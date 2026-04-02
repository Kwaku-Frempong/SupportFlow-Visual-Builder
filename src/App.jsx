import { useDecisionTree } from './hooks/useDecisionTree';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas/Canvas';
import EditPanel from './components/EditPanel';
import PreviewPanel from './components/Preview/PreviewPanel';

export default function App() {
  const tree = useDecisionTree();

  function handleNodeMouseDown(e, nodeId) {
    e.stopPropagation();
    tree.startDrag(e, nodeId);
  }

  function handleCanvasMouseUp(nodeId) {
    tree.onCanvasMouseUp(nodeId);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Toolbar
        mode={tree.mode}
        onToggleMode={tree.toggleMode}
        onAddNode={tree.addNode}
        onExport={tree.exportJSON}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {tree.mode === 'preview' ? (
          <PreviewPanel
            previewState={tree.previewState}
            currentNode={tree.currentPreviewNode}
            onSelectOption={tree.selectPreviewOption}
            onRestart={tree.restartPreview}
            onBack={tree.toggleMode}
          />
        ) : (
          <>
            <Canvas
              nodes={tree.nodes}
              meta={tree.meta}
              selectedNodeId={tree.selectedNodeId}
              nodeRefs={tree.nodeRefs}
              canvasRef={tree.canvasRef}
              svgTrigger={tree.svgTrigger}
              isDragging={tree.isDragging}
              onNodeMouseDown={handleNodeMouseDown}
              onNodeMouseUp={tree.onCanvasMouseUp}
              onMouseMove={tree.onCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onBackgroundClick={tree.onCanvasBackgroundClick}
            />

            {/* Edit Panel (slides in when a node is selected) */}
            <div
              style={{
                width: tree.selectedNode ? 300 : 0,
                overflow: 'hidden',
                transition: 'width 0.2s ease',
                flexShrink: 0,
              }}
            >
              <EditPanel
                node={tree.selectedNode}
                nodes={tree.nodes}
                onUpdateText={tree.updateNodeText}
                onUpdateOptionLabel={tree.updateOptionLabel}
                onUpdateOptionNextId={tree.updateOptionNextId}
                onAddOption={tree.addOption}
                onRemoveOption={tree.removeOption}
                onDeleteNode={tree.deleteNode}
                onClose={() => tree.setSelectedNodeId(null)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
