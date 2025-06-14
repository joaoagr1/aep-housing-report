package com.aep.moradia.service;

import com.aep.moradia.domain.Denuncia;
import com.aep.moradia.domain.StatusDenuncia;
import com.aep.moradia.dto.DenunciaRequestDTO;
import com.aep.moradia.dto.DenunciaResponseDTO;
import com.aep.moradia.repository.DenunciaRepository;
import com.aep.moradia.service.DenunciaService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public   class DenunciaServiceImpl implements DenunciaService {

    @Autowired
    private DenunciaRepository denunciaRepository;

    @Override
    public DenunciaResponseDTO criarDenuncia(DenunciaRequestDTO requestDTO) {
        Denuncia denuncia = new Denuncia();
        BeanUtils.copyProperties(requestDTO, denuncia);

        denuncia.setProtocolo(UUID.randomUUID().toString()); // Gera um protocolo único
        denuncia.setStatus(StatusDenuncia.PENDENTE);

        // A lógica de upload de imagens para um serviço de storage (S3, etc.) iria aqui.
        // Por enquanto, estamos salvando as URLs diretamente.

        Denuncia novaDenuncia = denunciaRepository.save(denuncia);
        return convertToDTO(novaDenuncia);
    }

    @Override
    public DenunciaResponseDTO buscarPorId(Long id) {
        Denuncia denuncia = denunciaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Denúncia não encontrada com o ID: " + id));
        return convertToDTO(denuncia);
    }

    @Override
    public List<DenunciaResponseDTO> buscarTodas() {
        return denunciaRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DenunciaResponseDTO atualizarStatus(Long id, String status) {
        Denuncia denuncia = denunciaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Denúncia não encontrada com o ID: " + id));

        // Converte a string do novo status para o Enum
        StatusDenuncia novoStatus = StatusDenuncia.valueOf(status.toUpperCase());
        denuncia.setStatus(novoStatus);

        Denuncia denunciaAtualizada = denunciaRepository.save(denuncia);
        return convertToDTO(denunciaAtualizada);
    }

    @Override
    public void deletarDenuncia(Long id) {
        if (!denunciaRepository.existsById(id)) {
            throw new EntityNotFoundException("Denúncia não encontrada com o ID: " + id);
        }
        denunciaRepository.deleteById(id);
    }

    // Método utilitário para converter Entidade em DTO
    private DenunciaResponseDTO convertToDTO(Denuncia denuncia) {
        DenunciaResponseDTO dto = new DenunciaResponseDTO();
        BeanUtils.copyProperties(denuncia, dto);
        return dto;
    }
}