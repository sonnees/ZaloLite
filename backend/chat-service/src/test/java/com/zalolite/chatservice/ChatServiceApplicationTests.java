package com.zalolite.chatservice;

import com.zalolite.chatservice.repository.ChatRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import reactor.core.publisher.Mono;

@SpringBootTest
class ChatServiceApplicationTests {
	@Autowired
	ChatRepository chatRepository;
	@Test
	void contextLoads() {

		chatRepository.getChatTop10("49a9768c-a2a8-4290-9653-5291b9718db2")
				.flatMap(chat -> {
					chat.getChatActivity().forEach(chatActivity -> System.out.println(chatActivity.getTimestamp()));
					return Mono.empty();
				}).block();

	}

}
