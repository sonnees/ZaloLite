package com.zalolite.chatservice.dto.handleChat;

import com.zalolite.chatservice.dto.enums.TypeChatMessage;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
@ToString
public class TypingTextMessageDTO extends ChatMessageDTO {
    private String chatID;
    private String senderName;

    public TypingTextMessageDTO(UUID id, TypeChatMessage TCM, String ws, String chatID, String senderName) {
        super(id, TCM, ws);
        this.chatID = chatID;
        this.senderName = senderName;
    }
}
