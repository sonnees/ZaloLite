package com.zalolite.chatservice.dto.notify;

import com.zalolite.chatservice.dto.handleUser.UserMessageDTO;
import com.zalolite.chatservice.dto.enums.TypeNotify;
import com.zalolite.chatservice.dto.enums.TypeUserMessage;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
public class NotifyMessage extends UserMessageDTO {
    private TypeNotify typeNotify;

    public NotifyMessage(UUID id, TypeUserMessage TUM, TypeNotify typeNotify) {
        super(id, TUM);
        this.typeNotify = typeNotify;
    }
}
