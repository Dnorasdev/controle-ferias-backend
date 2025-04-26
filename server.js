// Importações
import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

// Configurações iniciais
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota para teste
app.get("/", (req, res) => {
  res.send("Servidor do Controle de Férias rodando! 🚀");
});

// Rota para envio de e-mail
app.post("/send-email", async (req, res) => {
  const { nome, funcao, status, tipo } = req.body; // <-- Corrigido

  if (!nome || !funcao || !status || !tipo) {
    return res.status(400).json({ message: "Dados incompletos." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_DESTINO,
      subject: `⚠️ ${tipo} de ${nome}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
          <!-- Corpo HTML todo aqui -->
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    console.log(`✉️ Email enviado para ${mailOptions.to}`);
    res.status(200).json({ message: "E-mail enviado com sucesso!" });
  } catch (error) {
    console.error("❌ Erro ao enviar email:", error);
    res.status(500).json({ message: "Erro ao enviar email." });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
