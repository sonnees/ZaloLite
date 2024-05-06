package com.zalolite.gatewayservice;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.reactive.function.client.WebClient;

import java.lang.annotation.Annotation;

@Service
@Slf4j
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> implements Order {

    @Autowired
    WebClient.Builder builder;

    @Autowired
    AntPathMatcher pathMatcher;

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        WebClient webClient = builder.build();
        return (exchange, chain)->{
            String openApiEndpointPattern1 = "/api/v1/auth/**";
            String openApiEndpointPattern2 = "/ws/**";
            String path = exchange.getRequest().getURI().getPath();
            boolean match1 = pathMatcher.match(openApiEndpointPattern1, path);
            boolean match2 = pathMatcher.match(openApiEndpointPattern2, path);
            log.info("** Match: "+match1+match2+" | "+exchange.getRequest().getURI().getPath());

            if(!match1 && !match2){
                if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION))
                    throw new RuntimeException("Missing authorization header");
                String token = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
                if (token != null && token.startsWith("Bearer "))
                    token = token.substring(7);

                log.info("** AuthenticationFilter enter | token: "+token);
                return webClient.get()
                        .uri("http://ACCOUNT-SERVICE/api/v1/auth/check-token/" + token)
                        .retrieve()
                        .bodyToMono(Boolean.class)
                        .flatMap(isValidToken -> {
                            log.info("token: :"+isValidToken);
                            if (!isValidToken) {
                                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                                return exchange.getResponse().setComplete();
                            }
                            return chain.filter(exchange);
                        });
            }
            return chain.filter(exchange);
        };
    }

    @Override
    public Class<? extends Annotation> annotationType() {
        return null;
    }

    @Override
    public int value() {
        return -2;
    }

    public static class Config { }


}
