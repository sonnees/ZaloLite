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

    @Query(value = "{'_id': ?0, 'conversations.chatID': { $in: [?1, ?2] }}")
    @Update(update = "{$set: {'conversations.$.type': ?3}}")
    Mono<Long> updateTypeConversation(String senderID, String chatID1, String chatID2, String type);

    @Query(value = "{'_id': ?0}")
    @Update("{$push:{'conversations': ?1}}")
    Mono<Long> appendConversation(String id, Conversation conversation);

    @Query(value = "{'_id': {$in: ?0}}")
    @Update("{$push:{'conversations': ?1}}")
    Mono<Long> appendConversation(String[] id, Conversation conversation);

    @Query(value = "{_id: {$in: ?0}}")
    @Update("{$pull:{conversations: {chatID: ?1}}}")
    Mono<Long> removeConversation(String[] id, String idChat);

    @Query(value = "{_id: ?0}")
    @Update("{$pull:{conversations: {chatID: ?1}}}")
    Mono<Long> removeConversation(String id, String idChat);

    @Query(value = "{_id:?0,'conversations.chatID': {$in: [?1,?2]}}")
    Mono<User> searchConversation(String senderID, String chatId1, String chatId2);

    @Query(value = "{_id:?0,'conversations.chatID': ?1}")
    Mono<User> searchConversation(String senderID, String chatId);

    @Query(value = "{'conversations.chatID': ?0}")
    @Update(update = "{$set:{'conversations.$.lastUpdateAt': ?1, 'conversations.$.deliveries': ?2, 'conversations.$.reads': ?3, 'conversations.$.topChatActivity': ?4}}")
    Mono<Long> updateChatActivity(String chatID, Date lastUpdateAt, List<Delivery> deliveries, List<Delivery> reads, List<ChatActivity> newTopChatActivity);

    @Query(value = "{'conversations.chatAvatar': ?0}")
    @Update(update = "{$set:{'conversations.$.chatAvatar': ?1}}")
    Mono<Long> updateAvatarInConversation(String oldAvatar, String newAvatar);

    @Query(value = "{'friendRequests.userAvatar': ?0}")
    @Update(update = "{$set:{'conversations.$.chatAvatar': ?1}}")
    Mono<Long> updateAvatarInFriendRequest(String oldAvatar, String newAvatar);

    @Query(value = "{_id: {$in: ?0}, 'conversations.chatID': ?1}")
    @Update(update = "{$set:{'conversations.$.chatName': ?2}}")
    Mono<Long> updateChatNameInConversation(String[] arrID,String chatId, String chatName);

    @Query(value = "{_id: {$in: ?0}, 'conversations.chatID': ?1}")
    @Update(update = "{$set:{'conversations.$.chatAvatar': ?2}}")
    Mono<Long> updateAvatarInConversation(String[] arrID,String chatId, String newAvatar);

}
