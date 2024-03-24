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
public class MessageDeliveryDTO extends ChatMessageDTO{
    @Field(targetType = FieldType.STRING)
    private UUID userID;
    @Field(targetType = FieldType.STRING)
    private UUID messageID;
    private String userAvatar;
    private String userName;

    public MessageDeliveryDTO(UUID id, TypeChatMessage TCM, UUID userID, UUID messageID, String userAvatar, String userName) {
        super(id, TCM);
        this.userID = userID;
        this.messageID = messageID;
        this.userAvatar = userAvatar;
        this.userName = userName;
    }

    public MessageDeliveryDTO(UUID userID, UUID messageID, String userAvatar, String userName) {
        this.messageID = messageID;
        this.userAvatar = userAvatar;
        this.userID = userID;
        this.userName = userName;
    }

    public MessageDeliveryDTO(MessageAppendDTO m, UUID messageID) {
        super(m.getId(), m.getTCM());
        this.userID = m.getUserID();
        this.messageID = messageID;
        this.userAvatar = m.getUserAvatar();
        this.userName = m.getUserName();
    }


}
