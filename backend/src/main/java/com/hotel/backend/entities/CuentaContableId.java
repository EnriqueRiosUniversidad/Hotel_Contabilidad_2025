package com.hotel.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CuentaContableId implements Serializable {

    private String codigo;

    @Column(name = "periodo_contable_id")
    private Integer periodoContableId;

    // Necesario para claves embebidas
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CuentaContableId that)) return false;
        return Objects.equals(codigo, that.codigo) &&
                Objects.equals(periodoContableId, that.periodoContableId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(codigo, periodoContableId);
    }
}
