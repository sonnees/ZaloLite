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
<<<<<<< HEAD
import org.springframework.beans.factory.annotation.Autowired;
=======
>>>>>>> master
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
<<<<<<< HEAD

=======
>>>>>>> master
    public static void main(String[] args) {
        SpringApplication.run(AccountServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner commandLineRunner(){
        return new CommandLineRunner() {
            @Override
            public void run(String... args) throws Exception {
<<<<<<< HEAD
                Account account = accountRepository.searchByPhoneNumber("0123456789").block();
                if(account!=null) return;

                Mono<Account> save = accountRepository.save(new Account(
                        UUID.randomUUID(),
                        "0123456789",
                        new BCryptPasswordEncoder().encode("123"),
                        UUID.randomUUID(),
                        new Date(),
                        Type.personal,
                        new Profile(
                                "Nguyen Van Son",
                                false,
                                new Date(),
                                "https://cdn1.vectorstock.com/i/1000x1000/23/70/man-avatar-icon-flat-vector-19152370.jpg",
                                "https://giaiphapzalo.com/wp-content/uploads/2021/09/pagebg-1-1920x705.jpg"
=======
                Account account = accountRepository.searchByPhoneNumber("0000000000").block();
                if(account!=null) return;

                Mono<Account> save = accountRepository.save(new Account(
                        UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db9"),
                        "0000000000",
                        new BCryptPasswordEncoder().encode("123"),
                        new Date(),
                        Type.personal,
                        new Profile(
                                UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
                                "Tú Anh",
                                true,
                                new Date(),
                                "https://zalolite.s3.amazonaws.com/nam1.jpg",
                                "https://zalolite.s3.amazonaws.com/background1.jpg"
>>>>>>> master
                        ),
                        UserRole.USER,
                        new Setting(
                                AllowMessaging.EVERYONE,
                                ShowBirthday.SHOW_DMY
                        )
                ));
<<<<<<< HEAD
                log.info("** create account success: "+save.block().getId());

                Mono<Account> save1 = accountRepository.save(new Account(
                        UUID.randomUUID(),
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
=======

                log.info("** create account success: "+save.block().getId());

                Mono<Account> save1 = accountRepository.save(new Account(
                        UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db8"),
                        "0000000001",
                        new BCryptPasswordEncoder().encode("123"),
                        new Date(),
                        Type.personal,
                        new Profile(
                                UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db2"),
                                "Bảo Châu",
                                false,
                                new Date(),
                                "https://zalolite.s3.amazonaws.com/nu1.jpg",
                                "https://zalolite.s3.amazonaws.com/background3.jpg"
>>>>>>> master
                        ),
                        UserRole.USER,
                        new Setting(
                                AllowMessaging.EVERYONE,
                                ShowBirthday.NO
                        )
                ));
                log.info("** create account success: "+save1.block().getId());
<<<<<<< HEAD
=======

                Mono<Account> save2 = accountRepository.save(new Account(
                        UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db6"),
                        "0000000002",
                        new BCryptPasswordEncoder().encode("123"),
                        new Date(),
                        Type.personal,
                        new Profile(
                                UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db3"),
                                "Thảo Chi",
                                false,
                                new Date(),
                                "https://zalolite.s3.amazonaws.com/nu2.jpg",
                                "https://zalolite.s3.amazonaws.com/background2.jpg"
                        ),
                        UserRole.USER,
                        new Setting(
                                AllowMessaging.EVERYONE,
                                ShowBirthday.SHOW_DM
                        )
                ));
                log.info("** create account success: "+save2.block().getId());
>>>>>>> master
            }
        };
    }
}
