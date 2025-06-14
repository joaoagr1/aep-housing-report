package com.aep.moradia.service;

import com.aep.moradia.dto.DenunciaRequestDTO;
import com.aep.moradia.dto.DenunciaResponseDTO;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface DenunciaService {
    DenunciaResponseDTO criarDenuncia(DenunciaRequestDTO requestDTO);
    DenunciaResponseDTO buscarPorId(Long id);
    List<DenunciaResponseDTO> buscarTodas();
    DenunciaResponseDTO atualizarStatus(Long id, String status);
    void deletarDenuncia(Long id);
}