package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.OrderItems;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import hibernate.Orders;
import java.util.List;
import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author 94702
 */
@WebServlet(name = "LoadOrders", urlPatterns = {"/LoadOrders"})
public class LoadOrders extends HttpServlet {

    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Session session = null;
        try {
            String userEmail = null;
            if (request.getSession(false) != null) {
                userEmail = (String) request.getSession().getAttribute("email");
            }
            if (userEmail == null) {
                JsonObject errorResponse = new JsonObject();
                errorResponse.addProperty("success", false);
                errorResponse.addProperty("message", "Please login to view orders");
                response.getWriter().write(gson.toJson(errorResponse));
                return;
            }

            SessionFactory sf = HibernateUtil.getSessionFactory();
            session = sf.openSession();

            // Get all orders for the user
            Criteria orderCriteria = session.createCriteria(Orders.class);
            orderCriteria.createAlias("user", "u"); // Fixed: use "user" not "userId"
            orderCriteria.add(Restrictions.eq("u.email", userEmail));
            orderCriteria.addOrder(Order.desc("created_at")); // Fixed: use Order.desc not Orders.desc
            List<Orders> orders = orderCriteria.list();

            System.out.println("DEBUG: Found " + orders.size() + " orders for user: " + userEmail);

            JsonArray ordersArray = new JsonArray();

            for (Orders order : orders) {
                // Get order items for this order
                Criteria itemsCriteria = session.createCriteria(OrderItems.class);
                itemsCriteria.add(Restrictions.eq("orders", order)); // Fixed: use "orders" not "orderId"
                List<OrderItems> orderItems = itemsCriteria.list();

                System.out.println("DEBUG: Order " + order.getId() + " has " + orderItems.size() + " items");

                if (!orderItems.isEmpty()) {
                    JsonObject orderJson = new JsonObject();

                    // Add order details
                    orderJson.addProperty("id", order.getId());
                    orderJson.addProperty("createAt", order.getCreated_at().toString());

                    // Add user details (clean sensitive data)
                    if (order.getUser() != null) {
                        JsonObject userJson = new JsonObject();
                        userJson.addProperty("id", order.getUser().getId());
                        userJson.addProperty("firstName", order.getUser().getFirst_name());
                        userJson.addProperty("lastName", order.getUser().getLast_name());
                        userJson.addProperty("email", order.getUser().getEmail());
                        // Don't include password or other sensitive data
                        orderJson.add("user", userJson);
                    }

                    

                    // Add order items
                    JsonArray itemsArray = new JsonArray();
                    double totalAmount = 0.0;
                    int totalQuantity = 0;

                    for (OrderItems item : orderItems) { // Fixed: use OrderItems type not Orders
                        JsonObject itemJson = new JsonObject();
                        itemJson.addProperty("id", item.getId());
                        itemJson.addProperty("quantity", item.getQty()); // Fixed: use getQty() not getQuantity()
                        itemJson.addProperty("rating", item.getRating());

                        // Add order status for this item
                        if (item.getOrderStatus() != null) {
                            JsonObject statusJson = new JsonObject();
                            statusJson.addProperty("id", item.getOrderStatus().getId());
                            statusJson.addProperty("value", item.getOrderStatus().getValue());
                            itemJson.add("orderStatus", statusJson);
                        }

                        // Add delivery type for this item
                        if (item.getDeliveryType() != null) {
                            JsonObject deliveryJson = new JsonObject();
                            deliveryJson.addProperty("id", item.getDeliveryType().getId());
                            deliveryJson.addProperty("name", item.getDeliveryType().getName());
                            deliveryJson.addProperty("price", item.getDeliveryType().getPrice());
                            itemJson.add("deliveryType", deliveryJson);
                        }

                        // Add product details if exists
                        if (item.getProduct() != null) {
                            JsonObject productJson = new JsonObject();
                            productJson.addProperty("id", item.getProduct().getId());
                            productJson.addProperty("title", item.getProduct().getTitle());
                            productJson.addProperty("description", item.getProduct().getDescription());
                            productJson.addProperty("price", item.getProduct().getPrice());

                            // Calculate totals using product price
                            double itemTotal = item.getProduct().getPrice() * item.getQty();
                            totalAmount += itemTotal;
                            totalQuantity += item.getQty();
                            
                            itemJson.addProperty("itemTotal", itemTotal);

                            

                            // Add status details if exists
                            if (item.getProduct().getStatus() != null) {
                                JsonObject productStatusJson = new JsonObject();
                                productStatusJson.addProperty("id", item.getProduct().getStatus().getId());
                                productStatusJson.addProperty("name", item.getProduct().getStatus().getValue());
                                productJson.add("status", productStatusJson);
                            }

                            // Clean user data from product (seller info)
                            if (item.getProduct().getUser() != null) {
                                JsonObject productUserJson = new JsonObject();
                                productUserJson.addProperty("id", item.getProduct().getUser().getId());
                                productUserJson.addProperty("firstName", item.getProduct().getUser().getFirst_name());
                                productUserJson.addProperty("lastName", item.getProduct().getUser().getLast_name());
                                productUserJson.addProperty("email", item.getProduct().getUser().getEmail());
                                // Don't include sensitive data like password
                                productJson.add("seller", productUserJson);
                            }

                            itemJson.add("product", productJson);
                        }

                        itemsArray.add(itemJson);
                    }

                    orderJson.add("items", itemsArray);
                    orderJson.addProperty("totalAmount", totalAmount);
                    orderJson.addProperty("totalQuantity", totalQuantity);
                    orderJson.addProperty("itemsCount", orderItems.size());

                    ordersArray.add(orderJson);
                }
            }

            JsonObject responseJson = new JsonObject();
            responseJson.addProperty("success", true);
            responseJson.addProperty("totalOrders", ordersArray.size());
            responseJson.add("orders", ordersArray);

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(gson.toJson(responseJson));

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            JsonObject errorResponse = new JsonObject();
            errorResponse.addProperty("success", false);
            errorResponse.addProperty("message", "Error fetching orders: " + e.getMessage());
            response.getWriter().write(gson.toJson(errorResponse));
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
}