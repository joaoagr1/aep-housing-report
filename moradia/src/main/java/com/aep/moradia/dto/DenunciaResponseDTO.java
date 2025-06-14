package com.aep.moradia.dto;

import com.aep.moradia.domain.StatusDenuncia;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class DenunciaResponseDTO {
    private Long id;
    private String protocolo;
    private Double latitude;
    private Double longitude;
    private String descricao;
    private List<String> imageUrls;
    private StatusDenuncia status;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
}