// Canvas state
let nodes = [];
let connections = [];
let selectedNode = null;
let isDraggingNode = false;
let dragOffset = { x: 0, y: 0 };
let canvasOffset = { x: 0, y: 0 };
let zoom = 1;
let nodeCounter = 0;
let currentTool = 'select';
let connectionStart = null;
let isPanning = false;
let panStart = { x: 0, y: 0 };
let history = [];

const canvas = document.getElementById('canvas');
const canvasGrid = document.getElementById('canvas-grid');
const connectionsSvg = document.getElementById('connections-svg');

function initCanvas() {
  // Drag over
  canvas.addEventListener('dragover', (e) => { e.preventDefault(); canvas.classList.add('drag-over'); });
  canvas.addEventListener('dragleave', () => canvas.classList.remove('drag-over'));
  canvas.addEventListener('drop', handleDrop);
  
  // Pan canvas
  canvas.addEventListener('mousedown', (e) => {
    if (e.target === canvas || e.target === canvasGrid || e.target === connectionsSvg) {
      if (currentTool === 'select') {
        isPanning = true;
        panStart = { x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y };
        canvas.style.cursor = 'grabbing';
        deselectAll();
      }
    }
  });
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  
  // Zoom
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    zoom = Math.max(0.3, Math.min(2, zoom + delta));
    applyTransform();
    document.getElementById('zoom-display').textContent = Math.round(zoom * 100) + '%';
  }, { passive: false });
  
  // Tool buttons
  document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentTool = btn.dataset.tool;
      document.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  
  document.getElementById('btn-undo').addEventListener('click', undo);
  document.getElementById('btn-clear').addEventListener('click', clearCanvas);
  document.getElementById('btn-zoom-in').addEventListener('click', () => { zoom = Math.min(2, zoom + 0.1); applyTransform(); document.getElementById('zoom-display').textContent = Math.round(zoom * 100) + '%'; });
  document.getElementById('btn-zoom-out').addEventListener('click', () => { zoom = Math.max(0.3, zoom - 0.1); applyTransform(); document.getElementById('zoom-display').textContent = Math.round(zoom * 100) + '%'; });
}

function applyTransform() {
  canvasGrid.style.transform = `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`;
  canvasGrid.style.transformOrigin = '0 0';
}

function handleDrop(e) {
  e.preventDefault();
  canvas.classList.remove('drag-over');
  const serviceId = e.dataTransfer.getData('serviceId');
  const cloud = e.dataTransfer.getData('cloud');
  if (!serviceId) return;
  
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left - canvasOffset.x) / zoom;
  const y = (e.clientY - rect.top - canvasOffset.y) / zoom;
  
  addNode(serviceId, cloud, x - 60, y - 30);
}

function addNode(serviceId, cloud, x, y) {
  const services = getAllServices(cloud);
  const service = services.find(s => s.id === serviceId);
  if (!service) return;
  
  saveHistory();
  
  const node = {
    id: `node_${++nodeCounter}`,
    serviceId,
    cloud,
    service,
    x, y,
    label: service.name,
    config: {}
  };
  nodes.push(node);
  renderNode(node);
  updateStats();
  document.getElementById('canvas-hint').style.display = 'none';
}

function renderNode(node) {
  const el = document.createElement('div');
  el.className = `canvas-node ${node.cloud}-node`;
  el.id = node.id;
  el.style.left = node.x + 'px';
  el.style.top = node.y + 'px';
  
  el.innerHTML = `
    <button class="node-delete" data-id="${node.id}">✕</button>
    <div class="node-header">
      <span class="node-icon">${node.service.icon}</span>
      <div>
        <div class="node-label" contenteditable="false">${node.label}</div>
        <div class="node-service">${node.service.name}</div>
      </div>
    </div>
    <div class="node-badge">${node.cloud.toUpperCase()}</div>
    <div class="node-ports">
      <div class="node-port port-in" data-node="${node.id}" data-port="in" title="Input"></div>
      <div class="node-port port-out" data-node="${node.id}" data-port="out" title="Output"></div>
    </div>
  `;
  
  canvasGrid.appendChild(el);
  
  // Node drag
  el.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('node-delete') || e.target.classList.contains('node-port')) return;
    if (currentTool !== 'select') return;
    e.stopPropagation();
    selectNode(node);
    isDraggingNode = true;
    const rect = el.getBoundingClientRect();
    dragOffset.x = (e.clientX - rect.left) / zoom;
    dragOffset.y = (e.clientY - rect.top) / zoom;
  });
  
  // Double click to rename
  el.querySelector('.node-label').addEventListener('dblclick', (e) => {
    const label = e.target;
    label.contentEditable = 'true';
    label.focus();
    label.addEventListener('blur', () => { label.contentEditable = 'false'; node.label = label.textContent; });
    label.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); label.blur(); }});
  });
  
  // Delete button
  el.querySelector('.node-delete').addEventListener('click', (e) => {
    e.stopPropagation();
    deleteNode(node.id);
  });
  
  // Port connection
  el.querySelectorAll('.node-port').forEach(port => {
    port.addEventListener('mousedown', (e) => {
      if (currentTool === 'connect' || currentTool === 'select') {
        e.stopPropagation();
        connectionStart = { nodeId: node.id, port: port.dataset.port };
        canvas.style.cursor = 'crosshair';
      }
    });
    port.addEventListener('mouseup', (e) => {
      if (connectionStart && connectionStart.nodeId !== node.id) {
        addConnection(connectionStart.nodeId, node.id);
        connectionStart = null;
        canvas.style.cursor = '';
      }
    });
  });
  
  // Click for properties
  el.addEventListener('click', (e) => {
    if (!isDraggingNode) selectNode(node);
  });
}

function selectNode(node) {
  deselectAll();
  selectedNode = node;
  const el = document.getElementById(node.id);
  if (el) el.classList.add('selected');
  showProperties(node);
}

function deselectAll() {
  selectedNode = null;
  document.querySelectorAll('.canvas-node.selected').forEach(el => el.classList.remove('selected'));
}

function deleteNode(nodeId) {
  saveHistory();
  nodes = nodes.filter(n => n.id !== nodeId);
  connections = connections.filter(c => c.from !== nodeId && c.to !== nodeId);
  const el = document.getElementById(nodeId);
  if (el) el.remove();
  renderConnections();
  updateStats();
  if (nodes.length === 0) document.getElementById('canvas-hint').style.display = '';
}

function addConnection(fromId, toId) {
  const exists = connections.find(c => c.from === fromId && c.to === toId);
  if (exists) return;
  saveHistory();
  const conn = { id: `conn_${Date.now()}`, from: fromId, to: toId };
  connections.push(conn);
  renderConnections();
  updateStats();
}

function renderConnections() {
  connectionsSvg.innerHTML = `<defs><marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#3a3a42" class="connection-arrow"/></marker></defs>`;
  
  connections.forEach(conn => {
    const fromEl = document.getElementById(conn.from);
    const toEl = document.getElementById(conn.to);
    if (!fromEl || !toEl) return;
    
    const fromRect = { x: parseFloat(fromEl.style.left), y: parseFloat(fromEl.style.top), w: fromEl.offsetWidth, h: fromEl.offsetHeight };
    const toRect = { x: parseFloat(toEl.style.left), y: parseFloat(toEl.style.top), w: toEl.offsetWidth, h: toEl.offsetHeight };
    
    const x1 = fromRect.x + fromRect.w;
    const y1 = fromRect.y + fromRect.h / 2;
    const x2 = toRect.x;
    const y2 = toRect.y + toRect.h / 2;
    const cx = (x1 + x2) / 2;
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`);
    path.setAttribute('class', 'connection-path');
    path.setAttribute('marker-end', 'url(#arrowhead)');
    connectionsSvg.appendChild(path);
  });
}

function handleMouseMove(e) {
  if (isPanning) {
    canvasOffset.x = e.clientX - panStart.x;
    canvasOffset.y = e.clientY - panStart.y;
    applyTransform();
  }
  
  if (isDraggingNode && selectedNode) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvasOffset.x) / zoom - dragOffset.x;
    const y = (e.clientY - rect.top - canvasOffset.y) / zoom - dragOffset.y;
    selectedNode.x = Math.max(0, x);
    selectedNode.y = Math.max(0, y);
    const el = document.getElementById(selectedNode.id);
    if (el) { el.style.left = selectedNode.x + 'px'; el.style.top = selectedNode.y + 'px'; }
    renderConnections();
  }
}

function handleMouseUp(e) {
  if (isPanning) { isPanning = false; canvas.style.cursor = ''; }
  if (isDraggingNode) { isDraggingNode = false; }
  if (connectionStart) { connectionStart = null; canvas.style.cursor = ''; }
}

function showProperties(node) {
  const panel = document.getElementById('panel-properties');
  const content = document.getElementById('properties-content');
  document.getElementById('panel-translate').classList.add('hidden');
  panel.classList.remove('hidden');
  
  const cloudColor = node.cloud === 'aws' ? '#FF9900' : node.cloud === 'azure' ? '#0078D4' : '#4285F4';
  
  content.innerHTML = `
    <div class="prop-service-header">
      <div class="prop-icon">${node.service.icon}</div>
      <div>
        <div class="prop-service-name">${node.service.name}</div>
        <div class="prop-cloud-tag" style="color:${cloudColor}">${node.cloud.toUpperCase()} · ${node.service.tf}</div>
      </div>
    </div>
    <div class="prop-section">
      <div class="prop-section-title">Resource Settings</div>
      <div class="prop-field">
        <label class="prop-label">Resource Name</label>
        <input class="prop-input" type="text" value="${node.label}" id="prop-name">
      </div>
      ${getServiceFields(node.service, node.cloud)}
    </div>
    <div class="prop-section">
      <div class="prop-section-title">Tags</div>
      <div class="prop-field">
        <label class="prop-label">Environment</label>
        <select class="prop-select">
          <option>production</option><option>staging</option><option>development</option>
        </select>
      </div>
    </div>
    <div class="prop-section">
      <div class="prop-section-title">Terraform Resource</div>
      <div style="background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); padding: 8px 10px; font-family: var(--font-mono); font-size: 11px; color: var(--accent-green);">resource "${node.service.tf}" "${node.label.toLowerCase().replace(/\s/g,'_')}"</div>
    </div>
  `;
  
  document.getElementById('close-properties').addEventListener('click', () => {
    panel.classList.add('hidden');
    document.getElementById('panel-translate').classList.remove('hidden');
    deselectAll();
  });
  
  document.getElementById('prop-name').addEventListener('input', (e) => {
    node.label = e.target.value;
    const el = document.getElementById(node.id);
    if (el) el.querySelector('.node-label').textContent = node.label;
  });
}

function getServiceFields(service, cloud) {
  const fields = {
    ec2: [['Instance Type', 't3.micro', 'select', ['t3.micro','t3.small','t3.medium','m5.large','c5.xlarge']], ['AMI ID', 'ami-0abcdef1234567890', 'text'], ['Key Pair', 'my-key-pair', 'text']],
    s3: [['Bucket Name', 'my-bucket', 'text'], ['Versioning', 'enabled', 'select', ['enabled','disabled']], ['Access', 'private', 'select', ['private','public-read']]],
    rds: [['Engine', 'mysql', 'select', ['mysql','postgres','mariadb']], ['Instance Class', 'db.t3.micro', 'select', ['db.t3.micro','db.t3.small','db.m5.large']], ['Storage GB', '20', 'text']],
    lambda: [['Runtime', 'nodejs18.x', 'select', ['nodejs18.x','python3.11','java17']], ['Memory MB', '128', 'text'], ['Timeout s', '3', 'text']],
    eks: [['K8s Version', '1.28', 'select', ['1.28','1.27','1.26']], ['Node Count', '2', 'text']],
    vpc: [['CIDR Block', '10.0.0.0/16', 'text'], ['Enable DNS', 'true', 'select', ['true','false']]],
    default: [['Region', 'us-east-1', 'select', ['us-east-1','us-west-2','eu-west-1','ap-south-1']]]
  };
  
  const serviceFields = fields[service.id] || fields.default;
  return serviceFields.map(([label, defaultVal, type, options]) => {
    if (type === 'select' && options) {
      return `<div class="prop-field"><label class="prop-label">${label}</label><select class="prop-select">${options.map(o => `<option${o===defaultVal?' selected':''}>${o}</option>`).join('')}</select></div>`;
    }
    return `<div class="prop-field"><label class="prop-label">${label}</label><input class="prop-input" type="text" value="${defaultVal}"></div>`;
  }).join('');
}

function saveHistory() {
  history.push({ nodes: JSON.parse(JSON.stringify(nodes)), connections: JSON.parse(JSON.stringify(connections)) });
  if (history.length > 30) history.shift();
}

function undo() {
  if (history.length === 0) return;
  const state = history.pop();
  nodes = state.nodes;
  connections = state.connections;
  // Re-render all
  document.querySelectorAll('.canvas-node').forEach(el => el.remove());
  nodes.forEach(n => { const s = getAllServices(n.cloud).find(x => x.id === n.serviceId); n.service = s; renderNode(n); });
  renderConnections();
  updateStats();
  if (nodes.length === 0) document.getElementById('canvas-hint').style.display = '';
  showToast('Undone');
}

function clearCanvas() {
  if (nodes.length === 0) return;
  saveHistory();
  nodes = []; connections = [];
  document.querySelectorAll('.canvas-node').forEach(el => el.remove());
  renderConnections();
  updateStats();
  document.getElementById('canvas-hint').style.display = '';
  document.getElementById('panel-properties').classList.add('hidden');
  document.getElementById('panel-translate').classList.remove('hidden');
  showToast('Canvas cleared');
}

function updateStats() {
  document.getElementById('node-count').textContent = nodes.length + ' service' + (nodes.length !== 1 ? 's' : '');
  document.getElementById('connection-count').textContent = connections.length + ' connection' + (connections.length !== 1 ? 's' : '');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2000);
}
