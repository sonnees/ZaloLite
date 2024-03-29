package com.zalolite.accountservice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import com.zalolite.accountservice.AccountRepository;
import com.zalolite.accountservice.dto.AccountCreateDTO;
import com.zalolite.accountservice.dto.AccountLoginDTO;
import com.zalolite.accountservice.dto.Field2DTO;
import com.zalolite.accountservice.dto.FieldDTO;
import com.zalolite.accountservice.entity.Account;
import com.zalolite.accountservice.entity.Profile;
import com.zalolite.accountservice.jwt.JwtService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.imgscalr.Scalr;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/auth")
@Slf4j
public class AuthController {
    private WebClient.Builder builder;
    private AccountRepository accountRepository;
    private JwtService jwtService;
    private ObjectMapper objectMapper;

    @GetMapping("/check-uniqueness-phone-number/{phoneNumber}")
    public Mono<ResponseEntity<String>> checkUniquenessPhoneNumber(@PathVariable String phoneNumber) throws RuntimeException {
        return accountRepository.searchByPhoneNumber(phoneNumber)
                .flatMap(account -> {
                    Profile profile = new Profile();
                    profile.setUserName(account.getProfile().getUserName());
                    try {
                        return Mono.just(ResponseEntity.status(409).body(objectMapper.writeValueAsString(profile)));
                    } catch (JsonProcessingException e) {
                        log.error("** "+ e);
                        return Mono.just(ResponseEntity.status(500).body("Error processing JSON"));
                    }
                }).switchIfEmpty(Mono.just(ResponseEntity.ok("")));
    }

    @PostMapping("/register")
    public Mono<ResponseEntity<String>> create(@RequestBody AccountCreateDTO accountCreateDTO){
        return accountRepository.insert(new Account(accountCreateDTO))
                .flatMap(result -> accountRepository.searchByPhoneNumber(accountCreateDTO.getPhoneNumber())
                        .flatMap(account -> {
                            WebClient webClient = builder.build();
                            return  webClient
                                    .post()
                                    .uri("http://CHAT-SERVICE/api/v1/user/create?id="+account.getProfile().getUserID())
                                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                                    .retrieve()
                                    .bodyToMono(Boolean.class)
                                    .flatMap(aBoolean -> {
                                        if(aBoolean) return Mono.just(ResponseEntity.status(200).body(""));
                                        else return Mono.just(ResponseEntity.status(500).body(""));
                                    });
                        }))
                .onErrorResume(e->Mono.just(ResponseEntity.status(409).body("")));
    }

    @PostMapping("/authenticate")
    public Mono<ResponseEntity<String>> login(@RequestBody AccountLoginDTO accountLoginDTO) {
        return accountRepository.searchByPhoneNumber(accountLoginDTO.getPhoneNumber())
                .flatMap(account -> {
                    if (!new BCryptPasswordEncoder().matches(accountLoginDTO.getPassword(), account.getPassword()))
                        return Mono.just(ResponseEntity.status(401).body(""));
                    String token = jwtService.generateToken(account);
                    FieldDTO oneFieldDTO = new FieldDTO(token);
                    try {
                        return Mono.just(ResponseEntity.status(200).body(objectMapper.writeValueAsString(oneFieldDTO)));
                    } catch (JsonProcessingException e) {
                        log.error("** "+ e);
                        return Mono.just(ResponseEntity.status(500).body("Error processing JSON"));
                    }
                })
                .switchIfEmpty(Mono.just(ResponseEntity.status(401).body("")));
    }

    @GetMapping("/check-token/{token}")
    public Mono<Boolean> checkToken(@PathVariable String token) {
        return Mono.just(jwtService.isTokenExpired(token));
    }

    @GetMapping("/get-userid/{token}")
    public Mono<String> getPhoneNumber(@PathVariable String token) {
        return accountRepository.searchByPhoneNumber(jwtService.extractUsername(token))
                .flatMap(account -> {
                    if(account!=null)
                        return Mono.just(account.getProfile().getUserID()+"");
                    else return Mono.just("");
                });
    }

    //true: pixel đen
    //cot x, hang y
    @GetMapping("/authenticate/qr-code")
    public ResponseEntity<String> loginQRCode() {
        String endpointWebSocket = UUID.randomUUID().toString();
        try {
            int width = 200;
            int height = 200;
            BitMatrix matrix = new MultiFormatWriter().encode(endpointWebSocket, BarcodeFormat.QR_CODE, width, height);
            BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
            for (int x = 0; x < width; x++) {
                for (int y = 0; y < height; y++) {
                    image.setRGB(x, y, matrix.get(x, y) ? 0xFF000000 : 0xFFFFFFFF);
                }
            }
            BufferedImage scaledImage = Scalr.crop(image, 30, 30, width-60, height-60);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ImageIO.write(scaledImage, "png", outputStream);
            byte[] imageBytes = outputStream.toByteArray();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            Field2DTO dto = new Field2DTO(endpointWebSocket, base64Image);
            return ResponseEntity.ok().body(objectMapper.writeValueAsString(dto));
        } catch (Exception e) {
            log.error("***" + e);
            return ResponseEntity.status(500).body("Gen QR code error");
        }
    }

    @PostMapping("/send-otp/{phoneNumber}")
    public Mono<String> sendOTP(@PathVariable String phoneNumber) {

        return Mono.empty();
    }
}
