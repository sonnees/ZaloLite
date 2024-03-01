package com.zalolite.gatewayservice;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class SecurityConfig {
    @Bean
    @LoadBalanced
    public WebClient getWebClient(){
        return WebClient.builder().build();
    }
    @Bean
    public AntPathMatcher pathMatcher(){
        return new AntPathMatcher();
    }
}
