package com.zalolite.chatservice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.util.List;
import java.util.UUID;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.chatservice.dto.AppendConversationDTO;
import com.zalolite.chatservice.entity.*;
import com.zalolite.chatservice.repository.ChatRepository;
import com.zalolite.chatservice.repository.GroupRepository;
import com.zalolite.chatservice.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/user")
@Slf4j
public class UserController {
    private UserRepository userRepository;
    private ChatRepository chatRepository;
    private GroupRepository groupRepository;
    private ObjectMapper objectMapper;
    private WebClient.Builder builder;

    @PostMapping("/create")
    public Mono<Boolean> createUser(@RequestParam String id){
        return userRepository.save(new User(id))
                .flatMap(user -> Mono.just((user!=null)));
    }

    @GetMapping("/info/{userId}")
    public Mono<ResponseEntity<String>> getUser(ServerWebExchange exchange, @PathVariable String userId){
        String token = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        WebClient webClient = builder.build();
        if(token!=null) token = token.substring(7);
        log.info("** getUser:"+ token);

        // check auth
        return webClient.get()
               .uri("http://ACCOUNT-SERVICE/api/v1/auth/get-userid/" + token)
               .retrieve()
               .bodyToMono(String.class)
               .flatMap(id -> {
                   log.info("** userId: "+id);
                   if (id.isEmpty() || !userId.equals(id))
                       return Mono.just(ResponseEntity.status(401).body("Error token"));

                   // get info user
                   return userRepository.findUserById(userId)
                           .flatMap(user -> {
                               try {
                                   return Mono.just(ResponseEntity.status(200).body(objectMapper.writeValueAsString(user)));
                               } catch (JsonProcessingException e) {
                                   log.error("** "+ e);
                                   return Mono.just(ResponseEntity.status(500).body("Error processing JSON"));
                               }
                           })
                           .switchIfEmpty(Mono.just(ResponseEntity.status(401).body("Error token")));
               })
                .doOnError(throwable -> log.error(throwable.getMessage()));
    }

//    @PostMapping("/update")
//    public Mono<Boolean> updateTopChatActivity(@RequestParam String id, @RequestBody List<ChatActivity> chatActivities){
//        return userRepository.updateTopChatActivity(id,chatActivities)
//                .flatMap(aLong -> Mono.just(aLong>0));
//    }

//    @PostMapping("/friend-request")
//    public Mono<ResponseEntity<String>> updateFriendRequests(@RequestBody FriendRequestDTO f_dto){
//        FriendRequest sender = new FriendRequest(f_dto.getSenderID(),f_dto.getSenderName(),f_dto.getSenderAvatar(),f_dto.getDescription(), false);
//        FriendRequest receiver = new FriendRequest(f_dto.getReceiverID(),f_dto.getReceiverName(),f_dto.getReceiverAvatar(),f_dto.getDescription(), true);
//
//        // add friend request for sender
//        return userRepository.updateFriendRequests(receiver.getUserID()+"",sender)
//                .flatMap(aLong -> {
//                    if(aLong<=0){
//                        log.error("sender updateFriendRequests failed");
//                        return Mono.just(ResponseEntity.status(404).body(""));
//                    }
//
//                    // add friend request for receiver
//                    return userRepository.updateFriendRequests(sender.getUserID() + "", receiver)
//                            .flatMap(aLong1 -> {
//                                if(aLong1<=0){
//                                    log.error("receiver updateFriendRequests failed");
//                                    return Mono.just(ResponseEntity.status(404).body(""));
//                                }
//                                return Mono.just(ResponseEntity.status(200).body("Update success"));
//                            });
//                });
//    }
//
//    @PostMapping("/remove-friend-request")
//    public Mono<ResponseEntity<String>>  updateFriendRequestsRemove(@RequestBody FriendRequestRemoveDTO fv_dto){
//
//        // remove friend request for sender
//        return userRepository.updateFriendRequestsRemove(fv_dto.getSenderID()+"",fv_dto.getReceiverID()+"")
//                .flatMap(aLong -> {
//                    if(aLong<=0) {
//                        log.error("sender updateFriendRequestsRemove failed");
//                        return Mono.just(ResponseEntity.status(404).body(""));
//                    }
//
//                    // remove friend request for receiver
//                    return userRepository.updateFriendRequestsRemove(fv_dto.getReceiverID()+"", fv_dto.getSenderID()+"")
//                            .flatMap(aLong1 -> {
//                                if(aLong1<=0){
//                                    log.error("receiver updateFriendRequestsRemove failed");
//                                    return Mono.just(ResponseEntity.status(404).body(""));
//                                }
//                                return Mono.just(ResponseEntity.status(200).body("Update success"));
//                            });
//                });
//    }

//    @PostMapping("/accept-friend-request")
//    public Mono<ResponseEntity<String>>  updateFriendRequestsAccept(@RequestParam String userID){
//        return userRepository.updateFriendRequestsAccept()
//    }

//    @PostMapping("/append-conversation")
//    public Mono<ResponseEntity<String>> updateConversations(@RequestBody AppendConversationDTO appendConversationDTO){
//        UUID idChat = UUID.randomUUID();
//        // new chat
//        return chatRepository.save(new Chat(idChat+""))
//                .flatMap(chat -> {
//                    if(chat==null){
//                        log.error("Chat updateConversations failed");
//                        return Mono.just(ResponseEntity.status(404).body(""));
//                    }
//
//                    // append conversation for sender
//                    Conversation conversationOurSender = new Conversation(idChat,appendConversationDTO.getReceiverName(),appendConversationDTO.getReceiverAvatar(),appendConversationDTO.getType());
//                    return userRepository.updateConversations(appendConversationDTO.getSenderID()+"",conversationOurSender)
//                            .flatMap(aLongS -> {
//                                if(aLongS<=0) {
//                                    log.error("conversationOurSender updateConversations failed");
//                                    return Mono.just(ResponseEntity.status(404).body(""));
//                                }
//
//                                // append conversation for receiver
//                                Conversation conversationOurReceiver = new Conversation(idChat,appendConversationDTO.getSenderName(),appendConversationDTO.getSenderAvatar(),appendConversationDTO.getType());
//                                return userRepository.updateConversations(appendConversationDTO.getReceiverID()+"",conversationOurReceiver)
//                                        .flatMap(aLongR -> {
//                                            if(aLongR<=0){
//                                                log.error("conversationOurReceiver updateConversations failed");
//                                                return Mono.just(ResponseEntity.status(404).body(""));
//                                            }
//                                            return Mono.just(ResponseEntity.status(200).body("Update success"));
//                                        });
//                            });
//                });
//    }

//    @PostMapping("/append-chat-conversation")
//    public Mono<ResponseEntity<String>> updateConversations(@RequestParam String id, @RequestBody Conversation conversation){
//        return userRepository.updateConversations(id, conversation)
//                .flatMap(aLong -> {
//                    if(aLong<=0) return Mono.just(ResponseEntity.status(404).body("updateConversations failed"));
//                    return chatRepository.save(new Chat(id))
//                            .flatMap(chat -> {
//                                if(chat==null) return Mono.just(ResponseEntity.status(404).body("Create chat failed"));
//                                return Mono.just(ResponseEntity.status(200).body("{'idWS':'"+id+"'}"));
//                            });
//                });
//    }
}
