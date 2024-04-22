package com.zalolite.chatservice.dto.handleChat;

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
public class ChangeVoterDTO extends ChatMessageDTO{
    @Field(targetType = FieldType.STRING)
    private UUID votingID;
    private String oldName;
    private String newName;
    private PersonInfo voter;

    public ChangeVoterDTO(MessageAppendDTO dto) {
        super(dto.getId(), dto.getTCM());
        String[] arrStr = dto.getContents().get(0).getValue().split("@");
        this.votingID = UUID.fromString(arrStr[0]);
        this.oldName = arrStr[1];
        this.newName = arrStr[2];
        this.voter = new PersonInfo(dto.getUserID(), dto.getUserName(), dto.getUserAvatar());
    }
}
