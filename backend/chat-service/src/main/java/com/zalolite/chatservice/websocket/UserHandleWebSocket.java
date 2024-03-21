package com.zalolite.chatservice.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.chatservice.dto.*;
import com.zalolite.chatservice.entity.*;
import com.zalolite.chatservice.repository.ChatRepository;
import com.zalolite.chatservice.repository.GroupRepository;
import com.zalolite.chatservice.repository.UserRepository;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Arrays;
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
        return userRepository.appendFriendRequest(receiver.getUserID()+"",sender)
                .flatMap(aLong -> {
                    if(aLong<=0){
                        log.error("** sender updateFriendRequests failed");
                        return Mono.error(() -> new Throwable("failed"));
                    }
                    // add friend request for receiver
                    return userRepository.appendFriendRequest(sender.getUserID() + "", receiver)
                            .flatMap(aLong1 -> {
                                if(aLong1<=0){
                                    log.error("** receiver updateFriendRequests failed");
                                    return Mono.error(() -> new Throwable("failed"));
                                }
                                // check exist conversation
                                String chatID1 = info.getSenderID().toString().substring(0,18)+info.getReceiverID().toString().substring(18,36);
                                String chatID2 = info.getReceiverID().toString().substring(0,18)+info.getSenderID().toString().substring(18,36);
                                return userRepository.searchConversation(info.getSenderID()+"",chatID1,chatID2)
                                        .switchIfEmpty( // not exist conversation
                                                appendConversations(new AppendConversationDTO(info), Type.GROUP) // GROUP is presentation REQUESTS and REQUESTED
                                                        .then(Mono.defer(Mono::empty))
                                        )
                                        .flatMap(user ->{
                                            log.info("** conversation exist");
                                            return updateTypeConversation(info.getSenderID() + "", info.getReceiverID() + "", Type.REQUESTS+"",Type.REQUESTED+"");
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
    }

    public Mono<Void> removeFriendRequests(FriendRequestRemoveDTO info){
        log.info("** removeFriendRequests: {} {} {}",info.getId(), info.getSenderID(), info.getReceiverID());
        // remove friend request for sender
        return userRepository.removeFriendRequest(info.getSenderID()+"",info.getReceiverID()+"")
                .flatMap(aLong -> {
                    if(aLong<=0) {
                        log.error("** sender updateFriendRequestsRemove failed");
                        return Mono.error(() -> new Throwable("failed"));
                    }
                    // remove friend request for receiver
                    return userRepository.removeFriendRequest(info.getReceiverID()+"", info.getSenderID()+"")
                            .flatMap(aLong1 -> {
                                if(aLong1<=0){
                                    log.error("** receiver updateFriendRequestsRemove failed");
                                    return Mono.error(() -> new Throwable("failed"));
                                }
                                // check exist conversation
                                String chatID1 = info.getSenderID().toString().substring(0,18)+info.getReceiverID().toString().substring(18,36);
                                String chatID2 = info.getReceiverID().toString().substring(0,18)+info.getSenderID().toString().substring(18,36);
                                return userRepository.searchConversation(info.getSenderID()+"",chatID1,chatID2)
                                        .flatMap(user -> updateTypeConversation(info.getSenderID() + "", info.getReceiverID() + "", Type.STRANGER+"",Type.STRANGER+""))
                                        .switchIfEmpty(Mono.empty());
                            })
                            .onErrorResume(throwable -> {
                                log.error(Arrays.toString(throwable.getStackTrace()));
                                return Mono.error(() -> new Throwable("failed sql receiver"));
                            })
                            .then();
                })
                .onErrorResume(throwable -> {
                    log.error(Arrays.toString(throwable.getStackTrace()));
                    return Mono.error(() -> new Throwable("failed sql sender"));
                })
                .then();
    }

    public Mono<Void>  acceptFriendRequests(FriendRequestAcceptDTO info){
        log.info("** acceptFriendRequests: {} {} {}",info.getId(), info.getSenderID(), info.getReceiverID());
        // delete friend request
        return removeFriendRequests(new FriendRequestRemoveDTO(info))
                .then(Mono.defer(()->{
                    // check exist conversation
                    String chatID1 = info.getSenderID().toString().substring(0,18)+info.getReceiverID().toString().substring(18,36);
                    String chatID2 = info.getReceiverID().toString().substring(0,18)+info.getSenderID().toString().substring(18,36);
                    return userRepository.searchConversation(info.getSenderID()+"",chatID1,chatID2)
                            .switchIfEmpty( // not exist conversation
                                appendConversations(new AppendConversationDTO(info), Type.FRIEND)
                                        .then(Mono.empty())
                            )
                            .flatMap(user ->{ // exist conversation
                                log.info("** acceptFriendRequests exist");
                                return updateTypeConversation(info.getSenderID() + "", info.getReceiverID() + "", Type.FRIEND+"",Type.FRIEND+"");
                            })
                            .onErrorResume(e -> {
                                log.error("** ",e);
                                return Mono.empty();
                            })
                            .then();
                }));
    }

    public Mono<Void> updateTypeConversation(String senderID, String receiverID, String typeSender, String typeReceiver){
        log.info("** updateTypeConversation: {} {} {}",senderID, receiverID, typeSender);
        return userRepository.updateTypeConversation(senderID,receiverID,typeSender)
                .flatMap(aLong -> {
                    if(aLong<=0){
                        log.error("** update conversation in sender failed");
                        return Mono.error(() -> new Throwable("failed"));
                    }
                    // update conversation in receiver
                    return userRepository.updateTypeConversation(receiverID,senderID,typeReceiver)
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
        String chatID1 = info.getSenderID().toString().substring(0,18)+info.getReceiverID().toString().substring(18,36);
        String chatID2 = info.getReceiverID().toString().substring(0,18)+info.getSenderID().toString().substring(18,36);
        UUID idChat = UUID.fromString(chatID1);
        return userRepository.searchConversation(info.getSenderID()+"",chatID1,chatID2)
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
                                return userRepository.appendConversation(info.getSenderID()+"",conversationOurSender)
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
                                            return userRepository.appendConversation(info.getReceiverID()+"",conversationOurReceiver)
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
