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
                "0123456666",
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
                "0123456788",
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
                "0123456999",
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

    @Test
    void searchByUserID() {
        AccountCreateDTO dto = new AccountCreateDTO(
                "0123456777",
                "123",
                "Son",
                "link",
                true,
                new Date(),
                UserRole.USER
        );
        Account account = new Account(dto);
        Account accountCreate = accountRepository.save(account).block();
        assertNotNull(accountCreate);

        Account accountSearch = accountRepository.searchByUserID(accountCreate.getProfile().getUserID()).block();
        assertNotNull(accountSearch);

        accountRepository.deleteById(account.getId()).block();
    }
}