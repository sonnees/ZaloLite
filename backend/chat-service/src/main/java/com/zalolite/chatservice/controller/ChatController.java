package com.zalolite.chatservice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.chatservice.entity.Chat;
import com.zalolite.chatservice.repository.ChatRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/chat")
@Slf4j
public class ChatController {
    private final ChatRepository chatRepository;
    private final ObjectMapper objectMapper;

    @PostMapping("/create")
    public Mono<Boolean> createChat(@RequestParam String id){
        log.info("### enter create chat ###");
        log.info("# {} #", id);
        return chatRepository.save(new Chat(id))
                .flatMap(chat -> Mono.just((chat!=null)));
    }

    @GetMapping("/x-to-y")
    public Mono<ResponseEntity<String>> getChatActivityFromNToM(@RequestParam String id, @RequestParam int x, @RequestParam int y){
        log.info("### enter get chat active from n to m ###");
        log.info("# id: {} x: {} y: {} #", id, x, y);
        return chatRepository.getChatActivityFromNToM(id,x,y)
                .collectList()
                .flatMap(list -> {
                    try {
                        return Mono.just(ResponseEntity.status(200).body(objectMapper.writeValueAsString(list)));
                    } catch (JsonProcessingException e) {
                        log.error("# {} #", e+"");
                        return Mono.just(ResponseEntity.status(500).body("Error processing JSON"));
                    }
                });
    }

    @GetMapping("/search-bkw")
    public Mono<ResponseEntity<String>> searchByKeyWord(@RequestParam UUID chatID, @RequestParam String key){
        log.info("### enter search by key word ###");
        log.info("# chatID: {} key: {} #", chatID, key);
        return chatRepository.searchByKeyWord(chatID, key)
                .collectList()
                .flatMap(list -> {
                    try {
                        return Mono.just(ResponseEntity.status(200).body(objectMapper.writeValueAsString(list)));
                    } catch (JsonProcessingException e) {
                        log.error("# {} #", e+"");
                        return Mono.just(ResponseEntity.status(500).body("Error processing JSON"));
                    }
                });
    }

    @GetMapping("/get-search")
    public Mono<ResponseEntity<String>> getSearch(@RequestParam UUID chatID, @RequestParam UUID messageID){
        log.info("### enter get search ###");
        log.info("# chatID: {} messageID: {} #", chatID, messageID);
        return chatRepository.getIndexOfMessageID(chatID, messageID)
                .collectList()
                .switchIfEmpty(Mono.defer(()->{
                    log.error("# {} #", "Fail get index of message id");
                    return Mono.empty();
                }))
                .flatMap(list -> {
                    int index = list.get(0).getIndex();
                    log.info("# index: {}  #",index);
                    return getChatActivityFromNToM(chatID.toString(), 0, index+11);
                });
    }

}
