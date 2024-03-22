package com.zalolite.chatservice.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.chatservice.dto.AppendConversationDTO;
import com.zalolite.chatservice.dto.FriendRequestAcceptDTO;
import com.zalolite.chatservice.dto.FriendRequestRemoveDTO;
import com.zalolite.chatservice.dto.MessageAppendDTO;
import com.zalolite.chatservice.entity.ChatActivity;
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
        return chatRepository.appendChatActivityByIDChat(chatID, new ChatActivity(info))
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



}
