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
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });console.log("Variável da IA carregada:", process.env.GEMINI_API_KEY ? "Sim ✅" : "Não ❌");

app.use(cors({
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
  try {
    const usuarios = await prisma.user.findMany({ select: { id: true, name: true, email: true } });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários." });
  }
});

import axios from 'axios'; 

app.post("/ia/chat", async (req, res) => {
  const { mensagem } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  console.log("--- Iniciando processamento via HTTP Direto ---");

  try {
    const faturas = await prisma.invoice.findMany({ take: 5 }).catch(() => []);
    const dadosFinanceiros = faturas.length > 0 
      ? faturas.map((f: any) => `- ${f.description}: R$ ${f.value}`).join("\n")
      : "Sem faturas.";

const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-001:generateContent?key=${apiKey}`;
  const corpoRequisicao = {
      contents: [{
        parts: [{
          text: `Você é um assistente financeiro. Contexto: ${dadosFinanceiros}. Pergunta: ${mensagem}`
        }]
      }]
    };

    console.log("🤖 Chamando API do Google via HTTP...");
    const googleResponse = await axios.post(url, corpoRequisicao);

    const textoResposta = googleResponse.data.candidates[0].content.parts[0].text;

    console.log("✨ Sucesso total!");
    return res.json({ resposta: textoResposta });

  } catch (error: any) {
    console.error("🚨 ERRO NA CHAMADA DIRETA:");
    console.error(error.response?.data || error.message);
    
    return res.status(500).json({ 
      error: "Erro na comunicação com Google",
      detalhe: error.response?.data?.error?.message || error.message
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});