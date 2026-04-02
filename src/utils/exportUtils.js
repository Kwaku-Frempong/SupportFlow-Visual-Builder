/**
 * Downloads the current flow state as a JSON file.
 */
export function exportFlowJSON(nodes, meta) {
  const data = { meta, nodes };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'flow_data.json';
  a.click();
  URL.revokeObjectURL(url);
}

let _idCounter = 100;
export function generateId() {
  return String(++_idCounter);
}
