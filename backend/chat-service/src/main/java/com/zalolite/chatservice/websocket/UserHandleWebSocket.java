package com.zalolite.chatservice.websocket;

import com.zalolite.chatservice.dto.handleUser.*;
import com.zalolite.chatservice.entity.*;
import com.zalolite.chatservice.repository.ChatRepository;
import com.zalolite.chatservice.repository.GroupRepository;
import com.zalolite.chatservice.repository.UserRepository;
import com.zalolite.chatservice.serialization.JsonConverter;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

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
    private JsonConverter jsonConverter;

    @Autowired
    public UserHandleWebSocket(UserRepository userRepository, ChatRepository chatRepository, GroupRepository groupRepository, JsonConverter jsonConverter) {
        this.userRepository = userRepository;
        this.chatRepository = chatRepository;
        this.groupRepository = groupRepository;
        this.jsonConverter = jsonConverter;
    }

    public Mono<Void> appendFriendRequests(FriendRequestAddDTO info){
        log.info("*** enter append friend request ***");
        log.info("* info: {} *", jsonConverter.objToString(info));
        FriendRequest sender = new FriendRequest(info.getSenderID(),info.getSenderName(),info.getSenderAvatar(),info.getDescription(), false);
        FriendRequest receiver = new FriendRequest(info.getReceiverID(),info.getReceiverName(),info.getReceiverAvatar(),info.getDescription(), true);
        // add friend request for sender
        return userRepository.appendFriendRequest(receiver.getUserID()+"",sender)
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.error(() -> new Throwable("append friend request sender"));
                    // add friend request for receiver
                    return userRepository.appendFriendRequest(sender.getUserID() + "", receiver)
                            .flatMap(aLong1 -> {
                                if(aLong1<=0) return Mono.error(() -> new Throwable("append friend request receiver"));
                                String[] ArrID = getArrID(info.getSenderID(),info.getReceiverID());
                                return userRepository.searchConversation(info.getSenderID()+"",ArrID[0],ArrID[1])
                                        .switchIfEmpty( // not exist conversation
                                                appendConversations(new AppendConversationDTO(info), Type.GROUP) // GROUP is presentation REQUESTS and REQUESTED
                                                        .then(Mono.defer(Mono::empty))
                                        )
                                        .flatMap(user -> updateTypeConversation(info.getSenderID() + "", info.getReceiverID() + "", Type.REQUESTS+"",Type.REQUESTED+""));
                            });
                });
    }

    public Mono<Void> removeFriendRequests(FriendRequestRemoveDTO info){
        log.info("*** enter remove friend request ***");
        log.info("* info: {} *", jsonConverter.objToString(info));
        // remove friend request for sender
        return userRepository.removeFriendRequest(info.getSenderID()+"",info.getReceiverID()+"")
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.error(() -> new Throwable("remove friend request sender"));
                    // remove friend request for receiver
                    return userRepository.removeFriendRequest(info.getReceiverID()+"", info.getSenderID()+"")
                            .flatMap(aLong1 -> {
                                if(aLong1<=0) return Mono.error(() -> new Throwable("remove friend request receiver"));
                                String[] ArrID = getArrID(info.getSenderID(),info.getReceiverID());
                                return userRepository.searchConversation(info.getSenderID()+"",ArrID[0],ArrID[1])
                                        .flatMap(user -> updateTypeConversation(info.getSenderID() + "", info.getReceiverID() + "", Type.STRANGER+"",Type.STRANGER+""))
                                        .switchIfEmpty(Mono.empty());
                            });
                });
    }

    public Mono<Void> acceptFriendRequests(FriendRequestAcceptDTO info){
        log.info("*** enter accept friend request ***");
        log.info("* info: {} *", jsonConverter.objToString(info));
        return removeFriendRequests(new FriendRequestRemoveDTO(info))
                .then(Mono.defer(()->{
                    String[] ArrID = getArrID(info.getSenderID(),info.getReceiverID());
                    return userRepository.searchConversation(info.getSenderID()+"",ArrID[0],ArrID[1])
                            .switchIfEmpty( // not exist conversation
                                appendConversations(new AppendConversationDTO(info), Type.FRIEND)
                                        .then(Mono.empty())
                            )
                            .flatMap(user ->{ // exist conversation
                                return updateTypeConversation(info.getSenderID() + "", info.getReceiverID() + "", Type.FRIEND+"",Type.FRIEND+"");
                            });
                }));
    }

    public Mono<Void>  unfriend(UnfriendDTO info){
        log.info("*** enter accept friend request ***");
        log.info("* info: {} *", jsonConverter.objToString(info));
        return updateTypeConversation(
                info.getSenderID()+"",
                info.getReceiverID()+"",
                Type.STRANGER+"",
                Type.STRANGER+"");
    }

    public Mono<Void> updateTypeConversation(String senderID, String receiverID, String typeSender, String typeReceiver){
        log.info("*** update type conversation ***");
        log.info("* senderID: {} receiverID: {} typeSender: {} typeReceiver: {} *", senderID,receiverID,typeSender,typeReceiver);
        String chatID1 = senderID.substring(0,18)+receiverID.substring(18,36);
        String chatID2 = receiverID.substring(0,18)+senderID.substring(18,36);
        return userRepository.updateTypeConversation(senderID,chatID1,chatID2,typeSender) // in sender
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.error(() -> new Throwable("update type conversation sender"));
                    return userRepository.updateTypeConversation(receiverID,chatID1,chatID2,typeReceiver) // in receiver
                            .flatMap(aLong1 -> {
                                if(aLong1<=0) return Mono.error(() -> new Throwable("update type conversation receiver"));
                                return Mono.empty();
                            });
                });
    }

    // have checked duplicate
    public Mono<Void> appendConversations(AppendConversationDTO info, Type type){
        log.info("*** append conversations ***");
        log.info("* type: {} info: {} *", type, jsonConverter.objToString(info));
        String[] ArrID = getArrID(info.getSenderID(),info.getReceiverID());
        UUID idChat = UUID.fromString(ArrID[0]);
        return userRepository.searchConversation(info.getSenderID()+"",ArrID[0],ArrID[1])
                .flatMap(user -> Mono.empty())
                .switchIfEmpty(Mono.defer(()->{
                    return chatRepository.save(new Chat(idChat+""))
                            .flatMap(chat -> {
                                if(chat == null) return Mono.error(() -> new Throwable("new chat"));
                                Conversation conversationOurSender = null;
                                switch (type){
                                    case FRIEND -> conversationOurSender = new Conversation(idChat,info.getReceiverName(),info.getReceiverAvatar(), Type.FRIEND);
                                    case STRANGER -> conversationOurSender = new Conversation(idChat,info.getReceiverName(),info.getReceiverAvatar(), Type.STRANGER);
                                    default -> conversationOurSender = new Conversation(idChat,info.getReceiverName(),info.getReceiverAvatar(), Type.REQUESTS);
                                }
                                return userRepository.appendConversation(info.getSenderID()+"",conversationOurSender) // in sender
                                        .flatMap(aLongS -> {
                                            if(aLongS<=0) return Mono.error(() -> new Throwable("append conversation sender"));
                                            Conversation conversationOurReceiver = null;
                                            switch (type){
                                                case FRIEND -> conversationOurReceiver = new Conversation(idChat,info.getSenderName(),info.getSenderAvatar(),Type.FRIEND);
                                                case STRANGER -> conversationOurReceiver = new Conversation(idChat,info.getSenderName(),info.getSenderAvatar(),Type.STRANGER);
                                                default -> conversationOurReceiver = new Conversation(idChat,info.getSenderName(),info.getSenderAvatar(),Type.REQUESTED);
                                            }
                                            return userRepository.appendConversation(info.getReceiverID()+"",conversationOurReceiver) // in receiver
                                                    .flatMap(aLongR -> {
                                                        if(aLongR<=0) return Mono.error(() -> new Throwable("append conversation receiver"));
                                                        return Mono.empty();
                                                    });
                                        });
                            });
                })).then();
    }

    public Mono<Void> appendConversation(String[] userID,Conversation conversation){
        log.info("*** append conversations ***");
        log.info("* userID: {} conversation: {} *", jsonConverter.objToString(userID), jsonConverter.objToString(conversation));
        return userRepository.appendConversation(userID,conversation)
                .flatMap(aLongR -> {
                    if(aLongR<=0) return Mono.error(() -> new Throwable("append conversation"));
                    return Mono.empty();
                });
    }

    public Mono<Void> appendConversation(String userID,Conversation conversation){
        log.info("*** append conversations ***");
        log.info("* userID: {} conversation: {} *", jsonConverter.objToString(userID), jsonConverter.objToString(conversation));
        return userRepository.searchConversation(userID, conversation.getChatID().toString())
                .switchIfEmpty(Mono.defer(() -> userRepository.appendConversation(userID, conversation)
                        .flatMap(aLongR -> {
                            if (aLongR <= 0) return Mono.error(() -> new Throwable("append conversation"));
                            return Mono.empty();
                        })))
                .flatMap(user -> Mono.empty());

    }

    public Mono<Void> removeConversation(String[] userID, String idChat){
        log.info("*** remove conversations ***");
        log.info("* userID: {} idChat: {} *", jsonConverter.objToString(userID), idChat);
        return userRepository.removeConversation(userID,idChat)
                .flatMap(aLongR -> {
                    if(aLongR<=0) return Mono.error(() -> new Throwable("remove conversation"));
                    return Mono.empty();
                });
    }

    public Mono<Void> removeConversation(String userID, String idChat){
        log.info("*** remove conversations ***");
        log.info("* userID: {} idChat: {} *", userID, idChat);
        return userRepository.removeConversation(userID,idChat)
                .flatMap(aLongR -> {
                    if(aLongR<=0) return Mono.error(() -> new Throwable("remove conversation failed"));
                    return Mono.empty();
                });
    }

    public Mono<Void> updateConversations(Chat chat){
        log.info("*** update conversations ***");
        log.info("* chat: {} *", jsonConverter.objToString(chat));
        return userRepository.updateChatActivity(
                        chat.getId().toString(),
                        chat.getChatActivity().get(chat.getChatActivity().size()-1).getTimestamp(),
                        chat.getDeliveries(),
                        chat.getReads(),
                        chat.getChatActivity())
                .then();
    }

    public Mono<Void> updateChatNameInConversation(String[] arrID,String chatID, String chatName){
        log.info("*** update chat name conversations ***");
        log.info("* arrID: {} chatID: {} chatName: {} *", jsonConverter.objToString(arrID), chatID, chatName);
        return userRepository.updateChatNameInConversation(arrID,chatID,chatName)
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.error(() -> new Throwable("update chat name in conversation"));
                    return Mono.empty();
                });
    }

    public Mono<Void> updateAvatarInConversation(String[] arrID,String chatID, String newAvatar){
        log.info("*** update chat name conversations ***");
        log.info("* arrID: {} chatID: {} newAvatar: {} *", jsonConverter.objToString(arrID), chatID, newAvatar);
        return userRepository.updateAvatarInConversation(arrID,chatID,newAvatar)
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.error(() -> new Throwable("update avatar in conversation"));
                    return Mono.empty();
                });
    }

    public String[] getArrID(UUID sender, UUID receiver){
        String chatID1 = sender.toString().substring(0,18)+receiver.toString().substring(18,36);
        String chatID2 = receiver.toString().substring(0,18)+sender.toString().substring(18,36);
        return new String[] {chatID1,chatID2};
    }

}
