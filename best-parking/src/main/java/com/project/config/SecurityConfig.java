package com.project.config;

import com.project.security.JwtAuthFilter;
import com.project.services.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;
    private final JwtAuthFilter jwtAuthFilter;
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
      return http.csrf(csrf -> csrf.disable())
                      .cors( cors -> cors.configurationSource(request ->{
                                  var corsConfig = new CorsConfiguration();
                                  corsConfig.setAllowedOrigins(List.of(
                                          "http://localhost:5173",
                                          "http://192.168.18.24:5173" )); // <-- tu celular en la red local));
                                  corsConfig.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
                                  corsConfig.setAllowedHeaders(List.of("*"));
                                  return corsConfig;
                      }   ))
              .sessionManagement(session ->
                      session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
              )
              .authorizeHttpRequests(auth -> auth
                      .requestMatchers("/api/auth/**").permitAll() // Debe estar permitido
                      .requestMatchers("/api/tickets/**").authenticated()
                      .requestMatchers("/api/tickets/ingresos/**").authenticated()
                      .requestMatchers("/api/pagos/**").authenticated()
                      .requestMatchers("/api/abonado/**").authenticated()
                      .anyRequest().authenticated()
              )
              .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
              .build();
    }

}
