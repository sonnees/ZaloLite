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
public class UnfriendDTO extends UserMessageDTO{
    private UUID senderID;
    private UUID receiverID;

    public UnfriendDTO(UUID id, TypeUserMessage TUM, UUID senderID, UUID receiverID) {
        super(id, TUM);
        this.senderID = senderID;
        this.receiverID = receiverID;
    }

    public UnfriendDTO(FriendRequestAcceptDTO f) {
        super(f.getId(), f.getTUM());
        this.senderID = f.getSenderID();
        this.receiverID = f.getReceiverID();
    }
}
