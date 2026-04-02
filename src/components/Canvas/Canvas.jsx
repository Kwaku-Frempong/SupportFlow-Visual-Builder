import SVGLayer from './SVGLayer';
import NodeCard from './NodeCard';

export default function Canvas({
  nodes,
  meta,
  selectedNodeId,
  nodeRefs,
  canvasRef,
  svgTrigger,
  isDragging,
  onNodeMouseDown,
  onNodeMouseUp,
  onMouseMove,
  onMouseUp,
  onBackgroundClick,
}) {
  return (
    <div
      className={`canvas-wrapper flex-1 bg-gray-950 ${isDragging ? 'dragging' : ''}`}
      style={{ position: 'relative' }}
      onMouseMove={onMouseMove}
      onMouseUp={() => onMouseUp(null)}
      onMouseLeave={() => onMouseUp(null)}
      onClick={onBackgroundClick}
    >
      {/* Inner canvas at fixed size for correct SVG coordinate space */}
      <div
        ref={canvasRef}
        style={{
          position: 'relative',
          width: meta.canvas_size.w,
          height: meta.canvas_size.h,
          minWidth: '100%',
          minHeight: '100%',
        }}
      >
        {/* Dot-grid background */}
        <svg
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          <defs>
            <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="#1f2937" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>

        {/* SVG connection lines */}
        <SVGLayer
          nodes={nodes}
          nodeRefs={nodeRefs}
          canvasRef={canvasRef}
          svgTrigger={svgTrigger}
          canvasSize={meta.canvas_size}
        />

        {/* Nodes */}
        {nodes.map(node => (
          <NodeCard
            key={node.id}
            node={node}
            isSelected={node.id === selectedNodeId}
            nodeRef={nodeRefs.get(node.id)}
            onMouseDown={onNodeMouseDown}
            onMouseUp={onNodeMouseUp}
          />
        ))}
      </div>
    </div>
  );
}
