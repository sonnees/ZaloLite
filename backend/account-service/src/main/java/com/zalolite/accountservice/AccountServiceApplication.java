package com.zalolite.accountservice;

import com.zalolite.accountservice.entity.Account;
import com.zalolite.accountservice.entity.Profile;
import com.zalolite.accountservice.entity.Setting;
import com.zalolite.accountservice.enums.AllowMessaging;
import com.zalolite.accountservice.enums.ShowBirthday;
import com.zalolite.accountservice.enums.Type;
import com.zalolite.accountservice.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import reactor.core.publisher.Mono;

import java.util.Date;
import java.util.UUID;

@Slf4j
@SpringBootApplication
@AllArgsConstructor
@EnableDiscoveryClient
public class AccountServiceApplication {

    private AccountRepository accountRepository;

    public static void main(String[] args) {
        SpringApplication.run(AccountServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner commandLineRunner(){
        return new CommandLineRunner() {
            @Override
            public void run(String... args) throws Exception {
                Account account = accountRepository.searchByPhoneNumber("0123456789").block();
                if(account!=null) return;

                Mono<Account> save = accountRepository.save(new Account(
                        UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db9"),
                        "0123456789",
                        new BCryptPasswordEncoder().encode("123"),
                        UUID.randomUUID(),
                        new Date(),
                        Type.personal,
                        new Profile(
                                "Nguyen Van Son",
                                true,
                                new Date(),
                                "https://cdn1.vectorstock.com/i/1000x1000/23/70/man-avatar-icon-flat-vector-19152370.jpg",
                                "https://giaiphapzalo.com/wp-content/uploads/2021/09/pagebg-1-1920x705.jpg"
                        ),
                        UserRole.USER,
                        new Setting(
                                AllowMessaging.EVERYONE,
                                ShowBirthday.SHOW_DMY
                        )
                ));
                log.info("** create account success: "+save.block().getId());

                Mono<Account> save1 = accountRepository.save(new Account(
                        UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db8"),
                        "0123456788",
                        new BCryptPasswordEncoder().encode("123"),
                        UUID.randomUUID(),
                        new Date(),
                        Type.personal,
                        new Profile(
                                "Nguyen Thi Son",
                                false,
                                new Date(),
                                "https://cdn4.iconfinder.com/data/icons/circle-avatars-1/128/050_girl_avatar_profile_woman_suit_student_officer-2-1024.png",
                                "https://giaiphapzalo.com/wp-content/uploads/2021/09/pagebg-1-1920x705.jpg"
                        ),
                        UserRole.USER,
                        new Setting(
                                AllowMessaging.EVERYONE,
                                ShowBirthday.NO
                        )
                ));
                log.info("** create account success: "+save1.block().getId());

                Mono<Account> save2 = accountRepository.save(new Account(
                        UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db6"),
                        "0123456777",
                        new BCryptPasswordEncoder().encode("123"),
                        UUID.randomUUID(),
                        new Date(),
                        Type.personal,
                        new Profile(
                                "Ha Ma Tau",
                                false,
                                new Date(),
                                "https://cdn4.iconfinder.com/data/icons/circle-avatars-1/128/050_girl_avatar_profile_woman_suit_student_officer-2-1024.png",
                                "https://giaiphapzalo.com/wp-content/uploads/2021/09/pagebg-1-1920x705.jpg"
                        ),
                        UserRole.USER,
                        new Setting(
                                AllowMessaging.EVERYONE,
                                ShowBirthday.SHOW_DM
                        )
                ));
                log.info("** create account success: "+save2.block().getId());
            }
        };
    }
}
