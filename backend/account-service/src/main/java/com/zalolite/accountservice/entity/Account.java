package com.zalolite.accountservice.entity;

import com.zalolite.accountservice.dto.AccountCreateDTO;
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

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
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
    @Field(targetType = FieldType.STRING)
    private UUID userID;
    private Date createAt;
    private Type type;
    private Profile profile;
    private UserRole role;

    public Account(AccountCreateDTO accountCreateDTO) {
        this.id = UUID.randomUUID();
        this.phoneNumber = accountCreateDTO.getPhoneNumber();
        this.pw = new BCryptPasswordEncoder().encode(accountCreateDTO.getPassword());
        this.userID = UUID.randomUUID();
        this.createAt = new Date();
        this.type = Type.personal;
        this.profile = new Profile(
                accountCreateDTO.getUserName(),
                accountCreateDTO.getGender(),
                accountCreateDTO.getBirthday(),
                accountCreateDTO.getGender() ? "https://cdn4.iconfinder.com/data/icons/circle-avatars-1/128/050_girl_avatar_profile_woman_suit_student_officer-2-1024.png" : "https://cdn1.vectorstock.com/i/1000x1000/23/70/man-avatar-icon-flat-vector-19152370.jpg",
                "https://giaiphapzalo.com/wp-content/uploads/2021/09/pagebg-1-1920x705.jpg"
        );
        this.role = accountCreateDTO.getRole();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    public UserRole getRole() {
        return role;
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
