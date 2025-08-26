
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.OrderItems;
import hibernate.OrderStatus;
import hibernate.Orders;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.PayHere;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "VerifyPayments", urlPatterns = {"/VerifyPayments"})
public class VerifyPayments extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String merchant_id = request.getParameter("merchant_id");
        String order_id = request.getParameter("order_id");
        String payhere_amount = request.getParameter("payhere_amount");
        String payhere_currency = request.getParameter("payhere_currency");
        String status_code = request.getParameter("status_code");
        String md5sig = request.getParameter("md5sig");

        String merchant_secret = "MzkwNTM4NDAzMDc5Mjg4NTY2MzQwMjEzODMyMzIyMjYwMTQ1MTg1";
        
        String local_md5sig = PayHere.generateMD5(
            merchant_id + order_id + payhere_amount + payhere_currency + 
            status_code + PayHere.generateMD5(merchant_secret)
        );

        if (local_md5sig.equals(md5sig) && status_code.equals("2")) {
            // Payment success
            updateOrderStatus(order_id, 1); // 1 = paid status
            System.out.println("Payment verified for order: " + order_id);
        } else {
            // Payment failed or invalid
            updateOrderStatus(order_id, 6); // 6 = payment failed status
            System.out.println("Payment verification failed for order: " + order_id);
        }

        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write("OK");
    }

    private void updateOrderStatus(String orderIdStr, int statusId) {
        Session session = null;
        Transaction transaction = null;
        
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();

            // Extract order ID (remove # and leading zeros)
            int orderId = Integer.parseInt(orderIdStr.replaceAll("[^0-9]", ""));

            Orders order = (Orders) session.get(Orders.class, orderId);
            if (order != null) {
                OrderStatus orderStatus = (OrderStatus) session.get(OrderStatus.class, statusId);
                
                // Update all order items with new status
                Criteria criteria = session.createCriteria(OrderItems.class);
                criteria.add(Restrictions.eq("orders", order));
                List<OrderItems> orderItemsList = criteria.list();
                
                for (OrderItems orderItem : orderItemsList) {
                    orderItem.setOrderStatus(orderStatus);
                    session.update(orderItem);
                }
                
                transaction.commit();
                System.out.println("Order status updated successfully for order ID: " + orderId);
            } else {
                System.out.println("Order not found: " + orderId);
            }

        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
}