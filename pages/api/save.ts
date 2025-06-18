// pages/api/save.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { cpf, location } = req.body;

  if (!cpf || !location || !location.lat || !location.lng) {
    return res.status(400).json({ message: "Dados incompletos" });
  }

  try {
    const scriptURL =
      "https://script.google.com/macros/s/AKfycbwGiVNif86JhzqxnD_BFFXAF3ljzqmGNOwcbYCnQDBXCEx1hLNKU_Xeygn_ku4JXPPXTg/exec";

    // Envia os dados para o Google Apps Script
    const response = await fetch(scriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cpf, location }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao enviar para Google Apps Script: ${response.statusText}`);
    }

    return res.status(200).json({ message: "Dados enviados com sucesso" });
  } catch (error: any) {
    console.error("Erro no handler save:", error.message || error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
}
