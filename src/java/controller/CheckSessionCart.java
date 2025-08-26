package controller;

import hibernate.Cart;
import hibernate.HibernateUtil;
import hibernate.Product;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "CheckSessionCart", urlPatterns = {"/CheckSessionCart"})
public class CheckSessionCart extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse resp) throws ServletException, IOException {

        User user = (User) request.getSession().getAttribute("user");
        if (user != null) {

            ArrayList<Cart> sessionCarts = (ArrayList<Cart>) request.getSession().getAttribute("sessionCart");
            if (sessionCarts != null) {

                Session s = HibernateUtil.getSessionFactory().openSession();
                Transaction tr = s.beginTransaction();

                Criteria c1 = s.createCriteria(Cart.class);
                c1.add(Restrictions.eq("user", user));

                for (Cart sessionCart : sessionCarts) {
                    Product product = (Product) s.get(Product.class, sessionCart.getProduct().getId());

                    c1.add(Restrictions.eq("product", sessionCart.getProduct()));

                    if (c1.list().isEmpty()) {// product not availiable in same pid

                        sessionCart.setUser(user); // session user

                        s.save(sessionCart);
                        tr.commit();

                    } else {
                        Cart dbCart = (Cart) c1.uniqueResult();
                        int newQty = sessionCart.getQty() + dbCart.getQty();

                        if (newQty <= product.getQty()) {
                            dbCart.setQty(newQty);
                            dbCart.setUser(user);

                            s.update(dbCart);
                            tr.commit();
                        }

//                           
                    }

                }
                
                request.getSession().setAttribute("sessionCart", null);
            }

        }

    }

}