package com.zalolite.chatservice.controller;

import com.zalolite.chatservice.dto.handleChat.VotingDTO;
import com.zalolite.chatservice.entity.Voting;
import com.zalolite.chatservice.repository.VotingRepository;
import com.zalolite.chatservice.serialization.JsonConverter;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.ArrayList;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VotingControllerTest {

    @Mock private JsonConverter jsonConverter;
    @InjectMocks private VotingController votingController;
    @Mock private VotingRepository votingRepository;

    @Test
    void createVoting() {
        VotingDTO votingDTO = new VotingDTO();
        Voting voting = new Voting();
        votingDTO.setChoices(new ArrayList<>());

        when(jsonConverter.objToString(any())).thenReturn("jsonConverter");
        when(votingRepository.save(any())).thenReturn(Mono.just(voting));

        Mono<ResponseEntity<String>> result = votingController.createVoting(votingDTO);

        StepVerifier.create(result)
                .expectNext(ResponseEntity.ok("jsonConverter"))
                .verifyComplete();

        verify(votingRepository).save(any());
    }

}