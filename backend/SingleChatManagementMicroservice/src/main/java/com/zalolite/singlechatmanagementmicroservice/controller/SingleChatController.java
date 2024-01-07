package com.zalolite.singlechatmanagementmicroservice.controller;

import com.zalolite.singlechatmanagementmicroservice.model.SingleChat;
import com.zalolite.singlechatmanagementmicroservice.reporitory.SingleChatRep;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@AllArgsConstructor
@RestController
@RequestMapping("/api/single-chat")
public class SingleChatController {
    private SingleChatRep singleChatRep;

    @PostMapping("/insert")
    public Mono<SingleChat> insert(@RequestBody SingleChat singleChat){
        return singleChatRep.save(singleChat);
    }

}
