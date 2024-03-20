package com.zalolite.chatservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.chatservice.entity.Group;
import com.zalolite.chatservice.entity.User;
import com.zalolite.chatservice.repository.GroupRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
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

}
