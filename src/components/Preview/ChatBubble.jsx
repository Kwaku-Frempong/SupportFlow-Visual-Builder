export default function ChatBubble({ type, text }) {
  const isBot = type === 'bot';
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-3`}>
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white mr-2 mt-auto shrink-0">
          AI
        </div>
      )}
      <div
        className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow ${
          isBot
            ? 'bg-gray-800 text-gray-100 rounded-tl-sm'
            : 'bg-blue-600 text-white rounded-tr-sm'
        }`}
      >
        {text}
      </div>
    </div>
  );
}
