package com.aep.moradia.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class DenunciaRequestDTO {

    @NotNull(message = "Latitude é obrigatória")
    private Double latitude;

    @NotNull(message = "Longitude é obrigatória")
    private Double longitude;

    @NotBlank(message = "A descrição não pode estar em branco")
    private String descricao;

    // O front-end pode enviar as URLs das imagens já salvas em algum storage (ex: S3, Firebase)
    @NotEmpty(message = "É necessário enviar pelo menos uma imagem")
    private List<String> imageUrls;
}