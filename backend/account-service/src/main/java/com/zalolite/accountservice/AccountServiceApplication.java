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
    CommandLineRunner commandLineRunner(){
        return new CommandLineRunner() {
            @Override
            public void run(String... args) throws Exception {
                Account account = accountRepository.searchByPhoneNumber("0000000000").block();
                if(account!=null) return;

                Mono<Account> save = accountRepository.save(new Account(
                        UUID.fromString("3000f6da-e5c7-43eb-9733-f772672779e2"),
                        "0000000000",
                        new BCryptPasswordEncoder().encode("123"),
                        new Date(),
                        Type.personal,
                        new Profile(
                                UUID.fromString("3000f6da-e5c7-43eb-9733-f772672779e1"),
                                "Tú Anh",
                                true,
                                new Date(),
                                "https://res.cloudinary.com/dj9ulywm8/image/upload/v1711532178/nam1_hyq0hl.jpg",
                                "https://res.cloudinary.com/dj9ulywm8/image/upload/v1711532181/background2_kyjzut.jpg"
                        ),
                        UserRole.USER,
                        new Setting(
                                AllowMessaging.EVERYONE,
                                ShowBirthday.SHOW_DMY
                        )
                ));

                log.info("** create account success: "+save.block().getId());

                Mono<Account> save1 = accountRepository.save(new Account(
                        UUID.fromString("0f1c6cdd-5d81-460b-8a39-02f19349e19f"),
                        "0000000001",
                        new BCryptPasswordEncoder().encode("123"),
                        new Date(),
                        Type.personal,
                        new Profile(
                                UUID.fromString("0f1c6cdd-5d81-460b-8a39-02f19349e18f"),
                                "Bảo Châu",
                                false,
                                new Date(),
                                "https://res.cloudinary.com/dj9ulywm8/image/upload/v1711532179/nu1_uq2zmu.png",
                                "https://res.cloudinary.com/dj9ulywm8/image/upload/v1711532181/background2_kyjzut.jpg"
                        ),
                        UserRole.USER,
                        new Setting(
                                AllowMessaging.EVERYONE,
                                ShowBirthday.NO
                        )
                ));
                log.info("** create account success: "+save1.block().getId());

                Mono<Account> save2 = accountRepository.save(new Account(
                        UUID.fromString("689d39dd-fbed-409f-9f53-626f250712f2"),
                        "0000000002",
                        new BCryptPasswordEncoder().encode("123"),
                        new Date(),
                        Type.personal,
                        new Profile(
                                UUID.fromString("689d39dd-fbed-409f-9f53-626f250712f1"),
                                "Thảo Chi",
                                false,
                                new Date(),
                                "https://res.cloudinary.com/dj9ulywm8/image/upload/v1711532179/nu1_uq2zmu.png",
                                "https://res.cloudinary.com/dj9ulywm8/image/upload/v1711532181/background2_kyjzut.jpg"
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
