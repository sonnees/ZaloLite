package com.zalolite.accountservice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.accountservice.AccountRepository;
import com.zalolite.accountservice.entity.Account;
import com.zalolite.accountservice.entity.Profile;
import com.zalolite.accountservice.serialization.JsonConverter;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private ObjectMapper objectMapper;
    @Mock private JsonConverter jsonConverter;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private AccountRepository accountRepository;
    @InjectMocks
    private AuthController authController;

    @BeforeEach
    public void setUp() throws Exception {
    }

    @AfterEach
    public void tearDown() throws Exception {
    }

    @Test
    void checkUniquenessPhoneNumber() throws JsonProcessingException {
        String phoneNumber = "0123456789";
        Account account = new Account(phoneNumber);

        when(objectMapper.writeValueAsString(any())).thenReturn("profileJson");
        when(accountRepository.searchByPhoneNumber(anyString())).thenReturn(Mono.just(account));

        Mono<ResponseEntity<String>> result = authController.checkUniquenessPhoneNumber(phoneNumber);
        StepVerifier.create(result)
                .expectNext(ResponseEntity.status(409).body("profileJson"))
                .verifyComplete();

        verify(accountRepository).searchByPhoneNumber(phoneNumber);
    }

    @Test
    void create() {
    }

    @Test
    void login() {
    }

    @Test
    void loginQRCode() {
    }

    @Test
    void resetPassword() {
    }

    @Test
    void checkToken() {
    }

    @Test
    void getPhoneNumber() {
    }
}