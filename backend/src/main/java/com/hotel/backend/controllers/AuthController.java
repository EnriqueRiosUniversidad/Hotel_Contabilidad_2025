package com.hotel.backend.controllers;

import com.hotel.backend.repository.UserRepository;
import com.hotel.backend.seguridad.CustomUserDetailsService;
import com.hotel.backend.seguridad.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.hotel.backend.seguridad.AuthRequest;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;



    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/debug-password")
    public ResponseEntity<?> debugPassword(@RequestBody AuthRequest request) {
        var user = userRepository.findByEmailOrUsername(request.getIdentifier(), request.getIdentifier());

        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }

        String raw = request.getPassword();
        String encoded = user.get().getPassword();

        System.out.println("🔑 Contraseña ingresada: " + raw);
        System.out.println("🧾 Hash desde DB: " + encoded);
        System.out.println("✅ Coinciden: " + passwordEncoder.matches(raw, encoded));

        return ResponseEntity.ok(Map.of(
                "input", raw,
                "stored", encoded,
                "match", passwordEncoder.matches(raw, encoded)
        ));
    }


    @GetMapping("/hash")
    public String generateHash() {
        String raw = "1234";
        String hash = passwordEncoder.encode(raw);
        System.out.println("🔐 Hash generado para '1234': " + hash);
        return hash;
    }



    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        System.out.println("🎯 Intentando login con: " + request.getIdentifier());

        // DEBUG extra
        UserDetails user2 = userDetailsService.loadUserByUsername(request.getIdentifier());
        System.out.println(" Password del usuario desde DB: " + user2.getPassword());

        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getIdentifier(),
                            request.getPassword()
                    )
            );
            System.out.println("✅ Autenticación exitosa");

            UserDetails user = userDetailsService.loadUserByUsername(request.getIdentifier());
            String token = jwtService.generateToken(user);
            System.out.println("🎫 Token generado: " + token);

            return ResponseEntity.ok(Map.of("token", token));
        } catch (Exception e) {
            System.out.println("❌ Error durante la autenticación: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Credenciales inválidas");
        }
    }
}


