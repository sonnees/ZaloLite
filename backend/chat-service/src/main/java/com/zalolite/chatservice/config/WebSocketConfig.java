package com.zalolite.chatservice.config;

import com.zalolite.chatservice.websocket.WebSocketHandler;
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
    public SimpleUrlHandlerMapping simpleUrlHandlerMapping(WebSocketHandler webSocketHandler) {
        log.info("** run simpleUrlHandlerMapping");
        Map<String, WebSocketHandler> urlMap = new HashMap<>();

        urlMap.put("/ws/chat/{chatID}", webSocketHandler);
        urlMap.put("/ws/user/{userID}", webSocketHandler);

        SimpleUrlHandlerMapping mapping = new SimpleUrlHandlerMapping();
        mapping.setUrlMap(urlMap);
        mapping.setOrder(10);
        return mapping;
    }

}