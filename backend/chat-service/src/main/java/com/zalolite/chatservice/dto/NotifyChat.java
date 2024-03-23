package com.zalolite.chatservice.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
@ToString
public class NotifyChat extends ChatMessageDTO{
    private TypeNotify typeNotify;

    public NotifyChat(UUID id, TypeChatMessage TCM, TypeNotify typeNotify) {
        super(id, TCM);
        this.typeNotify = typeNotify;
    }
}
