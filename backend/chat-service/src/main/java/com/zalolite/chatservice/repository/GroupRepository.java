package com.zalolite.chatservice.repository;

import com.zalolite.chatservice.entity.Group;
import com.zalolite.chatservice.entity.GroupSetting;
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
    Mono<Long> updateNameChat(String id, String chatName);

    @Query(value = "{'_id': ?0}")
    @Update(update = "{$set: {'avatar': ?1}}")
    Mono<Long> updateAvatar(String id, String avatar);

    @Query(value = "{'_id': ?0}")
    @Update(update = "{$set: {'owner': ?1}}")
    Mono<Long> changeOwner(String senderID, PersonInfo owner);

    // ===== setting =====
    @Query(value = "{'_id': ?0}")
    @Update(update = "{$set: {'setting':  ?1}}")
    Mono<Long> updateSetting(String id, GroupSetting setting);

    @Query(value = "{'owner.userAvatar': ?0}")
    @Update(update = "{$set:{'owner.userAvatar': ?1}}")
    Mono<Long> updateAvatarInOwner(String oldAvatar, String newAvatar);

    @Query(value = "{'admin.userAvatar': ?0}")
    @Update(update = "{$set:{'admin.$.userAvatar': ?1}}")
    Mono<Long> updateAvatarInAdmin(String oldAvatar, String newAvatar);

    @Query(value = "{'members.userAvatar': ?0}")
    @Update(update = "{$set:{'members.$.userAvatar': ?1}}")
    Mono<Long> updateAvatarInMembers(String oldAvatar, String newAvatar);
}
