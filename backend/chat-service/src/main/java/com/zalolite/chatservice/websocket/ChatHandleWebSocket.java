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
                    if(aLong<=0){
                        log.error("** appendChat failed");
                        return Mono.error(() -> new Throwable("failed"));
                    }
                    return changeReadChat(UUID.fromString(chatID), info.getUserID(), messageID, info.getUserAvatar());
                })
                .onErrorResume(e -> {
                    log.error("** ",e);
                    return Mono.empty();
                })
                .then();
    }

    public Mono<Void> changeDeliveryChat(String chatID,MessageDeliveryDTO info){
        log.info("** changeDeliveryChat: {} {} {}",chatID, info.getMessageID(), info.getUserAvatar());
        return chatRepository.appendDelivery(chatID, new Delivery(info.getUserID() ,info.getMessageID(),info.getUserAvatar()))
                .flatMap(aLong -> {
                    if(aLong<=0){
                        log.error("** appendChat failed");
                        return Mono.error(() -> new Throwable("failed"));
                    }
                    return Mono.empty();
                })
                .onErrorResume(e -> {
                    log.error("** ",e);
                    return Mono.empty();
                })
                .then();
    }

    public Mono<Void> changeReadChat(UUID chatID, UUID userID, UUID messageID, String userAvatar){
        log.info("** changeReadChat: {} {} {}",chatID.toString(), messageID.toString(), userAvatar);
        return chatRepository.appendRead(chatID.toString(), new Delivery(userID,messageID, userAvatar))
                .flatMap(aLong1 -> {
                    if (aLong1 <= 0) {
                        log.error("** changeReadChat failed");
                        return Mono.error(() -> new Throwable("failed"));
                    }
                    return Mono.empty();
                })
                .onErrorResume(e -> {
                    log.error("** ",e);
                    return Mono.empty();
                })
                .then();
    }

//    public Mono<Void> changeReadChatNotExitDelivery(UUID chatID, UUID messageID, String userAvatar){
//        log.info("** changeReadChatNotExitDelivery: {} {} {}",chatID.toString(), messageID.toString(), userAvatar);
//        // remove delivery
//        return chatRepository.removeDelivery(chatID.toString(), messageID.toString())
//                .flatMap(aLong -> {
//                    if (aLong <= 0) {
//                        log.error("** changeReadChatNotExitDelivery removeDelivery failed");
//                        return Mono.error(() -> new Throwable("failed"));
//                    }
//                    // append read
//                    return chatRepository.appendRead(chatID.toString(), new Delivery(messageID, userAvatar))
//                            .flatMap(aLong1 -> {
//                                if (aLong1 <= 0) {
//                                    log.error("** changeReadChatNotExitDelivery changeReadChat failed");
//                                    return Mono.error(() -> new Throwable("failed"));
//                                }
//                                return Mono.empty();
//                            })
//                            .onErrorResume(e -> {
//                                log.error("** ",e);
//                                return Mono.empty();
//                            })
//                            .then();
//                });
//    }



}
