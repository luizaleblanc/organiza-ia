import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const JWT_SECRET = 'sua_chave_secreta_aqui_123';

app.post('/usuarios', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const novoUsuario = await prisma.user.create({
      data: { 
        email, 
        name,
        password: hashedPassword 
      },
    });

    const { password: _, ...usuarioSemSenha } = novoUsuario;
    res.status(201).json(usuarioSemSenha);

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Erro ao criar usuário. E-mail já existe?" });
  }
});

app.post('/loginn', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Procura o usuário pelo e-mail
    const usuario = await prisma.user.findUnique({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ error: "E-mail ou senha inválidos." });
    }

    const senhaCorreta = await bcrypt.compare(password, usuario.password);

    if (!senhaCorreta) {
      return res.status(401).json({ error: "E-mail ou senha inválidos." });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: '24h' } 
    );

    res.json({
      message: "Login realizado com sucesso!",
      user: { id: usuario.id, name: usuario.name, email: usuario.email },
      token: token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

app.get('/usuarios', async (req, res) => {
  const usuarios = await prisma.user.findMany({
    select: { id: true, name: true, email: true }
  });
  res.json(usuarios);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});