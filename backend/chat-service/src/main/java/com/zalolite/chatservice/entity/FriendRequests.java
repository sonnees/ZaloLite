package com.zalolite.chatservice.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.Date;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class FriendRequests {
    @Field(targetType = FieldType.STRING)
    private UUID userID;
    private String userName;
    private String userAvatar;
    private String description;
    private Date sendAt;
    private Boolean isSender;
}
