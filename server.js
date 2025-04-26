// Importações
import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

// Configurações iniciais

function capitalizar(nome) {
  const palavrasMinusculas = ['de', 'da', 'do', 'dos', 'das', 'e'];
  return nome
    .toLowerCase()
    .split(' ')
    .map((palavra, index) =>
      palavrasMinusculas.includes(palavra) && index !== 0
        ? palavra
        : palavra.charAt(0).toUpperCase() + palavra.slice(1)
    )
    .join(' ');
}

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));


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
    console.log("📥 Dados recebidos pelo backend:", { nome, funcao, status, tipo });
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
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
            <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 20px;">
              <div style="text-align: center;">
              <img src="https://controle-ferias-backend.onrender.com/logo-silimed.png" alt="Logo Silimed" style="max-width: 120px; margin-bottom: 20px;" />
              <h2 style="color: #d9534f; text-align: center;">${tipo} de usuário</h2>
              <p style="font-size: 16px;"><strong>Nome:</strong> ${capitalizar(nome)}</p>
              <p style="font-size: 16px;"><strong>Função:</strong> ${capitalizar(funcao)}</p>
              <p style="font-size: 16px;">
                <strong>Status:</strong> 
                <span style="color: ${status === 'bloqueado' ? '#d9534f' : '#5cb85c'}; font-weight: bold;">
                  ${status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </p>
              <hr style="margin: 20px 0;" />
              <p style="font-size: 14px; color: #888; text-align: center;">
                Este e-mail foi enviado automaticamente pelo sistema de controle de férias.<br/>
                Por favor, não responda.
              </p>
            </div>
          </body>
        </html>
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
