package com.zalolite.chatservice.entity;

import com.zalolite.chatservice.dto.handleGroup.CreateGroupDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.ArrayList;
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

    public Group(CreateGroupDTO g) {
        this.id = g.getId();
        this.chatName = g.getChatName();
        this.owner = g.getOwner();
        this.admin = new ArrayList<>();
        this.members = g.getMembers();
        this.createAt = new Date();
        this.avatar = g.getAvatar();
        this.setting = new GroupSetting();
    }
}
