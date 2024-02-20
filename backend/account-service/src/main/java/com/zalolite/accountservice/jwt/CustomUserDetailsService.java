package com.zalolite.accountservice.jwt;

import com.zalolite.accountservice.AccountRepository;
import com.zalolite.accountservice.entity.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@Primary
public class CustomUserDetailsService implements ReactiveUserDetailsService{

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public Mono<UserDetails> findByUsername(String username) {
        return accountRepository.searchByPhoneNumber(username)
                .flatMap(account -> {
                    if(account != null)
                        return Mono.just(
                            User.withUsername(account.getPhoneNumber())
                                    .password(account.getPassword())
                                    .roles(account.getRole().name())
                                    .build());
                    else return Mono.error(new UsernameNotFoundException("User not found"));
                });
    }

}
