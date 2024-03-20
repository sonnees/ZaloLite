package com.zalolite.chatservice.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.chatservice.dto.*;
import com.zalolite.chatservice.entity.Chat;
import com.zalolite.chatservice.entity.Conversation;
import com.zalolite.chatservice.entity.FriendRequest;
import com.zalolite.chatservice.entity.Type;
import com.zalolite.chatservice.repository.ChatRepository;
import com.zalolite.chatservice.repository.GroupRepository;
import com.zalolite.chatservice.repository.UserRepository;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
@Slf4j
@Component
public class UserHandleWebSocket {

    private UserRepository userRepository;
    private ChatRepository chatRepository;
    private GroupRepository groupRepository;
    private ObjectMapper objectMapper;
    private WebClient.Builder builder;

    @Autowired
    public UserHandleWebSocket(UserRepository userRepository, ChatRepository chatRepository, GroupRepository groupRepository, ObjectMapper objectMapper, WebClient.Builder builder) {
        this.userRepository = userRepository;
        this.chatRepository = chatRepository;
        this.groupRepository = groupRepository;
        this.objectMapper = objectMapper;
        this.builder = builder;
    }

    public Mono<Void> appendFriendRequests(FriendRequestAddDTO info){
        log.info("** addFriendRequests: {}",info.getId());
        FriendRequest sender = new FriendRequest(info.getSenderID(),info.getSenderName(),info.getSenderAvatar(),info.getDescription(), false);
        FriendRequest receiver = new FriendRequest(info.getReceiverID(),info.getReceiverName(),info.getReceiverAvatar(),info.getDescription(), true);

        // add friend request for sender
        return userRepository.updateFriendRequests(receiver.getUserID()+"",sender)
                .flatMap(aLong -> {
                    if(aLong<=0){
                        log.error("** sender updateFriendRequests failed");
                        return Mono.error(() -> new Throwable("failed"));
                    }
                    // add friend request for receiver
                    return userRepository.updateFriendRequests(sender.getUserID() + "", receiver)
                            .flatMap(aLong1 -> {
                                if(aLong1<=0){
                                    log.error("** receiver updateFriendRequests failed");
                                    return Mono.error(() -> new Throwable("failed"));
                                }
                                // append conversation
                                return appendConversations(new AppendConversationDTO(info), Type.GROUP);
                            })
                            .onErrorResume(e -> {
                                log.error("** ",e);
                                return Mono.empty();
                            })
                            .then();
                })
                .onErrorResume(e -> {
                    log.error("** ",e);
                    return Mono.empty();
                })
                .then();
    }

    public Mono<Void> removeFriendRequests(FriendRequestRemoveDTO info){
        log.info("** removeFriendRequests: {} {} {}",info.getId(), info.getSenderID(), info.getReceiverID());
        // remove friend request for sender
        return userRepository.updateFriendRequestsRemove(info.getSenderID()+"",info.getReceiverID()+"")
                .flatMap(aLong -> {
                    if(aLong<=0) {
                        log.error("** sender updateFriendRequestsRemove failed");
                        return Mono.error(() -> new Throwable("failed"));
                    }
                    // remove friend request for receiver
                    return userRepository.updateFriendRequestsRemove(info.getReceiverID()+"", info.getSenderID()+"")
                            .flatMap(aLong1 -> {
                                if(aLong1<=0){
                                    log.error("** receiver updateFriendRequestsRemove failed");
                                    return Mono.error(() -> new Throwable("failed"));
                                }
                                // check exist conversation
                                return userRepository.updateTypeConversation(info.getSenderID() + "", info.getReceiverID() + "", Type.STRANGER+"")
                                        .flatMap(aLong2 -> {
                                            if(aLong2<=0){
                                                log.error("** update conversation in sender failed");
                                                return Mono.error(() -> new Throwable("failed"));
                                            }
                                            return Mono.empty();
                                            });
//                                return userRepository.searchConversation(info.getSenderID()+"",info.getReceiverID()+"")
//                                        .flatMap(user -> updateTypeConversation(info.getSenderID() + "", info.getReceiverID() + "", Type.STRANGER+""))
//                                        .switchIfEmpty(Mono.empty())  // not exist conversation
//                                        .onErrorResume(e -> {
//                                            log.error("** ",e);
//                                            return Mono.empty();
//                                        })
//                                        .then();

                            })
                            .onErrorResume(e -> {
                                log.error("** ",e);
                                return Mono.empty();
                            })
                            .then();
                })
                .onErrorResume(e -> {
                    log.error("** ",e);
                    return Mono.empty();
                })
                .then();
    }

    public Mono<Void>  acceptFriendRequests(FriendRequestAcceptDTO info){
        log.info("** acceptFriendRequests: {} {} {}",info.getId(), info.getSenderID(), info.getReceiverID());
        // delete friend request
        return removeFriendRequests(new FriendRequestRemoveDTO(info))
                .then(Mono.defer(()->{
                    // check exist conversation
                    return userRepository.searchConversation(info.getSenderID()+"",info.getReceiverID()+"")
                            .flatMap(user ->updateTypeConversation(info.getSenderID() + "", info.getReceiverID() + "", Type.FRIEND+""))
                            .switchIfEmpty(Mono.defer(()->{ // not exist conversation
                                return appendConversations(new AppendConversationDTO(info), Type.FRIEND);
                            }))
                            .onErrorResume(e -> {
                                log.error("** ",e);
                                return Mono.empty();
                            })
                            .then();
                }));
    }

    public Mono<Void> updateTypeConversation(String senderID, String receiverID, String type){
        log.info("** updateTypeConversation: {} {} {}",senderID, receiverID, type);
        return userRepository.updateTypeConversation(senderID,receiverID,type)
                .flatMap(aLong -> {
                    if(aLong<=0){
                        log.error("** update conversation in sender failed");
                        return Mono.error(() -> new Throwable("failed"));
                    }
                    // update conversation in receiver
                    return userRepository.updateTypeConversation(receiverID,senderID,type)
                            .flatMap(aLong1 -> {
                                if(aLong1<=0){
                                    log.error("** update conversation in receiver failed");
                                    return Mono.error(() -> new Throwable("failed"));
                                }
                                return Mono.empty();
                            });
                })
                .onErrorResume(e -> {
                    log.error("** ",e);
                    return Mono.empty();
                })
                .then();
    }

    // check duplicate
    public Mono<Void> appendConversations(AppendConversationDTO info, Type type){
        log.info("** appendConversations: {}",info.getSenderID());
        UUID idChat = info.getSenderID();
        return userRepository.searchConversation(info.getSenderID()+"",info.getReceiverID()+"")
                .flatMap(user -> Mono.empty())
                .switchIfEmpty(Mono.defer(()->{
                    // new chat
                    return chatRepository.save(new Chat(idChat+""))
                            .flatMap(chat -> {
                                if(chat==null){
                                    log.error("** new chat updateConversations failed");
                                    return Mono.error(() -> new Throwable("failed"));
                                }
                                Conversation conversationOurSender = null;
                                switch (type){
                                    case FRIEND -> conversationOurSender = new Conversation(idChat,info.getReceiverName(),info.getReceiverAvatar(), Type.FRIEND);
                                    case STRANGER -> conversationOurSender = new Conversation(idChat,info.getReceiverName(),info.getReceiverAvatar(), Type.STRANGER);
                                    default -> conversationOurSender = new Conversation(idChat,info.getReceiverName(),info.getReceiverAvatar(), Type.REQUESTS);
                                }
                                // append conversation for sender
                                return userRepository.updateConversations(info.getSenderID()+"",conversationOurSender)
                                        .flatMap(aLongS -> {
                                            if(aLongS<=0) {
                                                log.error("** sender updateConversations failed");
                                                return Mono.error(() -> new Throwable("failed"));
                                            }
                                            Conversation conversationOurReceiver = null;
                                            switch (type){
                                                case FRIEND -> conversationOurReceiver = new Conversation(idChat,info.getSenderName(),info.getSenderAvatar(),Type.FRIEND);
                                                case STRANGER -> conversationOurReceiver = new Conversation(idChat,info.getSenderName(),info.getSenderAvatar(),Type.STRANGER);
                                                default -> conversationOurReceiver = new Conversation(idChat,info.getSenderName(),info.getSenderAvatar(),Type.REQUESTED);
                                            }
                                            // append conversation for receiver
                                            return userRepository.updateConversations(info.getReceiverID()+"",conversationOurReceiver)
                                                    .flatMap(aLongR -> {
                                                        if(aLongR<=0){
                                                            log.error("** sender updateConversations failed");
                                                            return Mono.error(() -> new Throwable("failed"));
                                                        }
                                                        return Mono.empty();
                                                    })
                                                    .onErrorResume(e -> {
                                                        log.error("** ",e);
                                                        return Mono.empty();
                                                    })
                                                    .then();
                                        })
                                        .onErrorResume(e -> {
                                            log.error("** ",e);
                                            return Mono.empty();
                                        })
                                        .then();
                            })
                            .onErrorResume(e -> {
                                log.error("** ",e);
                                return Mono.empty();
                            })
                            .then();
                })).then();
    }


}
