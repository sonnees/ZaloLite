package com.zalolite.accountservice.config;

import com.zalolite.accountservice.websocket.CustomWebSocketHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.config.EnableWebFlux;
import org.springframework.web.reactive.config.WebFluxConfigurer;
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping;
import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableWebFlux
@Slf4j
public class WebSocketConfig implements WebFluxConfigurer {

    @Bean
    public WebSocketHandlerAdapter handlerAdapter() {
        return new WebSocketHandlerAdapter();
    }

    @Bean
    public SimpleUrlHandlerMapping simpleUrlHandlerMapping(CustomWebSocketHandler customWebSocketHandler) {
        log.info("** run simpleUrlHandlerMapping");
        Map<String, CustomWebSocketHandler> urlMap = new HashMap<>();

        urlMap.put("/ws/auth/{userId}", customWebSocketHandler);

        SimpleUrlHandlerMapping mapping = new SimpleUrlHandlerMapping();
        mapping.setUrlMap(urlMap);
        mapping.setOrder(10);
        return mapping;
    }

}
