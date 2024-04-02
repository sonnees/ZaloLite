package com.zalolite.chatservice.dto.other;

import com.zalolite.chatservice.dto.enums.TypeNotify;
import com.zalolite.chatservice.entity.Type;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InfoUserMessage {
    private UUID senderID;
    private String senderName;
    private String senderAvatar;
    private UUID receiverID;
    private String receiverName;
    private String receiverAvatar;
    private String description;
    private Type type;
    private TypeNotify typeNotify;

    public InfoUserMessage(TypeNotify typeNotify) {
        this.typeNotify = typeNotify;
    }
}
