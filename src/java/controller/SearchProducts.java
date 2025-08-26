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

import hibernate.Status;

import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Anne
 */
@WebServlet(name = "SearchProducts", urlPatterns = {"/SearchProducts"})
public class SearchProducts extends HttpServlet {

    private static final int MAX_RESULT = 6;
    private static final int ACTIVE_ID = 2;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject resposeObject = new JsonObject();
        resposeObject.addProperty("status", false);

        JsonObject requestJsonObject = gson.fromJson(request.getReader(), JsonObject.class);

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        Criteria c1 = s.createCriteria(Product.class); // get all products for the filtering

        if (requestJsonObject.has("brandName")) {
            String brandName = requestJsonObject.get("brandName").getAsString();

            // get brand details 
            Criteria c2 = s.createCriteria(Brand.class);
            c2.add(Restrictions.eq("name", brandName));
            Brand brand = (Brand) c2.uniqueResult();

        }

        if (requestJsonObject.has("priceStart") && requestJsonObject.has("priceEnd")) {
            double priceStart = requestJsonObject.get("priceStart").getAsDouble();
            double priceEnd = requestJsonObject.get("priceEnd").getAsDouble();

            c1.add(Restrictions.ge("price", priceStart));
            c1.add(Restrictions.le("price", priceEnd));
        }

        if (requestJsonObject.has("sortValue")) {
            String sortValue = requestJsonObject.get("sortValue").getAsString();
            if (sortValue.equals("Sort by Latest")) {
                c1.addOrder(Order.desc("id"));
            } else if (sortValue.equals("Sort by Oldest")) {
                c1.addOrder(Order.asc("id"));
            } else if (sortValue.equals("Sort by Name")) {
                c1.addOrder(Order.asc("title"));
            } else if (sortValue.equals("Sort by Price")) {
                c1.addOrder(Order.asc("price"));
            }
        }

        Status status = (Status) s.get(Status.class, SearchProducts.ACTIVE_ID); // get Active product [2 = Active]
        c1.add(Restrictions.eq("status", status));

        resposeObject.addProperty("allProductCount", c1.list().size());

        if (requestJsonObject.has("firstResult")) {
            int firstResult = requestJsonObject.get("firstResult").getAsInt();
            c1.setFirstResult(firstResult);
            c1.setMaxResults(SearchProducts.MAX_RESULT);
        }

        // get filtered product list
        List<Product> productList = c1.list();
        for (Product product : productList) {
            product.setUser(null);
        }
        // hibernate session close
        s.close();

        resposeObject.add("productList", gson.toJsonTree(productList));
        resposeObject.addProperty("status", true);
        response.setContentType("application/json");
        String toJson = gson.toJson(resposeObject);
        response.getWriter().write(toJson);
    }
}
