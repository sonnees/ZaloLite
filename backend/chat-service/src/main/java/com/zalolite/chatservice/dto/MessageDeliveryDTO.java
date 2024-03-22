package com.zalolite.chatservice.dto;

<<<<<<< HEAD
=======
import com.zalolite.chatservice.entity.Content;
import com.zalolite.chatservice.entity.Status;
>>>>>>> master
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

<<<<<<< HEAD
=======
import java.util.Date;
import java.util.List;
>>>>>>> master
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

    public MessageDeliveryDTO(UUID id, TypeChatMessage TCM, UUID userID, UUID messageID, String userAvatar) {
        super(id, TCM);
        this.userID = userID;
        this.messageID = messageID;
        this.userAvatar = userAvatar;
    }

    public MessageDeliveryDTO(UUID userID,UUID messageID, String userAvatar) {
        this.messageID = messageID;
        this.userAvatar = userAvatar;
        this.userID = userID;
    }
<<<<<<< HEAD

    public MessageDeliveryDTO(MessageAppendDTO m, UUID messageID) {
        super(m.getId(), m.getTCM());
        this.userID = m.getUserID();
        this.messageID = messageID;
        this.userAvatar = m.getUserAvatar();
    }


=======
>>>>>>> master
}
