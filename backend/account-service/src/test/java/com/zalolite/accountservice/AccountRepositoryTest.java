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

    @Test //1
    void searchByPhoneNumber_NotNull() {
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

    @Test //2
    void searchByPhoneNumber_Null() {
        Account searchByPhoneNumber  = accountRepository.searchByPhoneNumber("000000").block();
        assertNull(searchByPhoneNumber);
    }

    @Test //3
    void changePassword_NotNull() {
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

    @Test //4
    void changePassword_Null() {
        String newPass = "321";
        Long block = accountRepository.changePassword("0000", newPass ).block();

        assertNotNull(block);
    }

    @Test //5
    void changeAvatar_NotNull() {
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
        Account account1 = accountRepository.save(account).block();
        assert account1 != null;
        account1.getProfile().setAvatar("new avatar");

        Long block = accountRepository.changeAvatar(account.getPhoneNumber(), account1.getProfile()).block();

        assertNotNull(block);
        assertTrue(block>0);

        accountRepository.deleteById(account.getId()).block();
    }

    @Test //6
    void changeAvatar_Null() {
        AccountCreateDTO dto = new AccountCreateDTO(
                "00000",
                "123",
                "Son",
                "link",
                true,
                new Date(),
                UserRole.USER
        );
        Account account = new Account(dto);
        Account account1 = accountRepository.save(account).block();
        assert account1 != null;
        account1.getProfile().setAvatar("new avatar");

        Long block = accountRepository.changeAvatar(account.getPhoneNumber(), account1.getProfile()).block();

        assertNotNull(block);
        assertTrue(block>0);

        accountRepository.deleteById(account.getId()).block();
    }
}