package com.zalolite.accountservice.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@RestController
@RequestMapping("/api/v1/auth/")
@Slf4j
@AllArgsConstructor
public class Demo {

    WebClient webClient;

    @PostMapping("/j{token}")
    public void registerWebSocket(@PathVariable String token) {

        webClient.get()
                .uri("http://localhost:8081/api/v1/auth/check-token?token=" + token)
                .retrieve()
                .bodyToMono(Boolean.class)
                .subscribe(aBoolean -> {
                    log.info("** "+aBoolean);
                });

    }
}
