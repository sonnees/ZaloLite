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

    @Autowired
    public UserHandleWebSocket(UserRepository userRepository, ChatRepository chatRepository, GroupRepository groupRepository) {
        this.userRepository = userRepository;
        this.chatRepository = chatRepository;
        this.groupRepository = groupRepository;
    }

    public Mono<Void> appendFriendRequests(FriendRequestAddDTO info){
        log.info("** addFriendRequests: {}",info.getId());
        FriendRequest sender = new FriendRequest(info.getSenderID(),info.getSenderName(),info.getSenderAvatar(),info.getDescription(), false);
        FriendRequest receiver = new FriendRequest(info.getReceiverID(),info.getReceiverName(),info.getReceiverAvatar(),info.getDescription(), true);

        // add friend request for sender
        return userRepository.appendFriendRequest(receiver.getUserID()+"",sender)
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.error(() -> new Throwable("appendFriendRequest sender failed"));
                    // add friend request for receiver
                    return userRepository.appendFriendRequest(sender.getUserID() + "", receiver)
                            .flatMap(aLong1 -> {
                                if(aLong1<=0) return Mono.error(() -> new Throwable("appendFriendRequest receiver failed"));
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
                                        });
                            });
                });
    }

    public Mono<Void> removeFriendRequests(FriendRequestRemoveDTO info){
        log.info("** removeFriendRequests: {} {} {}",info.getId(), info.getSenderID(), info.getReceiverID());
        // remove friend request for sender
        return userRepository.removeFriendRequest(info.getSenderID()+"",info.getReceiverID()+"")
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.error(() -> new Throwable("removeFriendRequest sender failed"));
                    // remove friend request for receiver
                    return userRepository.removeFriendRequest(info.getReceiverID()+"", info.getSenderID()+"")
                            .flatMap(aLong1 -> {
                                if(aLong1<=0) return Mono.error(() -> new Throwable("removeFriendRequest receiver failed"));
                                // check exist conversation
                                String chatID1 = info.getSenderID().toString().substring(0,18)+info.getReceiverID().toString().substring(18,36);
                                String chatID2 = info.getReceiverID().toString().substring(0,18)+info.getSenderID().toString().substring(18,36);
                                return userRepository.searchConversation(info.getSenderID()+"",chatID1,chatID2)
                                        .flatMap(user -> updateTypeConversation(info.getSenderID() + "", info.getReceiverID() + "", Type.STRANGER+"",Type.STRANGER+""))
                                        .switchIfEmpty(Mono.empty());
                            });
                });
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
                            });
                }));
    }

    public Mono<Void>  unfriend(UnfriendDTO info){
        log.info("** unfriend: {} {} {}",info.getId(), info.getSenderID(), info.getReceiverID());
        // update type conversation to STRANGER
        return updateTypeConversation(
                info.getSenderID()+"",
                info.getReceiverID()+"",
                Type.STRANGER+"",
                Type.STRANGER+"");
    }

    public Mono<Void> updateTypeConversation(String senderID, String receiverID, String typeSender, String typeReceiver){
        log.info("** updateTypeConversation: {} {} {}",senderID, receiverID, typeSender);
        return userRepository.updateTypeConversation(senderID,receiverID,typeSender)
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.error(() -> new Throwable("updateTypeConversation receiver failed"));
                    // update conversation in receiver
                    return userRepository.updateTypeConversation(receiverID,senderID,typeReceiver)
                            .flatMap(aLong1 -> {
                                if(aLong1<=0) return Mono.error(() -> new Throwable("updateTypeConversation receiver failed"));
                                return Mono.empty();
                            });
                });
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
                                if(chat == null) return Mono.error(() -> new Throwable("new chat failed"));
                                Conversation conversationOurSender = null;
                                switch (type){
                                    case FRIEND -> conversationOurSender = new Conversation(idChat,info.getReceiverName(),info.getReceiverAvatar(), Type.FRIEND);
                                    case STRANGER -> conversationOurSender = new Conversation(idChat,info.getReceiverName(),info.getReceiverAvatar(), Type.STRANGER);
                                    default -> conversationOurSender = new Conversation(idChat,info.getReceiverName(),info.getReceiverAvatar(), Type.REQUESTS);
                                }
                                // append conversation for sender
                                return userRepository.appendConversation(info.getSenderID()+"",conversationOurSender)
                                        .flatMap(aLongS -> {
                                            if(aLongS<=0) return Mono.error(() -> new Throwable("appendConversation sender failed"));
                                            Conversation conversationOurReceiver = null;
                                            switch (type){
                                                case FRIEND -> conversationOurReceiver = new Conversation(idChat,info.getSenderName(),info.getSenderAvatar(),Type.FRIEND);
                                                case STRANGER -> conversationOurReceiver = new Conversation(idChat,info.getSenderName(),info.getSenderAvatar(),Type.STRANGER);
                                                default -> conversationOurReceiver = new Conversation(idChat,info.getSenderName(),info.getSenderAvatar(),Type.REQUESTED);
                                            }
                                            // append conversation for receiver
                                            return userRepository.appendConversation(info.getReceiverID()+"",conversationOurReceiver)
                                                    .flatMap(aLongR -> {
                                                        if(aLongR<=0) return Mono.error(() -> new Throwable("appendConversation receiver failed"));
                                                        return Mono.empty();
                                                    });
                                        });
                            });
                })).then();
    }

    public Mono<Void> updateConversations(Chat chat){
        log.info("** updateConversations: {}",chat.getId());

        return userRepository.updateChatActivity(
                        chat.getId().toString(),
                        chat.getChatActivity().get(chat.getChatActivity().size()-1).getTimestamp(),
                        chat.getDeliveries(),
                        chat.getReads(),
                        chat.getChatActivity())
                .then();
    }


}
