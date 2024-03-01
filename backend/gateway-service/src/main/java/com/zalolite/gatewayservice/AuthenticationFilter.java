package com.zalolite.gatewayservice;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.reactive.function.client.WebClient;

import java.lang.annotation.Annotation;
import java.util.concurrent.atomic.AtomicReference;

@Service
@Slf4j
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> implements Order {

    @Autowired
    WebClient webClient;

    @Autowired
    AntPathMatcher pathMatcher;

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain)->{
            String openApiEndpointPattern = "/api/v1/auth/**";
            String path = exchange.getRequest().getURI().getPath();

            boolean Match = pathMatcher.match(openApiEndpointPattern, path);
            log.info("** Match: "+Match +" | "+exchange.getRequest().getURI().getPath());

            if(!Match){
                if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION))
                    throw new RuntimeException("missing authorization header");
                log.info("** AuthenticationFilter enter");
                String token = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
                if (token != null && token.startsWith("Bearer "))
                    token = token.substring(7);

                AtomicReference<Boolean> isValidToken = new AtomicReference<>(false);
                webClient.get()
                        .uri("http://account-service/api/v1/auth/check-toke?token=" + token)
                        .retrieve()
                        .bodyToMono(Boolean.class)
                        .subscribe(isValidToken::set);




                if (!isValidToken.get()){
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                }
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
        return -1;
    }


    public static class Config {

    }
}
