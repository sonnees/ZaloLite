package com.zalolite.chatservice.repository;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestComponent;
import reactor.core.publisher.Mono;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ChatRepositoryTest {
    @Autowired
    ChatRepository chatRepository;

    @Test
    void getChatTop10() {
        chatRepository.getChatTop10("49a9768c-a2a8-4290-9653-5291b9718db1")
                .flatMap(chat -> {
                    System.out.println(chat.getDeliveries());
                    chat.getChatActivity().forEach(chatActivity -> System.out.println(chatActivity.getTimestamp()));
                    return Mono.empty();
                }).block();
    }
}