package com.zalolite.chatservice.repository;

import com.zalolite.chatservice.entity.ChatActivity;
import com.zalolite.chatservice.entity.Conversation;
import com.zalolite.chatservice.entity.FriendRequest;
import com.zalolite.chatservice.entity.User;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserRepository  extends ReactiveMongoRepository<User, UUID> {

    @Query(value = "{'_id': ?0}",sort = "{'conversations.lastUpdateAt': -1}")
    Mono<User> findUserById(String id);

    @Query(value = "{'conversations.chatID': ?0}")
    @Update("{$set:{'conversations.$.topChatActivity': ?1}}")
    Mono<Long> updateTopChatActivity(String chatID, List<ChatActivity> newTopChatActivity);

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

    @Query(value = "{_id:?0,'conversations.chatID': {$in: [?1,?2]}}")
    Mono<User> searchConversation(String senderID, String chatId1, String chatId2);
}
