import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import morgan from 'morgan';
interface AuthRequest extends Request {
  user?: any;
}
const app = express();
const prisma = new PrismaClient();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

console.log(
  'Variável da IA carregada:',
  process.env.GEMINI_API_KEY ? 'Sim' : 'Não',
);

app.use(
  cors({
    origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(morgan('dev'));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || '';

if (!JWT_SECRET) {
  console.error(' ERRO: JWT_SECRET não definida no arquivo .env');
  process.exit(1);
}
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: 'Acesso negado. Token não fornecido.' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado.' });
    }
    (req as AuthRequest).user = user;
    next();
  });
};

app.post('/usuarios', async (req, res) => {
  const { email, password, name } = req.body;

  // Validação simples
  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ error: 'Nome, email e senha são obrigatórios.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const novoUsuario = await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });

    const { password: _, ...usuarioSemSenha } = novoUsuario;
    res.status(201).json(usuarioSemSenha);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Este e-mail já possui cadastro.' });
    }

    console.error('Erro no Registro:', error);
    res.status(500).json({ error: 'Erro interno ao criar conta.' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await prisma.user.findUnique({ where: { email } });
    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: '24h' },
    );
    res.json({
      message: 'Login realizado!',
      user: { id: usuario.id, name: usuario.name },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno.' });
  }
});

app.get('/usuarios', authenticateToken, async (req, res) => {
  try {
    const usuarios = await prisma.user.findMany({
      select: { id: true, name: true, email: true },
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});

app.post('/ia/chat', authenticateToken, async (req, res) => {
  const { mensagem } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const faturas = await prisma.invoice.findMany({ take: 5 }).catch(() => []);

    const dadosFinanceiros =
      faturas.length > 0
        ? faturas
            .map((f: any) => `- ${f.description}: R$ ${f.value}`)
            .join('\n')
        : 'Sem faturas.';

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const corpoRequisicao = {
      contents: [
        {
          parts: [
            {
              text: `Você é um assistente financeiro. Contexto: ${dadosFinanceiros}. Pergunta do usuário: ${mensagem}`,
            },
          ],
        },
      ],
    };

    const googleResponse = await axios.post(url, corpoRequisicao);

    const textoResposta =
      googleResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Desculpe, não consegui processar sua resposta.';

    return res.json({ resposta: textoResposta });
  } catch (error: any) {
    console.error('Erro na IA:', error.message);
    return res.status(500).json({
      error: 'Erro na comunicação com Google',
      detalhe: error.response?.data?.error?.message || error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor BLINDADO rodando em http://localhost:${PORT}`);
});
