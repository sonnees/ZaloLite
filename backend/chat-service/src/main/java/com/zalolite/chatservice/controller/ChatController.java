package com.zalolite.chatservice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.chatservice.entity.Chat;
import com.zalolite.chatservice.entity.Content;
import com.zalolite.chatservice.entity.User;
import com.zalolite.chatservice.repository.ChatRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/chat")
@Slf4j
public class ChatController {
    private ChatRepository chatRepository;
    private ObjectMapper objectMapper;
    private WebClient.Builder builder;

    @PostMapping("/create")
    public Mono<Boolean> createChat(@RequestParam String id){
        log.info("** createChat");
        return chatRepository.save(new Chat(id))
                .flatMap(chat -> Mono.just((chat!=null)));
    }

    @GetMapping("/x-to-y")
    public Mono<ResponseEntity<String>> getChatActivityFromNToM(@RequestParam String id, @RequestParam int x, @RequestParam int y){
        return chatRepository.getChatActivityFromNToM(id,x,y)
                .collectList()
                .flatMap(list -> {
                    try {
                        return Mono.just(ResponseEntity.status(200).body(objectMapper.writeValueAsString(list)));
                    } catch (JsonProcessingException e) {
                        log.error("** "+ e);
                        return Mono.just(ResponseEntity.status(500).body("Error processing JSON"));
                    }
                });
    }



}
