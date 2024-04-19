package com.zalolite.chatservice.dto.handleGroup;

import com.zalolite.chatservice.dto.enums.TypeGroupMessage;
import lombok.*;

import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
@ToString
public class UpdateSettingGroupDTO extends GroupDTO {
    private String idChat;
    private boolean value;

    public UpdateSettingGroupDTO(UUID id, TypeGroupMessage TGM, String ws, String idChat, boolean value) {
        super(id, TGM, ws);
        this.idChat = idChat;
        this.value = value;
    }
}
