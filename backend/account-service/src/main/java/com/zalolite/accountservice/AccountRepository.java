package com.zalolite.accountservice;

import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface AccountRepository extends ReactiveMongoRepository<Account, UUID> {

    @Query(value = "{'phoneNumber': ?0}")
    public Mono<Account> searchByPhoneNumber(String phoneNumber);
}
