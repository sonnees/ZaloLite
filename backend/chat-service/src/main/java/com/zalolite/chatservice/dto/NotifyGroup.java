package com.zalolite.chatservice.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
public class NotifyGroup extends GroupDTO{
    private TypeNotify typeNotify;

    public NotifyGroup(UUID id, TypeGroupMessage TGM, TypeNotify typeNotify) {
        super(id, TGM);
        this.typeNotify = typeNotify;
    }
}
