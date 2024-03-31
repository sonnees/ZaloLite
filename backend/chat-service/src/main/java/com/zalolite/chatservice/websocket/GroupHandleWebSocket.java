package com.zalolite.chatservice.websocket;

import com.zalolite.chatservice.dto.*;
import com.zalolite.chatservice.entity.*;
import com.zalolite.chatservice.repository.ChatRepository;
import com.zalolite.chatservice.repository.GroupRepository;
import com.zalolite.chatservice.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.util.StringList;
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

    public Mono<Void> create(String[] arrayID,CreateGroupDTO info){
        log.info("** create group: {}",info.getId());
        Group group = new Group(info);
        return groupRepository.save(group)
                .switchIfEmpty(Mono.error(() -> new Throwable("create group failed")))
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

}
