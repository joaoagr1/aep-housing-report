// script.js
document.addEventListener('DOMContentLoaded', () => {
    // ... (apiUrl e referências aos elementos permanecem os mesmos) ...
    const apiUrl = 'http://localhost:8080/api/denuncias';

    const denunciasTbody = document.getElementById('denunciasTbody');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const denunciasTable = document.getElementById('denunciasTable');

    const denunciaForm = document.getElementById('denunciaForm');
    const denunciaModalElement = document.getElementById('denunciaModal');
    const denunciaModal = new bootstrap.Modal(denunciaModalElement);

    const updateStatusForm = document.getElementById('updateStatusForm');
    const updateStatusModalElement = document.getElementById('updateStatusModal');
    const updateStatusModal = new bootstrap.Modal(updateStatusModalElement);
    const updateDenunciaIdInput = document.getElementById('updateDenunciaId');
    const statusSelect = document.getElementById('statusSelect');

    /**
     * Função auxiliar para retornar a classe CSS do badge com base no status.
     * @param {string} status - O status da denúncia.
     * @returns {string} - A classe de cor do Bootstrap.
     */
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'PENDENTE': return 'bg-warning text-dark';
            case 'EM_ANALISE': return 'bg-info text-dark';
            case 'RESOLVIDO': return 'bg-success';
            case 'ARQUIVADO': return 'bg-secondary';
            default: return 'bg-light text-dark';
        }
    };

    const renderizarTabela = (denuncias) => {
        denunciasTbody.innerHTML = '';
        if (denuncias.length === 0) {
            mostrarErroNaTabela('Nenhuma denúncia encontrada.');
            return;
        }

        denuncias.forEach(denuncia => {
            const tr = document.createElement('tr');
            const dataFormatada = dayjs(denuncia.dataCriacao).format('DD/MM/YYYY HH:mm');
            const statusBadgeClass = getStatusBadgeClass(denuncia.status);

            // --- CORREÇÃO APLICADA AQUI ---
            // O acionador do tooltip foi movido para um <span> que envolve o botão de editar.
            const acoesHtml = `
                <div class="d-flex justify-content-center gap-2">

                    <span data-bs-toggle="tooltip" title="Alterar Status">
                        <button class="btn btn-sm btn-outline-primary"
                                data-id="${denuncia.id}"
                                data-status="${denuncia.status}"
                                data-bs-toggle="modal"
                                data-bs-target="#updateStatusModal">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                    </span>

                    <button class="btn btn-sm btn-outline-danger" data-bs-toggle="tooltip" title="Excluir Denúncia"
                            data-id="${denuncia.id}">
                        <i class="bi bi-trash3-fill"></i>
                    </button>

                </div>
            `;

            tr.innerHTML = `
                <td>${denuncia.protocolo.substring(0, 8)}...</td>
                <td>${denuncia.descricao}</td>
                <td class="text-center">
                    <span class="badge ${statusBadgeClass}">${denuncia.status.replace('_', ' ')}</span>
                </td>
                <td>${dataFormatada}</td>
                <td class="actions-cell">${acoesHtml}</td>
            `;
            denunciasTbody.appendChild(tr);
        });

        // INICIALIZA OS TOOLTIPS DO BOOTSTRAP APÓS RENDERIZAR A TABELA
        // Esta parte continua a mesma e é essencial para os tooltips funcionarem
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            // Garante que tooltips antigos sejam destruídos antes de criar novos para evitar bugs
            const tooltip = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
            if (tooltip) {
                tooltip.dispose();
            }
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    };

    const deletarDenuncia = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error(`Erro ao excluir: ${response.statusText}`);
            // Recarrega a tabela para refletir a exclusão e mostrar feedback ao usuário
            await carregarDenuncias();
        } catch (error) {
            console.error('Falha ao excluir denúncia:', error);
            alert('Não foi possível excluir a denúncia.');
        }
    };

    // Delegação de eventos para os botões de Ação na tabela
    denunciasTbody.addEventListener('click', (event) => {
        const targetButton = event.target.closest('button');
        if (!targetButton) return;

        const id = targetButton.dataset.id;

        // Se for o botão de excluir
        if (targetButton.classList.contains('btn-outline-danger')) {
            if (confirm('Você tem certeza que deseja excluir esta denúncia? Esta ação não pode ser desfeita.')) {
                deletarDenuncia(id);
            }
        }
        // O botão de update já é tratado pelo data-bs-toggle do Bootstrap
    });


    // --- (O restante do seu script.js continua aqui, sem alterações) ---
    // (A lógica de carregarDenuncias, os event listeners dos forms,
    // a preparação do modal de update, mostrarSpinner, e mostrarErroNaTabela
    // permanecem os mesmos do código anterior)

    const carregarDenuncias = async () => {
        mostrarSpinner(true);
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Erro na rede: ${response.statusText}`);
            const denuncias = await response.json();
            renderizarTabela(denuncias);
        } catch (error) {
            console.error('Falha ao carregar denúncias:', error);
            mostrarErroNaTabela('Não foi possível carregar os dados. Verifique se a API está no ar.');
        } finally {
            mostrarSpinner(false);
        }
    };

    denunciaForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const novaDenuncia = {
            latitude: parseFloat(document.getElementById('latitude').value),
            longitude: parseFloat(document.getElementById('longitude').value),
            descricao: document.getElementById('descricao').value,
            imageUrls: JSON.parse(document.getElementById('imageUrls').value.replace(/'/g, '"')),
        };

        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(novaDenuncia) });
            if (!response.ok) throw new Error(`Erro ao criar denúncia: ${response.statusText}`);
            denunciaModal.hide();
            denunciaForm.reset();
            carregarDenuncias();
        } catch (error) {
            console.error('Falha ao salvar denúncia:', error);
            alert('Não foi possível salvar a denúncia.');
        }
    });

    updateStatusForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = updateDenunciaIdInput.value;
        const novoStatus = statusSelect.value;

        try {
            const response = await fetch(`${apiUrl}/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: novoStatus }) });
            if (!response.ok) throw new Error(`Erro ao atualizar status: ${response.statusText}`);
            updateStatusModal.hide();
            carregarDenuncias();
        } catch (error) {
            console.error('Falha ao atualizar status:', error);
            alert('Não foi possível atualizar o status.');
        }
    });

    updateStatusModalElement.addEventListener('show.bs.modal', (event) => {
        const button = event.relatedTarget;
        if(button){
            const id = button.dataset.id;
            const currentStatus = button.dataset.status;
            updateDenunciaIdInput.value = id;
            statusSelect.value = currentStatus;
        }
    });

    const mostrarSpinner = (mostrar) => {
        loadingSpinner.style.display = mostrar ? 'block' : 'none';
        denunciasTable.style.display = mostrar ? 'none' : 'table';
    };

    const mostrarErroNaTabela = (mensagem) => {
        const colunas = 5;
        denunciasTbody.innerHTML = `<tr><td colspan="${colunas}" class="text-center py-4 text-muted">${mensagem}</td></tr>`;
    };

    carregarDenuncias();
});