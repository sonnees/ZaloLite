package com.zalolite.chatservice.dto.handleUser;

import com.zalolite.chatservice.dto.enums.TypeUserMessage;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserMessageDTO {
    private UUID id;
    private TypeUserMessage TUM;
}
