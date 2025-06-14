package com.aep.moradia.controller;

import com.aep.moradia.dto.DenunciaRequestDTO;
import com.aep.moradia.dto.DenunciaResponseDTO;
import com.aep.moradia.service.DenunciaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/denuncias") // Endpoint base para as denúncias
@CrossOrigin(origins = "*") // Permite requisições de qualquer origem (ajustar em produção)
public class DenunciaController {

    @Autowired
    private DenunciaService denunciaService;

    // Endpoint para criar uma nova denúncia (POST /api/denuncias)
    @PostMapping
    public ResponseEntity<DenunciaResponseDTO> criarDenuncia(@Valid @RequestBody DenunciaRequestDTO requestDTO) {
        DenunciaResponseDTO novaDenuncia = denunciaService.criarDenuncia(requestDTO);
        return new ResponseEntity<>(novaDenuncia, HttpStatus.CREATED);
    }

    // Endpoint para listar todas as denúncias (GET /api/denuncias)
    @GetMapping
    public ResponseEntity<List<DenunciaResponseDTO>> listarDenuncias() {
        List<DenunciaResponseDTO> denuncias = denunciaService.buscarTodas();
        return ResponseEntity.ok(denuncias);
    }

    // Endpoint para buscar uma denúncia por ID (GET /api/denuncias/{id})
    @GetMapping("/{id}")
    public ResponseEntity<DenunciaResponseDTO> buscarDenunciaPorId(@PathVariable Long id) {
        DenunciaResponseDTO denuncia = denunciaService.buscarPorId(id);
        return ResponseEntity.ok(denuncia);
    }

    // Endpoint para atualizar o status de uma denúncia (PATCH /api/denuncias/{id}/status)
    @PatchMapping("/{id}/status")
    public ResponseEntity<DenunciaResponseDTO> atualizarStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String novoStatus = body.get("status");
        if (novoStatus == null || novoStatus.isBlank()) {
            return ResponseEntity.badRequest().build(); // Retorna erro se o corpo for inválido
        }
        DenunciaResponseDTO denunciaAtualizada = denunciaService.atualizarStatus(id, novoStatus);
        return ResponseEntity.ok(denunciaAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarDenuncia(@PathVariable Long id) {
        denunciaService.deletarDenuncia(id);
        // Retorna 204 No Content, o padrão para DELETE bem-sucedido
        return ResponseEntity.noContent().build();
    }
}