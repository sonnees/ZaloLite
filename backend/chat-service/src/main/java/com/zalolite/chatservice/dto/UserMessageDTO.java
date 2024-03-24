package com.zalolite.chatservice.dto;

import com.zalolite.chatservice.entity.Content;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserMessageDTO {
    private UUID id;
    private TypeUserMessage TUM;
}
