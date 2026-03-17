// Main app initialization
let currentCloud = 'aws';

document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initTerraform();
  initTranslation();
  initDeploy();
  populateSidebar(currentCloud);
  
  // Cloud tab switching
  document.querySelectorAll('.cloud-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentCloud = tab.dataset.cloud;
      document.querySelectorAll('.cloud-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      populateSidebar(currentCloud);
      
      // Update badge
      const badge = document.getElementById('sidebar-cloud-badge');
      badge.textContent = currentCloud.toUpperCase();
      badge.className = 'cloud-badge ' + (currentCloud !== 'aws' ? currentCloud : '');
      
      // Update source cloud name in translate panel
      const cloudNames = { aws: 'Amazon Web Services', azure: 'Microsoft Azure', gcp: 'Google Cloud Platform' };
      document.getElementById('source-cloud-name').textContent = cloudNames[currentCloud];
      
      const dot = document.querySelector('.translate-cloud-info .cloud-dot');
      dot.className = 'cloud-dot ' + currentCloud;
      
      // Update target buttons (hide current cloud)
      document.querySelectorAll('.target-btn').forEach(btn => {
        btn.style.display = btn.dataset.target === currentCloud ? 'none' : '';
      });
    });
  });
  
  // Search
  document.getElementById('service-search').addEventListener('input', (e) => {
    filterServices(e.target.value);
  });
  
  // Deploy
  document.getElementById('btn-deploy').addEventListener('click', () => {
    document.getElementById('deploy-modal').classList.remove('hidden');
  });
});

function populateSidebar(cloud) {
  const list = document.getElementById('component-list');
  const categories = CLOUD_SERVICES[cloud];
  
  let html = '';
  for (const category in categories) {
    const services = categories[category];
    const catLabel = category.charAt(0).toUpperCase() + category.slice(1);
    
    html += `<div class="category-section" data-category="${category}">`;
    html += `<div class="category-label">${catLabel}</div>`;
    
    services.forEach(service => {
      html += `
        <div class="service-item" draggable="true" data-service-id="${service.id}" data-cloud="${cloud}">
          <div class="service-icon" style="background: ${service.color}22; color: ${service.color}">
            ${service.icon}
          </div>
          <div class="service-info">
            <div class="service-name">${service.name}</div>
            <div class="service-desc">${service.desc}</div>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
  }
  
  list.innerHTML = html;
  
  // Setup drag events
  list.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('serviceId', item.dataset.serviceId);
      e.dataTransfer.setData('cloud', item.dataset.cloud);
      e.dataTransfer.effectAllowed = 'copy';
    });
    
    // Click to add to canvas
    item.addEventListener('click', () => {
      const x = 100 + Math.random() * 400;
      const y = 100 + Math.random() * 300;
      addNode(item.dataset.serviceId, item.dataset.cloud, x, y);
    });
  });
}

function filterServices(query) {
  const items = document.querySelectorAll('.service-item');
  const q = query.toLowerCase();
  
  items.forEach(item => {
    const name = item.querySelector('.service-name').textContent.toLowerCase();
    const desc = item.querySelector('.service-desc').textContent.toLowerCase();
    item.style.display = (!q || name.includes(q) || desc.includes(q)) ? '' : 'none';
  });
  
  // Hide empty categories
  document.querySelectorAll('.category-section').forEach(section => {
    const visible = section.querySelectorAll('.service-item:not([style*="none"])').length;
    section.style.display = visible === 0 ? 'none' : '';
  });
}

function initDeploy() {
  const modal = document.getElementById('deploy-modal');
  
  document.getElementById('close-deploy').addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
  
  document.getElementById('btn-next-deploy').addEventListener('click', () => {
    const cloud = document.getElementById('deploy-cloud').value;
    const region = document.getElementById('deploy-region').value;
    
    document.getElementById('deploy-step-1').classList.remove('active');
    document.getElementById('deploy-step-2').classList.add('active');
    
    const summary = document.getElementById('deploy-summary');
    summary.innerHTML = `
      <strong>Cloud:</strong> ${cloud.toUpperCase()}<br>
      <strong>Region:</strong> ${region}<br>
      <strong>Resources:</strong> ${nodes.length} service${nodes.length !== 1 ? 's' : ''}<br>
      <strong>Connections:</strong> ${connections.length}<br><br>
      <strong>Services to deploy:</strong><br>
      ${nodes.map(n => `• ${n.service.name} (${n.label})`).join('<br>') || '• No services added yet'}
    `;
  });
  
  document.getElementById('btn-prev-deploy').addEventListener('click', () => {
    document.getElementById('deploy-step-2').classList.remove('active');
    document.getElementById('deploy-step-1').classList.add('active');
  });
  
  document.getElementById('btn-confirm-deploy').addEventListener('click', () => {
    document.getElementById('deploy-step-2').classList.remove('active');
    document.getElementById('deploy-step-3').classList.add('active');
    simulateDeploy();
  });
}

function simulateDeploy() {
  const log = document.getElementById('deploy-log');
  log.innerHTML = '';
  const cloud = document.getElementById('deploy-cloud').value;
  
  const steps = [
    { msg: `Initializing Terraform...`, class: 'info', delay: 300 },
    { msg: `✓ Terraform initialized`, class: 'success', delay: 900 },
    { msg: `Validating configuration...`, class: 'info', delay: 1400 },
    { msg: `✓ Configuration is valid`, class: 'success', delay: 1900 },
    { msg: `Planning infrastructure changes...`, class: 'info', delay: 2400 },
    { msg: `  + ${nodes.length} resource${nodes.length !== 1 ? 's' : ''} to add`, class: '', delay: 2900 },
    { msg: `  ~ 0 resources to change`, class: '', delay: 3100 },
    { msg: `  - 0 resources to destroy`, class: '', delay: 3300 },
    { msg: `Applying changes to ${cloud.toUpperCase()}...`, class: 'info', delay: 3800 },
    ...nodes.map((n, i) => ({ msg: `  ✓ Created ${n.service.tf}.${sanitizeName(n.label)}`, class: 'success', delay: 4300 + i * 600 })),
    { msg: `\nApply complete! ${nodes.length} resource${nodes.length !== 1 ? 's' : ''} added.`, class: 'success', delay: 4300 + nodes.length * 600 + 500 },
    { msg: `\nNote: This is a simulation. Connect real credentials to deploy.`, class: 'info', delay: 4300 + nodes.length * 600 + 1000 }
  ];
  
  steps.forEach(step => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className = 'log-line ' + step.class;
      line.textContent = step.msg;
      log.appendChild(line);
      log.scrollTop = log.scrollHeight;
    }, step.delay);
  });
}
