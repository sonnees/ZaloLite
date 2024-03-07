package com.zalolite.chatservice.config;

import lombok.NonNull;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractReactiveMongoConfiguration;

@Configuration
public class MongoConfig extends AbstractReactiveMongoConfiguration {
    @Override
    @NonNull
    protected String getDatabaseName() {
        return "ZaloLite";
    }

    @Override
    protected boolean autoIndexCreation() {
        return true;
    }
}
