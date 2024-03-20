package com.zalolite.chatservice.repository;

import com.zalolite.chatservice.entity.User;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository  extends ReactiveMongoRepository<User, UUID> {
}
