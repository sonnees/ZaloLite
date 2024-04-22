package com.zalolite.chatservice.dto.handleChat;

import com.zalolite.chatservice.dto.enums.TypeGroupMessage;
import com.zalolite.chatservice.dto.handleGroup.GroupDTO;
import com.zalolite.chatservice.entity.Choice;
import com.zalolite.chatservice.entity.PersonInfo;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
public class VotingDTO extends ChatMessageDTO {
    private String name;
    private PersonInfo owner;
    private Date dateLock;
    private List<String> choices;
}
