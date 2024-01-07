package com.zalolite.singlechatmanagementmicroservice.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Document(collection = "SingleChat")
public class SingleChat {
    @Id
    @Field(name = "singleChatId")
    private String id;
}
