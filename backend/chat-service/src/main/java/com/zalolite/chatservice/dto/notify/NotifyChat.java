package com.zalolite.chatservice.dto.notify;

import com.zalolite.chatservice.dto.handleChat.ChatMessageDTO;
import com.zalolite.chatservice.dto.enums.TypeChatMessage;
import com.zalolite.chatservice.dto.enums.TypeNotify;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
@ToString
public class NotifyChat extends ChatMessageDTO {
    private TypeNotify typeNotify;

    public NotifyChat(UUID id, TypeChatMessage TCM, String ws, TypeNotify typeNotify) {
        super(id, TCM, ws);
        this.typeNotify = typeNotify;
    }
}
