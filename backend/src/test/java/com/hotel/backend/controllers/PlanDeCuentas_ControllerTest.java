package com.hotel.backend.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotel.backend.DTOs.CuentaContableDTO;
import com.hotel.backend.entities.TipoCuenta;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase
@Sql(scripts = "/data-test.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
class PlanDeCuentas_ControllerTest {
/*
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

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
        String loginRequest = """
            {
                "identifier": "contador@email.com",
                "password": "1234"
            }
        """;

        String response = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginRequest))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JsonNode jsonNode = objectMapper.readTree(response);
        jwtToken = "Bearer " + jsonNode.get("token").asText();
    }

    @Test
    void testGetByIdCuenta_Unauthed() throws Exception {
        mockMvc.perform(get("/plancuentas/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    void testGetByIdCuenta() throws Exception {
        CuentaContableDTO dto = getSampleCuenta();

        mockMvc.perform(post("/plancuentas/cuenta")
                        .header("Authorization", jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/plancuentas/1")
                        .header("Authorization", jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.codigo").value("1010"));
    }

    @Test
    void testCrearCuenta() throws Exception {
        CuentaContableDTO dto = getSampleCuenta();

        mockMvc.perform(post("/plancuentas/cuenta")
                        .header("Authorization", jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tipo").value("ACTIVO"));
    }

    @Test
    void testEliminarCuenta() throws Exception {
        CuentaContableDTO dto = getSampleCuenta();

        // Primero crear
        String response = mockMvc.perform(post("/plancuentas/cuenta")
                        .header("Authorization", jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andReturn().getResponse().getContentAsString();

        JsonNode created = objectMapper.readTree(response);
        Long id = created.get("id").asLong();


        mockMvc.perform(delete("/plancuentas/" + id)
                        .header("Authorization", jwtToken))
                .andExpect(status().isNoContent());
    }
    */
}
