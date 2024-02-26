package com.zalolite.gatewayservice;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.client.RestTemplate;

@Configuration
public class SecurityConfig {
    @Bean
    public RestTemplate template(){
        return new RestTemplate();
    }
    @Bean
    public AntPathMatcher pathMatcher(){
        return new AntPathMatcher();
    }
}
