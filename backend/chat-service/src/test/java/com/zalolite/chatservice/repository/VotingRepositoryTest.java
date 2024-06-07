package com.zalolite.chatservice.repository;

import com.zalolite.chatservice.entity.PersonInfo;
import com.zalolite.chatservice.entity.Voting;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Date;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class VotingRepositoryTest {
    @Autowired private VotingRepository votingRepository;

    @Test
    void appendVoter() {
        String name = "son";
        Voting voting = new Voting();
        voting.setId(UUID.randomUUID());
        PersonInfo info = new PersonInfo();

        Voting block = votingRepository.save(voting).block();
        Long blocked = votingRepository.appendVoter(voting.getId(), name, info).block();

        assertNotNull(block);
        assertNotNull(blocked);
        assertTrue(blocked>=0);

        votingRepository.deleteById(voting.getId()).block();
    }

    @Test
    void removeVoter() {
        String name = "son";
        Voting voting = new Voting();
        voting.setId(UUID.randomUUID());
        PersonInfo info = new PersonInfo();
        info.setUserID(UUID.randomUUID());

        Voting block = votingRepository.save(voting).block();
        Long blocked = votingRepository.appendVoter(voting.getId(), name, info).block();
        Long aLong = votingRepository.removeVoter(voting.getId(), name, info.getUserID()).block();

        assertNotNull(block);
        assertNotNull(blocked);
        assertNotNull(aLong);
        assertTrue(blocked>=0);
        assertTrue(aLong>=0);

        votingRepository.deleteById(voting.getId()).block();
    }

    @Test
    void lockVoting() {
        String name = "son";
        Voting voting = new Voting();
        voting.setId(UUID.randomUUID());
        PersonInfo info = new PersonInfo();

        Voting block = votingRepository.save(voting).block();
        Long blocked = votingRepository.appendVoter(voting.getId(), name, info).block();
        Long aLong = votingRepository.lockVoting(voting.getId(), true, new Date()).block();

        assertNotNull(block);
        assertNotNull(blocked);
        assertNotNull(aLong);
        assertTrue(blocked>=0);
        assertTrue(aLong>=0);

        votingRepository.deleteById(voting.getId()).block();
    }
}