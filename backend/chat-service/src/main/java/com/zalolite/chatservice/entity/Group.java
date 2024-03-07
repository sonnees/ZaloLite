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
@Document(collection = "group")
public class Group {
    @Field(targetType = FieldType.STRING)
    @Id
    private UUID id;
    private String chatName;
    private PersonInfo owner;
    private List<PersonInfo> admin;
    private List<PersonInfo> members;
    private Date createAt;
    private String avatar;
    private GroupSetting setting;
}
