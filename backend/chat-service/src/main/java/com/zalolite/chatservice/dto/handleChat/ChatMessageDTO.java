package com.zalolite.chatservice.dto.handleChat;

import com.zalolite.chatservice.dto.enums.TypeChatMessage;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ChatMessageDTO {
    private UUID id;
    private TypeChatMessage TCM;
    private String ws;
}
