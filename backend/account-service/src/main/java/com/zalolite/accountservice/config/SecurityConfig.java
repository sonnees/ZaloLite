package com.zalolite.accountservice.config;

import com.zalolite.accountservice.jwt.AuthenticationManager;
import com.zalolite.accountservice.jwt.SecurityContextRepository;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;


@Configuration
@EnableWebFluxSecurity
@AllArgsConstructor
public class SecurityConfig {
    private AuthenticationManager authenticationManager;
    private SecurityContextRepository securityContextRepository;
    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) throws Exception {
        return http.authorizeExchange(
                        auth ->
                                auth.pathMatchers("/api/v1/auth/**", "/ws/auth/**").permitAll()
                                        .anyExchange().authenticated()
                )
                .authenticationManager(authenticationManager)
                .securityContextRepository(securityContextRepository)
                .formLogin(Customizer.withDefaults())
                .httpBasic(Customizer.withDefaults())
                .anonymous(Customizer.withDefaults())
                .cors(Customizer.withDefaults())
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .build();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
