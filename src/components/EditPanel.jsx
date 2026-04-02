export default function EditPanel({
  node,
  nodes,
  onUpdateText,
  onUpdateOptionLabel,
  onUpdateOptionNextId,
  onAddOption,
  onRemoveOption,
  onDeleteNode,
  onClose,
}) {
  if (!node) return null;

  const TYPE_BADGE = {
    start: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    question: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    end: 'bg-red-500/20 text-red-400 border-red-500/40',
  };

  const otherNodes = nodes.filter(n => n.id !== node.id);

  return (
    <div
      className="flex flex-col bg-gray-900 border-l border-gray-700 overflow-y-auto"
      style={{ width: 300, minWidth: 300, height: '100%' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-100">Edit Node</span>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${TYPE_BADGE[node.type] || TYPE_BADGE.question}`}>
            {node.type}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200 text-lg leading-none"
          title="Close panel"
        >
          ×
        </button>
      </div>

      <div className="flex-1 p-4 space-y-5 overflow-y-auto">
        {/* Node ID (read-only) */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Node ID</label>
          <div className="text-xs text-gray-400 bg-gray-800 rounded px-2 py-1 font-mono">
            #{node.id}
          </div>
        </div>

        {/* Question Text */}
        <div>
          <label className="block text-xs text-gray-400 mb-1 font-medium">Question / Message</label>
          <textarea
            className="w-full bg-gray-800 text-gray-100 text-sm rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none resize-none leading-snug"
            rows={3}
            value={node.text}
            onChange={e => onUpdateText(node.id, e.target.value)}
          />
        </div>

        {/* Options */}
        {node.type !== 'end' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-400 font-medium">Answer Options</label>
              <button
                onClick={() => onAddOption(node.id)}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium"
              >
                + Add Option
              </button>
            </div>

            {node.options.length === 0 && (
              <p className="text-xs text-gray-600 italic">No options yet.</p>
            )}

            <div className="space-y-3">
              {node.options.map((opt, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-3 space-y-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Label</label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 text-gray-100 text-sm rounded px-2 py-1 border border-gray-600 focus:border-blue-500 focus:outline-none"
                      value={opt.label}
                      onChange={e => onUpdateOptionLabel(node.id, i, e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Goes to</label>
                    <select
                      className="w-full bg-gray-700 text-gray-100 text-sm rounded px-2 py-1 border border-gray-600 focus:border-blue-500 focus:outline-none"
                      value={opt.nextId || ''}
                      onChange={e => onUpdateOptionNextId(node.id, i, e.target.value)}
                    >
                      <option value="">(none)</option>
                      {otherNodes.map(n => (
                        <option key={n.id} value={n.id}>
                          #{n.id} — {n.text.slice(0, 30)}{n.text.length > 30 ? '…' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => onRemoveOption(node.id, i)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove option
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer: Delete */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => {
            if (window.confirm(`Delete node #${node.id}? This cannot be undone.`)) {
              onDeleteNode(node.id);
            }
          }}
          className="w-full text-sm text-red-400 border border-red-500/30 hover:bg-red-500/10 rounded-lg py-2 transition-colors"
        >
          Delete Node
        </button>
      </div>
    </div>
  );
}
