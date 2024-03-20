package com.zalolite.chatservice.entity;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.Date;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class FriendRequest {
    @Field(targetType = FieldType.STRING)
    private UUID userID;
    private String userName;
    private String userAvatar;
    private String description;
    private Date sendAt;
    private Boolean isSender;

    public FriendRequest(UUID userID, String userName, String userAvatar, String description,Boolean isSender) {
        this.userID = userID;
        this.userName = userName;
        this.userAvatar = userAvatar;
        this.description = description;
        this.sendAt = new Date();
        this.isSender = isSender;
    }
}
