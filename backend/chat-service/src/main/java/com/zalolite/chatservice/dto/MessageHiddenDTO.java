package com.zalolite.chatservice.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
@ToString
public class MessageHiddenDTO extends ChatMessageDTO{
    @Field(targetType = FieldType.STRING)
    private UUID userID;
    @Field(targetType = FieldType.STRING)
    private UUID messageID;

    public MessageHiddenDTO(UUID id, TypeChatMessage TCM, UUID userID, UUID messageID) {
        super(id, TCM);
        this.userID = userID;
        this.messageID = messageID;
    }

    public MessageHiddenDTO(UUID userID, UUID messageID) {
        this.messageID = messageID;
        this.userID = userID;
    }
}
