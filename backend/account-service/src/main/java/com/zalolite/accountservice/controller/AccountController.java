package com.zalolite.accountservice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.accountservice.AccountRepository;
import com.zalolite.accountservice.dto.AccountChangePassword;
import com.zalolite.accountservice.dto.AccountCreateDTO;
import com.zalolite.accountservice.dto.FieldDTO;
import com.zalolite.accountservice.entity.Account;
import com.zalolite.accountservice.entity.Profile;
import com.zalolite.accountservice.jwt.AuthenticationManager;
import com.zalolite.accountservice.serialization.JsonConverter;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/account")
@Slf4j
public class AccountController {
    private final AccountRepository accountRepository;
    private final ObjectMapper objectMapper;
    private final PasswordEncoder passwordEncoder;
    private final WebClient.Builder builder;
    private final JsonConverter jsonConverter;

    @GetMapping("/profile/{phoneNumber}")
    public Mono<ResponseEntity<String>> getProfileByPhoneNumber(@PathVariable String phoneNumber){
        log.info("### enter get profile by phone number ###");
        log.info("# {} #", phoneNumber);
        return  ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .map(authentication -> {
                    String userDetailsPhoneNumber = (String) authentication.getPrincipal();
                    return accountRepository.searchByPhoneNumber(phoneNumber)
                            .flatMap(account -> {
                                try {
                                    return Mono.just(ResponseEntity.ok(objectMapper.writeValueAsString(account.getProfile(userDetailsPhoneNumber))));
                                } catch (JsonProcessingException e) {
                                    log.error("# {} #", e+"");
                                    return Mono.just(ResponseEntity.status(500).body("Error processing JSON"));
                                }
                            }).switchIfEmpty(Mono.just(ResponseEntity.status(404).body("User not found")));
                }).flatMap(responseEntityMono -> responseEntityMono);
    }

    @GetMapping("/info")
    public Mono<ResponseEntity<String>> getAccount(){
        log.info("### enter get info account ###");
        return  ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .map(authentication -> {
                    String userDetailsPhoneNumber = (String) authentication.getPrincipal();
                    return accountRepository.searchByPhoneNumber(userDetailsPhoneNumber)
                            .flatMap(account -> {
                                try {
                                    return Mono.just(ResponseEntity.ok(objectMapper.writeValueAsString(account)));
                                } catch (JsonProcessingException e) {
                                    log.error("# {} #", e+"");
                                    return Mono.just(ResponseEntity.status(500).body("Error processing JSON"));
                                }
                            }).switchIfEmpty(Mono.just(ResponseEntity.status(403).body("Not authenticate")));
                }).flatMap(responseEntityMono -> responseEntityMono);
    }

    @PostMapping("/change-password")
    public Mono<ResponseEntity<String>> changePassword(@RequestBody AccountChangePassword info){
        log.info("### enter change password ###");
        log.info("# {} #", jsonConverter.objToString(info));
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .map(authentication -> {
                    String userDetailsPhoneNumber = (String) authentication.getPrincipal();
                    return accountRepository.searchByPhoneNumber(userDetailsPhoneNumber)
                            .switchIfEmpty(Mono.empty())
                            .flatMap(account -> {
                                if(!passwordEncoder.matches(info.getCurPass(),account.getPassword())){
                                    log.error("** {} ",info.getCurPass());
                                    return Mono.just(ResponseEntity.status(403).body("Not authenticate"));
                                }
                                return accountRepository.changePassword(account.getPhoneNumber(), passwordEncoder.encode(info.getNewPass()))
                                        .flatMap(aLong ->Mono.just(ResponseEntity.ok("Success")))
                                        .switchIfEmpty(Mono.just(ResponseEntity.status(403).body("Not authenticate")));
                            });
                }).flatMap(responseEntityMono -> responseEntityMono);
    }

    @PostMapping("/change-avatar")
    public Mono<ResponseEntity<String>> changeAvatar(@RequestBody FieldDTO info){
        log.info("### enter change avatar in account ###");
        log.info("# {} #", jsonConverter.objToString(info));
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .map(authentication -> {
                    String userDetailsPhoneNumber = (String) authentication.getPrincipal();
                    return accountRepository.searchByPhoneNumber(userDetailsPhoneNumber)
                            .switchIfEmpty(Mono.defer(()->{
                                log.error("# Error: {} userDetailsPhoneNumber: {} #", "Failed in searchByPhoneNumber", userDetailsPhoneNumber);
                                return Mono.just(ResponseEntity.status(403).body("Error Token"));
                            }).then(Mono.empty()))
                            .flatMap(account -> {
                                Profile profile = account.getProfile();
                                profile.setAvatar(info.getField());
                                return accountRepository.changeAvatar(userDetailsPhoneNumber, profile)
                                        .flatMap(aLong -> {
                                            if(aLong<=0) {
                                                log.error("# Error: {} userDetailsPhoneNumber: {} profile: {} #", "Failed in changeAvatar", userDetailsPhoneNumber, jsonConverter.objToString(profile));
                                                return Mono.just(ResponseEntity.status(500).body("Error"));
                                            }
                                            WebClient webClient = builder.build();
                                            String oldAvatar = account.getProfile().getAvatar();
                                            String newAvatar = info.getField();
                                            return webClient.get()
                                                    .uri("http://CHAT-SERVICE/api/v1/user/update-avatar-account?oldAvatar="+ oldAvatar+"&newAvatar="+newAvatar)
                                                    .retrieve()
                                                    .bodyToMono(Void.class)
                                                    .then(Mono.just(ResponseEntity.ok("Success")));
                                        });
                            });
                }).flatMap(responseEntityMono -> responseEntityMono);
    }

}

