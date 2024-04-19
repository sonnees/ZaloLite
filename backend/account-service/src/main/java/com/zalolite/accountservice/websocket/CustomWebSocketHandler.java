package com.zalolite.accountservice.websocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.accountservice.dto.MessageDTO;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
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
    private ObjectMapper objectMapper;
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    @NonNull
    public Mono<Void> handle(WebSocketSession session) {
        String sessionId = session.getId();
        String path = "ws://localhost:8081"+session.getHandshakeInfo().getUri().getPath();
        log.info("** session begin: "+ sessionId +" | "+session.getHandshakeInfo());
        sessions.put(sessionId, session);
        Flux<WebSocketMessage> sendFlux = Flux.just(session.textMessage("Connect success"));

        return session
                .send(sendFlux)
                .thenMany(session.receive()
                        .map(WebSocketMessage::getPayloadAsText)
                        .doOnNext(message -> {
                            try {
                                MessageDTO root = objectMapper.readValue(message, MessageDTO.class);
                                if(root.getWs().equals(path)){
                                    log.info("Received message from {}: message: {} path {}", sessionId, message, path);
                                    sendMessageToAllClients(sessionId,message);
                                }
                            } catch (Exception e) {
                                log.error("** " + e);
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
