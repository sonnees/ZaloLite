package com.zalolite.chatservice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.chatservice.async.UpdateAsync;
import com.zalolite.chatservice.entity.*;
import com.zalolite.chatservice.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/user")
@Slf4j
public class UserController {
    private final UserRepository userRepository;
    private final UpdateAsync updateAsync;
    private final ObjectMapper objectMapper;
    private final WebClient.Builder builder;

    @PostMapping("/create")
    public Mono<Boolean> createUser(@RequestParam String id){
        log.info("### enter create user ###");
        log.info("# {} #", id);
        return userRepository.save(new User(id))
                .flatMap(user -> Mono.just((user!=null)));
    }

    @GetMapping("/info/{userId}")
    public Mono<ResponseEntity<String>> getUser(ServerWebExchange exchange, @PathVariable String userId){
        log.info("### enter get user ###");
        log.info("# {} #", userId);
        String token = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        WebClient webClient = builder.build();
        if(token!=null) token = token.substring(7);
        log.info("# token: {} #", token);
        // check auth
        return webClient.get()
               .uri("http://ACCOUNT-SERVICE/api/v1/auth/get-userid/" + token)
               .retrieve()
               .bodyToMono(String.class)
               .flatMap(id -> {
                   log.info("# userId: {} #", id);
                   if (id.isEmpty() || !userId.equals(id))
                       return Mono.just(ResponseEntity.status(401).body("Error token"));
                   // get info user
                   return userRepository.findUserById(userId)
                           .flatMap(user -> {
                               try {
                                   return Mono.just(ResponseEntity.status(200).body(objectMapper.writeValueAsString(user)));
                               } catch (JsonProcessingException e) {
                                   log.error("# {} #", e+"");
                                   return Mono.just(ResponseEntity.status(500).body("Error processing JSON"));
                               }
                           })
                           .switchIfEmpty(Mono.just(ResponseEntity.status(401).body("Error token")));
               })
                .doOnError(throwable -> log.error(throwable.getMessage()));
    }

    @GetMapping("/update-avatar-account")
    public Mono<Void> updateAvatarAsync(@RequestParam String oldAvatar,@RequestParam String newAvatar){
        log.info("### enter update avatar ###");
        log.info("# oldAvatar: {} newAvatar: {} #", oldAvatar, newAvatar);
        updateAsync.updateAvatarAsync(oldAvatar,newAvatar);
        return Mono.empty();
    }

}
