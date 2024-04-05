package com.zalolite.accountservice;

import com.zalolite.accountservice.dto.AccountCreateDTO;
import com.zalolite.accountservice.entity.Account;
import com.zalolite.accountservice.enums.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class AccountRepositoryTest {
    @Autowired
    AccountRepository accountRepository;

    @Test
    void searchByPhoneNumber() {
        AccountCreateDTO dto = new AccountCreateDTO(
                "1212121212",
                "123",
                "Son",
                "link",
                true,
                new Date(),
                UserRole.USER
        );
        accountRepository.save(new Account(dto)).block();

        Account searchByPhoneNumber  = accountRepository.searchByPhoneNumber(dto.getPhoneNumber()).block();

        assertNotNull(searchByPhoneNumber);
        accountRepository.deleteById(searchByPhoneNumber.getId()).block();
    }

    @Test
    void changePassword() {
        AccountCreateDTO dto = new AccountCreateDTO(
                "1212121212",
                "123",
                "Son",
                "link",
                true,
                new Date(),
                UserRole.USER
        );
        Account account = new Account(dto);
        accountRepository.save(account).block();

        String newPass = "321";
        Long block = accountRepository.changePassword(dto.getPhoneNumber(), newPass ).block();

        assertNotNull(block);
        assertTrue(block>0);

        accountRepository.deleteById(account.getId()).block();
    }

    @Test
    void changeAvatar() {
        AccountCreateDTO dto = new AccountCreateDTO(
                "1212121212",
                "123",
                "Son",
                "link",
                true,
                new Date(),
                UserRole.USER
        );
        Account account = new Account(dto);
        accountRepository.save(account).block();

        String newAvatar = "new avatar";
//        Long block = accountRepository.changeAvatar(account.getPhoneNumber(), newAvatar).block();

//        assertNotNull(block);
//        assertTrue(block>0);

        accountRepository.deleteById(account.getId()).block();
    }
}