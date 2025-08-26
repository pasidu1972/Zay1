
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Brand;
import hibernate.HibernateUtil;
import hibernate.Product;
import hibernate.Status;
import hibernate.User;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.Util;
import org.hibernate.Session;

/**
 *
 * @author Anne
 */
@MultipartConfig
@WebServlet(name = "SaveProduct", urlPatterns = {"/SaveProduct"})
public class SaveProduct extends HttpServlet {

    private static final int PENDING_STATUS_ID = 2;
    private static final int DEFAULT_USER_ID = 41;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String brandId = request.getParameter("brandId");
        String title = request.getParameter("title");
        String description = request.getParameter("description");
        String price = request.getParameter("price");
        String qty = request.getParameter("qty");

        Part image = request.getPart("image");

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        Session s = HibernateUtil.getSessionFactory().openSession();

        //validation
        if (!Util.isInteger(brandId)) {
            responseObject.addProperty("message", "Invalid brand");
        } else if (Integer.parseInt(brandId) == 0) {
            responseObject.addProperty("message", "Please select a brand");
        } else if (title.isEmpty()) {
            responseObject.addProperty("message", "Product Title can not be empty");
        } else if (description.isEmpty()) {
            responseObject.addProperty("message", "Product description can not be empty");
        } else if (!Util.isDouble(price)) {
            responseObject.addProperty("message", "Invalid Price");
        } else if (Double.parseDouble(price) <= 0) {
            responseObject.addProperty("message", "Price must be greater than 0");
        } else if (!Util.isInteger(qty)) {
            responseObject.addProperty("message", "Invalid Quantity");
        } else if (Integer.parseInt(qty) <= 0) {
            responseObject.addProperty("message", "Quantity must be greater than 0");
        } else if (image.getSubmittedFileName() == null || image.getSubmittedFileName().isEmpty()) {
            responseObject.addProperty("message", "Product image is required");
        } else {

            Brand brand = (Brand) s.get(Brand.class, Integer.parseInt(brandId));

            if (brand == null) {
                responseObject.addProperty("message", "Please select a valid Brand");
            } else {
                try {
                    Product p = new Product();

                    p.setTitle(title);
                    p.setDescription(description);
                    p.setPrice(Double.parseDouble(price));
                    p.setQty(Integer.parseInt(qty));

                    // Set the brand
                    p.setBrand_id(brand);

                    // Hardcode status to 1
                    Status status = (Status) s.get(Status.class, PENDING_STATUS_ID);
                    p.setStatus(status);

                    // Hardcode user to 41
                    User user = (User) s.get(User.class, DEFAULT_USER_ID);
                    p.setUser(user);

                    p.setCreated_at(new Date());

                    s.beginTransaction();
                    int id = (int) s.save(p);
                    s.getTransaction().commit();

                    //image uploading
                    String appPath = getServletContext().getRealPath(""); // full path of the web pages
                    String newPath = appPath.replace("build" + File.separator + "web", "web" + File.separator + "assets" + File.separator + "img");

                    File productFolder = new File(newPath, String.valueOf(id));
                    productFolder.mkdirs();

                    File imageFile = new File(productFolder, "image1.png");
                    Files.copy(image.getInputStream(), imageFile.toPath(), StandardCopyOption.REPLACE_EXISTING);

                    responseObject.addProperty("status", true);
                    responseObject.addProperty("message", "Product saved successfully");

                } catch (Exception e) {
                    if (s.getTransaction() != null) {
                        s.getTransaction().rollback();
                    }
                    responseObject.addProperty("message", "Failed to save product: " + e.getMessage());
                    e.printStackTrace();
                } finally {
                    s.close();
                }
            }
        }

        Gson gson = new Gson();
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseObject));
    }
}
