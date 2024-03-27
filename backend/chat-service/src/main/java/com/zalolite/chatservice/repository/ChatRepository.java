package com.zalolite.chatservice.repository;

import com.zalolite.chatservice.entity.Chat;
import com.zalolite.chatservice.entity.ChatActivity;
import com.zalolite.chatservice.entity.Delivery;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Component;
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
    @Update("{$push:{'reads': ?1}}")
    Mono<Long> appendRead(String chatID, Delivery delivery);

    @Query(value = "{'_id': ?0, 'deliveries.userID': ?1}")
    Mono<Chat> searchDeliveryByUserID(String chatID, String userID);

    @Query(value = "{'_id': ?0, 'reads.userID': ?1}")
    Mono<Chat> searchReadByUserID(String chatID, String userID);

    @Query(value = "{'_id': ?0, 'deliveries.userID': ?1}")
    @Update(update = "{$set: {'deliveries.$.messageID': ?2}}")
    Mono<Long> changeDelivery(String chatID, String userID, String messageID);

    @Query(value = "{'_id': ?0, 'reads.userID': ?1}")
    @Update(update = "{$set: {'reads.$.messageID': ?2}}")
    Mono<Long> changeRead(String chatID, String userID, String messageID);

    @Query(value = "{'_id': ?0}")
    @Update("{$pull:{deliveries: {messageID: ?1}}}")
    Mono<Long> removeDelivery(String chatID, String messageID);

    @Query(value = "{'_id': ?0, 'reads.userID': ?1}")
    @Update(update = "[{$setOnInsert: {'reads.$': ?2}} ,{$upsert:true}]")
    Mono<Long> appendRead(String chatID, String userID, Delivery delivery);

    @Query(value = "{'_id': ?0}")
    @Update("{$pull:{reads: {messageID: ?1}}}")
    Mono<Long> removeRead(String chatID, String messageID);

    @Query(value = "{_id: ?0, 'chatActivity.messageID': ?2}")
    @Update("{$push:{'chatActivity.$.hidden': ?1}}")
    Mono<Long> appendHiddenMessage(String chatID, String userID, String messageID);

    @Query(value = "{'_id': ?0, 'chatActivity.messageID': ?1}")
    @Update(update = "{$set: {'chatActivity.$.recall': true}}")
    Mono<Long> recallMessage(String chatID, String messageID);

    @Query(value = "{_id:?0}", fields = "{chatActivity: {$slice: -10}}")
    Mono<Chat> getChatTop10(String chatID);


}
