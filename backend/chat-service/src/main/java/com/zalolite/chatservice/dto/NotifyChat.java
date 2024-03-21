package com.zalolite.chatservice.dto;

import com.zalolite.chatservice.entity.Content;
import com.zalolite.chatservice.entity.Status;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;
import java.util.List;
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
