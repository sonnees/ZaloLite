package com.zalolite.accountservice.config;

import com.zalolite.accountservice.jwt.CustomUserDetailsService;
import com.zalolite.accountservice.jwt.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
@AllArgsConstructor
public class SecurityConfig {

    private final JwtService jwtService;

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) throws Exception {
        http.authorizeExchange(auth->
                        auth.pathMatchers(
                                "/api/account/check-uniqueness-phone-number/*",
                                "/api/account/create").permitAll()

                )
                .csrf(ServerHttpSecurity.CsrfSpec::disable);
        http.httpBasic(Customizer.withDefaults());
        return http.build();
    }

    @Bean
    public ReactiveUserDetailsService userDetailsService(@Qualifier("customUserDetailsService") ReactiveUserDetailsService reactiveUserDetailsService) {
        return reactiveUserDetailsService;
    }

    @Bean
    public ReactiveUserDetailsPasswordService userDetailsPasswordService(@Qualifier("customUserDetailsService") CustomUserDetailsService customUserDetailsService) {
        return customUserDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
