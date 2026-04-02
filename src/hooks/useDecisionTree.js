import { useState, useRef, createRef } from 'react';
import initialData from '../data/flow_data.json';
import { exportFlowJSON, generateId } from '../utils/exportUtils';

function buildNodeRefs(nodes) {
  const map = new Map();
  nodes.forEach(n => map.set(n.id, createRef()));
  return map;
}

export function useDecisionTree() {
  const [nodes, setNodes] = useState(initialData.nodes);
  const [meta] = useState(initialData.meta);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [mode, setMode] = useState('editor'); // 'editor' | 'preview'
  const [previewState, setPreviewState] = useState(null);
  const [svgTrigger, setSvgTrigger] = useState(0);

  // nodeRefs: stable Map<id, ref> — rebuilt when node set changes
  const nodeRefsRef = useRef(buildNodeRefs(initialData.nodes));

  // dragState stored in ref to avoid stale closures in mousemove
  const dragStateRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // canvasRef: owned here, passed to Canvas and SVGLayer
  const canvasRef = useRef(null);

  // ─── Node mutations ───────────────────────────────────────────────

  function updateNodeText(id, text) {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, text } : n));
  }

  function updateOptionLabel(id, optionIndex, label) {
    setNodes(prev => prev.map(n => {
      if (n.id !== id) return n;
      const options = n.options.map((o, i) => i === optionIndex ? { ...o, label } : o);
      return { ...n, options };
    }));
  }

  function updateOptionNextId(id, optionIndex, nextId) {
    setNodes(prev => prev.map(n => {
      if (n.id !== id) return n;
      const options = n.options.map((o, i) => i === optionIndex ? { ...o, nextId } : o);
      return { ...n, options };
    }));
  }

  function addOption(id) {
    setNodes(prev => prev.map(n => {
      if (n.id !== id) return n;
      return { ...n, options: [...n.options, { label: 'New Option', nextId: '' }] };
    }));
  }

  function removeOption(id, optionIndex) {
    setNodes(prev => prev.map(n => {
      if (n.id !== id) return n;
      return { ...n, options: n.options.filter((_, i) => i !== optionIndex) };
    }));
  }

  function addNode() {
    const newId = generateId();
    const newNode = {
      id: newId,
      type: 'question',
      text: 'New question?',
      position: { x: 500, y: 400 },
      options: [],
    };
    const newNodes = [...nodes, newNode];
    // Rebuild refs map to include new node
    nodeRefsRef.current = buildNodeRefs(newNodes);
    setNodes(newNodes);
    setSelectedNodeId(newId);
  }

  function deleteNode(id) {
    const newNodes = nodes
      .filter(n => n.id !== id)
      .map(n => ({
        ...n,
        options: n.options.filter(o => o.nextId !== id),
      }));
    nodeRefsRef.current = buildNodeRefs(newNodes);
    setNodes(newNodes);
    setSelectedNodeId(null);
  }

  function updateNodePosition(id, x, y) {
    setNodes(prev => prev.map(n =>
      n.id === id ? { ...n, position: { x: Math.max(0, x), y: Math.max(0, y) } } : n
    ));
  }

  // ─── Drag logic ──────────────────────────────────────────────────

  function startDrag(e, nodeId) {
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const node = nodes.find(n => n.id === nodeId);
    const ds = {
      nodeId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      offsetX: e.clientX - canvasRect.left - node.position.x,
      offsetY: e.clientY - canvasRect.top - node.position.y,
      hasMoved: false,
    };
    dragStateRef.current = ds;
  }

  function onCanvasMouseMove(e) {
    const ds = dragStateRef.current;
    if (!ds) return;

    const DRAG_THRESHOLD = 4;
    if (!ds.hasMoved) {
      const dx = Math.abs(e.clientX - ds.startClientX);
      const dy = Math.abs(e.clientY - ds.startClientY);
      if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) return;
      dragStateRef.current = { ...ds, hasMoved: true };
      setIsDragging(true);
    }

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - canvasRect.left - dragStateRef.current.offsetX;
    const newY = e.clientY - canvasRect.top - dragStateRef.current.offsetY;
    updateNodePosition(dragStateRef.current.nodeId, newX, newY);
    setSvgTrigger(t => t + 1);
  }

  function onCanvasMouseUp(nodeId) {
    const ds = dragStateRef.current;
    // If we didn't actually move, treat as a click → select node
    if (ds && !ds.hasMoved && nodeId) {
      setSelectedNodeId(nodeId);
    }
    dragStateRef.current = null;
    setIsDragging(false);
  }

  function onCanvasBackgroundClick() {
    if (!isDragging) {
      setSelectedNodeId(null);
    }
  }

  // ─── Mode / Preview ──────────────────────────────────────────────

  function toggleMode() {
    if (mode === 'editor') {
      const startNode = nodes.find(n => n.type === 'start') || nodes[0];
      setPreviewState({
        currentNodeId: startNode.id,
        history: [{ type: 'bot', text: startNode.text }],
      });
      setMode('preview');
      setSelectedNodeId(null);
    } else {
      setMode('editor');
      setPreviewState(null);
    }
  }

  function selectPreviewOption(label, nextId) {
    const nextNode = nodes.find(n => n.id === nextId);
    if (!nextNode) return;
    setPreviewState(prev => ({
      currentNodeId: nextId,
      history: [
        ...prev.history,
        { type: 'user', text: label },
        { type: 'bot', text: nextNode.text },
      ],
    }));
  }

  function restartPreview() {
    const startNode = nodes.find(n => n.type === 'start') || nodes[0];
    setPreviewState({
      currentNodeId: startNode.id,
      history: [{ type: 'bot', text: startNode.text }],
    });
  }

  // ─── Export ──────────────────────────────────────────────────────

  function exportJSON() {
    exportFlowJSON(nodes, meta);
  }

  // ─── Derived ─────────────────────────────────────────────────────

  const currentPreviewNode = previewState
    ? nodes.find(n => n.id === previewState.currentNodeId)
    : null;

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;

  return {
    nodes,
    meta,
    selectedNodeId,
    selectedNode,
    mode,
    previewState,
    currentPreviewNode,
    isDragging,
    svgTrigger,
    canvasRef,
    nodeRefs: nodeRefsRef.current,
    // mutations
    updateNodeText,
    updateOptionLabel,
    updateOptionNextId,
    addOption,
    removeOption,
    addNode,
    deleteNode,
    setSelectedNodeId,
    startDrag,
    onCanvasMouseMove,
    onCanvasMouseUp,
    onCanvasBackgroundClick,
    toggleMode,
    selectPreviewOption,
    restartPreview,
    exportJSON,
  };
}
