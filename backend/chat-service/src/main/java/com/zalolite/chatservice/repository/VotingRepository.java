package com.zalolite.chatservice.repository;

import com.zalolite.chatservice.entity.Delivery;
import com.zalolite.chatservice.entity.PersonInfo;
import com.zalolite.chatservice.entity.Voting;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.Date;
import java.util.UUID;

@Repository
public interface VotingRepository extends ReactiveMongoRepository<Voting, UUID> {

    @Query(value = "{'_id': ?0, 'choices.name': ?1}")
    @Update("{$push:{'choices.$.voters': ?2}}")
    Mono<Long> appendVoter(UUID id, String name, PersonInfo info);

    @Query(value = "{'_id': ?0, 'choices.name': ?1}")
    @Update("{$pull:{'choices.$.voters': {userID: ?2}}}")
    Mono<Long> removeVoter(UUID id, String name, UUID userID);

    @Query(value = "{'_id': ?0}")
    @Update(update = "{$set: {lock: ?1, dateLock: ?2}}")
    Mono<Long> lockVoting(UUID id, boolean isLock, Date dateLock);

}
