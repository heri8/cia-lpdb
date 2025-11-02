import { useState } from "react";

const LLMAssistant = () => {
  const [message, setMessage] = useState("");

  const quickQuestions = [
    {
      icon: "chart-line",
      color: "text-primary-500",
      text: "Jelaskan faktor utama yang mempengaruhi skor APL-2023-0012",
    },
    {
      icon: "lightbulb",
      color: "text-warning",
      text: "Tampilkan rekomendasi OTS untuk aplikasi dengan skor 70-79",
    },
    {
      icon: "chart-bar",
      color: "text-info",
      text: "Analisis tren penolakan aplikasi bulan ini",
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Asisten Analis (LLM)</h3>
      </div>
      <div className="p-6">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl mb-4 border border-blue-100">
          <div className="flex items-start">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg mr-3">
              <i className="fas fa-robot text-white text-sm"></i>
            </div>
            <p className="text-sm text-gray-700 flex-1">
              Halo! Saya siap membantu analisis aplikasi pinjaman. Apa yang
              ingin Anda ketahui?
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              className="w-full text-left p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm font-medium text-gray-700 flex items-center"
            >
              <i
                className={`fas fa-${question.icon} ${question.color} mr-3`}
              ></i>
              {question.text}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <div className="flex">
            <input
              type="text"
              placeholder="Tanyakan sesuatu..."
              className="flex-1 border border-gray-300 rounded-l-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 rounded-r-xl hover:from-blue-600 hover:to-cyan-600 transition"
              onClick={handleSendMessage}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LLMAssistant;
