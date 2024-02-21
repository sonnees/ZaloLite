package com.zalolite.accountservice.jwt;

import com.zalolite.accountservice.AccountRepository;
import io.jsonwebtoken.Claims;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
@AllArgsConstructor
public class AuthenticationManager implements ReactiveAuthenticationManager {

    private AccountRepository accountRepository;
    private JwtService jwtService;

    @Override
    @SuppressWarnings("unchecked")
    public Mono<Authentication> authenticate(Authentication authentication) {
        String token = authentication.getCredentials().toString();
        String username = jwtService.extractUsername(token);
        System.out.println(username);
        return Mono.just(jwtService.isTokenExpired(token))
                .filter(valid -> valid)
                .switchIfEmpty(Mono.empty())
                .map(valid -> {
                    System.out.println(valid);
                    Claims claims = jwtService.extractAllClaims(token);
                    String rolesMap = claims.get("role", String.class);
                    System.out.println(rolesMap);
                    return (Authentication) new UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            List.of(new SimpleGrantedAuthority(rolesMap))
                    );
                }).defaultIfEmpty(new UsernamePasswordAuthenticationToken(
                        "",
                        null,
                        null
                ));
    }
}
