package com.zalolite.chatservice;

import com.mongodb.reactivestreams.client.MongoClients;
import com.mongodb.reactivestreams.client.MongoCollection;
import com.mongodb.reactivestreams.client.MongoDatabase;
import com.zalolite.chatservice.config.MongoConfig;
import com.zalolite.chatservice.entity.*;
import com.zalolite.chatservice.repository.ChatRepository;
import com.zalolite.chatservice.repository.GroupRepository;
import com.zalolite.chatservice.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.reactivestreams.Subscriber;
import org.reactivestreams.Subscription;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@SpringBootApplication
@Slf4j
@AllArgsConstructor
public class ChatServiceApplication {
	UserRepository userRepository;
	ChatRepository chatRepository;
	GroupRepository groupRepository;

	public static void main(String[] args) {
		SpringApplication.run(ChatServiceApplication.class, args);
	}

	@Bean
	CommandLineRunner commandLineRunner(){
		return new CommandLineRunner() {
			@Override
			public void run(String... args) throws Exception {

				User user = userRepository.findById(UUID.fromString("3000f6da-e5c7-43eb-9733-f772672779e1")).block();

				if( user != null ) return;
				userRepository.save(new User("3000f6da-e5c7-43eb-9733-f772672779e1"))
								.then(Mono.defer(()->{
									return userRepository.save(new User("0f1c6cdd-5d81-460b-8a39-02f19349e18f"))
											.then(Mono.defer(()->{
												return userRepository.save(new User("689d39dd-fbed-409f-9f53-626f250712f1"));
											}));
								})).block();
			}
		};
	}
}
