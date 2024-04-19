package com.zalolite.chatservice.dto.notify;

import com.zalolite.chatservice.dto.enums.TypeGroupMessage;
import com.zalolite.chatservice.dto.enums.TypeNotify;
import com.zalolite.chatservice.dto.handleGroup.GroupDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
public class NotifyGroup extends GroupDTO {
    private TypeNotify typeNotify;

    public NotifyGroup(UUID id, TypeGroupMessage TGM, String ws, TypeNotify typeNotify) {
        super(id, TGM, ws);
        this.typeNotify = typeNotify;
    }
}
