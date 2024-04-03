package com.zalolite.chatservice.dto.handleUser;

import com.zalolite.chatservice.dto.handleUser.FriendRequestAcceptDTO;
import com.zalolite.chatservice.dto.handleUser.FriendRequestAddDTO;
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

    public AppendConversationDTO(FriendRequestAddDTO f) {
        senderID = f.getSenderID();
        senderName = f.getSenderName();
        senderAvatar = f.getSenderAvatar();
        receiverID = f.getReceiverID();
        receiverName = f.getReceiverName();
        receiverAvatar = f.getReceiverAvatar();
    }

    public AppendConversationDTO(FriendRequestAcceptDTO f) {
        senderID = f.getSenderID();
        senderName = f.getSenderName();
        senderAvatar = f.getSenderAvatar();
        receiverID = f.getReceiverID();
        receiverName = f.getReceiverName();
        receiverAvatar = f.getReceiverAvatar();
    }

}
