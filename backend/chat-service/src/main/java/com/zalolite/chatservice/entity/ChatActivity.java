package com.zalolite.chatservice.entity;

import com.zalolite.chatservice.dto.ChatActivityDTO;
import com.zalolite.chatservice.dto.MessageAppendDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.web.reactive.socket.WebSocketMessage;

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
//    @Indexed(unique = true)
    private Date timestamp;
    @Field(targetType = FieldType.STRING)
    private UUID parentID;
    private List<Content> contents;
    private Status status;

    public ChatActivity(ChatActivityDTO chatActivityDTO) {
        this.userID = chatActivityDTO.getUserID();
        this.parentID = chatActivityDTO.getParentID();
        this.contents = chatActivityDTO.getContents();

        this.timestamp = new Date();
        this.messageID = UUID.randomUUID();
        this.status = new Status(userID,chatActivityDTO.getUserAvatar());
    }

    public ChatActivity(MessageAppendDTO m) {
        this.userID = m.getUserID();
        this.parentID = m.getParentID();
        this.contents = m.getContents();
        this.timestamp = m.getTimestamp();

        this.messageID = UUID.randomUUID();
        this.status = new Status(m.getUserID(), m.getUserAvatar());
    }
}
