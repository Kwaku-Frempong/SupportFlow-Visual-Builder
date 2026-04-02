const TYPE_STYLES = {
  start: {
    border: 'border-emerald-500',
    badge: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
    icon: '▶',
    label: 'Start',
  },
  question: {
    border: 'border-blue-500',
    badge: 'bg-blue-500/20 text-blue-400 border border-blue-500/40',
    icon: '?',
    label: 'Question',
  },
  end: {
    border: 'border-red-500',
    badge: 'bg-red-500/20 text-red-400 border border-red-500/40',
    icon: '■',
    label: 'End',
  },
};

export default function NodeCard({ node, isSelected, nodeRef, onMouseDown, onMouseUp }) {
  const style = TYPE_STYLES[node.type] || TYPE_STYLES.question;

  return (
    <div
      ref={nodeRef}
      style={{
        position: 'absolute',
        left: node.position.x,
        top: node.position.y,
        width: 200,
        zIndex: 1,
        cursor: 'grab',
      }}
      className={`
        rounded-xl border-2 ${style.border}
        bg-gray-900 shadow-xl select-none
        transition-shadow duration-150
        ${isSelected ? 'ring-2 ring-white/30 shadow-2xl' : 'hover:shadow-lg hover:brightness-110'}
      `}
      onMouseDown={e => onMouseDown(e, node.id)}
      onMouseUp={e => { e.stopPropagation(); onMouseUp(node.id); }}
    >
      {/* Header */}
      <div className="px-3 pt-3 pb-1 flex items-center gap-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
          {style.icon} {style.label}
        </span>
      </div>

      {/* Body */}
      <div className="px-3 pb-3">
        <p className="text-sm text-gray-200 leading-snug mt-1">{node.text}</p>

        {node.options.length > 0 && (
          <div className="mt-2 space-y-1">
            {node.options.map((opt, i) => (
              <div
                key={i}
                className="text-xs text-gray-400 bg-gray-800 rounded px-2 py-1 truncate"
              >
                → {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
