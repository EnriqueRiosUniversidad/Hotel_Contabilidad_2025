package com.hotel.backend.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotel.backend.DTOs.CuentaContableDTO;
import com.hotel.backend.entities.TipoCuenta;
import com.hotel.backend.services.Cuenta_Service;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PlanDeCuentas_Controller.class)
public class PlanDeCuentas_ControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private Cuenta_Service cuentaService;

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

    @Test
    void testGetByIdCuenta() throws Exception {
        CuentaContableDTO dto = getSampleCuenta();
        when(cuentaService.getByIdCuenta(1L)).thenReturn(dto);

        mockMvc.perform(get("/plancuentas/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.codigo").value("1010"));
    }

    @Test
    void testGetByCodigoYPeriodo() throws Exception {
        CuentaContableDTO dto = getSampleCuenta();
        when(cuentaService.getByCodigoCuenta("1010", 1L)).thenReturn(dto);

        mockMvc.perform(get("/plancuentas/buscar")
                        .param("codigo", "1010")
                        .param("periodoId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Caja"));
    }

    @Test
    void testGetCuentas() throws Exception {
        when(cuentaService.getCuentas()).thenReturn(List.of(getSampleCuenta()));

        mockMvc.perform(get("/plancuentas/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Caja"));
    }

    @Test
    void testGetByPlan() throws Exception {
        when(cuentaService.getByPlan(1L)).thenReturn(List.of(getSampleCuenta()));

        mockMvc.perform(get("/plancuentas/plan/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].codigo").value("1010"));
    }

    @Test
    void testCrearCuenta() throws Exception {
        CuentaContableDTO dto = getSampleCuenta();
        when(cuentaService.crearCuenta(any())).thenReturn(dto);

        mockMvc.perform(post("/plancuentas/cuenta")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tipo").value("ACTIVO"));
    }

    @Test
    void testActualizarCuenta() throws Exception {
        CuentaContableDTO dto = getSampleCuenta();
        when(cuentaService.actualizarCuenta(eq(1L), any())).thenReturn(dto);

        mockMvc.perform(put("/plancuentas/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nivel").value(1));
    }

    @Test
    void testEliminarCuenta() throws Exception {
        mockMvc.perform(delete("/plancuentas/1"))
                .andExpect(status().isNoContent());
    }
}
