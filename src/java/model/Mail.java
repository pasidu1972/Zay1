package model;

import java.util.Properties;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.IOException;
import java.io.InputStream;

public class Mail {
    private static String APP_EMAIL;
    private static String APP_PASSWORD;
    
    static {
        loadCredentials();
    }
    
    private static void loadCredentials() {
        // For now using hardcoded values - move to properties file or environment variables for production
        APP_EMAIL = "pasiduride@gmail.com";  // Fixed: Added @ symbol
        APP_PASSWORD = "lqhiobsmcxupcutc";   // Fixed: Removed spaces
        
        // Alternative: Load from properties file (commented out)
        /*
        Properties props = new Properties();
        try (InputStream input = Mail.class.getClassLoader().getResourceAsStream("mail.properties")) {
            if (input != null) {
                props.load(input);
                APP_EMAIL = props.getProperty("mail.username");
                APP_PASSWORD = props.getProperty("mail.password");
            } else {
                // Fallback to environment variables
                APP_EMAIL = System.getenv("MAIL_USERNAME");
                APP_PASSWORD = System.getenv("MAIL_PASSWORD");
            }
        } catch (IOException e) {
            System.err.println("Error loading mail configuration: " + e.getMessage());
            // Fallback to environment variables
            APP_EMAIL = System.getenv("MAIL_USERNAME");
            APP_PASSWORD = System.getenv("MAIL_PASSWORD");
        }
        */
    }
    
    public static void sendMail(String email, String subject, String htmlContent) {
        if (APP_EMAIL == null || APP_PASSWORD == null) {
            throw new RuntimeException("Email credentials not configured properly");
        }
        
        Properties props = new Properties();
        
        // Enhanced SMTP configuration for better compatibility
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");
        
        // SSL/TLS security enhancements
        props.put("mail.smtp.ssl.protocols", "TLSv1.2");
        props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        
        // Connection timeout settings
        props.put("mail.smtp.connectiontimeout", "10000");
        props.put("mail.smtp.timeout", "10000");
        props.put("mail.smtp.writetimeout", "10000");
        
        // Debug mode (disable in production)
        // props.put("mail.debug", "true");
        
        Session session = Session.getInstance(props, new javax.mail.Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(APP_EMAIL, APP_PASSWORD);
            }
        });
        
        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(APP_EMAIL));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
            message.setSubject(subject);
            message.setContent(htmlContent, "text/html; charset=utf-8");
            
            Transport.send(message);
            System.out.println("Email sent successfully to: " + email);
            
        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
            throw new RuntimeException("Email sending failed", e);
        }
    }
    
    /**
     * Development version with relaxed SSL settings for testing
     * WARNING: Use only for development/testing - not secure for production
     */
    public static void sendMailDevelopment(String email, String subject, String htmlContent) {
        if (APP_EMAIL == null || APP_PASSWORD == null) {
            throw new RuntimeException("Email credentials not configured properly");
        }
        
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");
        
        // Relaxed SSL settings for development (NOT SECURE - development only)
        props.put("mail.smtp.ssl.trust", "*");
        props.put("mail.smtp.ssl.checkserveridentity", "false");
        props.put("mail.smtp.starttls.required", "false");
        
        // Connection timeout settings
        props.put("mail.smtp.connectiontimeout", "10000");
        props.put("mail.smtp.timeout", "10000");
        props.put("mail.smtp.writetimeout", "10000");
        
        Session session = Session.getInstance(props, new javax.mail.Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(APP_EMAIL, APP_PASSWORD);
            }
        });
        
        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(APP_EMAIL));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
            message.setSubject(subject);
            message.setContent(htmlContent, "text/html; charset=utf-8");
            
            System.out.println("Attempting to send email (development mode) to: " + email);
            Transport.send(message);
            System.out.println("Email sent successfully to: " + email);
            
        } catch (MessagingException e) {
            System.err.println("Failed to send email to: " + email);
            System.err.println("Error: " + e.getMessage());
            throw new RuntimeException("Email sending failed: " + e.getMessage(), e);
        }
    }
}