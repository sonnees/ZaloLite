package com.zalolite.chatservice.dto.handleGroup;

import com.zalolite.chatservice.dto.enums.TypeGroupMessage;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
public class ChangeNameChatGroupDTO extends GroupDTO {
    private String idChat;
    private String chatName;

    public ChangeNameChatGroupDTO(UUID id, TypeGroupMessage TGM, String idChat, String chatName) {
        super(id, TGM);
        this.idChat = idChat;
        this.chatName = chatName;
    }
}
