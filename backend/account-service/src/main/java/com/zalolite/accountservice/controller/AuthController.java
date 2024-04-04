package com.zalolite.accountservice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import com.zalolite.accountservice.AccountRepository;
import com.zalolite.accountservice.dto.*;
import com.zalolite.accountservice.entity.Account;
import com.zalolite.accountservice.entity.Profile;
import com.zalolite.accountservice.jwt.JwtService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.imgscalr.Scalr;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.Arrays;
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
    private PasswordEncoder passwordEncoder;

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
        log.info("** create");
        return accountRepository.save(new Account(accountCreateDTO))
                .switchIfEmpty(Mono.defer(()->Mono.error(() -> new Throwable("new account failed"))))
                .flatMap(result -> {
                    WebClient webClient = builder.build();
                    return  webClient
                            .post()
                            .uri("http://CHAT-SERVICE/api/v1/user/create?id="+result.getProfile().getUserID())
                            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                            .retrieve()
                            .bodyToMono(Boolean.class)
                            .switchIfEmpty(Mono.defer(()->Mono.error(() -> new Throwable("new user failed"))))
                            .flatMap(aBoolean -> {
                                if(aBoolean) return Mono.just(ResponseEntity.status(200).body(""));
                                else return Mono.just(ResponseEntity.status(500).body(""));
                            });
                })
                .onErrorResume(e->Mono.just(ResponseEntity.status(409).body(Arrays.toString(e.getStackTrace()))));
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

    @PostMapping("/reset-password")
    public Mono<ResponseEntity<String>> resetPassword(@RequestBody Field2DTO dto){
        return accountRepository.changePassword(dto.getField1(), passwordEncoder.encode(dto.getField2()))
                .switchIfEmpty(Mono.empty())
                .flatMap(aLong -> {
                     if(aLong<=0) {
                         log.error("** change password");
                         return Mono.just(ResponseEntity.status(403).body("Error"));
                     }
                        return Mono.just(ResponseEntity.ok("Success"));
                });
    }
}
