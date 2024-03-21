package com.zalolite.accountservice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.accountservice.AccountRepository;
import com.zalolite.accountservice.entity.Account;
import com.zalolite.accountservice.jwt.AuthenticationManager;
import lombok.AllArgsConstructor;
<<<<<<< HEAD
=======
import lombok.extern.slf4j.Slf4j;
>>>>>>> master
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
<<<<<<< HEAD
=======
@Slf4j
>>>>>>> master
public class AccountController {
    private final AccountRepository accountRepository;
    private final ObjectMapper objectMapper;

<<<<<<< HEAD
    @PostMapping("/profile/{phoneNumber}")
=======
    @GetMapping("/profile/{phoneNumber}")
>>>>>>> master
    public Mono<ResponseEntity<String>> getProfileByPhoneNumber(@PathVariable String phoneNumber){
        return  ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .map(authentication -> {
                    String userDetailsPhoneNumber = (String) authentication.getPrincipal();
                    return accountRepository.searchByPhoneNumber(phoneNumber)
                            .flatMap(account -> {
<<<<<<< HEAD
                                if (account == null)
                                    return Mono.just(ResponseEntity.status(404).body("User not found"));
                                String json = "";
                                try {
                                    json = objectMapper.writeValueAsString(account.getProfile(userDetailsPhoneNumber));
                                } catch (JsonProcessingException e) {
                                    return Mono.error(new RuntimeException(e));
                                }
                                return Mono.just(ResponseEntity.ok(json));
                            });
                }).flatMap(responseEntityMono -> responseEntityMono);
    }
=======
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

>>>>>>> master
}

