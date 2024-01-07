package com.zalolite.usermanagementmicroservice.service;

import com.zalolite.usermanagementmicroservice.model.User;
import com.zalolite.usermanagementmicroservice.repository.UserRep;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
@AllArgsConstructor
public class UserService {
    private UserRep userRep;

    public Mono<User> insert(User user){
        return userRep.save(user);
    }

}
