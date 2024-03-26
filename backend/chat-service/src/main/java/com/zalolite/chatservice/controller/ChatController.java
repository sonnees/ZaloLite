package com.zalolite.chatservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.chatservice.entity.Chat;
import com.zalolite.chatservice.entity.Content;
import com.zalolite.chatservice.entity.User;
import com.zalolite.chatservice.repository.ChatRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
        return chatRepository.save(new Chat(id))
                .flatMap(chat -> Mono.just((chat!=null)));
    }

}
