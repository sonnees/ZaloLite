package com.zalolite.chatservice.dto.handleGroup;

import com.zalolite.chatservice.dto.enums.TypeGroupMessage;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
public class AppendMemberGroupDTO extends GroupDTO {
    private UUID idChat;
    private UUID userID;
    private String userName;
    private String userAvatar;

    public AppendMemberGroupDTO(UUID id, TypeGroupMessage TGM, UUID idChat, UUID userID, String userName, String userAvatar) {
        super(id, TGM);
        this.idChat = idChat;
        this.userID = userID;
        this.userName = userName;
        this.userAvatar = userAvatar;
    }
}
