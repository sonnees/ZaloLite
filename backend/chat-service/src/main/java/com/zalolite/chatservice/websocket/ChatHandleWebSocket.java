package com.zalolite.chatservice.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.chatservice.dto.*;
import com.zalolite.chatservice.entity.ChatActivity;
import com.zalolite.chatservice.entity.Delivery;
import com.zalolite.chatservice.entity.Type;
import com.zalolite.chatservice.repository.ChatRepository;
import com.zalolite.chatservice.repository.GroupRepository;
import com.zalolite.chatservice.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
@Slf4j
@Component
public class ChatHandleWebSocket {
    private UserRepository userRepository;
    private ChatRepository chatRepository;
    private GroupRepository groupRepository;

    @Autowired
    public ChatHandleWebSocket(UserRepository userRepository, ChatRepository chatRepository, GroupRepository groupRepository) {
        this.userRepository = userRepository;
        this.chatRepository = chatRepository;
        this.groupRepository = groupRepository;
    }

    public Mono<Void> appendChat(String chatID, MessageAppendDTO info){
        log.info("** appendChat: {} {} {} {}",info.getId(), chatID, info.getUserID(), info.getContents().get(0).getValue());
        UUID messageID = UUID.randomUUID();
        return chatRepository.appendChatActivityByIDChat(chatID, new ChatActivity(info,messageID))
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.error(() -> new Throwable("appendChatActivityByIDChat failed"));
                    return changeReadChat(chatID, new MessageDeliveryDTO(info, messageID));
                });
    }

    public Mono<Void> changeDeliveryChat(String chatID,MessageDeliveryDTO info){
        log.info("** changeDeliveryChat: {} {} {}",chatID, info.getMessageID(), info.getUserAvatar());
        return chatRepository.searchDeliveryByUserID(chatID,info.getUserID().toString())
                .switchIfEmpty(Mono.defer(() -> {
                    return chatRepository.appendDelivery(chatID, new Delivery(info.getUserID(), info.getMessageID(), info.getUserAvatar()))
                            .flatMap(aLong -> {
                                if (aLong <= 0) return Mono.error(() -> new Throwable("changeDelivery failed"));
                                return Mono.empty();
                            });
                }))
                .flatMap(user ->{
                    return chatRepository.changeDelivery(chatID,info.getUserID().toString(),info.getMessageID().toString())
                            .flatMap(aLong -> {
                                if(aLong<=0) return Mono.error(() -> new Throwable("changeDelivery failed"));
                                return Mono.empty();
                            });
                });
    }

    public Mono<Void> changeReadChat(String chatID,MessageDeliveryDTO info){
        log.info("** changeReadChat: {} {} {}",chatID, info.getMessageID(), info.getUserAvatar());
        return chatRepository.searchReadByUserID(chatID,info.getUserID().toString())
                .switchIfEmpty(Mono.defer(() -> {
                    return chatRepository.appendRead(chatID, new Delivery(info.getUserID(), info.getMessageID(), info.getUserAvatar()))
                            .flatMap(aLong -> {
                                if (aLong <= 0) return Mono.error(() -> new Throwable("appendRead failed"));
                                return chatRepository.searchDeliveryByUserID(chatID,info.getUserID().toString())
                                        .switchIfEmpty(Mono.defer(()->{ // not exit Delivery
                                                    return chatRepository.appendDelivery(chatID, new Delivery(info.getUserID(), info.getMessageID(), info.getUserAvatar()))
                                                            .flatMap(aLong1 -> {
                                                                if (aLong1 <= 0) return Mono.error(() -> new Throwable("appendDelivery failed"));
                                                                return Mono.empty();
                                                            });
                                                }))
                                        .flatMap(chat -> { // exit Delivery
                                            return chatRepository.changeDelivery(chatID,info.getUserID().toString(),info.getMessageID().toString())
                                                    .flatMap(aLong1 -> {
                                                        if(aLong1<=0) return Mono.error(() -> new Throwable("changeRead failed"));
                                                        return Mono.empty();
                                                    });
                                        });
                            });
                }))
                .flatMap(user ->{
                    // change Read
                    return chatRepository.changeRead(chatID,info.getUserID().toString(),info.getMessageID().toString())
                            .flatMap(aLong -> {
                                if(aLong<=0) return Mono.error(() -> new Throwable("changeRead failed"));
                                // change Delivery
                                return chatRepository.changeDelivery(chatID,info.getUserID().toString(),info.getMessageID().toString())
                                        .flatMap(aLong1 -> {
                                            if(aLong1<=0) return Mono.error(() -> new Throwable("changeRead failed"));
                                            return Mono.empty();
                                        });
                            });
                });
    }

    public Mono<Void> appendHiddenMessage(UUID chatID, MessageHiddenDTO info){
        log.info("** appendHiddenMessage: {} {} {}", chatID.toString(), info.getUserID(), info.getMessageID());
        return chatRepository.appendHiddenMessage(chatID.toString(), info.getUserID().toString(), info.getMessageID().toString())
                .flatMap(aLong -> {
                    if (aLong <= 0) return Mono.error(() -> new Throwable("appendHiddenMessage failed"));
                    return Mono.empty();
                });
    }

    public Mono<Void> recallMessage(UUID chatID, MessageHiddenDTO info){
        log.info("** recallMessage: {} {} {}", chatID.toString(), info.getUserID(), info.getMessageID());
        return chatRepository.recallMessage(chatID.toString(), info.getMessageID().toString())
                .flatMap(aLong -> {
                    if (aLong <= 0) return Mono.error(() -> new Throwable("recallMessage failed"));
                    return Mono.empty();
                });
    }

}
