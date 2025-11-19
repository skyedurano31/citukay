package com.citukay.ecommerce.controller;

import com.citukay.ecommerce.entity.User;
import com.citukay.ecommerce.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    private final UserService userService;

    public AuthController (UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        boolean success = userService.checkLogin(email, password);

        if (success) {
            return Map.of("success", true);
        } else {
            return Map.of("success", false, "error", "Invalid email or password");
        }
    }
}
