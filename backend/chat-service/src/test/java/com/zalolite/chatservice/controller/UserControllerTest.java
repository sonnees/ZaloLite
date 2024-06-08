package com.zalolite.chatservice.controller;

import com.zalolite.chatservice.entity.User;
import com.zalolite.chatservice.repository.UserRepository;
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
class UserControllerTest {
    @InjectMocks private UserController userController;
    @Mock private UserRepository userRepository;

    @Test
    void createUser() {
        UUID id = UUID.randomUUID();
        User user = new User();

        when(userRepository.save(any())).thenReturn(Mono.just(user));

        Mono<Boolean> result = userController.createUser(id.toString());

        StepVerifier.create(result)
                .expectNext(true)
                .verifyComplete();

        verify(userRepository).save(any());
    }

}