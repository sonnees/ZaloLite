package com.zalolite.chatservice.repository;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestComponent;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.UUID;

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

    @Test
    void getChatActivityFromNToM() {

        chatRepository.getChatActivityFromNToM("49a9768c-a2a8-4290-9653-5291b9718db1", 1,1)
                .map(chatActivity -> chatActivity)
                .flatMap(chatActivity -> {
                    System.out.println(chatActivity.getMessageID());
                    return Flux.empty();
                })
                .blockFirst();
    }

    @Test
    void test(){
        UUID u = UUID.randomUUID();
        System.out.println(u);
    }
}