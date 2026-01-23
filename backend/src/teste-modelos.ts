import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function verModelos() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    const data = await response.json();
    
    console.log("--- MODELOS DISPONÍVEIS PARA VOCÊ ---");
    if (data.models) {
      data.models.forEach((m: any) => console.log(`> ${m.name}`));
    } else {
      console.log("Resposta do Google:", data);
    }
  } catch (e) {
    console.error("Erro ao buscar:", e);
  }
}

verModelos();