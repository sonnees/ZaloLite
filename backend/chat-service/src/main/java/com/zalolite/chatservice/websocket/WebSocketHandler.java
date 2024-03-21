package com.zalolite.chatservice.websocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.chatservice.dto.*;
import com.zalolite.chatservice.repository.ChatRepository;
import com.zalolite.chatservice.repository.GroupRepository;
import com.zalolite.chatservice.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
@AllArgsConstructor
public class WebSocketHandler implements org.springframework.web.reactive.socket.WebSocketHandler {
    private WebClient.Builder builder;
    private UserRepository userRepository;
    private ChatRepository chatRepository;
    private GroupRepository groupRepository;
    private ObjectMapper objectMapper;
    private UserHandleWebSocket userHandleWebSocket;

    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    @NonNull
    public Mono<Void> handle(WebSocketSession session) {
        String sessionId = session.getId();
        String[] split = session.getHandshakeInfo().getUri().getPath().split("/");

        sessions.put(sessionId, session);
        Flux<WebSocketMessage> sendFlux = Flux.just(session.textMessage("Connect success"));

        return switch (split[split.length - 2]) {
            case "chat" -> handleChat(session, sendFlux, sessionId, split[split.length - 1]);
            case "user" -> handleUser(session, sendFlux, sessionId, split[split.length - 1]);
            default -> Mono.empty();
        };
    }

    private Mono<Void> handleUser(WebSocketSession session, Flux<WebSocketMessage> sendFlux, String sessionId, String userID) {
        return session
                .send(sendFlux)
                .thenMany(session.receive()
                        .map(WebSocketMessage::getPayloadAsText)
                        .flatMap(message -> {
                            try {
                                UserMessageDTO root = objectMapper.readValue(message, UserMessageDTO.class);
                                log.info("** Received message from {}: {}", sessionId, objectMapper.writeValueAsString(root));

                                return switch (root.getTUM()) {
                                    case TUM01 -> {
                                        FriendRequestAddDTO obj = objectMapper.readValue(message, FriendRequestAddDTO.class);
                                        yield userHandleWebSocket
                                                .appendFriendRequests(objectMapper.readValue(message, FriendRequestAddDTO.class))
                                                .thenMany(Mono.fromRunnable(() -> {
                                                    NotifyMessage notifyMessage=new NotifyMessage(obj.getId(), TypeUserMessage.TUM00, TypeNotify.SUCCESS);
                                                    sendMessageToClient(sessionId, notifyMessage);
                                                    sendMessageToAllClients(sessionId,obj);
                                                }
                                                ))
                                                .thenMany(Flux.just(message))
                                                .onErrorResume(e -> {
                                                    log.error("** " + e);
                                                    NotifyMessage notifyMessage=new NotifyMessage(obj.getId(), TypeUserMessage.TUM00, TypeNotify.FAILED);
                                                    sendMessageToClient(sessionId, notifyMessage);
                                                    return Mono.empty();
                                                });
                                    }

                                    case TUM02 -> {
                                        FriendRequestRemoveDTO obj = objectMapper.readValue(message, FriendRequestRemoveDTO.class);
                                        yield  userHandleWebSocket
                                                .removeFriendRequests(obj)
                                                .thenMany(Mono.fromRunnable(() -> {
                                                    NotifyMessage notifyMessage=new NotifyMessage(obj.getId(), TypeUserMessage.TUM00, TypeNotify.SUCCESS);
                                                    sendMessageToClient(sessionId, notifyMessage);
                                                    sendMessageToAllClients(sessionId,obj);
                                                }
                                                ))
                                                .thenMany(Flux.just(message))
                                                .onErrorResume(e -> {
                                                    log.error("** " + e);
                                                    NotifyMessage notifyMessage=new NotifyMessage(obj.getId(), TypeUserMessage.TUM00, TypeNotify.FAILED);
                                                    sendMessageToClient(sessionId, notifyMessage);
                                                    return Mono.empty();
                                                });
                                    }

                                    case TUM03 -> {
                                        FriendRequestAcceptDTO obj = objectMapper.readValue(message, FriendRequestAcceptDTO.class);
                                        yield  userHandleWebSocket
                                                .acceptFriendRequests(obj)
                                                .thenMany(Mono.fromRunnable(() -> {
                                                            NotifyMessage notifyMessage=new NotifyMessage(obj.getId(), TypeUserMessage.TUM00, TypeNotify.SUCCESS);
                                                            sendMessageToClient(sessionId, notifyMessage);
                                                            sendMessageToAllClients(sessionId,obj);
                                                        }
                                                ))
                                                .thenMany(Flux.just(message))
                                                .onErrorResume(e -> {
                                                    log.error("** " + e);
                                                    NotifyMessage notifyMessage=new NotifyMessage(obj.getId(), TypeUserMessage.TUM00, TypeNotify.FAILED);
                                                    sendMessageToClient(sessionId, notifyMessage);
                                                    return Mono.empty();
                                                });
                                    }

                                    default -> Flux.empty();
                                };
                            } catch (JsonProcessingException e) {
                                log.error("** " + e);
                                return Flux.empty();
                            }
                        })
                        .publishOn(Schedulers.boundedElastic())
                        .map(session::textMessage)
                        .doOnTerminate(() -> {
                            sessions.remove(sessionId);
                            log.info("** session end: " + sessionId);
                        }))
                .then();
    }

    private Mono<Void> handleChat(WebSocketSession session, Flux<WebSocketMessage> sendFlux, String sessionId, String chatID) {
        return session
                .send(sendFlux)
                .thenMany(session.receive()
                        .map(WebSocketMessage::getPayloadAsText)
                        .flatMap(message -> {
                            try {
                                UserMessageDTO root = objectMapper.readValue(message, UserMessageDTO.class);
                                log.info("** Received message from {}: {}", sessionId, objectMapper.writeValueAsString(root));

                                return switch (root.getTUM()) {
                                    case TUM01 -> {
                                        FriendRequestAddDTO obj = objectMapper.readValue(message, FriendRequestAddDTO.class);
                                        yield userHandleWebSocket
                                                .appendFriendRequests(objectMapper.readValue(message, FriendRequestAddDTO.class))
                                                .thenMany(Mono.fromRunnable(() -> {
                                                            NotifyMessage notifyMessage=new NotifyMessage(obj.getId(), TypeUserMessage.TUM00, TypeNotify.SUCCESS);
                                                            sendMessageToClient(sessionId, notifyMessage);
                                                            sendMessageToAllClients(sessionId,obj);
                                                        }
                                                ))
                                                .thenMany(Flux.just(message))
                                                .onErrorResume(e -> {
                                                    log.error("** " + e);
                                                    NotifyMessage notifyMessage=new NotifyMessage(obj.getId(), TypeUserMessage.TUM00, TypeNotify.FAILED);
                                                    sendMessageToClient(sessionId, notifyMessage);
                                                    return Mono.empty();
                                                });
                                    }

                                    default -> Flux.empty();
                                };
                            } catch (JsonProcessingException e) {
                                log.error("** " + e);
                                return Flux.empty();
                            }
                        })
                        .publishOn(Schedulers.boundedElastic())
                        .map(session::textMessage)
                        .doOnTerminate(() -> {
                            sessions.remove(sessionId);
                            log.info("** session end: " + sessionId);
                        }))
                .then();
    }

    private void sendMessageToClient(String senderId, UserMessageDTO userMessageDTO) {
        try {
            log.info("** sendMessageToAllClients {}",senderId );
            String message = objectMapper.writeValueAsString(userMessageDTO);
            sessions.forEach((sessionId, session) -> {
                if (sessionId.equals(senderId))
                    session
                            .send(Flux.just(session.textMessage(message)))
                            .subscribe();
            });
        } catch (Exception e){
            log.error(e.getMessage());
        }
    }

    private void sendMessageToAllClients(String senderId,UserMessageDTO userMessageDTO) {
        try {
            log.info("** sendMessageToAllClients");
            String message = objectMapper.writeValueAsString(userMessageDTO);
            sessions.forEach((sessionId, session) -> {
                if (!sessionId.equals(senderId))
                    session
                            .send(Flux.just(session.textMessage(message)))
                            .subscribe();
            });
        } catch (Exception e){
            log.error(e.getMessage());
        }
    }
}
