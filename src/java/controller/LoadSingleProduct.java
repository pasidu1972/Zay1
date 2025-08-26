/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.Product;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.Util;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

/**
 *
 * @author Anne
 */
@WebServlet(name = "LoadSingleProduct", urlPatterns = {"/LoadSingleProduct"})
public class LoadSingleProduct extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        String parameter = request.getParameter("id");
       
        if (Util.isInteger(parameter)) {
           
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();
           
            try {
                Product product = (Product) s.get(Product.class, Integer.valueOf(parameter));
                
                if (product != null && product.getStatus().getValue().equals("active")) {
                    // Clean user data for security
                    product.getUser().setEmail(null);
                    product.getUser().setPassword(null);
                    product.getUser().setVerification(null);
                    product.getUser().setId(-1);
                    product.getUser().setCreated_at(null);
                    
                    // Return only the single product
                    responseObject.add("product", gson.toJsonTree(product));
                    responseObject.addProperty("status", true);
                    responseObject.addProperty("message", "Product loaded successfully");
                } else {
                    responseObject.addProperty("message", "Product not found or inactive");
                }
            } catch (Exception e) {
                e.printStackTrace();
                responseObject.addProperty("message", "Error loading product: " + e.getMessage());
            } finally {
                s.close();
            }
           
        } else {
            responseObject.addProperty("message", "Invalid product ID");
        }
        
        response.setContentType("application/json");
        String toJson = gson.toJson(responseObject);
        response.getWriter().write(toJson);
    }
}