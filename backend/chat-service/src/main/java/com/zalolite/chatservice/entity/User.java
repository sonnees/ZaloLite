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

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "user")
public class User {
    @Field(targetType = FieldType.STRING)
    @Id
    private UUID id;
    private List<FriendRequest> friendRequests;
    private List<Conversation> conversations;

    public User(String id) {
        this.id = UUID.fromString(id);
        friendRequests = new ArrayList<>();
        conversations = new ArrayList<>();
    }

}
