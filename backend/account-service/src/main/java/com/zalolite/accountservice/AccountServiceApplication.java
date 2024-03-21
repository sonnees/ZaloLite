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
        CommandLineRunner commandLineRunner() {
                return new CommandLineRunner() {
                        @Override
                        public void run(String... args) throws Exception {
                                Account account = accountRepository.searchByPhoneNumber("0000000000").block();
                                if (account != null)
                                        return;

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
                                                                "https://zalolite.s3.amazonaws.com/background1.jpg"),
                                                UserRole.USER,
                                                new Setting(
                                                                AllowMessaging.EVERYONE,
                                                                ShowBirthday.SHOW_DMY)));

                                log.info("** create account success: " + save.block().getId());

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
                                                                "https://zalolite.s3.amazonaws.com/background3.jpg"),
                                                UserRole.USER,
                                                new Setting(
                                                                AllowMessaging.EVERYONE,
                                                                ShowBirthday.NO)));
                                log.info("** create account success: " + save1.block().getId());

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
                                                                "https://zalolite.s3.amazonaws.com/background2.jpg"),
                                                UserRole.USER,
                                                new Setting(
                                                                AllowMessaging.EVERYONE,
                                                                ShowBirthday.SHOW_DM)));
                                log.info("** create account success: " + save2.block().getId());
                        }
                };
        }
}