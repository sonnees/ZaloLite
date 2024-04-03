package com.zalolite.chatservice.repository;

import com.zalolite.chatservice.entity.*;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Repository
public interface UserRepository  extends ReactiveMongoRepository<User, UUID> {

    @Query(value = "{'_id': ?0}",sort = "{'conversations.lastUpdateAt': -1}")
    Mono<User> findUserById(String id);

    @Query(value = "{'_id': ?0}")
    @Update("{$push:{'friendRequests': ?1}}")
    Mono<Long> appendFriendRequest(String id, FriendRequest friendRequest);

    @Query(value = "{'_id': ?0}")
    @Update("{$pull: {friendRequests: {userID: ?1}}}")
    Mono<Long> removeFriendRequest(String sender, String receiver);

    @Query(value = "{'_id': ?0, 'conversations.chatID': { $in: [?0, ?1] }}")
    @Update(update = "{$set: {'conversations.$.type': ?2}}")
    Mono<Long> updateTypeConversation(String senderID, String receiverID, String type);

    @Query(value = "{'_id': ?0}")
    @Update("{$push:{'conversations': ?1}}")
    Mono<Long> appendConversation(String id, Conversation conversation);

    @Query(value = "{'_id': {$in: ?0}}")
    @Update("{$push:{'conversations': ?1}}")
    Mono<Long> appendConversation(String[] id, Conversation conversation);

    @Query(value = "{}")
    @Update("{$pull:{'conversations.chatID': {$in: ?0}}}")
    Mono<Long> removeConversation(String[] id);

    @Query(value = "{_id:?0,'conversations.chatID': {$in: [?1,?2]}}")
    Mono<User> searchConversation(String senderID, String chatId1, String chatId2);

    @Query(value = "{'conversations.chatID': ?0}")
    @Update(update = "{$set:{'conversations.$.lastUpdateAt': ?1, 'conversations.$.deliveries': ?2, 'conversations.$.reads': ?3, 'conversations.$.topChatActivity': ?4}}")
    Mono<Long> updateChatActivity(String chatID, Date lastUpdateAt, List<Delivery> deliveries, List<Delivery> reads, List<ChatActivity> newTopChatActivity);

    @Query(value = "{'conversations.chatAvatar': ?0}")
    @Update(update = "{$set:{'conversations.$.chatAvatar': ?1}}")
    Mono<Long> updateAvatarInConversation(String oldAvatar, String newAvatar);

    @Query(value = "{'friendRequests.userAvatar': ?0}")
    @Update(update = "{$set:{'conversations.$.chatAvatar': ?1}}")
    Mono<Long> updateAvatarInFriendRequest(String oldAvatar, String newAvatar);

}
