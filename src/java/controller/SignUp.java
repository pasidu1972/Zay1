package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.User;
import hibernate.UserRole;
import java.io.IOException;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Mail;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.hibernate.Transaction;

@WebServlet(name = "SignUp", urlPatterns = {"/api/SignUp"})
public class SignUp extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        Session hibernateSession = null;
        Transaction transaction = null;
        
        try {
            Gson gson = new Gson();
            JsonObject user = gson.fromJson(request.getReader(), JsonObject.class);

            String firstName = user.get("firstName").getAsString();
            String lastName = user.get("lastName").getAsString();
            final String email = user.get("email").getAsString();
            String password = user.get("password").getAsString();

            JsonObject responseObject = new JsonObject();
            responseObject.addProperty("status", false);

            if (firstName.isEmpty()) {
                responseObject.addProperty("message", "First Name can not be empty!");
            } else if (lastName.isEmpty()) {
                responseObject.addProperty("message", "Last Name can not be empty!");
            } else if (email.isEmpty()) {
                responseObject.addProperty("message", "Email can not be empty!");
            } else if (!Util.isEmailValid(email)) {
                responseObject.addProperty("message", "Please enter a valid email!");
            } else if (password.isEmpty()) {
                responseObject.addProperty("message", "Password can not be empty!");
            } else if (!Util.isPasswordValid(password)) {
                responseObject.addProperty("message", "Password must contain a-A * 123");
            } else {
                // Hibernate operations with proper transaction management
                hibernateSession = HibernateUtil.getSessionFactory().openSession();
                transaction = hibernateSession.beginTransaction();

                Criteria criteria = hibernateSession.createCriteria(User.class);
                criteria.add(Restrictions.eq("email", email));

                if (!criteria.list().isEmpty()) {
                    responseObject.addProperty("message", "User with this Email already exists!!");
                } else {
                    User u = new User();
                    u.setFirst_name(firstName);
                    u.setLast_name(lastName);
                    u.setEmail(email);
                    u.setPassword(password);

                    // Generate verification code
                    final String verificationCode = Util.genarateCode();
                    u.setVerification(verificationCode);
                    u.setCreated_at(new Date());
                    
                    UserRole role = (UserRole) hibernateSession.get(UserRole.class, 2);
                    u.setUserRole(role);

                    hibernateSession.save(u);
                    transaction.commit();

                    // Send email (commented out in original)
                    // new Thread(() -> {
                    //     Mail.sendMailDevelopment(email, "Smart Trade Verification", "<h1>" + verificationCode + "</h1>");
                    // }).start();

                    // Create session
                    HttpSession httpSession = request.getSession();
                    httpSession.setAttribute("email", email);

                    responseObject.addProperty("status", true);
                    responseObject.addProperty("message", "Registration Success. Please check your email for verification code");
                }
            }

            // Set response
            String responseText = gson.toJson(responseObject);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(responseText);

        } catch (Exception e) {
            // Rollback transaction if there's an error
            if (transaction != null && transaction.isActive()) {
                transaction.rollback();
            }
            
            // Log the error
            e.printStackTrace();
            
            // Send error response
            JsonObject errorResponse = new JsonObject();
            errorResponse.addProperty("status", false);
            errorResponse.addProperty("message", "Internal server error occurred");
            
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(new Gson().toJson(errorResponse));
            
        } finally {
            // Always close the session
            if (hibernateSession != null && hibernateSession.isOpen()) {
                hibernateSession.close();
            }
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("message", "SignUp endpoint is ready");
        response.getWriter().write(new Gson().toJson(responseObject));
        
        System.out.println("SignUp GET request received");
    }
}