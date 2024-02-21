//package com.zalolite.accountservice.jwt;
//
//import lombok.AllArgsConstructor;
//import lombok.NonNull;
//import org.springframework.http.server.reactive.ServerHttpRequest;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.ReactiveSecurityContextHolder;
//import org.springframework.security.core.context.SecurityContext;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.context.SecurityContextImpl;
//import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.web.authentication.WebAuthenticationDetails;
//import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
//import org.springframework.stereotype.Component;
//import org.springframework.web.server.ServerWebExchange;
//import org.springframework.web.server.WebFilter;
//import org.springframework.web.server.WebFilterChain;
//import reactor.core.publisher.Mono;
//
//import java.security.Principal;
//
//@Component
//@AllArgsConstructor
//public class JwtFilter implements WebFilter {
//    JwtService jwtService;
//    ReactiveUserDetailsService reactiveUserDetailsService;
//
//    @Override
//    @NonNull
//    public Mono<Void> filter(
//            @NonNull ServerWebExchange exchange,
//            @NonNull WebFilterChain chain) {
//        final String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
//        final String jwt;
//        ServerHttpRequest request = exchange.getRequest();
//        final String userPhoneNumber;
//        if (authHeader == null || !authHeader.startsWith("Bearer "))
//            return chain.filter(exchange);
//        jwt = authHeader.substring(7);
//        userPhoneNumber = jwtService.extractUsername(jwt);
//        System.out.println("2");
//        if (userPhoneNumber != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//            return reactiveUserDetailsService.findByUsername(userPhoneNumber)
//                    .flatMap(userDetail -> {
//                        System.out.println("3");
//                        if (jwtService.isTokenValid(jwt, userDetail)) {
//                            System.out.println("4");
//                            ReactiveSecurityContextHolder.withAuthentication(new UsernamePasswordAuthenticationToken(userDetail, null, userDetail.getAuthorities()));
//                        }
//                        return chain.filter(exchange);
//                    });
//        }
//        return chain.filter(exchange);
//    }
//}
//
