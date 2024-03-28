package com.zalolite.chatservice.repository;

import com.zalolite.chatservice.entity.Group;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GroupRepository extends ReactiveMongoRepository<Group, UUID> {

}
