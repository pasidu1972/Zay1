/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Brand;

import hibernate.HibernateUtil;

import hibernate.Product;

import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Anne
 */
@WebServlet(name = "LoadData", urlPatterns = {"/LoadData"})
public class LoadData extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        Session s = HibernateUtil.getSessionFactory().openSession();

        //get brands
        Criteria c1 = s.createCriteria(Brand.class);
        List<Brand> brandList = c1.list();

        // Status status = (Status) s.get(Status.class, 2);
        Criteria c6 = s.createCriteria(Product.class);
        c6.addOrder(Order.desc("id"));
        c6.add(Restrictions.eq("status.id", 2));
        // c6.add(Restrictions.eq("status",Status ));  
        responseObject.addProperty("allProductCount", c6.list().size());
        c6.setFirstResult(0);
        c6.setMaxResults(6);

        List<Product> productList = c6.list();
        for (Product product : productList) {
            product.setUser(null);
        }

        Gson gson = new Gson();

        responseObject.add("brandList", gson.toJsonTree(brandList));

        responseObject.add("productList", gson.toJsonTree(productList));
        responseObject.addProperty("status", true);
        System.out.println(gson.toJson(responseObject));

        String toJson = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(toJson);
        s.close();

    }

}
