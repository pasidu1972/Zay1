
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Address;
import hibernate.Cart;
import hibernate.City;
import hibernate.DeliveryType;
import hibernate.HibernateUtil;
import hibernate.OrderItems;
import hibernate.OrderStatus;
import hibernate.Orders;
import hibernate.Product;
import hibernate.User;
import java.io.IOException;
import java.text.DecimalFormat;
import java.util.Date;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.PayHere;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Anne
 */
@WebServlet(name = "Checkout", urlPatterns = {"/Checkout"})
public class Checkout extends HttpServlet {

    private static final int SELECTOR_DEFAULT_VALUE = 0;
    private static final int ORDER_PENDING = 3;
    private static final int WITHIN_COLOMBO = 1;
    private static final int OUT_OF_COLOMBO = 2;
    private static final int RATING_DEFAULT_VALUE = 0;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        Session s = null;
        Transaction tr = null;
        
        try {
            JsonObject reqJsonObject = gson.fromJson(request.getReader(), JsonObject.class);

            boolean isCurrentAddress = reqJsonObject.get("isCurrentAddress").getAsBoolean();
            String firstName = reqJsonObject.get("firstName").getAsString();
            String lastName = reqJsonObject.get("lastName").getAsString();
            String citySelect = reqJsonObject.get("citySelect").getAsString();
            String lineOne = reqJsonObject.get("lineOne").getAsString();
            String lineTwo = reqJsonObject.get("lineTwo").getAsString();
            String postalCode = reqJsonObject.get("postalCode").getAsString();
            String mobile = reqJsonObject.get("mobile").getAsString();

            s = HibernateUtil.getSessionFactory().openSession();
            tr = s.beginTransaction();

            JsonObject responseObject = new JsonObject();
            responseObject.addProperty("status", false);

            User user = (User) request.getSession().getAttribute("user");
            if (user == null) {
                responseObject.addProperty("message", "Session expired! Please log in again");
            } else {

                if (isCurrentAddress) {
                    Criteria c1 = s.createCriteria(Address.class);
                    c1.add(Restrictions.eq("user", user));
                    
                    c1.addOrder(Order.desc("id"));
                    if (c1.list().isEmpty()) {
                        responseObject.addProperty("message", "Your current address is not found. Please add a new address ");
                    } else {
                        Address address = (Address) c1.list().get(0);
                        processCheckout(s, tr, user, address, responseObject);
                    }

                } else {

                    if (firstName.isEmpty()) {
                        responseObject.addProperty("message", "First name is required");
                    } else if (lastName.isEmpty()) {
                        responseObject.addProperty("message", "Last name is required");
                    } else if (!Util.isInteger(citySelect)) {
                        responseObject.addProperty("message", "Invalid City");
                    } else if (Integer.parseInt(citySelect) == Checkout.SELECTOR_DEFAULT_VALUE) {
                        responseObject.addProperty("message", "Invalid City");
                    } else {
                        City city = (City) s.get(City.class, Integer.valueOf(citySelect));

                        if (city == null) {
                            responseObject.addProperty("message", "Invalid City name");
                        } else {

                            if (lineOne.isEmpty()) {
                                responseObject.addProperty("message", "Line one is required");
                            } else if (lineTwo.isEmpty()) {
                                responseObject.addProperty("message", "Line two is required");
                            } else if (postalCode.isEmpty()) {

                                responseObject.addProperty("message", "Postalcode is required");
                            } else if (!Util.isCodeValid(postalCode)) {
                                responseObject.addProperty("message", "Invalid Postalcode");
                            } else if (mobile.isEmpty()) {
                                responseObject.addProperty("message", "Mobile number is required");
                            } else if (!Util.isMobileValid(mobile)) {
                                responseObject.addProperty("message", "Invalid Mobile number");
                            } else {

                                Address address = new Address();
                                address.setFirstName(firstName);
                                address.setLastName(lastName);
                                address.setLineOne(lineOne);
                                address.setLineTwo(lineTwo);
                                address.setCity(city);
                                address.setPostalCode(postalCode);
                                address.setUser(user);

                                s.save(address);

                                processCheckout(s, tr, user, address, responseObject);

                            }
                        }

                    }

                }

            }

            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(responseObject));
            
        } catch (Exception e) {
            e.printStackTrace();
            if (tr != null) {
                tr.rollback();
            }
            
            JsonObject errorResponse = new JsonObject();
            errorResponse.addProperty("status", false);
            errorResponse.addProperty("message", "Server error occurred: " + e.getMessage());
            
            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(errorResponse));
            
        } finally {
            if (s != null) {
                s.close();
            }
        }
    }

    private void processCheckout(Session s,
            Transaction tr,
            User user,
            Address address,
            JsonObject responseObject) {

        try {
            // First check if cart is empty
            Criteria c1 = s.createCriteria(Cart.class);
            c1.add(Restrictions.eq("user", user));
            List<Cart> cartList = c1.list();
            
            if (cartList.isEmpty()) {
                responseObject.addProperty("message", "Cart is empty");
                return;
            }

            Orders orders = new Orders();
            orders.setAddress(address);
            orders.setCreated_at(new Date());
            orders.setUser(user);

            int orderId = (int) s.save(orders);

            OrderStatus orderStatus = (OrderStatus) s.get(OrderStatus.class, Checkout.ORDER_PENDING);
            DeliveryType withinColombo = (DeliveryType) s.get(DeliveryType.class, Checkout.WITHIN_COLOMBO);
            DeliveryType outOfColombo = (DeliveryType) s.get(DeliveryType.class, Checkout.OUT_OF_COLOMBO);
            
            // Validate delivery types exist
            if (withinColombo == null || outOfColombo == null) {
                responseObject.addProperty("message", "Delivery types not configured properly");
                return;
            }
            
            double amount = 0;
            String items = "";

            for (Cart cart : cartList) {
                
                // Validate cart items
                if (cart.getProduct() == null) {
                    responseObject.addProperty("message", "Invalid product in cart");
                    return;
                }
                
                if (cart.getQty() <= 0) {
                    responseObject.addProperty("message", "Invalid quantity in cart");
                    return;
                }
                
                // Check product availability
                if (cart.getProduct().getQty() < cart.getQty()) {
                    responseObject.addProperty("message", "Insufficient stock for product: " + cart.getProduct().getTitle());
                    return;
                }

                double itemTotal = cart.getQty() * cart.getProduct().getPrice();
                amount += itemTotal;

                OrderItems orderItems = new OrderItems();

                // FIXED: Delivery charge calculation
                if (address.getCity().getName().toLowerCase().equals("colombo")) {  // within colombo
                    amount += withinColombo.getPrice(); // Add delivery charge once per order, not per item
                    orderItems.setDeliveryType(withinColombo);
                } else {
                    amount += outOfColombo.getPrice(); // Add delivery charge once per order, not per item
                    orderItems.setDeliveryType(outOfColombo);
                }

                items += cart.getProduct().getTitle() + " x " + cart.getQty() + ", ";

                Product product = cart.getProduct();
                orderItems.setOrderStatus(orderStatus);
                orderItems.setOrders(orders);
                orderItems.setProduct(product);
                orderItems.setQty(cart.getQty());
                orderItems.setRating(RATING_DEFAULT_VALUE);

                s.save(orderItems);

                // update product qty
                product.setQty(product.getQty() - cart.getQty());
                s.update(product);

                // delete cart item
                s.delete(cart);

            }
            
            // Remove trailing comma and space from items
            if (items.endsWith(", ")) {
                items = items.substring(0, items.length() - 2);
            }
            
            tr.commit();

            //payhere process
            String merchantID = "1222409"; 
            String merchantSecret = "MzkwNTM4NDAzMDc5Mjg4NTY2MzQwMjEzODMyMzIyMjYwMTQ1MTg1";
            String orderID = String.format("%06d", orderId); // Better formatting
            String currency = "LKR";

            String formattedAmount = new DecimalFormat("0.00").format(amount);
            
            // Validate amount
            if (amount <= 0) {
                responseObject.addProperty("message", "Invalid order amount");
                return;
            }

            String merchantSecretMD5 = PayHere.generateMD5(merchantSecret);
            String hash = PayHere.generateMD5(merchantID + orderID + formattedAmount + currency + merchantSecretMD5);

            JsonObject payHereJson = new JsonObject();

            payHereJson.addProperty("sandbox", true);
            payHereJson.addProperty("merchant_id", merchantID);

            payHereJson.addProperty("return_url", "");
            payHereJson.addProperty("cancel_url", "");
            
            // Use the correct project name in URL
            payHereJson.addProperty("notify_url", "http://localhost:8080/Zay1/VerifyPayments");

            payHereJson.addProperty("order_id", orderID);
            payHereJson.addProperty("items", items);
            payHereJson.addProperty("amount", formattedAmount);
            payHereJson.addProperty("currency", currency);
            payHereJson.addProperty("hash", hash);

            payHereJson.addProperty("first_name", user.getFirst_name());
            payHereJson.addProperty("last_name", user.getLast_name());
            payHereJson.addProperty("email", user.getEmail());

            payHereJson.addProperty("address", address.getLineOne() + ", " + address.getLineTwo());
            payHereJson.addProperty("city", address.getCity().getName());
            payHereJson.addProperty("country", "Sri Lanka");
            
            responseObject.addProperty("status", true);
            responseObject.addProperty("message", "Checkout Complete");
            responseObject.add("payhereJson", payHereJson);

        } catch (Exception e) {
            e.printStackTrace();
            if (tr != null && tr.isActive()) {
                tr.rollback();
            }
            responseObject.addProperty("message", "Checkout failed: " + e.getMessage());
        }
    }
}