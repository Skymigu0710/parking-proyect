package com.project.controllers;

import com.project.dto.LoginRequest;
import com.project.models.Role;
import com.project.models.User;
import com.project.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import com.project.repositories.UserRepository;
import com.project.security.JwtService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User request) {
        User user = authService.registerUser(
                request.getUsername(),
                request.getPassword(),
                request.getRole(),
                request.getCorreo(),
                request.getName(),
                request.getDireccion()
        );
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);


        User user = userRepository.findByUsername(request.getUsername()).get();

        String token = jwtService.generateToken(user.getUsername(),user.getRole().name());

        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("roles", user.getRole());
        response.put("password", user.getPassword());
        response.put("correo", user.getCorreo());
        response.put("name", user.getName());
        response.put("direccion", user.getDireccion());
        response.put("token", token);

        return ResponseEntity.ok(response);
    }




}