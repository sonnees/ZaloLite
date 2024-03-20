package com.zalolite.chatservice.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Conversation {
    @Field(targetType = FieldType.STRING)
    private UUID chatID;
    private String chatName;
    private String chatAvatar;
    private Type type;
    @Field(targetType = FieldType.STRING)
    private UUID wsUG;
    private Date connectAt;
    private Date lastUpdateAt;
    private List<ChatActivity> topChatActivity;
}
