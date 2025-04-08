package com.hotel.backend.seguridad;

import com.hotel.backend.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.hotel.backend.entities.User;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository repo;

    public CustomUserDetailsService(UserRepository repo) {
        this.repo = repo;
    }

    @Override
    public UserDetails loadUserByUsername(String identifier) {

        return repo.findByEmailOrUsername(identifier, identifier)
                .map(user -> new org.springframework.security.core.userdetails.User(
                        user.getUsername(), user.getPassword(),
                        List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().getName().toUpperCase()))
                )).orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
    }
}