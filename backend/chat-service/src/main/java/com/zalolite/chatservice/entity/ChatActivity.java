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
public class ChatActivity {
    @Field(targetType = FieldType.STRING)
    private UUID messageID;
    @Field(targetType = FieldType.STRING)
    private UUID userID;
    private Date timestamp;
    @Field(targetType = FieldType.STRING)
    private UUID parentID;
    private List<Content> contents;
    private Status status;
}
