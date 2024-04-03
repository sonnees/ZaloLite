package com.zalolite.chatservice.dto;

import com.zalolite.chatservice.entity.PersonInfo;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
public class DeleteGroupDTO extends GroupDTO{
    private String idChat;

    public DeleteGroupDTO(UUID id, TypeGroupMessage TGM, String idChat) {
        super(id, TGM);
        this.idChat = idChat;
    }
}
