package com.zalolite.chatservice.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Choice {
    private String name;
    private List<PersonInfo> voters;

    public Choice(String name) {
        this.name = name;
        this.voters = new ArrayList<>();
    }
}
