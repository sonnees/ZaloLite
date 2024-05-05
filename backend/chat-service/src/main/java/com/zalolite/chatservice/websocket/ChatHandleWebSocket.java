package com.zalolite.chatservice.websocket;

import com.zalolite.chatservice.dto.handleChat.*;
import com.zalolite.chatservice.entity.Chat;
import com.zalolite.chatservice.entity.ChatActivity;
import com.zalolite.chatservice.entity.Delivery;
import com.zalolite.chatservice.repository.ChatRepository;
import com.zalolite.chatservice.repository.GroupRepository;
import com.zalolite.chatservice.repository.UserRepository;
import com.zalolite.chatservice.repository.VotingRepository;
import com.zalolite.chatservice.serialization.JsonConverter;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.Date;
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
    private VotingRepository votingRepository;
    private JsonConverter jsonConverter;

    @Autowired
    public ChatHandleWebSocket(UserRepository userRepository, ChatRepository chatRepository, GroupRepository groupRepository, VotingRepository votingRepository, JsonConverter jsonConverter) {
        this.userRepository = userRepository;
        this.chatRepository = chatRepository;
        this.groupRepository = groupRepository;
        this.votingRepository = votingRepository;
        this.jsonConverter = jsonConverter;
    }

    public Mono<Void> create(String chatID){
        log.info("*** enter create new chat ***");
        log.info("* {} *", chatID);
        return chatRepository.save(new Chat(chatID))
                .switchIfEmpty(Mono.defer(()->Mono.error(() -> new Throwable("new chat failed"))))
                .flatMap(chat -> Mono.empty());
    }

    public Mono<Void> delete(String chatID){
        log.info("*** enter delete chat ***");
        log.info("* {} *", chatID);
        return chatRepository.deleteById(UUID.fromString(chatID))
                .then(Mono.empty());
    }

    public Mono<Void> appendChat(String chatID, MessageAppendDTO info){
        log.info("*** enter append chat ***");
        log.info("* chatID: {} info: {} *", chatID, jsonConverter.objToString(info));
        UUID messageID = info.getId();
        return chatRepository.appendChatActivityByIDChat(chatID, new ChatActivity(info,messageID))
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.error(() -> new Throwable("append chatActivity by chatID failed"));
                    return changeReadChat(chatID, new MessageDeliveryDTO(info, messageID));
                });
    }

    public Mono<Void> changeDeliveryChat(String chatID,MessageDeliveryDTO info){
        log.info("*** enter change delivery chat ***");
        log.info("* chatID: {} info: {} *", chatID, jsonConverter.objToString(info));
        return chatRepository.searchDeliveryByUserID(chatID,info.getUserID().toString())
                .switchIfEmpty(Mono.defer(() -> {
                    return chatRepository.appendDelivery(chatID, new Delivery(info.getUserID(), info.getMessageID(), info.getUserAvatar(), info.getUserName()))
                            .flatMap(aLong -> {
                                if (aLong <= 0) return Mono.error(() -> new Throwable("not exit change delivery failed"));
                                return Mono.empty();
                            });
                }))
                .flatMap(user ->{
                    return chatRepository.changeDelivery(chatID,info.getUserID().toString(),info.getMessageID().toString())
                            .flatMap(aLong -> {
                                if(aLong<=0) return Mono.error(() -> new Throwable("exit change delivery failed"));
                                return Mono.empty();
                            });
                });
    }

    public Mono<Void> changeReadChat(String chatID,MessageDeliveryDTO info){
        log.info("*** enter change read chat ***");
        log.info("* chatID: {} info: {} *", chatID, jsonConverter.objToString(info));
        return chatRepository.searchReadByUserID(chatID,info.getUserID().toString())
                .switchIfEmpty(Mono.defer(() -> {
                    log.info("* {} *", "searchReadByUserID Empty");
                    return chatRepository.appendRead(chatID, new Delivery(info.getUserID(), info.getMessageID(), info.getUserAvatar(),info.getUserName()))
                            .flatMap(aLong -> {
                                if (aLong <= 0) return Mono.error(() -> new Throwable("append read failed"));
                                return chatRepository.searchDeliveryByUserID(chatID,info.getUserID().toString())
                                        .switchIfEmpty(Mono.defer(()->{ // not exit Delivery
                                                    return chatRepository.appendDelivery(chatID, new Delivery(info.getUserID(), info.getMessageID(), info.getUserAvatar(),info.getUserName()))
                                                            .flatMap(aLong1 -> {
                                                                if (aLong1 <= 0) return Mono.error(() -> new Throwable("not exit append delivery failed"));
                                                                return Mono.empty();
                                                            });
                                                }))
                                        .flatMap(chat -> { // exit Delivery
                                            return chatRepository.changeDelivery(chatID,info.getUserID().toString(),info.getMessageID().toString())
                                                    .flatMap(aLong1 -> {
//                                                        if (aLong1 <= 0) return Mono.error(() -> new Throwable("exit append delivery failed"));
                                                        return Mono.empty();
                                                    });
                                        });
                            });
                }).then(Mono.empty()))
                .flatMap(user ->{
                    log.info("* {} *", "searchReadByUserID Not Empty");
                    return chatRepository.changeRead(chatID,info.getUserID().toString(),info.getMessageID().toString())
                            .flatMap(aLong -> {
                                if(aLong<=0) return Mono.error(() -> new Throwable("change read failed"));
                                return chatRepository.changeDelivery(chatID,info.getUserID().toString(),info.getMessageID().toString())
                                        .flatMap(aLong1 -> {
//                                            if(aLong1<=0) return Mono.error(() -> new Throwable("change read failed"));
                                            return Mono.empty();
                                        });
                            });
                });
    }

    public Mono<Void> appendHiddenMessage(UUID chatID, MessageHiddenDTO info){
        log.info("*** enter append hidden message ***");
        log.info("* chatID: {} info: {} *", chatID, jsonConverter.objToString(info));
        return chatRepository.appendHiddenMessage(chatID.toString(), info.getUserID().toString(), info.getMessageID().toString())
                .flatMap(aLong -> {
                    if (aLong <= 0) return Mono.error(() -> new Throwable("append hidden message failed"));
                    return Mono.empty();
                });
    }

    public Mono<Void> recallMessage(UUID chatID, MessageHiddenDTO info){
        log.info("*** enter recall message ***");
        log.info("* chatID: {} info: {} *", chatID, jsonConverter.objToString(info));
        return chatRepository.recallMessage(chatID.toString(), info.getMessageID().toString())
                .flatMap(aLong -> {
                    if (aLong <= 0) return Mono.error(() -> new Throwable("recall message failed"));
                    return Mono.empty();
                });
    }

    public Mono<Chat> getChatTop10(String chatID){
        log.info("*** enter get top 10 message ***");
        log.info("* chatID: {} *", chatID);
        return chatRepository.getChatTop10(chatID)
                .switchIfEmpty(Mono.defer(()->Mono.error(() -> new Throwable("get top 10 failed"))).then(Mono.empty()))
                .flatMap(Mono::just);
    }

    public Mono<Void> appendVoter(AppendVoterDTO info, String chatID, MessageAppendDTO obj){
        log.info("*** enter append voter ***");
        log.info("* info: {} chatID:{} obj: {} *", info, chatID, obj);
        return votingRepository.appendVoter(info.getVotingID(), info.getName(), info.getVoter())
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.error(() -> new Throwable("Append voter fail"));
                    return appendChat(chatID, obj);
                });
    }

    public Mono<Void> changeVoting(ChangeVoterDTO info, String chatID, MessageAppendDTO obj){
        log.info("*** enter change voting ***");
        log.info("* info: {} chatID:{} obj: {} *", info, chatID, obj);
        return votingRepository.removeVoter(info.getVotingID(), info.getOldName(), info.getVoter().getUserID())
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.error(() -> new Throwable("Remove voter fail"));
                    return votingRepository.appendVoter(info.getVotingID(), info.getNewName(), info.getVoter())
                            .flatMap(aLong1 -> {
                                if(aLong1<=0) return Mono.error(() -> new Throwable("Append voter fail"));
                                return appendChat(chatID, obj);
                            });
                });
    }

    public Mono<Void> lockVoting(String chatID, MessageAppendDTO obj){
        log.info("*** enter lock voting ***");
        log.info("* chatID:{} obj: {} *", chatID, obj);
        return votingRepository.lockVoting(UUID.fromString(obj.getContents().get(0).getValue()),true, new Date())
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.error(() -> new Throwable("Lock voting fail"));
                    return appendChat(chatID, obj);
                });
    }
}
