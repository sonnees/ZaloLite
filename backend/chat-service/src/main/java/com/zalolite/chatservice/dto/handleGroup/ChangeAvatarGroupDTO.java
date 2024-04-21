package com.zalolite.chatservice.dto.handleGroup;

import com.zalolite.chatservice.dto.enums.TypeGroupMessage;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
public class ChangeAvatarGroupDTO extends GroupDTO {
    private String idChat;
    private String avatar;

    public ChangeAvatarGroupDTO(UUID id, TypeGroupMessage TGM, String ws, String idChat, String avatar) {
        super(id, TGM, ws);
        this.idChat = idChat;
        this.avatar = avatar;
    }
}
