import { buildBezierPath, bezierMidpoint } from '../../utils/pathUtils';

export default function SVGLayer({ nodes, nodeRefs, canvasRef, svgTrigger, canvasSize }) {
  // svgTrigger is read to force re-render on drag; not used directly
  void svgTrigger;

  if (!canvasRef.current) return null;

  const canvasRect = canvasRef.current.getBoundingClientRect();
  const connections = [];

  nodes.forEach(node => {
    node.options.forEach(opt => {
      if (!opt.nextId) return;
      const fromRef = nodeRefs.get(node.id);
      const toRef = nodeRefs.get(opt.nextId);
      if (!fromRef?.current || !toRef?.current) return;

      const fromRect = fromRef.current.getBoundingClientRect();
      const toRect = toRef.current.getBoundingClientRect();

      const x1 = fromRect.left + fromRect.width / 2 - canvasRect.left;
      const y1 = fromRect.bottom - canvasRect.top;
      const x2 = toRect.left + toRect.width / 2 - canvasRect.left;
      const y2 = toRect.top - canvasRect.top;

      connections.push({
        key: `${node.id}-${opt.nextId}-${opt.label}`,
        x1, y1, x2, y2,
        label: opt.label,
      });
    });
  });

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: canvasSize.w,
        height: canvasSize.h,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'visible',
      }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#4b5563" />
        </marker>
      </defs>

      {connections.map(({ key, x1, y1, x2, y2, label }) => {
        const d = buildBezierPath(x1, y1, x2, y2);
        const mid = bezierMidpoint(x1, y1, x2, y2);
        return (
          <g key={key}>
            <path
              d={d}
              fill="none"
              stroke="#4b5563"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            {/* Label background */}
            <rect
              x={mid.x - 42}
              y={mid.y - 10}
              width="84"
              height="20"
              rx="4"
              fill="#1f2937"
              stroke="#374151"
              strokeWidth="1"
            />
            <text
              x={mid.x}
              y={mid.y + 4}
              textAnchor="middle"
              fill="#9ca3af"
              fontSize="10"
              fontFamily="system-ui, sans-serif"
            >
              {label.length > 12 ? label.slice(0, 11) + '…' : label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
