package com.zalolite.accountservice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import com.zalolite.accountservice.AccountRepository;
import com.zalolite.accountservice.dto.AccountCreateDTO;
import com.zalolite.accountservice.dto.AccountLoginDTO;
import com.zalolite.accountservice.entity.Account;
import com.zalolite.accountservice.entity.Profile;
import com.zalolite.accountservice.jwt.JwtService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
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
    private AccountRepository accountRepository;
    private JwtService jwtService;
    private ObjectMapper objectMapper;

    @GetMapping("/check-uniqueness-phone-number/{phoneNumber}")
    public Mono<ResponseEntity<String>> checkUniquenessPhoneNumber(@PathVariable String phoneNumber) throws RuntimeException {
        return accountRepository.searchByPhoneNumber(phoneNumber)
                .flatMap(account -> {
                    if (account == null)
                        return Mono.just(ResponseEntity.ok(""));
                    Profile profile = new Profile();
                    profile.setUserName(account.getProfile().getUserName());
                    String json = "";
                    try {
                        json = objectMapper.writeValueAsString(profile);
                    } catch (JsonProcessingException e) {
                        return Mono.error(new RuntimeException(e));
                    }
                    return Mono.just(ResponseEntity.status(409).body(json));
                });
    }

    @PostMapping("/register")
    public Mono<ResponseEntity<String>> create(@RequestBody AccountCreateDTO accountCreateDTO){
        return accountRepository.insert(new Account(accountCreateDTO))
                .flatMap(result -> accountRepository.searchByPhoneNumber(accountCreateDTO.getPhoneNumber())
                        .flatMap(account -> {
                            String token = jwtService.generateToken(account);
                            return Mono.just(ResponseEntity.status(200).body(token));
                        }))
                .onErrorResume(e->Mono.just(ResponseEntity.status(409).body("")));
    }

    @GetMapping("/authenticate")
    public Mono<ResponseEntity<String>> login(@RequestBody AccountLoginDTO accountLoginDTO) {
        return accountRepository.searchByPhoneNumber(accountLoginDTO.getPhoneNumber())
                .flatMap(account -> {
                    if (account == null || !new BCryptPasswordEncoder().matches(accountLoginDTO.getPassword(), account.getPassword())) {
                        return Mono.just(ResponseEntity.status(401).body(""));
                    }
                    String token = jwtService.generateToken(account);
                    return Mono.just(ResponseEntity.status(200).body(token));
                })
                .switchIfEmpty(Mono.just(ResponseEntity.status(401).body("")));
    }

    @GetMapping("/check-token")
    public Mono<Boolean> checkToken(@RequestParam String token) {
        System.out.println(token);
        return Mono.just(jwtService.isTokenExpired(token));
    }

    @GetMapping("/authenticate/qr-code")
    public ResponseEntity<String> loginQRCode() {
        UUID uuid = UUID.randomUUID();

        String endpointWebSocket = "ws://localhost:8081/ws/auth/" + uuid;

        try {
            int width = 200;
            int height = 200;
            BitMatrix matrix = new MultiFormatWriter().encode(endpointWebSocket, BarcodeFormat.QR_CODE, width, height);
            BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);

            for (int x = 0; x < width; x++) {
                for (int y = 0; y < width; y++) {
                    image.setRGB(x, y, matrix.get(x, y) ? 0xFF000000 : 0xFFFFFFFF);
                }
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ImageIO.write(image, "png", outputStream);
            byte[] imageBytes = outputStream.toByteArray();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            return ResponseEntity.ok(base64Image);

        } catch (Exception e) {
            log.error("***" + e);
        }
        return ResponseEntity.status(404).body("");
    }
}
