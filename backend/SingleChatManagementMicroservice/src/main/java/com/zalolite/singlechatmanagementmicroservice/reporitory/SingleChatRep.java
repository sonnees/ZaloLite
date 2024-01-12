package com.zalolite.singlechatmanagementmicroservice.reporitory;

import com.zalolite.singlechatmanagementmicroservice.model.SingleChat;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SingleChatRep extends ReactiveMongoRepository<SingleChat,String> {
}
