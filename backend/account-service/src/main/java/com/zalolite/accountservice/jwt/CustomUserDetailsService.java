package com.zalolite.accountservice.jwt;

import com.zalolite.accountservice.AccountRepository;
import com.zalolite.accountservice.entity.Account;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.userdetails.ReactiveUserDetailsPasswordService;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@AllArgsConstructor
@Qualifier("customUserDetailsService")
public class CustomUserDetailsService implements ReactiveUserDetailsService, ReactiveUserDetailsPasswordService{

    private AccountRepository accountRepository;
    private PasswordEncoder passwordEncoder;

    @Override
    public Mono<UserDetails> findByUsername(String username) {
        Mono<Account> accountMono = accountRepository.findByPhoneNumber(username);
        if (accountMono!=null) {
            Account account = accountMono.block();
            assert account != null;
            return Mono.just(
                    User.withUsername(account.getPhoneNumber())
                    .password(account.getPassword())
                    .roles(account.getRole().name())
                    .build());
        } else {
            return Mono.error(new UsernameNotFoundException("User not found"));
        }
    }

    @Override
    public Mono<UserDetails> updatePassword(UserDetails user, String newPassword) {
        return findByUsername(user.getUsername())
                .map(existingUser -> User.withUserDetails(existingUser)
                        .password(passwordEncoder.encode(newPassword))
                        .build());
    }
}
