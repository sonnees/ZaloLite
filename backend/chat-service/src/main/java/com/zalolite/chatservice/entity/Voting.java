package com.zalolite.chatservice.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Document(collection = "voting")
public class Voting {
    @Field(targetType = FieldType.STRING)
    @Id
    private UUID id;
    private String name;
    private PersonInfo owner;
    private Date dateCreate;
    private Date dateLock;
    private List<Choice> choices;
    private boolean lock;
}
