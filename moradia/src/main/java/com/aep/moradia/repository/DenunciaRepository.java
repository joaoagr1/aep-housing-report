package com.aep.moradia.repository;

import com.aep.moradia.domain.Denuncia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DenunciaRepository extends JpaRepository<Denuncia, Long> {
    // Spring Data JPA cria a query automaticamente pelo nome do método
    Optional<Denuncia> findByProtocolo(String protocolo);
}