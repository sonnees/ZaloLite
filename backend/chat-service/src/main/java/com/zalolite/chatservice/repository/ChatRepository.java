package com.zalolite.chatservice.repository;

import com.zalolite.chatservice.entity.Chat;
import com.zalolite.chatservice.entity.ChatActivity;
import com.zalolite.chatservice.entity.Delivery;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface ChatRepository extends ReactiveMongoRepository<Chat, UUID> {

    @Query(value = "{'_id': ?0}")
    @Update("{$push:{'chatActivity': ?1}}")
    Mono<Long> appendChatActivityByIDChat(String chatID, ChatActivity chatActivity);

//    @Update(update = "{$set: {'conversations.$.type': ?2}}")

    @Query(value = "{'_id': ?0}")
    @Update("{$push:{'deliveries': ?1}}")
    Mono<Long> appendDelivery(String chatID, Delivery delivery);

    @Query(value = "{'_id': ?0}")
    @Update("{$pull:{deliveries: {userID: ?1}}}")
    Mono<Long> removeDelivery(String chatID, String userID);

    @Query(value = "{'_id': ?0}")
    @Update("{$push:{'reads': ?1}}")
    Mono<Long> appendRead(String chatID, Delivery delivery);



}
