/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author Anne
 */
@WebServlet(name = "SignOut", urlPatterns = {"/SignOut"})
public class SignOut extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        handleSignOut(request, response);
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        handleSignOut(request, response);
    }
    
    private void handleSignOut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        
        HttpSession ses = request.getSession(false);
        
        if(ses != null && ses.getAttribute("user") != null){
            ses.invalidate();
            responseObject.addProperty("status", true);
            responseObject.addProperty("message", "Signed out successfully");
        } else {
            responseObject.addProperty("message", "No active session found");
        }
        
        Gson gson = new Gson();
        String toJson = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(toJson);
    }
}