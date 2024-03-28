package com.zalolite.chatservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.chatservice.entity.Group;
import com.zalolite.chatservice.entity.User;
import com.zalolite.chatservice.repository.GroupRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/group")
@Slf4j
public class GroupController {
    private GroupRepository groupRepository;
    private ObjectMapper objectMapper;
    private WebClient.Builder builder;

    @PostMapping("/create")
    public Mono<ResponseEntity<String>> createGroup(@RequestBody Group group){
        return groupRepository.save(group)
                .flatMap(g -> Mono.just(ResponseEntity.status(200).body("Create group success")))
                .switchIfEmpty(Mono.just(ResponseEntity.status(500).body("Create group fail")));
    }

}
