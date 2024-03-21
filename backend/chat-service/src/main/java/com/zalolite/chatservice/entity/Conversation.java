package com.zalolite.chatservice.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.ArrayList;
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
    private Date connectAt;
    private Date lastUpdateAt;
    private List<ChatActivity> topChatActivity;

    public Conversation(UUID chatID, String chatName, String chatAvatar, Type type) {
        this.chatID = chatID;
        this.chatName = chatName;
        this.chatAvatar = chatAvatar;
        this.type = type;
        this.connectAt = new Date();
        this.lastUpdateAt = new Date();
        this.topChatActivity = new ArrayList<>();
    }
}
