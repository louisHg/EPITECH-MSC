package com.epitech.cryptoProject.configuration;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {
  @Bean
  public FilterRegistrationBean jwtFilter() {
    FilterRegistrationBean filter= new FilterRegistrationBean();
    filter.setFilter(new JwtFilter());
    filter.addUrlPatterns("/articles");
    filter.addUrlPatterns("/coins");
    filter.addUrlPatterns("/preferences");
    filter.addUrlPatterns("/user");
    return filter;
  }
  
}
