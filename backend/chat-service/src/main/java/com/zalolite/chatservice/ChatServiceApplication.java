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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@SpringBootApplication
@EnableDiscoveryClient
@EnableReactiveMongoRepositories
public class ChatServiceApplication implements CommandLineRunner{
	@Autowired
	UserRepository userRepository;
	@Autowired
	ChatRepository chatRepository;
	@Autowired
	GroupRepository groupRepository;

	public static void main(String[] args) {
		SpringApplication.run(ChatServiceApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {

	}
}
