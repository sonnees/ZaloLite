package com.zalolite.singlechatmanagementmicroservice.service;

import com.zalolite.singlechatmanagementmicroservice.model.SingleChat;
import com.zalolite.singlechatmanagementmicroservice.reporitory.SingleChatRep;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@AllArgsConstructor
public class SingleChatService {
    private SingleChatRep singleChatRep;

    public Mono<SingleChat> insert(SingleChat singleChat){
        return singleChatRep.insert(singleChat);
    }
}
