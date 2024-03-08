package com.zalolite.chatservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class FriendRequestRemoveDTO {
    private UUID senderID;
    private UUID receiverID;
}
