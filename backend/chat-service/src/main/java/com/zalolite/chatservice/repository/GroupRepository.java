package com.zalolite.chatservice.repository;

import com.zalolite.chatservice.entity.Group;
import com.zalolite.chatservice.entity.PersonInfo;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface GroupRepository extends ReactiveMongoRepository<Group, UUID> {
    @Query(value = "{'_id': ?0}")
    @Update("{$push:{'members': ?1}}")
    Mono<Long> appendMember(String id, PersonInfo info);

    @Query(value = "{'_id': ?0}")
    @Update("{$pull: {members: {userID: ?1}}}")
    Mono<Long> removeMember(String id, String userID);

    @Query(value = "{'_id': ?0}")
    @Update("{$push:{'admin': ?1}}")
    Mono<Long> appendAdmin(String id, PersonInfo info);

    @Query(value = "{'_id': ?0}")
    @Update("{$pull: {admin: {userID: ?1}}}")
    Mono<Long> removeAdmin(String id, String userID);

    @Query(value = "{'_id': ?0}")
    @Update(update = "{$set: {'conversations.$.type': ?2}}")
    Mono<Long> updateNameChat(String senderID, String receiverID, String type);
}
