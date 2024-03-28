package com.zalolite.chatservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class GroupDTO {
    private UUID id;
    private TypeGroupMessage TGM;
}
