package com.zalolite.chatservice.dto.handleUser;

import com.zalolite.chatservice.dto.enums.TypeUserMessage;
import lombok.*;

import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
@ToString
public class FriendRequestAddDTO extends UserMessageDTO {
    private UUID senderID;
    private String senderName;
    private String senderAvatar;
    private UUID receiverID;
    private String receiverName;
    private String receiverAvatar;
    private String description;

    public FriendRequestAddDTO(UUID id, TypeUserMessage TUM, UUID senderID, String senderName, String senderAvatar, UUID receiverID, String receiverName, String receiverAvatar, String description) {
        super(id, TUM);
        this.senderID = senderID;
        this.senderName = senderName;
        this.senderAvatar = senderAvatar;
        this.receiverID = receiverID;
        this.receiverName = receiverName;
        this.receiverAvatar = receiverAvatar;
        this.description = description;
    }
}
