package com.zalolite.chatservice.dto;

import com.zalolite.chatservice.entity.Content;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ChatActivityDTO {
    @Field(targetType = FieldType.STRING)
    private UUID userID;
    private String userAvatar;
    @Field(targetType = FieldType.STRING)
    private UUID parentID;
    private List<Content> contents;
}
