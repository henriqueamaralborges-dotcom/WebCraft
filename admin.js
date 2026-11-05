/**
 * WebCraft - Script do Painel Administrativo (Controle de Acesso, Edição de Preços e Leads)
 */

// ==========================================================================
// 1. Constantes e Padrões Iniciais do Sistema
// ==========================================================================
const DEFAULT_AUTH = {
  username: "admin",
  password: "webcraft2026"
};

const DEFAULT_CONFIG = {
  whatsappPhone: "5511974814897",
  contactEmail: "contato@webcraft.com.br",
  agencyName: "WebCraft",
  maxInstallments: 12
};

const DEFAULT_PRICING = {
  bases: {
    "express": { name: "Site Express / One-Page", price: 590 },
    "multi": { name: "Site Institucional Multipáginas", price: 1190 }
  },
  extraPageUnitPrice: 150,
  modules: {
    "blog": { name: "Criação de Blog / Notícias", price: 250 },
    "galeria": { name: "Galeria / Portfólio Interativo", price: 120 },
    "whatsapp": { name: "Botão Flutuante do WhatsApp", price: 50 },
    "formulario": { name: "Formulário de Orçamento Completo", price: 100 },
    "agendamento": { name: "Sistema de Agendamento Online", price: 200 },
    "catalogo": { name: "Catálogo de Produtos", price: 300 },
    "seo": { name: "Otimização SEO Local", price: 200 },
    "pixel": { name: "Instalação de Pixel de Anúncios", price: 100 },
    "dominio": { name: "Registro de Domínio por 1 Ano", price: 60 }
  },
  maintenance: {
    "basico": { name: "Plano Básico", price: 49 },
    "pro": { name: "Plano Pro", price: 99 },
    "premium": { name: "Plano Premium", price: 149 }
  }
};

// ==========================================================================
// 2. Utilitários de Armazenamento Local (localStorage)
// ==========================================================================
function getAuthCredentials() {
  const saved = localStorage.getItem('webcraft_admin_auth');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  return DEFAULT_AUTH;
}

function getStoredPricing() {
  const saved = localStorage.getItem('webcraft_pricing');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  return JSON.parse(JSON.stringify(DEFAULT_PRICING));
}

function getStoredConfig() {
  const saved = localStorage.getItem('webcraft_config');
  if (saved) {
    try { return { ...DEFAULT_CONFIG, ...JSON.parse(saved) }; } catch (e) {}
  }
  return { ...DEFAULT_CONFIG };
}

function getStoredLeads() {
  const saved = localStorage.getItem('webcraft_leads');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  // Leads de exemplo caso esteja vazio
  const initialLeads = [
    {
      id: "LEAD-101",
      date: new Date(Date.now() - 3600000 * 5).toISOString(),
      clientName: "Marcos Vinícius",
      clientCompany: "Clínica Odonto Vida",
      clientPhone: "(11) 98765-4321",
      baseName: "Site Institucional Multipáginas",
      basePrice: 1190,
      modules: ["Formulário de Orçamento Completo", "Botão Flutuante do WhatsApp", "Otimização SEO Local"],
      extraPages: 2,
      maintenanceName: "Plano Pro (R$ 99/mês)",
      total: 1840,
      status: "novo"
    },
    {
      id: "LEAD-102",
      date: new Date(Date.now() - 3600000 * 24).toISOString(),
      clientName: "Camila Ferreira",
      clientCompany: "Artes & Decoração",
      clientPhone: "(11) 97123-8899",
      baseName: "Site Express / One-Page",
      basePrice: 590,
      modules: ["Galeria / Portfólio Interativo", "Botão Flutuante do WhatsApp"],
      extraPages: 0,
      maintenanceName: "Plano Básico (R$ 49/mês)",
      total: 760,
      status: "atendimento"
    }
  ];
  localStorage.setItem('webcraft_leads', JSON.stringify(initialLeads));
  return initialLeads;
}

const formatCurrency = (val) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
};

// ==========================================================================
// 3. Sistema de Controle de Acesso e Autenticação
// ==========================================================================
function checkSession() {
  const isLogged = sessionStorage.getItem('webcraft_admin_logged') === 'true';
  const loginWrapper = document.getElementById('login-screen');
  const adminLayout = document.getElementById('admin-dashboard');

  if (isLogged) {
    if (loginWrapper) loginWrapper.style.display = 'none';
    if (adminLayout) adminLayout.classList.add('active');
    initDashboard();
  } else {
    if (loginWrapper) loginWrapper.style.display = 'flex';
    if (adminLayout) adminLayout.classList.remove('active');
  }
}

function setupAuth() {
  const loginForm = document.getElementById('login-form');
  const loginAlert = document.getElementById('login-alert');
  const logoutBtn = document.getElementById('btn-logout');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userVal = document.getElementById('login-username').value.trim();
      const passVal = document.getElementById('login-password').value.trim();

      const creds = getAuthCredentials();

      if (userVal === creds.username && passVal === creds.password) {
        sessionStorage.setItem('webcraft_admin_logged', 'true');
        if (loginAlert) loginAlert.classList.remove('show');
        showToast("Bem-vindo ao Painel WebCraft!", "success");
        checkSession();
      } else {
        if (loginAlert) {
          loginAlert.classList.add('show');
        }
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('webcraft_admin_logged');
      showToast("Sessão finalizada com sucesso.");
      setTimeout(() => {
        window.location.reload();
      }, 400);
    });
  }
}

// ==========================================================================
// 4. Edição de Preços em Tempo Real
// ==========================================================================
function populatePricingForm() {
  const pricing = getStoredPricing();

  // Bases
  const inputBaseExpress = document.getElementById('price-base-express');
  const inputBaseMulti = document.getElementById('price-base-multi');
  const inputExtraPage = document.getElementById('price-extra-page');

  if (inputBaseExpress && pricing.bases.express) inputBaseExpress.value = pricing.bases.express.price;
  if (inputBaseMulti && pricing.bases.multi) inputBaseMulti.value = pricing.bases.multi.price;
  if (inputExtraPage) inputExtraPage.value = pricing.extraPageUnitPrice || 150;

  // Módulos
  Object.keys(pricing.modules).forEach(modKey => {
    const input = document.getElementById(`price-mod-${modKey}`);
    if (input) {
      input.value = pricing.modules[modKey].price;
    }
  });

  // Planos de Manutenção
  Object.keys(pricing.maintenance).forEach(maintKey => {
    const input = document.getElementById(`price-maint-${maintKey}`);
    if (input) {
      input.value = pricing.maintenance[maintKey].price;
    }
  });
}

function setupPricingActions() {
  const formPricing = document.getElementById('form-pricing');
  const btnResetPricing = document.getElementById('btn-reset-pricing');

  if (formPricing) {
    formPricing.addEventListener('submit', (e) => {
      e.preventDefault();
      const currentPricing = getStoredPricing();

      // Salva Bases
      const expVal = parseFloat(document.getElementById('price-base-express')?.value) || 590;
      const multiVal = parseFloat(document.getElementById('price-base-multi')?.value) || 1190;
      const extraVal = parseFloat(document.getElementById('price-extra-page')?.value) || 150;

      currentPricing.bases.express.price = expVal;
      currentPricing.bases.multi.price = multiVal;
      currentPricing.extraPageUnitPrice = extraVal;

      // Salva Módulos
      Object.keys(currentPricing.modules).forEach(modKey => {
        const input = document.getElementById(`price-mod-${modKey}`);
        if (input) {
          currentPricing.modules[modKey].price = parseFloat(input.value) || 0;
        }
      });

      // Salva Planos
      Object.keys(currentPricing.maintenance).forEach(maintKey => {
        const input = document.getElementById(`price-maint-${maintKey}`);
        if (input) {
          currentPricing.maintenance[maintKey].price = parseFloat(input.value) || 0;
        }
      });

      localStorage.setItem('webcraft_pricing', JSON.stringify(currentPricing));
      showToast("✅ Todos os preços foram atualizados no site!", "success");
    });
  }

  if (btnResetPricing) {
    btnResetPricing.addEventListener('click', () => {
      if (confirm("Deseja realmente restaurar todos os preços para os valores de fábrica?")) {
        localStorage.removeItem('webcraft_pricing');
        populatePricingForm();
        showToast("Preços restaurados para o padrão original.");
      }
    });
  }
}

// ==========================================================================
// 5. Gestão de Leads e Orçamentos Recebidos
// ==========================================================================
function renderLeadsTable(searchTerm = "") {
  const tbody = document.getElementById('leads-table-body');
  if (!tbody) return;

  const leads = getStoredLeads();
  const term = searchTerm.toLowerCase().trim();

  const filtered = leads.filter(item => {
    return (
      (item.clientName && item.clientName.toLowerCase().includes(term)) ||
      (item.clientCompany && item.clientCompany.toLowerCase().includes(term)) ||
      (item.clientPhone && item.clientPhone.includes(term)) ||
      (item.baseName && item.baseName.toLowerCase().includes(term))
    );
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 32px;">
          Nenhum orçamento encontrado.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map((lead, idx) => {
    const rawPhone = (lead.clientPhone || "").replace(/\D/g, "");
    const formattedDate = new Date(lead.date).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const statusBadgeClass = {
      'novo': 'novo',
      'atendimento': 'atendimento',
      'fechado': 'fechado',
      'cancelado': 'cancelado'
    }[lead.status] || 'novo';

    const statusLabel = {
      'novo': 'Novo',
      'atendimento': 'Em Contato',
      'fechado': 'Fechado',
      'cancelado': 'Cancelado'
    }[lead.status] || 'Novo';

    return `
      <tr>
        <td><strong>#${idx + 1}</strong></td>
        <td>
          <div style="font-weight: 700;">${lead.clientName}</div>
          <div style="font-size: 0.775rem; color: var(--text-muted);">${lead.clientCompany || 'Empresa não informada'}</div>
        </td>
        <td>
          <a href="https://wa.me/55${rawPhone}" target="_blank" style="color: #25D366; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
            <i class="fa-brands fa-whatsapp"></i> ${lead.clientPhone}
          </a>
        </td>
        <td>
          <div style="font-size: 0.85rem;">${lead.baseName}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">
            ${lead.modules ? lead.modules.length : 0} módulos adicionais
          </div>
        </td>
        <td>
          <strong style="color: var(--emerald-400);">${formatCurrency(lead.total)}</strong>
        </td>
        <td>
          <select class="admin-input" style="padding: 4px 8px; font-size: 0.75rem;" onchange="updateLeadStatus('${lead.id}', this.value)">
            <option value="novo" ${lead.status === 'novo' ? 'selected' : ''}>Novo</option>
            <option value="atendimento" ${lead.status === 'atendimento' ? 'selected' : ''}>Em Contato</option>
            <option value="fechado" ${lead.status === 'fechado' ? 'selected' : ''}>Fechado</option>
            <option value="cancelado" ${lead.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
          </select>
        </td>
        <td>
          <div class="table-actions">
            <a href="https://wa.me/55${rawPhone}" target="_blank" class="btn-table-action whatsapp" title="Falar no WhatsApp">
              <i class="fa-brands fa-whatsapp"></i>
            </a>
            <button type="button" class="btn-table-action" onclick="deleteLead('${lead.id}')" title="Excluir Lead">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.updateLeadStatus = function(leadId, newStatus) {
  const leads = getStoredLeads();
  const index = leads.findIndex(l => l.id === leadId);
  if (index !== -1) {
    leads[index].status = newStatus;
    localStorage.setItem('webcraft_leads', JSON.stringify(leads));
    showToast("Status do lead atualizado!");
    updateDashboardMetrics();
  }
};

window.deleteLead = function(leadId) {
  if (confirm("Deseja realmente remover este orçamento do histórico?")) {
    let leads = getStoredLeads();
    leads = leads.filter(l => l.id !== leadId);
    localStorage.setItem('webcraft_leads', JSON.stringify(leads));
    renderLeadsTable();
    updateDashboardMetrics();
    showToast("Orçamento removido.");
  }
};

function setupLeadsActions() {
  const searchInput = document.getElementById('search-leads');
  const btnExportCsv = document.getElementById('btn-export-csv');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderLeadsTable(e.target.value);
    });
  }

  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', () => {
      const leads = getStoredLeads();
      if (leads.length === 0) {
        showToast("Não há leads para exportar.", "warning");
        return;
      }

      let csv = "ID;Data;Nome;Empresa;WhatsApp;Estrutura;Total (R$);Status\n";
      leads.forEach(l => {
        csv += `"${l.id}";"${l.date}";"${l.clientName}";"${l.clientCompany}";"${l.clientPhone}";"${l.baseName}";"${l.total}";"${l.status}"\n`;
      });

      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads_webcraft_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast("Arquivo CSV baixado com sucesso!", "success");
    });
  }
}

// ==========================================================================
// 6. Métricas do Dashboard
// ==========================================================================
function updateDashboardMetrics() {
  const leads = getStoredLeads();

  const totalLeadsEl = document.getElementById('metric-total-leads');
  const totalValueEl = document.getElementById('metric-total-value');
  const avgTicketEl = document.getElementById('metric-avg-ticket');
  const closedRateEl = document.getElementById('metric-closed-rate');

  const count = leads.length;
  const totalValue = leads.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const avg = count > 0 ? totalValue / count : 0;
  const closed = leads.filter(l => l.status === 'fechado').length;
  const rate = count > 0 ? Math.round((closed / count) * 100) : 0;

  if (totalLeadsEl) totalLeadsEl.textContent = count;
  if (totalValueEl) totalValueEl.textContent = formatCurrency(totalValue);
  if (avgTicketEl) avgTicketEl.textContent = formatCurrency(avg);
  if (closedRateEl) closedRateEl.textContent = `${rate}%`;
}

// ==========================================================================
// 7. Configurações Gerais e Alteração de Senha
// ==========================================================================
function populateSettingsForm() {
  const config = getStoredConfig();
  const inputPhone = document.getElementById('config-whatsapp-phone');
  const inputEmail = document.getElementById('config-contact-email');

  if (inputPhone) inputPhone.value = config.whatsappPhone;
  if (inputEmail) inputEmail.value = config.contactEmail;
}

function setupSettingsActions() {
  const formSettings = document.getElementById('form-settings');
  const formPassword = document.getElementById('form-password');

  if (formSettings) {
    formSettings.addEventListener('submit', (e) => {
      e.preventDefault();
      const phoneVal = document.getElementById('config-whatsapp-phone').value.replace(/\D/g, '');
      const emailVal = document.getElementById('config-contact-email').value.trim();

      if (phoneVal.length < 10) {
        showToast("Número de WhatsApp inválido.", "warning");
        return;
      }

      const config = getStoredConfig();
      config.whatsappPhone = phoneVal;
      config.contactEmail = emailVal;

      localStorage.setItem('webcraft_config', JSON.stringify(config));
      showToast("Configurações gerais salvas com sucesso!", "success");
    });
  }

  if (formPassword) {
    formPassword.addEventListener('submit', (e) => {
      e.preventDefault();
      const currentPass = document.getElementById('pass-current').value;
      const newPass = document.getElementById('pass-new').value;
      const confirmPass = document.getElementById('pass-confirm').value;

      const creds = getAuthCredentials();

      if (currentPass !== creds.password) {
        showToast("A senha atual digitada está incorreta.", "warning");
        return;
      }

      if (newPass.length < 6) {
        showToast("A nova senha deve ter no mínimo 6 caracteres.", "warning");
        return;
      }

      if (newPass !== confirmPass) {
        showToast("A confirmação da nova senha não confere.", "warning");
        return;
      }

      creds.password = newPass;
      localStorage.setItem('webcraft_admin_auth', JSON.stringify(creds));
      formPassword.reset();
      showToast("Senha de acesso alterada com sucesso!", "success");
    });
  }
}

// ==========================================================================
// 8. Navegação por Abas no Dashboard
// ==========================================================================
function setupTabNavigation() {
  const navButtons = document.querySelectorAll('.nav-item-btn[data-tab]');
  const panels = document.querySelectorAll('.admin-view-panel');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      navButtons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(`panel-${targetTab}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      // Fecha sidebar no mobile
      const sidebar = document.querySelector('.admin-sidebar');
      if (sidebar) sidebar.classList.remove('open');
    });
  });

  // Toggle Sidebar Mobile
  const mobileToggle = document.getElementById('mobile-admin-toggle');
  const sidebar = document.querySelector('.admin-sidebar');
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

// ==========================================================================
// 9. Toast Notification no Admin
// ==========================================================================
let adminToastTimer = null;
function showToast(message, type = "info") {
  let toastEl = document.getElementById('admin-toast');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'admin-toast';
    toastEl.className = 'admin-toast';
    document.body.appendChild(toastEl);
  }

  let icon = '<i class="fa-solid fa-circle-check" style="color: var(--emerald-400);"></i>';
  if (type === "warning") {
    icon = '<i class="fa-solid fa-triangle-exclamation" style="color: var(--amber-500);"></i>';
  }

  toastEl.innerHTML = `${icon} <span>${message}</span>`;
  toastEl.classList.add('show');

  if (adminToastTimer) clearTimeout(adminToastTimer);
  adminToastTimer = setTimeout(() => {
    toastEl.classList.remove('show');
  }, 3500);
}

// ==========================================================================
// 10. Inicialização
// ==========================================================================
function initDashboard() {
  updateDashboardMetrics();
  populatePricingForm();
  renderLeadsTable();
  populateSettingsForm();
}

document.addEventListener('DOMContentLoaded', () => {
  setupAuth();
  setupTabNavigation();
  setupPricingActions();
  setupLeadsActions();
  setupSettingsActions();
  checkSession();
});
