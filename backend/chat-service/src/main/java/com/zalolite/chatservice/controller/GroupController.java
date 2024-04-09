package com.zalolite.chatservice.controller;

import com.zalolite.chatservice.entity.Group;
import com.zalolite.chatservice.repository.GroupRepository;
import com.zalolite.chatservice.serialization.JsonConverter;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/group")
@Slf4j
public class GroupController {
    private final GroupRepository groupRepository;
    private final JsonConverter jsonConverter;

    @PostMapping("/create")
    public Mono<ResponseEntity<String>> createGroup(@RequestBody Group group){
        log.info("### enter create group ###");
        log.info("# {} #", jsonConverter.objToString(group));
        return groupRepository.save(group)
                .switchIfEmpty(Mono.defer(() -> Mono.just(ResponseEntity.status(500).body("Create group fail"))).then(Mono.empty()))
                .flatMap(g -> Mono.just(ResponseEntity.status(200).body("Create group success")));
    }

    @GetMapping("/info")
    public Mono<ResponseEntity<String>> getInfoGroup(@RequestParam UUID idGroup){
        log.info("### enter get info group ###");
        log.info("# {} #", idGroup);
        return groupRepository.findById(idGroup)
                .switchIfEmpty(Mono.defer(() -> Mono.just(ResponseEntity.status(500).body("Create group fail"))).then(Mono.empty()))
                .flatMap(g -> Mono.just(ResponseEntity.status(200).body("Create group success")));
    }

}
