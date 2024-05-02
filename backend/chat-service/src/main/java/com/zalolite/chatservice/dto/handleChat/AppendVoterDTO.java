package com.zalolite.chatservice.dto.handleChat;

import com.zalolite.chatservice.dto.enums.TypeChatMessage;
import com.zalolite.chatservice.entity.PersonInfo;
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
public class AppendVoterDTO extends ChatMessageDTO{

    @Field(targetType = FieldType.STRING)
    private UUID votingID;
    private String name;
    private PersonInfo voter;

    public AppendVoterDTO(MessageAppendDTO dto) {
        super(dto.getId(), dto.getTCM());
        String[] arrStr = dto.getContents().get(0).getValue().split("@");
        this.votingID = UUID.fromString(arrStr[0]);
        this.name = arrStr[1];
        this.voter = new PersonInfo(dto.getUserID(), dto.getUserName(), dto.getUserAvatar());
    }
}
