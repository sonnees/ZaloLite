package com.zalolite.accountservice;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Scheduler;
import reactor.core.scheduler.Schedulers;

@RestController
@AllArgsConstructor
@RequestMapping("/api/account")
public class AccountController {
    private AccountRepository accountRepository;
    private ObjectMapper objectMapper;

    /**
     * link api: http://localhost:8081/api/account/check-uniqueness-phone-number/0123456789
     * {"userName":"Nguyen Van Son","gender":null,"birthday":null,"avatar":null,"background":null}
     * @param phoneNumber : 0123456789
     * @return : "" or {"userName":"Nguyen Van Son","gender":null,"birthday":null,"avatar":null,"background":null}
     * @throws JsonProcessingException :
     */
    @PostMapping("/check-uniqueness-phone-number/{phoneNumber}")
    public ResponseEntity<String> CheckUniquenessPhoneNumber(@PathVariable String phoneNumber) throws JsonProcessingException {
        Account account = accountRepository.searchByPhoneNumber(phoneNumber).block();
        if(account == null) return ResponseEntity.ok().body("");
        else {
            Profile profile = new Profile();
            profile.setUserName(account.getProfile().getUserName());
            String json = objectMapper.writeValueAsString(profile);
            return ResponseEntity.status(409).body(json);
        }
    }

    @PostMapping("/create")
    public Mono<ResponseEntity<String>> create(@RequestBody AccountCreateDTO accountCreateDTO){
        return accountRepository.insert(new Account(accountCreateDTO))
                .flatMap(result ->{
                    Mono.fromRunnable(()->{

                    }).subscribeOn(Schedulers.boundedElastic()).subscribe();
                    return Mono.just(ResponseEntity.ok().body("success"));
                })
                .onErrorResume(e->Mono.just(ResponseEntity.status(409).body("")));
    }

}

