package com.zalolite.accountservice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.accountservice.AccountRepository;
import com.zalolite.accountservice.dto.AccountCreateDTO;
import com.zalolite.accountservice.dto.AccountLoginDTO;
import com.zalolite.accountservice.dto.Field2DTO;
import com.zalolite.accountservice.entity.Account;
import com.zalolite.accountservice.enums.UserRole;
import com.zalolite.accountservice.jwt.JwtService;
import com.zalolite.accountservice.serialization.JsonConverter;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.Date;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock private ObjectMapper objectMapper;
    @Mock private JsonConverter jsonConverter;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private WebClient.Builder builder;
    @Mock private WebClient webClient;
    @Mock private AccountRepository accountRepository;
    @InjectMocks private AuthController authController;
    @Mock private JwtService jwtService;

    @Mock private WebClient.RequestBodyUriSpec requestBodyUriSpec;
    @Mock private WebClient.ResponseSpec responseSpec;

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
        verify(objectMapper).writeValueAsString(any());
    }

    @Test
    void create() throws JsonProcessingException{
        String phoneNumber = "01234555555";
        UUID userID = UUID.randomUUID();
        Account account = new Account(phoneNumber);
        account.getProfile().setUserID(userID);
        AccountCreateDTO accountCreateDTO = new AccountCreateDTO(
                phoneNumber, "123", "son","avatar",true, new Date(), UserRole.USER
        );

        when(builder.build()).thenReturn(webClient);
        when(webClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri("http://CHAT-SERVICE/api/v1/user/create?id=" + userID)).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(jsonConverter.objToString(any())).thenReturn("jsonConverter");
        when(accountRepository.save(any())).thenReturn(Mono.just(account));

        Mono<ResponseEntity<String>> result = authController.create(accountCreateDTO);

        StepVerifier.create(result)
                .expectNext(ResponseEntity.ok(""))
                .verifyComplete();

        verify(accountRepository).save(any());

    }

    @Test
    void login() throws JsonProcessingException{
        String phoneNumber = "0123456756";
        Account account = new Account(phoneNumber);
        AccountLoginDTO accountLoginDTO = new AccountLoginDTO(phoneNumber, "123");

        when(jsonConverter.objToString(any())).thenReturn("jsonConverter");
        when(objectMapper.writeValueAsString(any())).thenReturn("profileJson");
        when(accountRepository.searchByPhoneNumber(phoneNumber)).thenReturn(Mono.just(account));
        when(jwtService.generateToken(account)).thenReturn("token");
        when(passwordEncoder.matches(accountLoginDTO.getPassword(), "")).thenReturn(true);


        Mono<ResponseEntity<String>> result = authController.login(accountLoginDTO);

        StepVerifier.create(result)
                .expectNext(ResponseEntity.ok("profileJson"))
                .verifyComplete();

        verify(accountRepository).searchByPhoneNumber(phoneNumber);
        verify(objectMapper).writeValueAsString(any());
        verify(jwtService).generateToken(account);
        verify(passwordEncoder).matches(any(),any());
    }

    @Test
    void loginQRCode() throws JsonProcessingException{
        when(objectMapper.writeValueAsString(any())).thenReturn("Image64 Code");

        Mono<ResponseEntity<String>> result = authController.loginQRCode();

        StepVerifier.create(result)
                .expectNext(ResponseEntity.ok("Image64 Code"))
                .verifyComplete();

        verify(objectMapper).writeValueAsString(any());
    }

    @Test
    void resetPassword() throws JsonProcessingException{
        String phoneNumber = "0123456756";
        String pass = "321";
        Field2DTO dto = new Field2DTO(phoneNumber, pass);
        when(jsonConverter.objToString(any())).thenReturn("jsonConverter");
        when(accountRepository.changePassword(phoneNumber,pass)).thenReturn(Mono.just(1L));
        when(passwordEncoder.encode(any())).thenReturn(pass);

        Mono<ResponseEntity<String>> result = authController.resetPassword(dto);

        StepVerifier.create(result)
                .expectNext(ResponseEntity.ok("Success"))
                .verifyComplete();

        verify(accountRepository).changePassword(phoneNumber, pass);
        verify(passwordEncoder).encode(pass);

    }

}