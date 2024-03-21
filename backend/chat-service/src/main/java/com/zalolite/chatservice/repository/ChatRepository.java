package com.zalolite.chatservice.repository;

import com.zalolite.chatservice.entity.Chat;
import com.zalolite.chatservice.entity.ChatActivity;
import com.zalolite.chatservice.entity.FriendRequest;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatRepository extends ReactiveMongoRepository<Chat, UUID> {

    @Query(value = "{'_id': ?0}")
    @Update("{$push:{'chatActivity': ?1}}")
    Mono<Long> appendChatActivityByIDChat(String chatID, ChatActivity chatActivity);

    @Query(value = "{'_id': ?0, 'chatActivity.messageID': ?1}")
    @Update(update = "{$set: {'conversations.$.type': ?2}}")
    Mono<Long> updateDelivery(String chatID, String messageID, String type);

}
