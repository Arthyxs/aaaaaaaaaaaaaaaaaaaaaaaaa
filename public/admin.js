/*
 * ===================================================================
 * Script da Página de Administrador - v2.0
 * ===================================================================
 * A verificação de autenticação foi removida, pois agora é
 * tratada de forma segura e centralizada pelo servidor.
 * ===================================================================
 */

const uploadForm = document.getElementById('upload-form');
const csvFile = document.getElementById('csv-file');
const uploadStatus = document.getElementById('upload-status');
const logoutButton = document.getElementById('logout-button');
const uploadButton = document.getElementById('upload-button');

// --- GESTÃO DO UPLOAD DE FICHEIRO ---
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!csvFile.files || csvFile.files.length === 0) {
        uploadStatus.textContent = 'Por favor, selecione um ficheiro CSV.';
        uploadStatus.style.color = 'red';
        return;
    }

    const formData = new FormData();
    formData.append('csvfile', csvFile.files[0]);

    uploadStatus.textContent = 'A enviar...';
    uploadStatus.style.color = 'var(--cor-texto-secundario-escuro)';
    uploadButton.disabled = true;
    uploadButton.textContent = 'A processar...';

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            uploadStatus.textContent = 'Ficheiro enviado com sucesso! O painel foi atualizado.';
            uploadStatus.style.color = 'green';
        } else {
            const result = await response.json();
            uploadStatus.textContent = `Erro: ${result.message || 'Não foi possível enviar o ficheiro.'}`;
            uploadStatus.style.color = 'red';
        }
    } catch (error) {
        console.error('Erro de upload:', error);
        uploadStatus.textContent = 'Erro de conexão ao enviar o ficheiro.';
        uploadStatus.style.color = 'red';
    } finally {
        uploadButton.disabled = false;
        uploadButton.textContent = 'Enviar Novo Ficheiro';
    }
});

// --- GESTÃO DO LOGOUT ---
logoutButton.addEventListener('click', async () => {
    try {
        await fetch('/logout');
        window.location.href = '/login.html';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        alert('Não foi possível sair. Por favor, tente novamente.');
    }
});
