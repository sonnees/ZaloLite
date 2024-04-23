package com.zalolite.chatservice.entity;

import com.zalolite.chatservice.dto.handleChat.VotingDTO;
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

    public Voting(VotingDTO dto) {
        this.id = UUID.randomUUID();
        this.name = dto.getName();
        this.owner = dto.getOwner();
        this.dateCreate = new Date();
        this.dateLock = dto.getDateLock();
        List<Choice> list = new ArrayList<>();
        Choice choice = null;
        for(String name : dto.getChoices()){
            choice = new Choice(name);
            list.add(choice);
        }
        this.choices = list;
        this.lock = false;
        this.dateLock = null;
    }
}
