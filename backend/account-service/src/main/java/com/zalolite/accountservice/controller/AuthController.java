package com.zalolite.accountservice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.accountservice.AccountRepository;
import com.zalolite.accountservice.dto.AccountCreateDTO;
import com.zalolite.accountservice.dto.AccountLoginDTO;
import com.zalolite.accountservice.entity.Account;
import com.zalolite.accountservice.entity.Profile;
import com.zalolite.accountservice.jwt.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {
    private AccountRepository accountRepository;
    private JwtService jwtService;
    private ObjectMapper objectMapper;

    @PostMapping("/check-uniqueness-phone-number/{phoneNumber}")
    public Mono<ResponseEntity<String>> checkUniquenessPhoneNumber(@PathVariable String phoneNumber) throws RuntimeException {
        return accountRepository.searchByPhoneNumber(phoneNumber)
                .flatMap(account -> {
                    if (account == null)
                        return Mono.just(ResponseEntity.ok(""));
                    Profile profile = new Profile();
                    profile.setUserName(account.getProfile().getUserName());
                    String json = "";
                    try {
                        json = objectMapper.writeValueAsString(profile);
                    } catch (JsonProcessingException e) {
                        return Mono.error(new RuntimeException(e));
                    }
                    return Mono.just(ResponseEntity.status(409).body(json));
                });
    }

    @PostMapping("/register")
    public Mono<ResponseEntity<String>> create(@RequestBody AccountCreateDTO accountCreateDTO){
        return accountRepository.insert(new Account(accountCreateDTO))
                .flatMap(result -> accountRepository.searchByPhoneNumber(accountCreateDTO.getPhoneNumber())
                        .flatMap(account -> {
                            String token = jwtService.generateToken(account);
                            return Mono.just(ResponseEntity.status(200).body(token));
                        }))
                .onErrorResume(e->Mono.just(ResponseEntity.status(409).body("")));
    }

    @PostMapping("/authenticate")
    public Mono<ResponseEntity<String>> login(@RequestBody AccountLoginDTO accountLoginDTO) {
        return accountRepository.searchByPhoneNumber(accountLoginDTO.getPhoneNumber())
                .flatMap(account -> {
                    if (account == null || !new BCryptPasswordEncoder().matches(accountLoginDTO.getPassword(), account.getPassword())) {
                        return Mono.just(ResponseEntity.status(401).body(""));
                    }
                    String token = jwtService.generateToken(account);
                    return Mono.just(ResponseEntity.status(200).body(token));
                })
                .switchIfEmpty(Mono.just(ResponseEntity.status(401).body("")));
    }
}
