package com.zalolite.chatservice.dto;

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
public class AppendConversationDTO {
    private UUID senderID;
    private String senderName;
    private String senderAvatar;
    private UUID receiverID;
    private String receiverName;
    private String receiverAvatar;
    private Type type;
}
