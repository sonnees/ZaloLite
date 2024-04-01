package com.zalolite.chatservice.websocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.chatservice.dto.*;
import com.zalolite.chatservice.entity.Type;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
@AllArgsConstructor
public class WebSocketHandler implements org.springframework.web.reactive.socket.WebSocketHandler {
    private ObjectMapper objectMapper;
    private UserHandleWebSocket userHandleWebSocket;
    private ChatHandleWebSocket chatHandleWebSocket;
    private GroupHandleWebSocket groupHandleWebSocket;

    private final Map<String, List<WebSocketSession>> sessions = new ConcurrentHashMap<>();

    @Override
    @NonNull
    public Mono<Void> handle(WebSocketSession session) {
        String sessionId = session.getId();
        String path = session.getHandshakeInfo().getUri().getPath();
        String[] split = path.split("/");

        if(sessions.get(path)==null){
            List<WebSocketSession> list = new ArrayList<>();
            list.add(session);
            sessions.put(path, list);
        }
        else sessions.get(path).add(session);

        Flux<WebSocketMessage> sendFlux = Flux.just(session.textMessage("Connect success"));

        return switch (split[2]) {
            case "chat" -> handleChat(session, sendFlux, sessionId, split[split.length - 1], path);
            case "user" -> handleUser(session, sendFlux, sessionId, split[split.length - 1], path);
            case "group" -> handleGroup(session, sendFlux, sessionId, path);
            default -> Mono.empty();
        };
    }

    private Mono<Void> handleGroup(WebSocketSession session, Flux<WebSocketMessage> sendFlux, String sessionId, String path) {
        return session
                .send(sendFlux)
                .thenMany(session.receive()
                        .map(WebSocketMessage::getPayloadAsText)
                        .flatMap(message -> {
                            try {
                                GroupDTO root = objectMapper.readValue(message, GroupDTO.class);
                                log.info("** Received message from {}: {}", sessionId, objectMapper.writeValueAsString(root));

                                return switch (root.getTGM()) {
                                    case TGM01 -> {
                                        CreateGroupDTO obj = objectMapper.readValue(message, CreateGroupDTO.class);
                                        List<String> listID = new ArrayList<>();
                                        listID.add(obj.getOwner().getUserID().toString());
                                        obj.getMembers().forEach(personInfo -> listID.add(personInfo.getUserID().toString()));
                                        String[] arrayID = listID.toArray(new String[0]);
                                        yield groupHandleWebSocket
                                                .create(arrayID, objectMapper.readValue(message, CreateGroupDTO.class))
                                                .thenMany(Mono.fromRunnable(() -> {
                                                            NotifyUser notify=new NotifyUser(obj.getId(), TypeUserMessage.TUM00, TypeNotify.SUCCESS);
                                                            sendMessageToClient(path,sessionId,notify, "Pass | Create Group");
                                                            sendMessageToAllClients(arrayID, obj.getOwner().getUserID().toString() ,obj);
                                                        }
                                                ))
                                                .thenMany(Flux.just(message))
                                                .onErrorResume(e -> {
                                                    log.error("** " + e);
                                                    NotifyUser notify=new NotifyUser(obj.getId(), TypeUserMessage.TUM00, TypeNotify.FAILED);
                                                    sendMessageToClient(path,sessionId,notify, "Failed | Create Group");
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
                            sessions.get(path).remove(session);
                            log.info("** session end: {} | size: {}", sessionId, sessions.get(path).size());
                        }))
                .then();
    }

    private void sendMessageToAllClients(String[] arrayID, String ignore, CreateGroupDTO obj) {
        log.info("** sendMessageToAllClients create group");
        try {
            String message = objectMapper.writeValueAsString(obj);
            String[] array = Arrays.stream(arrayID).filter(s -> !s.equals(ignore)).toArray(String[]::new);
            for (String i : array){
                List<WebSocketSession> webSocketSessions = sessions.get("/ws/user/"+i);
                if(webSocketSessions == null) continue;
                webSocketSessions.forEach(session -> {
                        session
                                .send(Flux.just(session.textMessage(message)))
                                .subscribe();
                });
            }
        } catch (JsonProcessingException e) {
            log.error(e.getMessage());
        }
    }

    // ===== handleUser =====
    private Mono<Void> handleUser(WebSocketSession session, Flux<WebSocketMessage> sendFlux, String sessionId, String userID,String path) {
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
                                                            sendMessageToClient(path,sessionId,notify, "Pass | append friend requests");
                                                            sendMessageToAllClients(path,sessionId,obj,"append friend requests");
                                                        }
                                                ))
                                                .thenMany(Flux.just(message))
                                                .onErrorResume(e -> {
                                                    log.error("** " + e);
                                                    NotifyUser notify=new NotifyUser(obj.getId(), TypeUserMessage.TUM00, TypeNotify.FAILED);
                                                    sendMessageToClient(path,sessionId,notify, "Failed | append friend requests");
                                                    return Mono.empty();
                                                });
                                    }

                                    case TUM02 -> {
                                        FriendRequestRemoveDTO obj = objectMapper.readValue(message, FriendRequestRemoveDTO.class);
                                        yield  userHandleWebSocket
                                                .removeFriendRequests(obj)
                                                .thenMany(Mono.fromRunnable(() -> {
                                                            NotifyUser notify=new NotifyUser(obj.getId(), TypeUserMessage.TUM00, TypeNotify.SUCCESS);
                                                            sendMessageToClient(path,sessionId,notify, "Pass | remove friend requests");
                                                            sendMessageToAllClients(path,sessionId,obj,"remove friend requests");
                                                        }
                                                ))
                                                .thenMany(Flux.just(message))
                                                .onErrorResume(e -> {
                                                    log.error("** " + e);
                                                    NotifyUser notify=new NotifyUser(obj.getId(), TypeUserMessage.TUM00, TypeNotify.FAILED);
                                                    sendMessageToClient(path,sessionId,notify, "Failed | remove friend requests");
                                                    return Mono.empty();
                                                });
                                    }

                                    case TUM03 -> {
                                        FriendRequestAcceptDTO obj = objectMapper.readValue(message, FriendRequestAcceptDTO.class);
                                        yield  userHandleWebSocket
                                                .acceptFriendRequests(obj)
                                                .thenMany(Mono.fromRunnable(() -> {
                                                            NotifyUser notify=new NotifyUser(obj.getId(), TypeUserMessage.TUM00, TypeNotify.SUCCESS);
                                                            sendMessageToClient(path,sessionId,notify, "Pass | accept friend requests");
                                                            sendMessageToAllClients(path,sessionId,obj,"accept friend requests");
                                                        }
                                                ))
                                                .thenMany(Flux.just(message))
                                                .onErrorResume(e -> {
                                                    log.error("** " + e);
                                                    NotifyUser notify=new NotifyUser(obj.getId(), TypeUserMessage.TUM00, TypeNotify.FAILED);
                                                    sendMessageToClient(path,sessionId,notify, "Failed | accept friend requests");
                                                    return Mono.empty();
                                                });
                                    }
                                    case TUM04 -> {
                                        UnfriendDTO obj = objectMapper.readValue(message, UnfriendDTO.class);
                                        yield  userHandleWebSocket
                                                .unfriend(obj)
                                                .thenMany(Mono.fromRunnable(() -> {
                                                            NotifyUser notify=new NotifyUser(obj.getId(), TypeUserMessage.TUM00, TypeNotify.SUCCESS);
                                                            sendMessageToClient(path,sessionId,notify, "Pass | unfriend");
                                                            sendMessageToAllClients(path,sessionId,obj,"unfriend");
                                                        }
                                                ))
                                                .thenMany(Flux.just(message))
                                                .onErrorResume(e -> {
                                                    log.error("** " + e);
                                                    NotifyUser notify=new NotifyUser(obj.getId(), TypeUserMessage.TUM00, TypeNotify.FAILED);
                                                    sendMessageToClient(path,sessionId,notify, "Failed | unfriend");
                                                    return Mono.empty();
                                                });
                                    }

                                    case TUM05 -> { // create conversation
                                        FriendRequestAcceptDTO obj = objectMapper.readValue(message, FriendRequestAcceptDTO.class);
                                        yield  userHandleWebSocket
                                                .appendConversations(new AppendConversationDTO(obj), Type.STRANGER)
                                                .thenMany(Mono.fromRunnable(() -> {
                                                            NotifyUser notify=new NotifyUser(obj.getId(), TypeUserMessage.TUM00, TypeNotify.SUCCESS);
                                                            sendMessageToClient(path,sessionId,notify, "Pass | append conversations");
                                                            sendMessageToAllClients(path,sessionId,obj,"append conversations");
                                                        }
                                                ))
                                                .thenMany(Flux.just(message))
                                                .onErrorResume(e -> {
                                                    log.error("** " + e);
                                                    NotifyUser notify=new NotifyUser(obj.getId(), TypeUserMessage.TUM00, TypeNotify.FAILED);
                                                    sendMessageToClient(path,sessionId,notify, "Failed | append conversations");
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

    private void sendMessageToClient(String path, String sessionId, NotifyUser notify, String logStr) {
        log.info("** sendMessageToClient User {}", logStr);
        try {
            String message = objectMapper.writeValueAsString(notify);
            List<WebSocketSession> webSocketSessions = sessions.get(path);

            webSocketSessions.forEach(session -> {
                if(session.getId().equals(sessionId))
                    session
                            .send(Flux.just(session.textMessage(message)))
                            .subscribe();
            });

        } catch (JsonProcessingException e) {
            log.error(e.getMessage());
        }
    }

    private void sendMessageToAllClients(String path, String sessionId, UserMessageDTO obj, String logStr) {
        log.info("** sendMessageToAllClients User {}", logStr);
        try {
            String message = objectMapper.writeValueAsString(obj);
            List<WebSocketSession> webSocketSessions = sessions.get(path);

            webSocketSessions.forEach(session -> {
                if(!session.getId().equals(sessionId))
                    session
                            .send(Flux.just(session.textMessage(message)))
                            .subscribe();
            });

        } catch (JsonProcessingException e) {
            log.error(e.getMessage());
        }
    }

    // ===== handleChat =====
    private Mono<Void> handleChat(WebSocketSession session, Flux<WebSocketMessage> sendFlux, String sessionId, String chatID, String path) {
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
                                                    sendMessageToClient(path,sessionId,notify, "Pass | append chat");
                                                    sendMessageToAllClients(path,sessionId,obj,"append chat");
                                                }
                                                ))
                                                .thenMany(Flux.just(message))
                                                .onErrorResume(e -> {
                                                    log.error("** " + e);
                                                    NotifyChat notify=new NotifyChat(obj.getId(), TypeChatMessage.TCM00, TypeNotify.FAILED);
                                                    sendMessageToClient(path,sessionId,notify, "Failed | append chat");
                                                    return Mono.empty();
                                                });
                                    }

                                    case TCM02 -> { // message delivery
                                        MessageDeliveryDTO obj = objectMapper.readValue(message, MessageDeliveryDTO.class);
                                        yield chatHandleWebSocket
                                                .changeDeliveryChat(chatID, obj)
                                                .thenMany(Mono.fromRunnable(() -> {
                                                            NotifyChat notify=new NotifyChat(obj.getId(), TypeChatMessage.TCM00, TypeNotify.SUCCESS);
                                                            sendMessageToClient(path,sessionId,notify, "Pass | change delivery chat");
                                                            sendMessageToAllClients(path,sessionId,obj,"change delivery chat");
                                                        }
                                                ))
                                                .thenMany(Flux.just(message))
                                                .onErrorResume(e -> {
                                                    log.error("** " + e);
                                                    NotifyChat notify=new NotifyChat(obj.getId(), TypeChatMessage.TCM00, TypeNotify.FAILED);
                                                    sendMessageToClient(path,sessionId,notify, "Failed | change delivery chat");
                                                    return Mono.empty();
                                                });
                                    }

                                    case TCM03 -> { // message read
                                        MessageDeliveryDTO obj = objectMapper.readValue(message, MessageDeliveryDTO.class);
                                        yield chatHandleWebSocket
                                                .changeReadChat(chatID, new MessageDeliveryDTO(obj.getUserID(), obj.getMessageID(), obj.getUserAvatar(), obj.getUserName()))
                                                .thenMany(Mono.fromRunnable(() -> {
                                                            NotifyChat notify=new NotifyChat(obj.getId(), TypeChatMessage.TCM00, TypeNotify.SUCCESS);
                                                            sendMessageToClient(path,sessionId,notify, "Pass | change read chat");
                                                            sendMessageToAllClients(path,sessionId,obj,"change read chat");
                                                        }
                                                ))
                                                .thenMany(Flux.just(message))
                                                .onErrorResume(e -> {
                                                    log.error("** " + e);
                                                    NotifyChat notify=new NotifyChat(obj.getId(), TypeChatMessage.TCM00, TypeNotify.FAILED);
                                                    sendMessageToClient(path,sessionId,notify, "Failed | change read chat");
                                                    return Mono.empty();
                                                });
                                    }

                                    case TCM04 -> { // message hidden
                                        MessageHiddenDTO obj = objectMapper.readValue(message, MessageHiddenDTO.class);
                                        yield chatHandleWebSocket
                                                .appendHiddenMessage(UUID.fromString(chatID), obj)
                                                .thenMany(Mono.fromRunnable(() -> {
                                                            NotifyChat notify=new NotifyChat(obj.getId(), TypeChatMessage.TCM00, TypeNotify.SUCCESS);
                                                            sendMessageToClient(path,sessionId,notify, "Pass | change hidden chat");
                                                            sendMessageToAllClients(path,sessionId,obj,"change hidden chat");
                                                        }
                                                ))
                                                .thenMany(Flux.just(message))
                                                .onErrorResume(e -> {
                                                    log.error("** " + e);
                                                    NotifyChat notify=new NotifyChat(obj.getId(), TypeChatMessage.TCM00, TypeNotify.FAILED);
                                                    sendMessageToClient(path,sessionId,notify, "Failed | change hidden chat");
                                                    return Mono.empty();
                                                });
                                    }

                                    case TCM05 -> { // message recall
                                        MessageHiddenDTO obj = objectMapper.readValue(message, MessageHiddenDTO.class);
                                        yield chatHandleWebSocket
                                                .recallMessage(UUID.fromString(chatID), obj)
                                                .thenMany(Mono.fromRunnable(() -> {
                                                            NotifyChat notify=new NotifyChat(obj.getId(), TypeChatMessage.TCM00, TypeNotify.SUCCESS);
                                                            sendMessageToClient(path,sessionId,notify, "Pass | recall message");
                                                            sendMessageToAllClients(path,sessionId,obj,"recall message");
                                                        }
                                                ))
                                                .thenMany(Flux.just(message))
                                                .onErrorResume(e -> {
                                                    log.error("** " + e);
                                                    NotifyChat notify=new NotifyChat(obj.getId(), TypeChatMessage.TCM00, TypeNotify.FAILED);
                                                    sendMessageToClient(path,sessionId,notify, "Failed | recall message");
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

    private void sendMessageToClient(String path, String sessionId, NotifyChat notify, String logStr) {
        log.info("** sendMessageToClient Chat {}", logStr);
        try {
            String message = objectMapper.writeValueAsString(notify);
            List<WebSocketSession> webSocketSessions = sessions.get(path);

            webSocketSessions.forEach(session -> {
                if(session.getId().equals(sessionId))
                    session
                            .send(Flux.just(session.textMessage(message)))
                            .subscribe();
            });

        } catch (JsonProcessingException e) {
            log.error(e.getMessage());
        }
    }

    private void sendMessageToAllClients(String path, String sessionId, ChatMessageDTO obj, String logStr) {
        log.info("** sendMessageToAllClients Chat {}", logStr);
        try {
            String message = objectMapper.writeValueAsString(obj);
            List<WebSocketSession> webSocketSessions = sessions.get(path);

            webSocketSessions.forEach(session -> {
                if(!session.getId().equals(sessionId))
                    session
                            .send(Flux.just(session.textMessage(message)))
                            .subscribe();
            });

        } catch (JsonProcessingException e) {
            log.error(e.getMessage());
        }
    }


}
