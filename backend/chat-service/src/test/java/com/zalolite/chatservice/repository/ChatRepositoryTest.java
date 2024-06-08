package com.zalolite.chatservice.repository;

import com.zalolite.chatservice.entity.Chat;
import com.zalolite.chatservice.entity.ChatActivity;
import com.zalolite.chatservice.entity.Delivery;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class ChatRepositoryTest {
    @Autowired private ChatRepository chatRepository;

    @Test
    void appendChatActivityByIDChat() {
        UUID id = UUID.randomUUID();
        chatRepository.save(new Chat(id.toString())).block();
        ChatActivity chatActivity = new ChatActivity();

        Long block = chatRepository.appendChatActivityByIDChat(id.toString(), chatActivity).block();

        assertNotNull(block);
        assertTrue(block >= 0);

        chatRepository.deleteById(id).block();
    }

    @Test
    void appendDelivery() {
        UUID id = UUID.randomUUID();
        chatRepository.save(new Chat(id.toString())).block();
        Delivery delivery = new Delivery();

        Long block = chatRepository.appendDelivery(id.toString(), delivery).block();
        assertNotNull(block);
        assertTrue(block >= 0);

        chatRepository.deleteById(id).block();
    }

    @Test
    void appendRead() {
        UUID id = UUID.randomUUID();
        chatRepository.save(new Chat(id.toString())).block();
        Delivery delivery = new Delivery();

        Long block = chatRepository.appendRead(id.toString(), delivery).block();
        assertNotNull(block);
        assertTrue(block >= 0);

        chatRepository.deleteById(id).block();
    }
}