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
public class FriendRequestAcceptDTO extends UserMessageDTO{
    private UUID senderID;
    private String senderName;
    private String senderAvatar;

    private UUID receiverID;
    private String receiverName;
    private String receiverAvatar;

    public FriendRequestAcceptDTO(UUID id, TypeUserMessage TUM, UUID senderID, String senderName, String senderAvatar, UUID receiverID, String receiverName, String receiverAvatar) {
        super(id, TUM);
        this.senderID = senderID;
        this.senderName = senderName;
        this.senderAvatar = senderAvatar;
        this.receiverID = receiverID;
        this.receiverName = receiverName;
        this.receiverAvatar = receiverAvatar;
    }
}
