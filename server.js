import express from 'express';
const app = express();
const PORT = 3000;

// Middleware para permitir leitura de JSON no req.body
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Bem-vindo à API de Livros!')
});

// BANCO DE DADOS EM MEMÓRIA
let livros = [
    {
        id: 1,
        titulo: "Biografia de Ronaldo",
        autor: "Cleber Bam Bam",
        paginas: 267,
        anoPublicacao: 2018
    },
    {
        id: 2,
        titulo: "Como virar um chavoso de verdade?",
        autor: "Zói de Gato (Alberto Silva)",
        paginas: 150,
        anoPublicacao: 2007
    },
    {
        id: 3,
        titulo: "MeMimei",
        autor: "Vivi Fonseca",
        paginas: 67,
        anoPublicacao: 2026
    }
];

// Rota 1: GET /livros (Listar todos)
app.get('/livros', (req, res) => {
    return res.status(200).json(livros);
});

// Rota 2: GET /livros/:id (Buscar livro específico)
app.get('/livros/:id', (req, res) => {
    const { id } = req.params;
    const livro = livros.find(l => l.id === parseInt(id));

    if (!livro) {
        return res.status(404).json({ mensagem: 'Livro não encontrado' });
    }

    return res.status(200).json(livro);
});

// Rota 3: POST /livros (Cadastrar novo livro)
app.post('/livros', (req, res) => {
    const { titulo, autor, paginas, anoPublicacao } = req.body;

    if (!titulo || !autor || !paginas || !anoPublicacao) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    const novoLivro = {
        id: livros.length > 0 ? livros[livros.length - 1].id + 1 : 1,
        titulo,
        autor,
        paginas: Number(paginas),
        anoPublicacao: Number(anoPublicacao)
    };

    livros.push(novoLivro);

    return res.status(201).json({
        mensagem: 'Livro cadastrado com sucesso!',
        livro: novoLivro
    });
});

// Rota 4: PUT /livros/:id (Atualizar livro existente)
app.put('/livros/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, autor, paginas, anoPublicacao } = req.body;

    const index = livros.findIndex(l => l.id === parseInt(id));

    if (index === -1) {
        return res.status(404).json({ mensagem: 'Livro não encontrado.' });
    }

    livros[index] = {
        ...livros[index],
        titulo: titulo || livros[index].titulo,
        autor: autor || livros[index].autor,
        paginas: paginas !== undefined ? Number(paginas) : livros[index].paginas,
        anoPublicacao: anoPublicacao !== undefined ? Number(anoPublicacao) : livros[index].anoPublicacao
    };

    return res.status(200).json({
        mensagem: 'Livro atualizado com sucesso!',
        livro: livros[index]
    });
});

// Rota 5: DELETE /livros/:id (Remover livro)
app.delete('/livros/:id', (req, res) => {
    const { id } = req.params;
    const index = livros.findIndex(l => l.id === parseInt(id));

    if (index === -1) {
        return res.status(404).json({ mensagem: 'Livro não encontrado.' });
    }

    livros.splice(index, 1);

    return res.status(200).json({
        mensagem: 'Livro deletado com sucesso!'
    });
});

// Inicialização do Servidor

app.listen(PORT, () => {
    console.log(`🚀[SERVIDOR ATIVO] rodando em http://localhost:${PORT}`);
    console.log('Pronto para receber requisições do Thunder Client!');
});