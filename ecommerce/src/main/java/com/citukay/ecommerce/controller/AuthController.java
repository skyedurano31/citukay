package com.citukay.ecommerce.controller;

import com.citukay.ecommerce.entity.User;
import com.citukay.ecommerce.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        System.out.println("🔐 Login attempt for: " + email);

        try {
            // Get user from service
            User user = userService.findByEmail(email);

            if (user != null && user.getPassword().equals(password)) {
                System.out.println("✅ Login successful for: " + email);

                // Return user data
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("id", user.getId());
                response.put("email", user.getEmail());
                response.put("firstName", user.getFirstName());
                response.put("lastName", user.getLastName());

                return response;
            } else {
                System.out.println("❌ Login failed - invalid credentials");
                return Map.of(
                        "success", false,
                        "error", "Invalid email or password"
                );
            }
        } catch (Exception e) {
            System.err.println("❌ Login error: " + e.getMessage());
            return Map.of(
                    "success", false,
                    "error", "Login failed: " + e.getMessage()
            );
        }
    }
}
