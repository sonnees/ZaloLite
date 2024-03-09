package com.zalolite.chatservice.websocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.chatservice.dto.ChatActivityDTO;
import com.zalolite.chatservice.entity.ChatActivity;
import com.zalolite.chatservice.repository.ChatRepository;
import com.zalolite.chatservice.repository.GroupRepository;
import com.zalolite.chatservice.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
@AllArgsConstructor
public class CustomWebSocketHandler implements WebSocketHandler {
    private WebClient.Builder builder;
    private UserRepository userRepository;
    private ChatRepository chatRepository;
    private GroupRepository groupRepository;
    private ObjectMapper objectMapper;

    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    @NonNull
    public Mono<Void> handle(WebSocketSession session) {
        String sessionId = session.getId();
        String[] split = session.getHandshakeInfo().getUri().getPath().split("/");
        String chatID = split[split.length-1];
        log.info("** session begin: "+ sessionId +" | "+chatID);

        sessions.put(sessionId, session);
        Flux<WebSocketMessage> sendFlux = Flux.just(session.textMessage("Connect success"));

        return session
                .send(sendFlux)
                .thenMany(session.receive()
                        .map(WebSocketMessage::getPayloadAsText)
                        .flatMap(message -> {
                            ChatActivityDTO chatActivityDTO = null;
                            try {
                                chatActivityDTO = objectMapper.readValue(message, ChatActivityDTO.class);
                                ChatActivity chatActivity = new ChatActivity(chatActivityDTO);
                                log.info("Received message from {}: {}", sessionId, objectMapper.writeValueAsString(chatActivity));
                                return chatRepository.updateChatActivity(chatID, chatActivity)
                                        .thenMany(Flux.just(message));
                            } catch (JsonProcessingException e) {
                                log.error("** "+e);
                                return Flux.empty();
                            }
                        })
                        .map(session::textMessage)
                        .doOnTerminate(() -> {
                            sessions.remove("sessionId");
                            log.info("** session end: " + sessionId);
                        }))
                .then();
    }

    private void sendMessageToAllClients(String senderId, String message) {
        sessions.forEach((sessionId, session) -> {
            if (!sessionId.equals(senderId)) {
                session.send(Flux.just(session.textMessage(message)))
                        .subscribe();
            }
        });
    }
}
