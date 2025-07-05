/*
 * ===================================================================
 * Script da Página de Login
 * ===================================================================
 * Este script lida com a submissão do formulário de login.
 * Ele envia a senha para o servidor e trata da resposta.
 * ===================================================================
 */

// Seleciona os elementos do formulário no HTML
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');
const loginButton = document.getElementById('login-button');

// Adiciona um "ouvinte" para o evento de submissão do formulário
loginForm.addEventListener('submit', async (e) => {
    // Previne o comportamento padrão do formulário de recarregar a página
    e.preventDefault();

    // Pega o valor digitado no campo de senha
    const password = document.getElementById('password').value;

    // Desabilita o botão para evitar múltiplos cliques enquanto verifica
    loginButton.disabled = true;
    loginButton.textContent = 'A verificar...';
    errorMessage.style.display = 'none'; // Esconde mensagens de erro antigas

    try {
        // Envia a senha para o nosso servidor na rota '/login'
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: password }) // Envia a senha em formato JSON
        });

        // Se a resposta do servidor for "OK" (status 200)
        if (response.ok) {
            // Redireciona o utilizador para a página de administrador
            window.location.href = '/admin.html';
        } else {
            // Se o servidor responder com um erro (ex: senha incorreta)
            errorMessage.textContent = 'Senha incorreta. Tente novamente.';
            errorMessage.style.display = 'block';
            // Reabilita o botão para uma nova tentativa
            loginButton.disabled = false;
            loginButton.textContent = 'Entrar';
        }
    } catch (error) {
        // Se houver um erro de rede (ex: servidor desligado)
        console.error('Erro de conexão:', error);
        errorMessage.textContent = 'Erro de conexão com o servidor.';
        errorMessage.style.display = 'block';
        loginButton.disabled = false;
        loginButton.textContent = 'Entrar';
    }
});
