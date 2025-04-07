package com.hotel.backend.seguridad;

import lombok.Data;

@Data
public class AuthRequest {
    private String identifier; // puede ser email o username
    private String password;
}

