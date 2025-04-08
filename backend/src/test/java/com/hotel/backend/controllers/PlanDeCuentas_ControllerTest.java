package com.hotel.backend.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotel.backend.DTOs.CuentaContableDTO;
import com.hotel.backend.entities.TipoCuenta;
import com.hotel.backend.services.Cuenta_Service;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class PlanDeCuentas_ControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private Cuenta_Service cuentaService;

    private String jwtToken;

    private CuentaContableDTO getSampleCuenta() {
        CuentaContableDTO dto = new CuentaContableDTO();
        dto.setCodigo("1010");
        dto.setNombre("Caja");
        dto.setTipo(TipoCuenta.ACTIVO);
        dto.setNivel(1);
        dto.setCuentaPadreId(null);
        dto.setPeriodoContableId(1L);
        return dto;
    }

    @BeforeEach
    void authenticateAndGetToken() throws Exception {
        String loginRequest = "{\"identifier\": \"contador@email.com\", \"password\": \"1234\"}";

        String response = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginRequest))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JsonNode jsonNode = objectMapper.readTree(response);
        jwtToken = jsonNode.get("token").asText();
    }

    @Test
    void testGetByIdCuenta() throws Exception {
        CuentaContableDTO dto = getSampleCuenta();
        when(cuentaService.getByIdCuenta(1L)).thenReturn(dto);

        mockMvc.perform(get("/plancuentas/1")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.codigo").value("1010"));
    }

    @Test
    void testCrearCuenta() throws Exception {
        CuentaContableDTO dto = getSampleCuenta();
        when(cuentaService.crearCuenta(any())).thenReturn(dto);

        mockMvc.perform(post("/plancuentas/cuenta")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tipo").value("ACTIVO"));
    }

    @Test
    void testEliminarCuenta() throws Exception {
        doNothing().when(cuentaService).eliminarCuenta(1L);

        mockMvc.perform(delete("/plancuentas/1")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNoContent());
    }


}
