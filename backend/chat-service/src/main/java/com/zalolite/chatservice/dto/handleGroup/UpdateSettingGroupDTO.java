package com.zalolite.chatservice.dto.handleGroup;

import com.zalolite.chatservice.dto.enums.TypeGroupMessage;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
public class UpdateSettingGroupDTO extends GroupDTO {
    private String idChat;
    private boolean isBoolean;

    public UpdateSettingGroupDTO(UUID id, TypeGroupMessage TGM, String idChat, boolean isBoolean) {
        super(id, TGM);
        this.idChat = idChat;
        this.isBoolean = isBoolean;
    }
}
