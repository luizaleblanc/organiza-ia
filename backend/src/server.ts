import 'dotenv/config'; 
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GoogleGenerativeAI } from "@google/generative-ai"; 

const app = express();
const prisma = new PrismaClient();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
console.log("Variável da IA carregada:", process.env.GEMINI_API_KEY ? "Sim ✅" : "Não ❌");

app.use(cors());
app.use(express.json());

const JWT_SECRET = 'sua_chave_secreta_aqui_123';

app.post('/usuarios', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const novoUsuario = await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });
    const { password: _, ...usuarioSemSenha } = novoUsuario;
    res.status(201).json(usuarioSemSenha);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar usuário." });
  }
});

app.post('/loginn', async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await prisma.user.findUnique({ where: { email } });
    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return res.status(401).json({ error: "E-mail ou senha inválidos." });
    }
    const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ message: "Login realizado!", user: { id: usuario.id, name: usuario.name }, token });
  } catch (error) {
    res.status(500).json({ error: "Erro interno." });
  }
});

app.get('/usuarios', async (req, res) => {
  const usuarios = await prisma.user.findMany({ select: { id: true, name: true, email: true } });
  res.json(usuarios);
});


app.post("/ia/chat", async (req, res) => {
  const { mensagem } = req.body;

  try {
    const chat = model.startChat({ history: [] });
    const result = await chat.sendMessage(mensagem);
    const response = await result.response;
    
    res.json({ resposta: response.text() });

  } catch (error: any) {
    console.error("--- ERRO NA API GEMINI ---");
    
    console.log("Status Code:", error.status);
    console.log("Mensagem de Erro:", error.message);
    
    if (error.response) {
      console.log("Detalhes do Google:", JSON.stringify(error.response, null, 2));
    }

    res.status(500).json({ 
      error: "Erro na comunicação com a IA",
      detalhes: error.message 
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});