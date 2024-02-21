package com.zalolite.accountservice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.accountservice.AccountRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/account")
public class AccountController {
    private AccountRepository accountRepository;
    private ObjectMapper objectMapper;

    @PostMapping("/profile/{phoneNumber}")
    public Mono<ResponseEntity<String>> getProfileByPhoneNumber(@PathVariable String phoneNumber){
        System.out.println("controller");
        return accountRepository.searchByPhoneNumber(phoneNumber)
                .flatMap(account -> {
                    if (account == null)
                        return Mono.just(ResponseEntity.status(404).body("Not Found"));
                    String json = "";
                    System.out.println(account.getProfile().getAvatar());
                    try {
                        json = objectMapper.writeValueAsString(account.getProfile());
                        System.out.println(json);
                    } catch (JsonProcessingException e) {
                        return Mono.error(new RuntimeException(e));
                    }
                    return Mono.just(ResponseEntity.ok(json));
                });
    }
}

