import type { NextApiRequest, NextApiResponse } from "next";

type Location = {
  lat: number;
  lng: number;
};

type Body = {
  cpf: string;
  location: Location;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { cpf, location } = req.body as Body;

  // Validação básica
  if (
    !cpf ||
    typeof cpf !== "string" ||
    !location ||
    typeof location.lat !== "number" ||
    typeof location.lng !== "number"
  ) {
    return res.status(400).json({ message: "Dados inválidos ou incompletos." });
  }

  try {
    const scriptURL =
      "https://script.google.com/macros/s/AKfycbwGiVNif86JhzqxnD_BFFXAF3ljzqmGNOwcbYCnQDBXCEx1hLNKU_Xeygn_ku4JXPPXTg/exec";

    const response = await fetch(scriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cpf, location }),
    });

    if (!response.ok) {
      throw new Error(`Erro na comunicação com Google Script: ${response.statusText}`);
    }

    return res.status(200).json({ message: "Dados enviados com sucesso." });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro no envio:", errorMessage);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}
