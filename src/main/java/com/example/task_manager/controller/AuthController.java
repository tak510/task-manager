package com.example.task_manager.controller;

import com.example.task_manager.dto.AuthRequest;
import com.example.task_manager.dto.AuthResponse;
import com.example.task_manager.model.User;
import com.example.task_manager.security.JWTUtil;
import com.example.task_manager.service.UserDetailsServiceImpl;
import com.example.task_manager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody AuthRequest request) {
        Optional<User> existing = userService.findByEmail(request.getEmail());

        Map<String, String> response = new HashMap<>();
        if (existing.isPresent()) {
            response.put("message", "Email already in use.");
            return ResponseEntity.badRequest().body(response);
        }

        // Password Validation
        String password = request.getPassword();

        if (password == null || password.length() < 10) {
            response.put("message", "Password must be at least 10 characters long.");
            return ResponseEntity.badRequest().body(response);
        }

        // Check for at least one uppercase letter
        Pattern upperCasePattern = Pattern.compile(".*[A-Z].*");
        if (!upperCasePattern.matcher(password).matches()) {
            response.put("message", "Password must contain at least one uppercase letter.");
            return ResponseEntity.badRequest().body(response);
        }

        // Check for at least one symbol
        Pattern symbolPattern = Pattern.compile(".*[^a-zA-Z0-9].*");
        if (!symbolPattern.matcher(password).matches()) {
            response.put("message", "Password must contain at least one symbol.");
            return ResponseEntity.badRequest().body(response);
        }

        // Create a new User object from the request
        User newUser = new User();
        newUser.setEmail(request.getEmail());
        newUser.setPassword(request.getPassword());
        newUser.setFirstName(request.getFirstName());
        newUser.setLastName(request.getLastName());

        userService.registerUser(newUser);

        response.put("message", "User registration successful");
        return ResponseEntity.ok(response);
    }


    @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final String token = jwtUtil.generateToken(userDetails.getUsername());
        return ResponseEntity.ok(new AuthResponse(token));
    }
}