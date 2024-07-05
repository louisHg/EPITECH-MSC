package com.epitech.cryptoProject.configuration;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.filter.GenericFilterBean;

public class JwtFilter extends GenericFilterBean {

  @Override
  public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
    final HttpServletRequest request = (HttpServletRequest) servletRequest;
    final HttpServletResponse response = (HttpServletResponse) servletResponse;
    final String authHeader = request.getHeader("Authorization");
    if ("OPTIONS".equals(request.getMethod())) {
      response.setStatus(HttpServletResponse.SC_OK);
      filterChain.doFilter(request, response);
    } else {
      if(authHeader == null || !authHeader.startsWith("Bearer ")){
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return;
      }
    }
    final String token = authHeader.substring(7);
    Claims claims = Jwts.parser().setSigningKey("PxG6btQ6H76WqlKaqRfc6yWan8XaMDz5AHTRChiX2qm5GQfDVfsA2oR2WjvynCt").parseClaimsJws(token).getBody();
    request.setAttribute("claims", claims);
    request.setAttribute("blog", servletRequest.getParameter("id"));
    filterChain.doFilter(request, response);
  }
}
