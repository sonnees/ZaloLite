package com.zalolite.accountservice;

import ch.qos.logback.core.subst.Token;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.accountservice.dto.AccountCreateDTO;
import com.zalolite.accountservice.dto.AccountLoginDTO;
import com.zalolite.accountservice.entity.Account;
import com.zalolite.accountservice.entity.Profile;
import com.zalolite.accountservice.jwt.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@RestController
@AllArgsConstructor
@RequestMapping("/api/account")
public class AccountController {
    private AccountRepository accountRepository;
    private ObjectMapper objectMapper;
    private JwtService jwtService;

    /**
     * link api: http://localhost:8081/api/account/check-uniqueness-phone-number/0123456789
     * {"userName":"Nguyen Van Son","gender":null,"birthday":null,"avatar":null,"background":null}
     * @param phoneNumber : 0123456789
     * @return : "" or {"userName":"Nguyen Van Son","gender":null,"birthday":null,"avatar":null,"background":null}
     * @throws RuntimeException :
     */
    @PostMapping("/check-uniqueness-phone-number/{phoneNumber}")
    public Mono<ResponseEntity<String>> checkUniquenessPhoneNumber(@PathVariable String phoneNumber) throws RuntimeException {
        return accountRepository.searchByPhoneNumber(phoneNumber)
                .flatMap(account -> {
                    if (account == null)
                        return Mono.just(ResponseEntity.ok().body(""));
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

    @PostMapping("/create")
    public Mono<ResponseEntity<String>> create(@RequestBody AccountCreateDTO accountCreateDTO){
        return accountRepository.insert(new Account(accountCreateDTO))
                .flatMap(result ->{
                    Mono.fromRunnable(()->{}).subscribeOn(Schedulers.boundedElastic()).subscribe();
                    return Mono.just(ResponseEntity.ok().body("success"));
                })
                .onErrorResume(e->Mono.just(ResponseEntity.status(409).body("")));
    }

    @PostMapping("/login")
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

    @PostMapping("/check")
    public ResponseEntity<String> oke(){
        return ResponseEntity.ok("");
    }

}

