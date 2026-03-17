// Cross-cloud translation
function initTranslation() {
  document.querySelectorAll('.target-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      const sourceCloud = getCurrentCloud();
      translateArchitecture(sourceCloud, target);
    });
  });
}

function getCurrentCloud() {
  const activeTab = document.querySelector('.cloud-tab.active');
  return activeTab ? activeTab.dataset.cloud : 'aws';
}

function translateArchitecture(sourceCloud, targetCloud) {
  if (nodes.length === 0) {
    showToast('Add some services to the canvas first!');
    return;
  }
  
  const mapKey = getTranslationKey(sourceCloud, targetCloud);
  const map = mapKey ? TRANSLATION_MAP[mapKey] : null;
  
  const mappings = [];
  const unmapped = [];
  
  nodes.forEach(node => {
    if (node.cloud !== sourceCloud) return;
    
    const translation = map ? map[node.serviceId] : null;
    if (translation) {
      mappings.push({
        from: { name: node.service.name, icon: node.service.icon, id: node.serviceId },
        to: translation,
        nodeId: node.id
      });
    } else {
      unmapped.push(node);
    }
  });
  
  // Show results
  const resultPanel = document.getElementById('translate-result');
  const mappingList = document.getElementById('mapping-list');
  
  if (mappings.length === 0 && unmapped.length === 0) {
    showToast('No services from ' + sourceCloud.toUpperCase() + ' found on canvas');
    return;
  }
  
  resultPanel.classList.remove('hidden');
  
  const targetCloudName = { aws: 'AWS', azure: 'Azure', gcp: 'GCP' }[targetCloud];
  
  let html = '';
  mappings.forEach(m => {
    const targetServices = getAllServices(targetCloud);
    const targetService = targetServices.find(s => s.id === m.to.id);
    const icon = targetService ? targetService.icon : '🔄';
    
    html += `
      <div class="mapping-item">
        <div class="mapping-from">${m.from.icon} ${m.from.name} (${sourceCloud.toUpperCase()})</div>
        <div class="mapping-arrow">↓ translates to</div>
        <div class="mapping-to">${icon} ${m.to.name}</div>
        <div class="mapping-note">${m.to.note}</div>
      </div>
    `;
  });
  
  if (unmapped.length > 0) {
    html += `<div class="mapping-item" style="border-color: rgba(255,107,107,0.3);">
      <div class="mapping-from" style="color: var(--accent-red)">⚠ ${unmapped.length} service(s) have no direct equivalent</div>
      <div class="mapping-note">${unmapped.map(n => n.service.name).join(', ')}</div>
    </div>`;
  }
  
  mappingList.innerHTML = html;
  
  // Store for apply
  resultPanel.dataset.targetCloud = targetCloud;
  resultPanel.dataset.mappingsJson = JSON.stringify(mappings);
  
  showToast(`Found ${mappings.length} equivalent service${mappings.length !== 1 ? 's' : ''} in ${targetCloudName}`);
  
  // Setup apply button
  document.getElementById('btn-apply-translation').onclick = () => applyTranslation(mappings, targetCloud);
}

function applyTranslation(mappings, targetCloud) {
  if (mappings.length === 0) return;
  
  saveHistory();
  
  // Find the bounding box of current nodes to place translated ones next to them
  const maxX = Math.max(...nodes.map(n => n.x)) + 180;
  const startY = Math.min(...nodes.map(n => n.y));
  
  mappings.forEach((mapping, i) => {
    const targetServices = getAllServices(targetCloud);
    const targetService = targetServices.find(s => s.id === mapping.to.id);
    if (!targetService) return;
    
    const x = maxX + 40;
    const y = startY + i * 120;
    
    addNode(targetService.id, targetCloud, x, y);
    
    // Connect original to translated
    const newNodeId = `node_${nodeCounter}`;
    setTimeout(() => {
      addConnection(mapping.nodeId, newNodeId);
    }, 50);
  });
  
  showToast(`Applied ${targetCloud.toUpperCase()} architecture! ${mappings.length} services added.`);
  
  // Switch to target cloud tab
  document.querySelectorAll('.cloud-tab').forEach(t => t.classList.remove('active'));
  const targetTab = document.querySelector(`.cloud-tab[data-cloud="${targetCloud}"]`);
  if (targetTab) {
    // Don't switch - keep original visible too
  }
}
