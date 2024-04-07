package com.zalolite.accountservice;

import com.zalolite.accountservice.entity.Account;
import com.zalolite.accountservice.entity.Profile;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface AccountRepository extends ReactiveMongoRepository<Account, UUID> {

    @Query(value = "{'phoneNumber': ?0}")
    Mono<Account> searchByPhoneNumber(String phoneNumber);

    @Query(value = "{phoneNumber: ?0}")
    @Update(update = "{$set: {pw: ?1}}")
    Mono<Long> changePassword(String phoneNumber, String password);

    @Query(value = "{phoneNumber: ?0}")
    @Update(update = "{$set: {profile: ?1}}")
    Mono<Long> changeAvatar(String phoneNumber, Profile profile);

    @Query(value = "{'profile.userID': ?0}")
    Mono<Account> searchByUserID(UUID userID);

}

