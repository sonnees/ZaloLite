package com.zalolite.chatservice.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Document(collection = "chat")
public class Chat {
    @Field(targetType = FieldType.STRING)
    @Id
    private UUID id;
    private List<Delivery> deliveries;
    private List<Delivery> reads;
    private List<ChatActivity> chatActivity;

    public Chat(String id) {
        this.id = UUID.fromString(id);
        this.chatActivity = new ArrayList<>();
    }
}
