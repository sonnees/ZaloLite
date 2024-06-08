package com.zalolite.chatservice.repository;

import com.zalolite.chatservice.entity.FriendRequest;
import com.zalolite.chatservice.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserRepositoryTest {
    @Autowired private UserRepository userRepository;

    @Test
    void findUserById() {
        User user = new User();
        user.setId(UUID.randomUUID());

        User block = userRepository.save(user).block();

        User blocked = userRepository.findUserById(user.getId().toString()).block();

        assertNotNull(block);
        assertNotNull(blocked);
        assertEquals(block.getId(), blocked.getId());

        userRepository.deleteById(blocked.getId()).block();
    }

    @Test
    void appendFriendRequest() {
        User user = new User();
        user.setId(UUID.randomUUID());
        FriendRequest friendRequest = new FriendRequest();

        User block = userRepository.save(user).block();
        Long blocked = userRepository.appendFriendRequest(user.getId().toString(), friendRequest).block();

        assertNotNull(block);
        assertNotNull(blocked);
        assertTrue(blocked>=0);

        userRepository.deleteById(block.getId()).block();
    }
}