package com.zalolite.usermanagementmicroservice.controller;

import com.zalolite.usermanagementmicroservice.model.User;
import com.zalolite.usermanagementmicroservice.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@AllArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private UserService userService;

    @PostMapping("/insert")
    public Mono<User> insert(
            @RequestBody User user
    ){
        return userService.insert(user);
    }
}
