package com.zalolite.chatservice.dto;

import com.zalolite.chatservice.entity.Type;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
public class NotifyUser extends UserMessageDTO{
    private TypeNotify typeNotify;

    public NotifyUser(UUID id, TypeUserMessage TUM, TypeNotify typeNotify) {
        super(id, TUM);
        this.typeNotify = typeNotify;
    }

}
