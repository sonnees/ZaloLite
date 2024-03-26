package com.zalolite.chatservice.websocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.chatservice.dto.*;
import com.zalolite.chatservice.entity.Chat;
import com.zalolite.chatservice.entity.Type;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.Disposable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
@AllArgsConstructor
public class WebSocketHandler implements org.springframework.web.reactive.socket.WebSocketHandler {
    private ObjectMapper objectMapper;
    private UserHandleWebSocket userHandleWebSocket;
    private ChatHandleWebSocket chatHandleWebSocket;

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
                                                            NotifyUser notify=new NotifyUser(obj.getId(), TypeUserMessage.TUM00, TypeNotify.SUCCESS);
                                                            sendMessageToClient(sessionId, notify);
                                                            sendMessageToAllClients(sessionId,obj);
                                                        }
                                                ))
                                                .thenMany(Flux.just(message))
                                                .onErrorResume(e -> {
                                                    log.error("** " + e);
                                                    NotifyUser notify=new NotifyUser(obj.getId(), TypeUserMessage.TUM00, TypeNotify.FAILED);
                                                    sendMessageToClient(sessionId, notify);
                                                    return Mono.empty();
                                                });
                                    }

                                    case TUM02 -> {
                                        FriendRequestRemoveDTO obj = objectMapper.readValue(message, FriendRequestRemoveDTO.class);
                                        yield  userHandleWebSocket
                                                .removeFriendRequests(obj)
                                                .thenMany(Mono.fromRunnable(() -> {
                                                            NotifyUser notify=new NotifyUser(obj.getId(), TypeUserMessage.TUM00, TypeNotify.SUCCESS);
                                                            sendMessageToClient(sessionId, notify);
                                                            sendMessageToAllClients(sessionId,obj);
                                                        }
                                                ))
                                                .thenMany(Flux.just(message))
                                                .onErrorResume(e -> {
                                                    log.error("** " + e);
                                                    NotifyUser notify=new NotifyUser(obj.getId(), TypeUserMessage.TUM00, TypeNotify.FAILED);
                                                    sendMessageToClient(sessionId, notify);
                                                    return Mono.empty();
                                                });
                                    }

                                    case TUM03 -> {
                                        FriendRequestAcceptDTO obj = objectMapper.readValue(message, FriendRequestAcceptDTO.class);
                                        yield  userHandleWebSocket
                                                .acceptFriendRequests(obj)
                                                .thenMany(Mono.fromRunnable(() -> {
                                                            NotifyUser notify=new NotifyUser(obj.getId(), TypeUserMessage.TUM00, TypeNotify.SUCCESS);
                                                            sendMessageToClient(sessionId, notify);
                                                            sendMessageToAllClients(sessionId,obj);
                                                        }
                                                ))
                                                .thenMany(Flux.just(message))
                                                .onErrorResume(e -> {
                                                    log.error("** " + e);
                                                    NotifyUser notify=new NotifyUser(obj.getId(), TypeUserMessage.TUM00, TypeNotify.FAILED);
                                                    sendMessageToClient(sessionId, notify);
                                                    return Mono.empty();
                                                });
                                    }
                                    case TUM04 -> {
                                        UnfriendDTO obj = objectMapper.readValue(message, UnfriendDTO.class);
                                        yield  userHandleWebSocket
                                                .unfriend(obj)
                                                .thenMany(Mono.fromRunnable(() -> {
                                                            NotifyUser notify=new NotifyUser(obj.getId(), TypeUserMessage.TUM00, TypeNotify.SUCCESS);
                                                            sendMessageToClient(sessionId, notify);
                                                            sendMessageToAllClients(sessionId,obj);
                                                        }
                                                ))
                                                .thenMany(Flux.just(message))
                                                .onErrorResume(e -> {
                                                    log.error("** " + e);
                                                    NotifyUser notify=new NotifyUser(obj.getId(), TypeUserMessage.TUM00, TypeNotify.FAILED);
                                                    sendMessageToClient(sessionId, notify);
                                                    return Mono.empty();
                                                });
                                    }

                                    case TUM05 -> { // create conversation
                                        FriendRequestAcceptDTO obj = objectMapper.readValue(message, FriendRequestAcceptDTO.class);
                                        yield  userHandleWebSocket
                                                .appendConversations(new AppendConversationDTO(obj), Type.STRANGER)
                                                .thenMany(Mono.fromRunnable(() -> {
                                                            NotifyUser notify=new NotifyUser(obj.getId(), TypeUserMessage.TUM00, TypeNotify.SUCCESS);
                                                            sendMessageToClient(sessionId, notify);
                                                            sendMessageToAllClients(sessionId,obj);
                                                        }
                                                ))
                                                .thenMany(Flux.just(message))
                                                .onErrorResume(e -> {
                                                    log.error("** " + e);
                                                    NotifyUser notify=new NotifyUser(obj.getId(), TypeUserMessage.TUM00, TypeNotify.FAILED);
                                                    sendMessageToClient(sessionId, notify);
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
                                ChatMessageDTO root = objectMapper.readValue(message, ChatMessageDTO.class);
                                log.info("** Received message from {}: {}", sessionId, objectMapper.writeValueAsString(root));

                                return switch (root.getTCM()) {
                                    case TCM01 -> { // message
                                        MessageAppendDTO obj = objectMapper.readValue(message, MessageAppendDTO.class);
                                        yield chatHandleWebSocket
                                                .appendChat(chatID,obj)
                                                .thenMany(Mono.fromRunnable(() -> {
                                                    NotifyChat notify=new NotifyChat(obj.getId(), TypeChatMessage.TCM00, TypeNotify.SUCCESS);
                                                    sendMessageToClient(sessionId, notify);
                                                    sendMessageToAllClients(sessionId,obj);
                                                }
                                                ))
                                                .thenMany(Flux.just(message))
                                                .onErrorResume(e -> {
                                                    log.error("** " + e);
                                                    NotifyChat notify=new NotifyChat(obj.getId(), TypeChatMessage.TCM00, TypeNotify.FAILED);
                                                    sendMessageToClient(sessionId, notify);
                                                    return Mono.empty();
                                                });
                                    }

                                    case TCM02 -> { // message delivery
                                        MessageDeliveryDTO obj = objectMapper.readValue(message, MessageDeliveryDTO.class);
                                        yield chatHandleWebSocket
                                                .changeDeliveryChat(chatID, obj)
                                                .thenMany(Mono.fromRunnable(() -> {
                                                            NotifyChat notify=new NotifyChat(obj.getId(), TypeChatMessage.TCM00, TypeNotify.SUCCESS);
                                                            sendMessageToClient(sessionId, notify);
                                                            sendMessageToAllClients(sessionId,obj);
                                                        }
                                                ))
                                                .thenMany(Flux.just(message))
                                                .onErrorResume(e -> {
                                                    log.error("** " + e);
                                                    NotifyChat notify=new NotifyChat(obj.getId(), TypeChatMessage.TCM00, TypeNotify.FAILED);
                                                    sendMessageToClient(sessionId, notify);
                                                    return Mono.empty();
                                                });
                                    }

                                    case TCM03 -> { // message read
                                        MessageDeliveryDTO obj = objectMapper.readValue(message, MessageDeliveryDTO.class);
                                        yield chatHandleWebSocket
                                                .changeReadChat(chatID, new MessageDeliveryDTO(obj.getUserID(), obj.getMessageID(), obj.getUserAvatar(), obj.getUserName()))
                                                .thenMany(Mono.fromRunnable(() -> {
                                                            NotifyChat notify=new NotifyChat(obj.getId(), TypeChatMessage.TCM00, TypeNotify.SUCCESS);
                                                            sendMessageToClient(sessionId, notify);
                                                            sendMessageToAllClients(sessionId,obj);
                                                        }
                                                ))
                                                .thenMany(Flux.just(message))
                                                .onErrorResume(e -> {
                                                    log.error("** " + e);
                                                    NotifyChat notify=new NotifyChat(obj.getId(), TypeChatMessage.TCM00, TypeNotify.FAILED);
                                                    sendMessageToClient(sessionId, notify);
                                                    return Mono.empty();
                                                });
                                    }

                                    case TCM04 -> { // message hidden
                                        MessageHiddenDTO obj = objectMapper.readValue(message, MessageHiddenDTO.class);
                                        yield chatHandleWebSocket
                                                .appendHiddenMessage(UUID.fromString(chatID), obj)
                                                .thenMany(Mono.fromRunnable(() -> {
                                                            NotifyChat notify=new NotifyChat(obj.getId(), TypeChatMessage.TCM00, TypeNotify.SUCCESS);
                                                            sendMessageToClient(sessionId, notify);
                                                            sendMessageToAllClients(sessionId,obj);
                                                        }
                                                ))
                                                .thenMany(Flux.just(message))
                                                .onErrorResume(e -> {
                                                    log.error("** " + e);
                                                    NotifyChat notify=new NotifyChat(obj.getId(), TypeChatMessage.TCM00, TypeNotify.FAILED);
                                                    sendMessageToClient(sessionId, notify);
                                                    return Mono.empty();
                                                });
                                    }

                                    case TCM05 -> { // message recall
                                        MessageHiddenDTO obj = objectMapper.readValue(message, MessageHiddenDTO.class);
                                        yield chatHandleWebSocket
                                                .recallMessage(UUID.fromString(chatID), obj)
                                                .thenMany(Mono.fromRunnable(() -> {
                                                            NotifyChat notify=new NotifyChat(obj.getId(), TypeChatMessage.TCM00, TypeNotify.SUCCESS);
                                                            sendMessageToClient(sessionId, notify);
                                                            sendMessageToAllClients(sessionId,obj);
                                                        }
                                                ))
                                                .thenMany(Flux.just(message))
                                                .onErrorResume(e -> {
                                                    log.error("** " + e);
                                                    NotifyChat notify=new NotifyChat(obj.getId(), TypeChatMessage.TCM00, TypeNotify.FAILED);
                                                    sendMessageToClient(sessionId, notify);
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
                            userHandleWebSocket.updateConversations(Objects.requireNonNull(chatHandleWebSocket.getChatTop10(chatID).block()))
                                    .onErrorResume(e -> {
                                        log.error("** " + e);
                                        return Mono.empty();
                                    }).block();

                            log.info("** session end: " + sessionId);
                        }))
                .then();
    }

    private void sendMessageToClient(String senderId, UserMessageDTO userMessageDTO) {
        try {
            log.info("** sendMessageToAllClients userMessageDTO {}",senderId );
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

    private void sendMessageToClient(String senderId, ChatMessageDTO chatMessageDTO) {
        try {
            log.info("** sendMessageToAllClients chatMessageDTO {}",senderId );
            String message = objectMapper.writeValueAsString(chatMessageDTO);
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



    private void sendMessageToAllClients(String senderId,UserMessageDTO info) {
        try {
            log.info("** sendMessageToAllClients UserMessageDTO");
            String message = objectMapper.writeValueAsString(info);
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

    private void sendMessageToAllClients(String senderId,ChatMessageDTO info) {
        try {
            log.info("** sendMessageToAllClients ChatMessageDTO");
            String message = objectMapper.writeValueAsString(info);
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
