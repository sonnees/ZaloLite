package com.zalolite.chatservice.websocket;

import com.zalolite.chatservice.dto.handleGroup.*;
import com.zalolite.chatservice.entity.*;
import com.zalolite.chatservice.repository.ChatRepository;
import com.zalolite.chatservice.repository.GroupRepository;
import com.zalolite.chatservice.repository.UserRepository;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.*;

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
                            String[] arrayID = getListID(group);
                            return userHandleWebSocket.removeConversation(arrayID, idChat)
                                    .then(Mono.defer(() -> {
                                        return chatHandleWebSocket.delete(idChat)
                                                .then(Mono.defer(() -> {
                                                    return groupRepository.deleteById(UUID.fromString(idChat))
                                                            .then(Mono.defer(()-> getMonoListID(group)));
                                                }));
                                    }));
                        });
    }

    public Mono<String[]> appendMember(AppendMemberGroupDTO info){
        log.info("** append Member: {} {}", info.getIdChat(), info.getUserID());
        PersonInfo personInfo = new PersonInfo(info.getUserID(), info.getUserName(), info.getUserAvatar());
        return groupRepository
                .findById(info.getIdChat())
                .switchIfEmpty(Mono.defer(()-> Mono.error(() -> new Throwable("group not found"))).then(Mono.empty()))
                .flatMap(group -> {
                    String[] arrayID = getListID(group);
                    boolean b = Arrays.stream(arrayID).anyMatch(s -> Objects.equals(s, personInfo.getUserID().toString()));
                    if(b) return Mono.error(() -> new Throwable("CONFLICT"));
                    return groupRepository.appendMember(info.getIdChat().toString(), personInfo)
                            .flatMap(aLong -> {
                                if(aLong<=0) return Mono.error(() -> new Throwable("append Member"));
                                return userHandleWebSocket.appendConversation(
                                        info.getUserID().toString(),
                                        new Conversation(
                                                info.getIdChat(),
                                                group.getChatName(),
                                                group.getAvatar(),
                                                Type.GROUP
                                        ))
                                        .then(Mono.defer(()-> getMonoListID(group)));
                            });
                });
    }

    public Mono<String[]> appendAdmin(AppendMemberGroupDTO info){
        log.info("** append Admin: {}",info.getUserID());
        PersonInfo personInfo = new PersonInfo(info.getUserID(), info.getUserName(), info.getUserAvatar());
        return groupRepository
                .findById(info.getIdChat())
                .switchIfEmpty(Mono.defer(()-> Mono.error(() -> new Throwable("group not found"))).then(Mono.empty()))
                .flatMap(group -> {
                    String[] arrayID = getListIDAdmin(group);
                    boolean b = Arrays.stream(arrayID).anyMatch(s -> Objects.equals(s, personInfo.getUserID().toString()));
                    if(b) return Mono.error(() -> new Throwable("CONFLICT"));
                    return groupRepository.appendAdmin(info.getIdChat().toString(), personInfo)
                            .flatMap(aLong -> {
                                if(aLong<=0) return Mono.error(() -> new Throwable("append Admin"));
                                return groupRepository.removeMember(info.getIdChat().toString(),personInfo.getUserID().toString())
                                        .flatMap(aLong1 ->  {
                                            if (aLong1<=0) return Mono.error(() -> new Throwable("group not found"));
                                            return Mono.empty();
                                        })
                                        .then(Mono.defer(()-> getMonoListID(group)));
                            });
                });
    }

    public Mono<String[]> changeOwner(AppendMemberGroupDTO info){
        log.info("** append Owner: {}",info.getUserID());
        PersonInfo personInfo = new PersonInfo(info.getUserID(), info.getUserName(), info.getUserAvatar());
        return groupRepository
                .findById(info.getIdChat())
                .switchIfEmpty(Mono.defer(()-> Mono.error(() -> new Throwable("group not found"))).then(Mono.empty()))
                .flatMap(group -> {
                    PersonInfo owner = group.getOwner();
                    return groupRepository.changeOwner(info.getIdChat().toString(),personInfo)
                            .flatMap(aLong -> {
                                if(aLong<=0) return Mono.error(() -> new Throwable("change owner admin"));
                                return groupRepository.appendMember(info.getIdChat().toString(),owner)
                                        .flatMap(aLong1 ->  {
                                            if (aLong1<=0) return Mono.error(() -> new Throwable("append member"));
                                            return groupRepository.removeMember(info.getIdChat().toString(), info.getUserID().toString())
                                                    .flatMap(aLong2 -> {
                                                        if (aLong2<=0) return Mono.error(() -> new Throwable("remove member"));
                                                        return getMonoListID(group);
                                                    });
                                        });
                            });
                });
    }

    public Mono<String[]> removeMember(AppendMemberGroupDTO info){
        log.info("** remove Member: {}",info.getUserID());
        PersonInfo personInfo = new PersonInfo(info.getUserID(), info.getUserName(), info.getUserAvatar());
        return groupRepository
                .findById(info.getIdChat())
                .switchIfEmpty(Mono.defer(()-> Mono.error(() -> new Throwable("group not found"))).then(Mono.empty()))
                .flatMap(group -> {
                    return groupRepository.removeMember(info.getIdChat().toString(),personInfo.getUserID().toString())
                            .flatMap(aLong1 ->  {
                                if (aLong1<=0) return Mono.error(() -> new Throwable("group not found"));
                                return userHandleWebSocket.removeConversation(personInfo.getUserID().toString(),info.getIdChat().toString())
                                        .then(Mono.defer(()-> getMonoListID(group)));
                            });
                });
    }

    public Mono<String[]> removeAdmin(AppendMemberGroupDTO info){
        log.info("** remove Admin: {}",info.getUserID());
        PersonInfo personInfo = new PersonInfo(info.getUserID(), info.getUserName(), info.getUserAvatar());
        return groupRepository
                .findById(info.getIdChat())
                .switchIfEmpty(Mono.defer(()-> Mono.error(() -> new Throwable("group not found"))).then(Mono.empty()))
                .flatMap(group -> {
                    return groupRepository.removeAdmin(info.getIdChat().toString(),personInfo.getUserID().toString())
                            .flatMap(aLong -> {
                                if(aLong<=0) return Mono.error(() -> new Throwable("remove Admin"));
                                return groupRepository.appendMember(info.getIdChat().toString(),personInfo)
                                        .flatMap(aLong1 ->  {
                                            if (aLong1<=0) return Mono.error(() -> new Throwable("append admin"));
                                            return Mono.empty();
                                        })
                                        .then(Mono.defer(()-> getMonoListID(group)));
                            });
                });
    }

    public Mono<String[]> updateNameChat(ChangeNameChatGroupDTO info){
        log.info("** update NameChat: {} {}",info.getIdChat(), info.getChatName());
        return groupRepository
                .findById(UUID.fromString(info.getIdChat()))
                .switchIfEmpty(Mono.defer(()-> Mono.error(() -> new Throwable("group not found"))).then(Mono.empty()))
                .flatMap(group -> {
                    return groupRepository.updateNameChat(info.getIdChat(), info.getChatName())
                            .flatMap(aLong -> {
                                if(aLong<=0) return Mono.error(() -> new Throwable("update name chat"));
                                String[] arrId = getListID(group);
                                return userHandleWebSocket.updateChatNameInConversation(arrId, info.getIdChat(),info.getChatName())
                                        .then(Mono.just(arrId));
                            });
                });
    }

    public Mono<String[]> updateAvatar(ChangeAvatarGroupDTO info){
        log.info("** update Avatar: {} {}",info.getIdChat(), info.getAvatar());
        return groupRepository
                .findById(UUID.fromString(info.getIdChat()))
                .switchIfEmpty(Mono.defer(()-> Mono.error(() -> new Throwable("group not found"))).then(Mono.empty()))
                .flatMap(group -> {
                    return groupRepository.updateAvatar(info.getIdChat(), info.getAvatar())
                            .flatMap(aLong -> {
                                if(aLong<=0) return Mono.error(() -> new Throwable("update avatar chat"));
                                String[] arrId = getListID(group);
                                return userHandleWebSocket.updateAvatarInConversation(arrId, info.getIdChat(),info.getAvatar())
                                        .then(Mono.just(arrId));
                            });
                });
    }

    public Mono<String[]> updateSetting_changeChatNameAndAvatar(UpdateSettingGroupDTO info){
        log.info("** update setting change chat name and avatar: {} {}",info.getIdChat(), info.isValue());
        return groupRepository
                .findById(UUID.fromString(info.getIdChat()))
                .switchIfEmpty(Mono.defer(()-> Mono.error(() -> new Throwable("group not found"))).then(Mono.empty()))
                .flatMap(group -> {
                    GroupSetting setting = group.getSetting();
                    setting.setChangeChatNameAndAvatar(info.isValue());
                    return groupRepository.updateSetting(info.getIdChat(),setting)
                            .flatMap(aLong -> {
                                if(aLong<=0) return Mono.error(() -> new Throwable("update setting change chat name and avatar"));
                                return getMonoListID(group);
                            });
                });
    }

    public Mono<String[]> updateSetting_pinMessages(UpdateSettingGroupDTO info){
        log.info("** update setting pin messages: {} {}",info.getIdChat(), info.isValue());
        return groupRepository
                .findById(UUID.fromString(info.getIdChat()))
                .switchIfEmpty(Mono.defer(()-> Mono.error(() -> new Throwable("group not found"))).then(Mono.empty()))
                .flatMap(group -> {
                    GroupSetting setting = group.getSetting();
                    setting.setPinMessages(info.isValue());
                    return groupRepository.updateSetting(info.getIdChat(),setting)
                            .flatMap(aLong -> {
                                if(aLong<=0) return Mono.error(() -> new Throwable("update setting pin messages"));
                                return getMonoListID(group);
                            });
                });
    }

    public Mono<String[]> updateSetting_sendMessages(UpdateSettingGroupDTO info){
        log.info("** update setting send messages: {} {}",info.getIdChat(), info.isValue());
        return groupRepository
                .findById(UUID.fromString(info.getIdChat()))
                .switchIfEmpty(Mono.defer(()-> Mono.error(() -> new Throwable("group not found"))).then(Mono.empty()))
                .flatMap(group -> {
                    GroupSetting setting = group.getSetting();
                    setting.setSendMessages(info.isValue());
                    return groupRepository.updateSetting(info.getIdChat(),setting)
                            .flatMap(aLong -> {
                                if(aLong<=0) return Mono.error(() -> new Throwable("update setting send messages"));
                                return getMonoListID(group);
                            });
                });
    }

    public Mono<String[]> updateSetting_membershipApproval(UpdateSettingGroupDTO info){
        log.info("** update setting membership approval: {} {}",info.getIdChat(), info.isValue());
        return groupRepository
                .findById(UUID.fromString(info.getIdChat()))
                .switchIfEmpty(Mono.defer(()-> Mono.error(() -> new Throwable("group not found"))).then(Mono.empty()))
                .flatMap(group -> {
                    GroupSetting setting = group.getSetting();
                    setting.setMembershipApproval(info.isValue());
                    return groupRepository.updateSetting(info.getIdChat(),setting)
                            .flatMap(aLong -> {
                                if(aLong<=0) return Mono.error(() -> new Throwable("update setting membership approval"));
                                return getMonoListID(group);
                            });
                });
    }

    public Mono<String[]> updateSetting_createNewPolls(UpdateSettingGroupDTO info){
        log.info("** update setting create new polls: {} {}",info.getIdChat(), info.isValue());
        return groupRepository
                .findById(UUID.fromString(info.getIdChat()))
                .switchIfEmpty(Mono.defer(()-> Mono.error(() -> new Throwable("group not found"))).then(Mono.empty()))
                .flatMap(group -> {
                    GroupSetting setting = group.getSetting();
                    setting.setCreateNewPolls(info.isValue());
                    log.info("** {}", setting.getCreateNewPolls());
                    return groupRepository.updateSetting(info.getIdChat(),setting)
                            .flatMap(aLong -> {
                                if(aLong<=0) return Mono.error(() -> new Throwable("update setting create new polls"));
                                return getMonoListID(group);
                            });
                });
    }

    private static Mono<String[]> getMonoListID(Group group) {
        ArrayList<String> listID = new ArrayList<>();
        listID.add(group.getOwner().getUserID().toString());
        group.getMembers().forEach(p -> listID.add(p.getUserID().toString()));
        group.getAdmin().forEach(p -> listID.add(p.getUserID().toString()));
        String[] arrayID = listID.toArray(new String[0]);
        return Mono.just(arrayID);
    }

    private static String[] getListID(Group group) {
        ArrayList<String> listID = new ArrayList<>();
        listID.add(group.getOwner().getUserID().toString());
        group.getMembers().forEach(p -> listID.add(p.getUserID().toString()));
        group.getAdmin().forEach(p -> listID.add(p.getUserID().toString()));
        return listID.toArray(new String[0]);
    }

    private static String[] getListIDAdmin(Group group) {
        ArrayList<String> listID = new ArrayList<>();
        group.getAdmin().forEach(p -> listID.add(p.getUserID().toString()));
        return listID.toArray(new String[0]);
    }


}
