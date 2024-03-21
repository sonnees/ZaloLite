package com.zalolite.accountservice.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
<<<<<<< HEAD
import java.util.Date;
=======
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.Date;
import java.util.UUID;
>>>>>>> master

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Profile {
<<<<<<< HEAD
=======
    @Field(targetType = FieldType.STRING)
    private UUID userID;
>>>>>>> master
    private String userName;
    private Boolean gender;
    private Date birthday;
    private String avatar;
    private String background;
}
