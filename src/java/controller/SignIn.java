
package controller;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "SignIn", urlPatterns = {"/SignIn"})
public class SignIn extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        JsonObject user = gson.fromJson(request.getReader(), JsonObject.class);
        String email = user.get("email").getAsString();
        String pw = user.get("password").getAsString();
        
        if (email.isEmpty()) {
            responseObject.addProperty("message", "Email can not be empty");
        } else if (!Util.isEmailValid(email)) {
            responseObject.addProperty("message", "Invalid Email");
        } else if (pw.isEmpty()) {
            responseObject.addProperty("message", "password can not be empty");
        } else {
            Session s = HibernateUtil.getSessionFactory().openSession();
            Criteria c = s.createCriteria(User.class);
            Criterion crt1 = Restrictions.eq("email", email);
            Criterion crt2 = Restrictions.eq("password", pw);
            c.add(crt1);
            c.add(crt2);
            
            if (c.list().isEmpty()) {
                responseObject.addProperty("message", "Invalid Credentials");
            } else {
                User u = (User) c.list().get(0);
                responseObject.addProperty("status", true);
                responseObject.addProperty("message", "Sign in successful");
                
                // Create session and store user data
                HttpSession ses = request.getSession();
                ses.setAttribute("user", u);
                ses.setAttribute("isSignedIn", true);
                ses.setAttribute("userEmail", u.getEmail());
                ses.setAttribute("userName", u.getFirst_name() + " " + u.getLast_name()); // Assuming you have these fields
            }
            s.close();
        }
        
        String responseText = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(responseText);
    }
}