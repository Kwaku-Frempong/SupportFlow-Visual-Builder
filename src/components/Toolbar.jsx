export default function Toolbar({ mode, onToggleMode, onAddNode, onExport }) {
  const isPreview = mode === 'preview';

  return (
    <header className="flex items-center gap-3 px-5 py-3 bg-gray-900 border-b border-gray-700 shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2 mr-4">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
          SF
        </div>
        <span className="text-sm font-semibold text-gray-100">SupportFlow</span>
        <span className="text-xs text-gray-500">/ Flow Editor</span>
      </div>

      <div className="flex-1" />

      {/* Editor-only actions */}
      {!isPreview && (
        <>
          <button
            onClick={onAddNode}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-gray-100 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 transition-colors"
          >
            <span className="text-base leading-none">+</span> Add Node
          </button>
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-gray-100 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 transition-colors"
          >
            ↓ Export JSON
          </button>
        </>
      )}

      {/* Mode toggle */}
      <button
        onClick={onToggleMode}
        className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
          isPreview
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-100 border border-gray-500'
            : 'bg-blue-600 hover:bg-blue-500 text-white'
        }`}
      >
        {isPreview ? (
          <>✏ Editor View</>
        ) : (
          <>▶ Preview Bot</>
        )}
      </button>
    </header>
  );
}
