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
  const { nome, funcao, status } = req.body;

  if (!nome || !funcao || !status) {
    return res.status(400).json({ message: "Dados incompletos." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // ou outro serviço como outlook, zoho...
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.DESTINATION_EMAIL, // Pode ser o próprio usuário ou outro administrador
      subject: `Atualização de Status: ${nome}`,
      html: `
        <h1>Atualização de Status</h1>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Função:</strong> ${funcao}</p>
        <p><strong>Status:</strong> ${status}</p>
      `,
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
