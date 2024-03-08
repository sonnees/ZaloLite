package com.zalolite.accountservice.dto;

import com.zalolite.accountservice.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AccountCreateDTO {
    private String phoneNumber;
    private String password;
    private String userName;
    private Boolean gender;
    private Date birthday;
    private UserRole role;
}

// map struct mvn