/*
 * ===================================================================
 * Servidor Backend do Painel de Inteligência Financeira - v2.1 (FIX DE SEGURANÇA)
 * ===================================================================
 * CORREÇÃO CRÍTICA: A ordem das rotas foi ajustada para garantir
 * que o middleware de autenticação (checkAuth) seja executado ANTES
 * que o servidor tente servir ficheiros estáticos. Isto impede o
 * acesso direto não autorizado à página /admin.html.
 * ===================================================================
 */

const express = require('express');
const path = require('path');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Configuração de middleware inicial
app.use(express.json());
app.use(cookieParser());

// --- Definição da Senha de Administrador ---
// IMPORTANTE: Mude esta senha para algo seguro!
const ADMIN_PASSWORD = "satilog";

// --- Middleware de Verificação de Autenticação ---
// Esta função "guarda" as nossas rotas protegidas.
const checkAuth = (req, res, next) => {
    // Se o cookie de sessão não existir ou for inválido...
    if (req.cookies.session_token !== 'logado_com_sucesso') {
        // ...redireciona imediatamente para a página de login.
        return res.redirect('/login.html');
    }
    // Se o cookie existir, permite que o pedido continue para a rota protegida.
    next();
};

// --- Rotas da Aplicação (Endpoints) ---

// ROTA PROTEGIDA: A rota para a página de admin é definida ANTES do express.static.
// Isto garante que este código de verificação seja executado primeiro.
app.get('/admin.html', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// SERVIDOR DE FICHEIROS ESTÁTICOS: Serve todos os outros ficheiros (públicos)
// da pasta 'public'. Como a rota '/admin.html' já foi tratada acima,
// o servidor não irá servir o ficheiro admin.html diretamente daqui.
app.use(express.static(path.join(__dirname, 'public')));


// --- Configuração do Upload ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, 'public', 'data');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, 'BRUDAM (2).csv');
    }
});
const upload = multer({ storage: storage });

// Rota para o processo de login
app.post('/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.cookie('session_token', 'logado_com_sucesso', {
            httpOnly: true, secure: true, maxAge: 3600000 // Expira em 1 hora
        });
        res.status(200).json({ message: 'Login bem-sucedido' });
    } else {
        res.status(401).json({ message: 'Senha incorreta' });
    }
});

// Rota para o processo de upload (protegida)
app.post('/upload', checkAuth, upload.single('csvfile'), (req, res) => {
    res.status(200).json({ message: 'Ficheiro enviado com sucesso!' });
});

// Rota para o processo de logout
app.get('/logout', (req, res) => {
    res.clearCookie('session_token');
    res.redirect('/login.html');
});

// --- Inicia o Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}. A aplicação está pronta!`);
});
