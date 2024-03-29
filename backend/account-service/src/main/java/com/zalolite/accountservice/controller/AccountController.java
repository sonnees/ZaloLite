package com.zalolite.accountservice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.accountservice.AccountRepository;
import com.zalolite.accountservice.entity.Account;
import com.zalolite.accountservice.jwt.AuthenticationManager;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/account")
@Slf4j
public class AccountController {
    private final AccountRepository accountRepository;
    private final ObjectMapper objectMapper;

    @GetMapping("/profile/{phoneNumber}")
    public Mono<ResponseEntity<String>> getProfileByPhoneNumber(@PathVariable String phoneNumber){
        return  ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .map(authentication -> {
                    String userDetailsPhoneNumber = (String) authentication.getPrincipal();
                    return accountRepository.searchByPhoneNumber(phoneNumber)
                            .flatMap(account -> {
                                try {
                                    return Mono.just(ResponseEntity.ok(objectMapper.writeValueAsString(account.getProfile(userDetailsPhoneNumber))));
                                } catch (JsonProcessingException e) {
                                    log.error("** "+ e);
                                    return Mono.just(ResponseEntity.status(500).body("Error processing JSON"));
                                }
                            }).switchIfEmpty(Mono.just(ResponseEntity.status(404).body("User not found")));
                }).flatMap(responseEntityMono -> responseEntityMono);
    }

    @GetMapping("/info")
    public Mono<ResponseEntity<String>> getAccount(){
        return  ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .map(authentication -> {
                    String userDetailsPhoneNumber = (String) authentication.getPrincipal();
                    return accountRepository.searchByPhoneNumber(userDetailsPhoneNumber)
                            .flatMap(account -> {
                                try {
                                    return Mono.just(ResponseEntity.ok(objectMapper.writeValueAsString(account)));
                                } catch (JsonProcessingException e) {
                                    log.error("** "+ e);
                                    return Mono.just(ResponseEntity.status(500).body("Error processing JSON"));
                                }
                            }).switchIfEmpty(Mono.just(ResponseEntity.status(403).body("Not authenticate")));
                }).flatMap(responseEntityMono -> responseEntityMono);
    }

}

