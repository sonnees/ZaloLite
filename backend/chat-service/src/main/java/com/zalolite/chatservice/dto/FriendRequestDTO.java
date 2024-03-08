package com.zalolite.chatservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class FriendRequestDTO {
    private UUID senderID;
    private String senderName;
    private String senderAvatar;
    private UUID receiverID;
    private String receiverName;
    private String receiverAvatar;
    private String description;
}
