package com.zalolite.chatservice.controller;

import com.zalolite.chatservice.entity.Group;
import com.zalolite.chatservice.repository.GroupRepository;
import com.zalolite.chatservice.serialization.JsonConverter;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.UUID;

import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
class GroupControllerTest {
    @Mock private JsonConverter jsonConverter;
    @InjectMocks private GroupController groupController;
    @Mock private GroupRepository groupRepository;

    @Test
    void createGroup() {
        Group group = new Group();

        when(jsonConverter.objToString(any())).thenReturn("jsonConverter");
        when(groupRepository.save(any())).thenReturn(Mono.just(group));

        Mono<ResponseEntity<String>> result = groupController.createGroup(group);

        StepVerifier.create(result)
                .expectNext(ResponseEntity.ok("Create group success"))
                .verifyComplete();

        verify(groupRepository).save(any());
    }

    @Test
    void getInfoGroup() {
        UUID id = UUID.randomUUID();
        Group group = new Group();
        group.setId(id);

        when(jsonConverter.objToString(any())).thenReturn("jsonConverter");
        when(groupRepository.findById(id)).thenReturn(Mono.just(group));

        Mono<ResponseEntity<String>> result = groupController.getInfoGroup(id);
        StepVerifier.create(result)
                .expectNext(ResponseEntity.ok("jsonConverter"))
                .verifyComplete();

        verify(groupRepository).findById(id);
    }
}