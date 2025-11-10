import { useState } from "react";
import { llmAPI } from "../../services/api";

const LLMAssistant = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);

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

  const MessageBubble = ({ message }) => (
    <div
      className={`flex mb-3 ${
        message.sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[85%] px-4 py-3 rounded-xl ${
          message.sender === "user"
            ? "bg-blue-500 text-white rounded-br-none"
            : message.isError
            ? "bg-red-100 text-red-700 rounded-tl-none border border-red-200"
            : "bg-gray-100 text-gray-800 rounded-tl-none"
        } shadow-sm`}
      >
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );

  const InitialPrompt = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-3">
        <i className="fas fa-robot text-primary-500 text-2xl"></i>
      </div>
      <h4 className="font-semibold text-gray-800 mb-1">
        Asisten Analis Siap Membantu
      </h4>
      <p className="text-sm text-gray-500 max-w-xs mx-auto">
        Tanyakan tentang status aplikasi, tren, atau faktor skoring pinjaman.
        Apa yang ingin Anda ketahui?
      </p>
    </div>
  );

  const sendMessage = async (question) => {
    if (!question.trim() || isSending) return;

    const userMessage = { text: question, sender: "user" };

    // 1. Tambahkan pesan user & reset input
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsSending(true);

    try {
      // 2. Panggil API (asumsi response memiliki field 'answer')
      const response = await llmAPI.askQuestion(question, {});

      // 3. Tambahkan balasan LLM ke riwayat
      const llmResponse = {
        text:
          response.answer ||
          "Maaf, terjadi kesalahan saat memproses permintaan.",
        sender: "llm",
      };
      setMessages((prev) => [...prev, llmResponse]);
    } catch (error) {
      // 4. Tangani error
      const errorMessage = {
        text: `Terjadi kesalahan koneksi. (${error.message})`,
        sender: "llm",
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
    }
  };

  const handleQuickQuestionClick = (questionText) => {
    sendMessage(questionText);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100 flex flex-col">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Asisten Analis (LLM)</h3>
      </div>

      {/* Area Chat/Riwayat */}
      <div className="p-6 flex-1 overflow-y-auto min-h-[300px] max-h-[450px]">
        {messages.length === 0 ? (
          <InitialPrompt /> // Tampilkan prompt awal jika belum ada pesan
        ) : (
          messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))
        )}

        {/* Loading Bubble */}
        {isSending && (
          <div className="flex justify-start mb-3">
            <div className="max-w-[85%] px-4 py-3 rounded-xl bg-gray-100 text-gray-800 rounded-tl-none shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-0"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Questions & Input */}
      <div className="p-6 border-t border-gray-200">
        {messages.length === 0 && ( // Tampilkan Quick Questions hanya di awal
          <div className="space-y-3 mb-4">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                className="w-full text-left p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm font-medium text-gray-700 flex items-center"
                onClick={() => handleQuickQuestionClick(question.text)}
                disabled={isSending}
              >
                <i
                  className={`fas fa-${question.icon} ${question.color} mr-3`}
                ></i>
                {question.text}
              </button>
            ))}
          </div>
        )}

        <div className="mt-4">
          <div className="flex">
            <input
              type="text"
              placeholder={
                isSending ? "Menunggu respon..." : "Tanyakan sesuatu..."
              }
              className="flex-1 border border-gray-300 rounded-l-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSending} // Disable saat mengirim
            />
            <button
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 rounded-r-xl hover:from-blue-600 hover:to-cyan-600 transition disabled:opacity-50"
              onClick={handleSendMessage}
              disabled={isSending || message.trim() === ""} // Disable saat mengirim atau input kosong
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
