package com.zalolite.usermanagementmicroservice.repository;

import com.zalolite.usermanagementmicroservice.model.User;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRep extends ReactiveMongoRepository<User,String> {
}
