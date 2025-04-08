package com.hotel.backend.seguridad;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthFilter(JwtService jwtService, CustomUserDetailsService uds) {
        this.jwtService = jwtService;
        this.userDetailsService = uds;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getServletPath();
        System.out.println("🔍 Request path: " + path);

        // EXCEPCIÓN PARA /auth/**
        if (path.startsWith("/auth")) {
            System.out.println("✅ Ruta pública detectada, sin necesidad de JWT");
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        System.out.println("🧾 Authorization header: " + authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("❌ No hay token o formato inválido");
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);
        System.out.println("🔐 Token extraído: " + token);

        final String username = jwtService.extractUsername(token);
        System.out.println("👤 Usuario extraído del token: " + username);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            System.out.println("✅ Usuario cargado: " + userDetails.getUsername());

            if (jwtService.isTokenValid(token, userDetails)) {
                System.out.println("✅ Token válido para el usuario");

                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());

                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            } else {
                System.out.println("❌ Token inválido para este usuario");
            }
        } else {
            System.out.println("⚠ Usuario ya autenticado o username nulo");
        }

        filterChain.doFilter(request, response);
    }
}
