package com.zalolite.accountservice;

import com.zalolite.accountservice.entity.Account;
import com.zalolite.accountservice.entity.Profile;
import com.zalolite.accountservice.enums.Type;
import com.zalolite.accountservice.enums.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import reactor.core.publisher.Mono;

import java.util.Date;
import java.util.UUID;

@SpringBootApplication
public class AccountServiceApplication {

    @Autowired
    private AccountRepository accountRepository;

    public static void main(String[] args) {
        SpringApplication.run(AccountServiceApplication.class, args);
    }

//    @Bean
    CommandLineRunner commandLineRunner(){
        return new CommandLineRunner() {
            @Override
            public void run(String... args) throws Exception {
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
                        ),
                        UserRole.USER
                ));
                System.out.println(save.block().getId());

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
                        ),
                        UserRole.USER
                ));
                System.out.println(save1.block().getId());
            }
        };
    }
}
