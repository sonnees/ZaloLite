package com.zalolite.accountservice.entity;

import com.zalolite.accountservice.dto.AccountCreateDTO;
import com.zalolite.accountservice.enums.AllowMessaging;
import com.zalolite.accountservice.enums.ShowBirthday;
import com.zalolite.accountservice.enums.Type;
import com.zalolite.accountservice.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Document(collection = "account")
public class Account implements UserDetails {
    @Field(targetType = FieldType.STRING)
    @Id
    private UUID id;
    @Indexed(unique = true)
    private String phoneNumber;
    private String pw;
    private Date createAt;
    private Type type;
    private Profile profile;
    private UserRole role;
    private Setting setting;

    public Account(AccountCreateDTO accountCreateDTO) {
        this.id = UUID.randomUUID();
        this.phoneNumber = accountCreateDTO.getPhoneNumber();
        this.pw = new BCryptPasswordEncoder().encode(accountCreateDTO.getPassword());
        this.createAt = new Date();
        this.type = Type.personal;
        this.profile = new Profile(
                UUID.randomUUID(),
                accountCreateDTO.getUserName(),
                accountCreateDTO.getGender(),
                accountCreateDTO.getBirthday(),
                accountCreateDTO.getAvatar(),
                "https://res.cloudinary.com/dj9ulywm8/image/upload/v1711532181/background2_kyjzut.jpg"
        );
        this.role = accountCreateDTO.getRole();
        this.setting = new Setting(
                AllowMessaging.EVERYONE,
                ShowBirthday.SHOW_DMY
        );
    }

    public Account(String phoneNumber) {
        this.id = UUID.randomUUID();
        this.phoneNumber = phoneNumber;
        this.pw = "";
        this.createAt = new Date();
        this.type = Type.personal;
        this.profile = new Profile();
        this.role = UserRole.USER;
        this.setting = new Setting();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    public Profile getProfile(String phoneNumber){
        if(this.phoneNumber.equals(phoneNumber))
            return this.profile;

        Profile temp = this.profile;
        switch (this.setting.getShowBirthday()){
            case NO -> temp.setBirthday(null);
            case SHOW_DM -> temp.setBirthday(new Date(0,temp.getBirthday().getMonth(),temp.getBirthday().getDay()));
        }
        return temp;
    }

    public Profile getProfile(){
        return this.profile;
    }

    @Override
    public String getPassword() {
        return this.getPw();
    }

    @Override
    public String getUsername() {
        return this.phoneNumber;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
