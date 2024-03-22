package com.zalolite.chatservice.dto;

import com.zalolite.chatservice.entity.Content;
import com.zalolite.chatservice.entity.Status;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
@ToString
public class MessageAppendDTO extends ChatMessageDTO{
    private UUID userID;
    private String userAvatar;
    private Date timestamp;
    private UUID parentID;
    private List<Content> contents;
    private Status status;

    public MessageAppendDTO(UUID id, TypeChatMessage TCM, UUID userID, String userAvatar, Date timestamp, UUID parentID, List<Content> contents, Status status) {
        super(id, TCM);
        this.userID = userID;
        this.userAvatar = userAvatar;
        this.timestamp = timestamp;
        this.parentID = parentID;
        this.contents = contents;
        this.status = status;
    }
}
