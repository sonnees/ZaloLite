package com.zalolite.accountservice.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/auth/ws")
@Slf4j
@AllArgsConstructor
public class Demo {

    @PostMapping("/{romId}")
    public Mono<String> registerWebSocket(@PathVariable String romId) {
        log.info("*** hello controller");
        return Mono.just("WebSocket registration successful for rom: " + romId);
    }
}
