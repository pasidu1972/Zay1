package filters;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebFilter(urlPatterns = {"/*"})
public class CORSFilter implements Filter {
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        System.out.println("CORS Filter initialized");
    }
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        String origin = httpRequest.getHeader("Origin");
        String method = httpRequest.getMethod();
        String requestURI = httpRequest.getRequestURI();
        
        System.out.println("=== CORS Filter ===");
        System.out.println("Method: " + method);
        System.out.println("URI: " + requestURI);
        System.out.println("Origin: " + origin);
        
        // Set CORS headers regardless of origin (for development)
        // In production, you should validate origins more strictly
        if (origin != null && (
                origin.startsWith("http://localhost:") || 
                origin.startsWith("http://127.0.0.1:") ||
                origin.equals("null"))) {
            httpResponse.setHeader("Access-Control-Allow-Origin", origin);
            System.out.println("Origin allowed: " + origin);
        } else {
            // Fallback for development
            httpResponse.setHeader("Access-Control-Allow-Origin", "*");
            System.out.println("Using wildcard origin for development");
        }
        
        httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        httpResponse.setHeader("Access-Control-Allow-Headers",
                "Content-Type, Authorization, X-Requested-With, Accept, Origin");
        httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
        httpResponse.setHeader("Access-Control-Max-Age", "3600");
        
        System.out.println("CORS headers set");
        
        // Handle OPTIONS preflight request
        if ("OPTIONS".equalsIgnoreCase(method)) {
            System.out.println("Handling OPTIONS preflight request");
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        
        System.out.println("Continuing with request chain");
        
        try {
            chain.doFilter(request, response);
        } catch (Exception e) {
            System.err.println("Error in filter chain: " + e.getMessage());
            e.printStackTrace();
            
            // Ensure CORS headers are still present even if servlet fails
            if (!httpResponse.isCommitted()) {
                httpResponse.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                httpResponse.setContentType("application/json");
                httpResponse.getWriter().write("{\"status\":false,\"message\":\"Internal server error\"}");
            }
        }
        
        System.out.println("=== End CORS Filter ===");
    }
    
    @Override
    public void destroy() {
        System.out.println("CORS Filter destroyed");
    }
}