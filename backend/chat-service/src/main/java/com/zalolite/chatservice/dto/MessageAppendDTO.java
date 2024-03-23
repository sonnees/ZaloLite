package com.zalolite.chatservice.dto;

import com.zalolite.chatservice.entity.Content;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
@ToString
public class MessageAppendDTO extends ChatMessageDTO{
    @Field(targetType = FieldType.STRING)
    private UUID userID;
    private String userAvatar;
    private String userName;
    private Date timestamp;
    @Field(targetType = FieldType.STRING)
    private UUID parentID;
    private List<Content> contents;

    public MessageAppendDTO(UUID id, TypeChatMessage TCM, UUID userID, String userAvatar, String userName, Date timestamp, UUID parentID, List<Content> contents) {
        super(id, TCM);
        this.userID = userID;
        this.userAvatar = userAvatar;
        this.userName = userName;
        this.timestamp = timestamp;
        this.parentID = parentID;
        this.contents = contents;
    }
}
