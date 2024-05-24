package com.zalolite.chatservice.config;

import com.mongodb.reactivestreams.client.MongoClient;
import com.mongodb.reactivestreams.client.MongoClients;
import lombok.NonNull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractReactiveMongoConfiguration;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;

//@Configuration
public class MongoConfig extends AbstractReactiveMongoConfiguration {
    @Override
    @NonNull
    protected String getDatabaseName() {
        return "ChatService";
    }

    @Override
    protected boolean autoIndexCreation() {
        return true;
    }

}
