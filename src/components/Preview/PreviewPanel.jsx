import { useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';

export default function PreviewPanel({
  previewState,
  currentNode,
  onSelectOption,
  onRestart,
  onBack,
}) {
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when history grows
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [previewState?.history?.length]);

  if (!previewState || !currentNode) return null;

  const isEnd = currentNode.options.length === 0;

  return (
    <div className="flex flex-col flex-1 bg-gray-950">
      {/* Preview header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-gray-700">
        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-gray-200 flex items-center gap-1"
        >
          ← Back to Editor
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-gray-400 font-medium">Preview Mode</span>
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col">
        <div className="max-w-xl w-full mx-auto flex flex-col flex-1">
          {/* Bot header card */}
          <div className="bg-gray-900 rounded-2xl p-4 mb-6 flex items-center gap-3 border border-gray-700">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
              AI
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-100">SupportFlow Bot</p>
              <p className="text-xs text-gray-400">Automated Support Assistant</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1">
            {previewState.history.map((msg, i) => (
              <ChatBubble key={i} type={msg.type} text={msg.text} />
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>
      </div>

      {/* Options / Restart */}
      <div className="border-t border-gray-800 bg-gray-900 px-4 py-4">
        <div className="max-w-xl mx-auto">
          {isEnd ? (
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-3">End of conversation</p>
              <button
                onClick={onRestart}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors"
              >
                ↺ Restart Conversation
              </button>
            </div>
          ) : (
            <div>
              <p className="text-xs text-gray-500 mb-2">Choose a response:</p>
              <div className="flex flex-wrap gap-2">
                {currentNode.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => onSelectOption(opt.label, opt.nextId)}
                    disabled={!opt.nextId}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-gray-100 text-sm rounded-xl border border-gray-600 hover:border-gray-500 transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
