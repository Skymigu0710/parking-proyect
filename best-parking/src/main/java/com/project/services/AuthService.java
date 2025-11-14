package com.project.services;

import com.project.models.Role;
import com.project.models.User;
import com.project.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(String username, String password, Role role, String correo, String name, String direccion) {
        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .role(role != null ? role : Role.OPERATOR)
                .correo(correo)
                .name(name)
                .direccion(direccion)
                .enabled(true)
                .build();

        return userRepository.save(user);
    }
}