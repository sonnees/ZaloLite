package com.zalolite.accountservice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.accountservice.AccountRepository;
import com.zalolite.accountservice.dto.AccountChangePassword;
import com.zalolite.accountservice.entity.Account;
import com.zalolite.accountservice.entity.Profile;
import com.zalolite.accountservice.serialization.JsonConverter;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.TestSecurityContextHolder;
import org.springframework.security.test.context.support.ReactorContextTestExecutionListener;
import org.springframework.test.context.TestExecutionListener;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountControllerTest {

    @Mock private ObjectMapper objectMapper;
    @Mock private JsonConverter jsonConverter;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private Authentication authentication;
    @Mock private AccountRepository accountRepository;
    @InjectMocks private AccountController accountController;

    private final TestExecutionListener reactorContextTestExecutionListener = new ReactorContextTestExecutionListener();

    @BeforeEach
    public void setUp() throws Exception {
        when(authentication.getPrincipal()).thenReturn("0123456789");

        TestSecurityContextHolder.setAuthentication(authentication);
        reactorContextTestExecutionListener.beforeTestMethod(null);
    }

    @AfterEach
    public void tearDown() throws Exception {
        reactorContextTestExecutionListener.afterTestMethod(null);
    }

    @Test
    void getProfileByPhoneNumber() throws JsonProcessingException {
        String phoneNumber = "0123456789";
        Account account = new Account(phoneNumber);
        Profile profile =account.getProfile();

        when(objectMapper.writeValueAsString(any())).thenReturn("profileJson");
        when(accountRepository.searchByPhoneNumber(anyString())).thenReturn(Mono.just(account));

        Mono<ResponseEntity<String>> result = accountController.getProfileByPhoneNumber(phoneNumber);
        StepVerifier.create(result)
                .expectNext(ResponseEntity.ok("profileJson"))
                .verifyComplete();

        verify(objectMapper).writeValueAsString(profile);
        verify(accountRepository).searchByPhoneNumber(phoneNumber);
    }

    @Test
    void getAccount() throws JsonProcessingException{
        String phoneNumber = "0123456789";
        Account account = new Account(phoneNumber);

        when(objectMapper.writeValueAsString(any())).thenReturn("profileJson");
        when(accountRepository.searchByPhoneNumber(anyString())).thenReturn(Mono.just(account));

        Mono<ResponseEntity<String>> result = accountController.getAccount();
        StepVerifier.create(result)
                .expectNext(ResponseEntity.ok("profileJson"))
                .verifyComplete();

        verify(accountRepository).searchByPhoneNumber(phoneNumber);
    }

    @Test
    void changePassword() throws JsonProcessingException{
        String phoneNumber = "0123456789";
        AccountChangePassword accountChangePassword = new AccountChangePassword("123","321");
        Account account = new Account(phoneNumber);

        when(jsonConverter.objToString(any())).thenReturn("jsonConverter");
        when(passwordEncoder.matches(any(),any())).thenReturn(true);
        when(passwordEncoder.encode(any())).thenReturn("321");
        when(accountRepository.searchByPhoneNumber(anyString())).thenReturn(Mono.just(account));
        when(accountRepository.changePassword(anyString(),anyString())).thenReturn(Mono.just(1L));

        Mono<ResponseEntity<String>> result = accountController.changePassword(accountChangePassword);
        StepVerifier.create(result)
                .expectNext(ResponseEntity.ok("Success"))
                .verifyComplete();

        verify(accountRepository).searchByPhoneNumber(phoneNumber);
        verify(passwordEncoder).encode(accountChangePassword.getNewPass());
        verify(accountRepository).changePassword(account.getPhoneNumber(), accountChangePassword.getNewPass());
    }
}