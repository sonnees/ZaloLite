package com.zalolite.chatservice.controller;

import com.zalolite.chatservice.entity.Chat;
import com.zalolite.chatservice.repository.ChatRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.UUID;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatControllerTest {

    @InjectMocks private ChatController chatController;
    @Mock private ChatRepository chatRepository;


    @BeforeEach
    public void setUp() throws Exception {
    }

    @AfterEach
    public void tearDown() throws Exception {
    }


    @Test
    void createChat() {
        UUID id = UUID.randomUUID();
        Chat chat = new Chat();

        when(chatRepository.save(any())).thenReturn(Mono.just(chat));

        Mono<Boolean> result = chatController.createChat(id.toString());

        StepVerifier.create(result)
                .expectNext(true)
                .verifyComplete();

        verify(chatRepository).save(any());
    }
}