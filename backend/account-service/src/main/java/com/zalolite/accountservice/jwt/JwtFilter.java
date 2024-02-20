package com.zalolite.accountservice.jwt;

import lombok.AllArgsConstructor;
import lombok.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
@AllArgsConstructor
public class JwtFilter implements WebFilter {

    JwtService jwtService;
    ReactiveUserDetailsService reactiveUserDetailsService;

    @Override
    @NonNull
    public Mono<Void> filter(
            @NonNull ServerWebExchange exchange,
            @NonNull WebFilterChain chain) {
        final String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
        final String jwt;
        final String userPhoneNumber;
        if(authHeader == null || !authHeader.startsWith("Bearer "))
            return chain.filter(exchange);
        jwt = authHeader.substring(7);
        userPhoneNumber = jwtService.extractUsername(jwt);
        if(userPhoneNumber != null && SecurityContextHolder.getContext().getAuthentication()==null){
            return reactiveUserDetailsService.findByUsername(userPhoneNumber)
                    .flatMap(userDetail ->{
                        if(jwtService.isTokenValid(jwt, userDetail)){
                            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetail, null, userDetail.getAuthorities());
                            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                        }
                        return Mono.empty();
                    });
        }
        return chain.filter(exchange);
    }
}
