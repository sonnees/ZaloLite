package com.zalolite.chatservice.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@Getter
@Setter
public class Status {
    @Field(targetType = FieldType.STRING)
    private List<UUID> hidden;
    private Boolean recall;

    public Status() {
        this.hidden = new ArrayList<>();
        this.recall = false;
    }
}
