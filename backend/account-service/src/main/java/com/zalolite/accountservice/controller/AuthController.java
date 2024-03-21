package com.zalolite.accountservice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import com.zalolite.accountservice.AccountRepository;
import com.zalolite.accountservice.dto.AccountCreateDTO;
import com.zalolite.accountservice.dto.AccountLoginDTO;
<<<<<<< HEAD
=======
import com.zalolite.accountservice.dto.OneFieldDTO;
>>>>>>> master
import com.zalolite.accountservice.entity.Account;
import com.zalolite.accountservice.entity.Profile;
import com.zalolite.accountservice.jwt.JwtService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
<<<<<<< HEAD
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
=======
import org.imgscalr.Scalr;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
>>>>>>> master
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
<<<<<<< HEAD
=======
    private WebClient.Builder builder;
>>>>>>> master
    private AccountRepository accountRepository;
    private JwtService jwtService;
    private ObjectMapper objectMapper;

<<<<<<< HEAD
    @PostMapping("/check-uniqueness-phone-number/{phoneNumber}")
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
=======
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
>>>>>>> master
    }

    @PostMapping("/register")
    public Mono<ResponseEntity<String>> create(@RequestBody AccountCreateDTO accountCreateDTO){
        return accountRepository.insert(new Account(accountCreateDTO))
                .flatMap(result -> accountRepository.searchByPhoneNumber(accountCreateDTO.getPhoneNumber())
                        .flatMap(account -> {
<<<<<<< HEAD
                            String token = jwtService.generateToken(account);
                            return Mono.just(ResponseEntity.status(200).body(token));
=======
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
>>>>>>> master
                        }))
                .onErrorResume(e->Mono.just(ResponseEntity.status(409).body("")));
    }

    @PostMapping("/authenticate")
    public Mono<ResponseEntity<String>> login(@RequestBody AccountLoginDTO accountLoginDTO) {
        return accountRepository.searchByPhoneNumber(accountLoginDTO.getPhoneNumber())
                .flatMap(account -> {
<<<<<<< HEAD
                    if (account == null || !new BCryptPasswordEncoder().matches(accountLoginDTO.getPassword(), account.getPassword())) {
                        return Mono.just(ResponseEntity.status(401).body(""));
                    }
                    String token = jwtService.generateToken(account);
                    return Mono.just(ResponseEntity.status(200).body(token));
=======
                    if (!new BCryptPasswordEncoder().matches(accountLoginDTO.getPassword(), account.getPassword()))
                        return Mono.just(ResponseEntity.status(401).body(""));
                    String token = jwtService.generateToken(account);
                    OneFieldDTO oneFieldDTO = new OneFieldDTO(token);
                    try {
                        return Mono.just(ResponseEntity.status(200).body(objectMapper.writeValueAsString(oneFieldDTO)));
                    } catch (JsonProcessingException e) {
                        log.error("** "+ e);
                        return Mono.just(ResponseEntity.status(500).body("Error processing JSON"));
                    }
>>>>>>> master
                })
                .switchIfEmpty(Mono.just(ResponseEntity.status(401).body("")));
    }

<<<<<<< HEAD
    @PostMapping("/authenticate/qr-code")
    public ResponseEntity<String> loginQRCode() {
        UUID uuid = UUID.randomUUID();

        String endpointWebSocket = "ws://localhost:8081/ws/auth/" + uuid;

=======
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

    @GetMapping("/authenticate/qr-code")
    public ResponseEntity<String> loginQRCode() {
        UUID uuid = UUID.randomUUID();
        String endpointWebSocket = "ws://localhost:8081/ws/auth/" + uuid;
>>>>>>> master
        try {
            int width = 200;
            int height = 200;
            BitMatrix matrix = new MultiFormatWriter().encode(endpointWebSocket, BarcodeFormat.QR_CODE, width, height);
            BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);

            for (int x = 0; x < width; x++) {
<<<<<<< HEAD
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
=======
                for (int y = 0; y < height; y++) {
                    image.setRGB(x, y, matrix.get(x, y) ? 0xFF000000 : 0xFFFFFFFF);
                }
            }
            BufferedImage scaledImage = Scalr.crop(image, 30, 30, width-60, height-60);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ImageIO.write(scaledImage, "png", outputStream);
            byte[] imageBytes = outputStream.toByteArray();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);

            OneFieldDTO oneFieldDTO = new OneFieldDTO(base64Image);

            return ResponseEntity.ok().body(objectMapper.writeValueAsString(oneFieldDTO));

        } catch (Exception e) {
            log.error("***" + e);
            return ResponseEntity.status(500).body("Gen QR code error");
        }
>>>>>>> master
    }
}
