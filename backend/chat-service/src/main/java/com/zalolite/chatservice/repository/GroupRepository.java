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
    @Update(update = "{$set: {'chatName': ?1}}")
    Mono<Long> updateNameChat(String senderID, String chatName);

    @Query(value = "{'_id': ?0}")
    @Update(update = "{$set: {'avatar': ?1}}")
    Mono<Long> updateAvatar(String senderID, String avatar);

    @Query(value = "{'_id': ?0}")
    @Update(update = "{$set: {'owner': ?1}}")
    Mono<Long> changeOwner(String senderID, PersonInfo owner);

    // ===== setting =====
    @Query(value = "{'_id': ?0}")
    @Update(update = "{$set: {'setting': {'changeChatNameAndAvatar': ?1}}}")
    Mono<Long> updateSetting_changeChatNameAndAvatar(String senderID, boolean changeChatNameAndAvatar);

    @Query(value = "{'_id': ?0}")
    @Update(update = "{$set: {'setting': {'pinMessages': ?1}}}")
    Mono<Long> updateSetting_pinMessages(String senderID, boolean pinMessages);

    @Query(value = "{'_id': ?0}")
    @Update(update = "{$set: {'setting': {'sendMessages': ?1}}}")
    Mono<Long> updateSetting_sendMessages(String senderID, boolean sendMessages);

    @Query(value = "{'_id': ?0}")
    @Update(update = "{$set: {'setting': {'membershipApproval': ?1}}}")
    Mono<Long> updateSetting_membershipApproval(String senderID, boolean membershipApproval);

    @Query(value = "{'_id': ?0}")
    @Update(update = "{$set: {'setting': {'createNewPolls': ?1}}}")
    Mono<Long> updateSetting_createNewPolls(String senderID, boolean createNewPolls);
}
