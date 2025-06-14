// src/script.js

// Espera o conteúdo da página carregar completamente antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // URL da nossa API Spring Boot (verifique se a porta está correta)
    const apiUrl = 'http://localhost:8080/api/denuncias';

    // Referências aos elementos do HTML que vamos manipular
    const denunciasTbody = document.getElementById('denunciasTbody');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const denunciasTable = document.getElementById('denunciasTable');
    const denunciaForm = document.getElementById('denunciaForm');
    const denunciaModalElement = document.getElementById('denunciaModal');
    const denunciaModal = new bootstrap.Modal(denunciaModalElement); // Instância do Modal do Bootstrap

    /**
     * Função principal para buscar as denúncias na API e renderizá-las na tabela.
     */
    const carregarDenuncias = async () => {
        mostrarSpinner(true);
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Erro na rede: ${response.statusText}`);
            }
            const denuncias = await response.json();
            renderizarTabela(denuncias);
        } catch (error) {
            console.error('Falha ao carregar denúncias:', error);
            mostrarErroNaTabela('Não foi possível carregar os dados. Verifique se a API está no ar.');
        } finally {
            mostrarSpinner(false);
        }
    };

    /**
     * Renderiza os dados das denúncias na tabela HTML.
     * @param {Array} denuncias - Um array de objetos de denúncia.
     */
    const renderizarTabela = (denuncias) => {
        // Limpa qualquer conteúdo existente na tabela
        denunciasTbody.innerHTML = '';

        if (denuncias.length === 0) {
            mostrarErroNaTabela('Nenhuma denúncia encontrada.');
            return;
        }

        denuncias.forEach(denuncia => {
            // Cria uma nova linha (tr) para a tabela
            const tr = document.createElement('tr');

            // Formata a data usando a biblioteca Day.js
            const dataFormatada = dayjs(denuncia.dataCriacao).format('DD/MM/YYYY HH:mm');

            // Preenche a linha com os dados da denúncia
            tr.innerHTML = `
                <td>${denuncia.protocolo.substring(0, 8)}...</td>
                <td>${denuncia.descricao}</td>
                <td><span class="badge bg-info text-dark">${denuncia.status}</span></td>
                <td>${dataFormatada}</td>
            `;
            denunciasTbody.appendChild(tr);
        });
    };

    /**
     * Lida com o envio do formulário de nova denúncia.
     */
    denunciaForm.addEventListener('submit', async (event) => {
        // Impede o comportamento padrão do formulário (que recarregaria a página)
        event.preventDefault();

        // Pega os valores dos campos do formulário
        const novaDenuncia = {
            latitude: parseFloat(document.getElementById('latitude').value),
            longitude: parseFloat(document.getElementById('longitude').value),
            descricao: document.getElementById('descricao').value,
            // Valor fixo, já que não temos upload de imagem
            imageUrls: JSON.parse(document.getElementById('imageUrls').value.replace(/'/g, '"')),
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novaDenuncia),
            });

            if (!response.ok) {
                throw new Error(`Erro ao criar denúncia: ${response.statusText}`);
            }

            // Se a denúncia foi criada com sucesso:
            denunciaModal.hide(); // Esconde o modal
            denunciaForm.reset(); // Limpa o formulário
            carregarDenuncias(); // Recarrega a tabela com os novos dados

        } catch (error) {
            console.error('Falha ao salvar denúncia:', error);
            alert('Não foi possível salvar a denúncia. Tente novamente.');
        }
    });

    /**
     * Funções auxiliares para mostrar/esconder o spinner e a tabela.
     */
    const mostrarSpinner = (mostrar) => {
        loadingSpinner.style.display = mostrar ? 'block' : 'none';
        denunciasTable.style.display = mostrar ? 'none' : 'table';
    };

    const mostrarErroNaTabela = (mensagem) => {
        denunciasTbody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">${mensagem}</td></tr>`;
    };


    // Inicia a aplicação carregando as denúncias quando a página abre
    carregarDenuncias();
});