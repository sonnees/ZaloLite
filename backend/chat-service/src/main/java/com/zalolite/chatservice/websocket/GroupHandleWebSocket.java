package com.zalolite.chatservice.websocket;

import com.zalolite.chatservice.dto.handleGroup.CreateGroupDTO;
import com.zalolite.chatservice.entity.*;
import com.zalolite.chatservice.repository.ChatRepository;
import com.zalolite.chatservice.repository.GroupRepository;
import com.zalolite.chatservice.repository.UserRepository;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Slf4j
@Component
public class GroupHandleWebSocket {

    private UserRepository userRepository;
    private ChatRepository chatRepository;
    private GroupRepository groupRepository;
    private UserHandleWebSocket userHandleWebSocket;
    private ChatHandleWebSocket chatHandleWebSocket;

    @Autowired
    public GroupHandleWebSocket(UserRepository userRepository, ChatRepository chatRepository, GroupRepository groupRepository, UserHandleWebSocket userHandleWebSocket, ChatHandleWebSocket chatHandleWebSocket) {
        this.userRepository = userRepository;
        this.chatRepository = chatRepository;
        this.groupRepository = groupRepository;
        this.userHandleWebSocket = userHandleWebSocket;
        this.chatHandleWebSocket = chatHandleWebSocket;
    }

    public Mono<Void> create(String[] arrayID, CreateGroupDTO info){
        log.info("** create group: {}",info.getId());
        Group group = new Group(info);
        return groupRepository.save(group)
                .switchIfEmpty(Mono.defer(()->Mono.error(() -> new Throwable("create group failed"))).then(Mono.empty()))
                .flatMap(group1 -> {
                    Conversation conversation = new Conversation(
                            info.getId(),
                            info.getChatName(),
                            info.getAvatar(),
                            Type.GROUP
                    );
                    return userHandleWebSocket.appendConversation(arrayID, conversation)
                            .then(Mono.defer(() -> {
                                return chatHandleWebSocket.create(info.getId().toString());
                            }));
                });
    }

    public Mono<String[]> delete(String idChat){
        log.info("** delete group:");
        return groupRepository.findById(UUID.fromString(idChat))
                .switchIfEmpty(Mono.defer(()->Mono.error(() -> new Throwable("delete group failed"))).then(Mono.empty()))
                        .flatMap(group -> {
                            List<String> listID = new ArrayList<>();
                            listID.add(group.getOwner().getUserID().toString());
                            group.getMembers().forEach(personInfo -> listID.add(personInfo.getUserID().toString()));
                            String[] arrayID = listID.toArray(new String[0]);
                            return chatHandleWebSocket.delete(idChat)
                                    .then(Mono.defer(() -> {
                                        return userHandleWebSocket.removeConversation(arrayID)
                                                .then(Mono.defer(() -> {
                                                    return groupRepository.deleteById(UUID.fromString(idChat))
                                                            .then(Mono.just(arrayID));
                                                }));
                                    }));
                        });
    }

    public Mono<Void> appendMember(String id, PersonInfo info){
        log.info("** append Member: {}",info.getUserID());
        return groupRepository.appendMember(id, info)
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.error(() -> new Throwable("append Member"));
                    return Mono.empty();
                });
    }

    public Mono<Void> appendAdmin(String id, PersonInfo info){
        log.info("** append Admin: {}",info.getUserID());
        return groupRepository.appendAdmin(id, info)
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.error(() -> new Throwable("append Admin"));
                    return Mono.empty();
                });
    }

    public Mono<Void> changeOwner(String id, PersonInfo info){
        log.info("** append Owner: {}",info.getUserID());
        return groupRepository.changeOwner(id, info)
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.error(() -> new Throwable("append Owner"));
                    return Mono.empty();
                });
    }

    public Mono<Void> removeMember(String id, String userID){
        log.info("** remove Member: {}",id);
        return groupRepository.removeMember(id, userID)
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.error(() -> new Throwable("remove Member"));
                    return Mono.empty();
                });
    }

    public Mono<Void> removeAdmin(String id, String userID){
        log.info("** remove Admin: {}",id);
        return groupRepository.removeAdmin(id, userID)
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.error(() -> new Throwable("remove Admin"));
                    return Mono.empty();
                });
    }

    public Mono<Void> updateNameChat(String id, String chatName){
        log.info("** update NameChat: {}",id);
        return groupRepository.updateNameChat(id, chatName)
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.error(() -> new Throwable("update NameChat"));
                    return Mono.empty();
                });
    }

    public Mono<Void> updateAvatar(String id, String avatar){
        log.info("** update Avatar: {}",id);
        return groupRepository.updateAvatar(id, avatar)
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.error(() -> new Throwable("update Avatar"));
                    return Mono.empty();
                });
    }

    public Mono<Void> updateSetting_changeChatNameAndAvatar(String id, boolean approval){
        log.info("** update setting changeChatNameAndAvatar: {}",id);
        return groupRepository.updateSetting_changeChatNameAndAvatar(id, approval)
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.error(() -> new Throwable("update setting changeChatNameAndAvatar"));
                    return Mono.empty();
                });
    }

    public Mono<Void> updateSetting_pinMessages(String id, boolean approval){
        log.info("** update setting pinMessages: {}",id);
        return groupRepository.updateSetting_pinMessages(id, approval)
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.error(() -> new Throwable("update setting pinMessages"));
                    return Mono.empty();
                });
    }

    public Mono<Void> updateSetting_sendMessages(String id, boolean approval){
        log.info("** update setting sendMessages: {}",id);
        return groupRepository.updateSetting_sendMessages(id, approval)
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.error(() -> new Throwable("update setting sendMessages"));
                    return Mono.empty();
                });
    }

    public Mono<Void> updateSetting_membershipApproval(String id, boolean approval){
        log.info("** update setting membershipApproval: {}",id);
        return groupRepository.updateSetting_membershipApproval(id, approval)
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.error(() -> new Throwable("update setting membershipApproval"));
                    return Mono.empty();
                });
    }

    public Mono<Void> updateSetting_createNewPolls(String id, boolean approval){
        log.info("** update setting createNewPolls: {}",id);
        return groupRepository.updateSetting_createNewPolls(id, approval)
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.error(() -> new Throwable("update setting createNewPolls"));
                    return Mono.empty();
                });
    }


}
