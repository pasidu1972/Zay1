/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.User;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author pasidu
 */
@WebServlet(name = "CheckSession", urlPatterns = {"/CheckSession"})
public class CheckSession extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        JsonObject responseObject = new JsonObject();
        HttpSession session = request.getSession(false);
        
        if (session != null && session.getAttribute("user") != null) {
            User user = (User) session.getAttribute("user");
            responseObject.addProperty("isSignedIn", true);
            
            // Construct user name - adjust these field names to match your User entity
            String firstName = user.getFirst_name() != null ? user.getFirst_name(): "";
            String lastName = user.getLast_name() != null ? user.getLast_name() : "";
            String userName = (firstName + " " + lastName).trim();
            
            // If no name available, use email as fallback
            if (userName.isEmpty()) {
                userName = user.getEmail();
            }
            
            responseObject.addProperty("userName", userName);
            responseObject.addProperty("userEmail", user.getEmail());
        } else {
            responseObject.addProperty("isSignedIn", false);
            responseObject.addProperty("userName", "");
            responseObject.addProperty("userEmail", "");
        }
        
        Gson gson = new Gson();
        String jsonResponse = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(jsonResponse);
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        doGet(request, response);
    }
}


