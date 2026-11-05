/**
 * WebCraft - Serviço de Banco de Dados Firebase (Cloud Firestore)
 * 
 * Este módulo gerencia a conexão com o Firebase e sincroniza em tempo real:
 * - Cadastros de clientes / leads (com Nome, Telefone, CPF, CEP, Módulos e Plano)
 * - Tabela de preços dinâmicos
 * - Regras de descontos e promoções
 * - Configurações gerais da agência
 * 
 * Se o Firebase não estiver configurado ou estiver offline, opera automaticamente
 * com fallback transparente via localStorage.
 */

// 1. Configuração padrão do Firebase (Pode ser preenchida aqui ou configurada pelo Painel Admin)
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

let firebaseApp = null;
let firestoreDb = null;
let isFirebaseReady = false;

// 2. Carrega as credenciais salvas no localStorage ou usa o padrão
function getFirebaseConfig() {
  const saved = localStorage.getItem('webcraft_firebase_config');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.projectId && parsed.apiKey) {
        return parsed;
      }
    } catch (e) {}
  }
  return DEFAULT_FIREBASE_CONFIG;
}

// 3. Inicializa o Firebase
function initFirebase() {
  if (isFirebaseReady && firestoreDb) {
    return firestoreDb;
  }

  const config = getFirebaseConfig();

  // Verifica se as chaves mínimas foram informadas
  if (!config.projectId || !config.apiKey) {
    console.warn("[WebCraft DB] Firebase não configurado com chaves válidas. Operando em modo LocalStorage (Offline).");
    isFirebaseReady = false;
    return null;
  }

  try {
    if (typeof firebase === 'undefined') {
      console.warn("[WebCraft DB] SDK do Firebase não encontrado no HTML.");
      isFirebaseReady = false;
      return null;
    }

    if (!firebase.apps || firebase.apps.length === 0) {
      firebaseApp = firebase.initializeApp(config);
    } else {
      firebaseApp = firebase.apps[0];
    }

    firestoreDb = firebase.firestore();
    isFirebaseReady = true;
    console.log("[WebCraft DB] Conexão com Firebase Firestore inicializada com sucesso!");
    return firestoreDb;
  } catch (error) {
    console.error("[WebCraft DB] Erro ao conectar ao Firebase:", error);
    isFirebaseReady = false;
    return null;
  }
}

// 4. Salva a configuração do Firebase (chamado pelo Painel Admin)
function saveFirebaseConfig(config) {
  try {
    localStorage.setItem('webcraft_firebase_config', JSON.stringify(config));
    // Reinicia a conexão
    isFirebaseReady = false;
    firestoreDb = null;
    return initFirebase() !== null;
  } catch (e) {
    console.error("Erro ao salvar config do Firebase:", e);
    return false;
  }
}

// 5. Verifica status da conexão
function getFirebaseStatus() {
  const config = getFirebaseConfig();
  const hasConfig = Boolean(config.projectId && config.apiKey);
  return {
    hasConfig,
    isConnected: isFirebaseReady && Boolean(firestoreDb),
    projectId: config.projectId || ""
  };
}

// ==========================================================================
// 6. OPERAÇÕES DE CLIENTES / LEADS (CADASTROS)
// ==========================================================================

/**
 * Salva um novo cliente cadastrado no Firebase e no LocalStorage
 */
async function dbSaveLead(leadData) {
  const leadId = 'LEAD-' + Math.floor(1000 + Math.random() * 9000);
  const nowIso = new Date().toISOString();

  const newLead = {
    id: leadId,
    date: nowIso,
    ...leadData,
    status: leadData.status || 'novo'
  };

  // 1. Sempre salva no LocalStorage como backup imediato
  try {
    const existing = JSON.parse(localStorage.getItem('webcraft_leads') || '[]');
    existing.unshift(newLead);
    localStorage.setItem('webcraft_leads', JSON.stringify(existing));
  } catch (e) {
    console.error("Erro ao salvar lead no localStorage:", e);
  }

  // 2. Se o Firebase estiver ativo, salva no Cloud Firestore
  const db = initFirebase();
  if (db) {
    try {
      await db.collection('leads').doc(leadId).set({
        ...newLead,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log(`[WebCraft DB] Lead ${leadId} salvo com sucesso no Firestore!`);
    } catch (error) {
      console.error("[WebCraft DB] Erro ao salvar lead no Firestore:", error);
    }
  }

  return newLead;
}

/**
 * Escuta os cadastros de clientes em tempo real (para o Painel Admin)
 * @param {Function} onLeadsUpdated Callback chamado com a lista de leads
 */
function dbListenLeads(onLeadsUpdated) {
  const db = initFirebase();

  if (db) {
    try {
      // Escuta Firestore em tempo real
      const unsubscribe = db.collection('leads')
        .orderBy('date', 'desc')
        .onSnapshot((snapshot) => {
          const leads = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            leads.push({
              ...data,
              id: doc.id
            });
          });

          // Atualiza também o cache local
          localStorage.setItem('webcraft_leads', JSON.stringify(leads));
          onLeadsUpdated(leads, true);
        }, (error) => {
          console.warn("[WebCraft DB] Erro ao escutar Firestore, usando fallback local:", error);
          const fallbackLeads = JSON.parse(localStorage.getItem('webcraft_leads') || '[]');
          onLeadsUpdated(fallbackLeads, false);
        });

      return unsubscribe;
    } catch (e) {
      console.error("[WebCraft DB] Falha ao iniciar listener:", e);
    }
  }

  // Fallback para LocalStorage se o Firebase não estiver configurado
  const localLeads = JSON.parse(localStorage.getItem('webcraft_leads') || '[]');
  onLeadsUpdated(localLeads, false);
  return null;
}

/**
 * Atualiza o status de um pedido/lead (Novo, Em Contato, Fechado, Cancelado)
 */
async function dbUpdateLeadStatus(leadId, newStatus) {
  // Atualiza no LocalStorage
  try {
    const existing = JSON.parse(localStorage.getItem('webcraft_leads') || '[]');
    const index = existing.findIndex(l => l.id === leadId);
    if (index !== -1) {
      existing[index].status = newStatus;
      localStorage.setItem('webcraft_leads', JSON.stringify(existing));
    }
  } catch (e) {}

  // Atualiza no Firestore
  const db = initFirebase();
  if (db) {
    try {
      await db.collection('leads').doc(leadId).update({
        status: newStatus,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log(`[WebCraft DB] Lead ${leadId} status alterado para ${newStatus} no Firestore`);
    } catch (e) {
      console.error("[WebCraft DB] Erro ao atualizar status no Firestore:", e);
    }
  }
}

/**
 * Exclui um cadastro
 */
async function dbDeleteLead(leadId) {
  // Remove do LocalStorage
  try {
    let existing = JSON.parse(localStorage.getItem('webcraft_leads') || '[]');
    existing = existing.filter(l => l.id !== leadId);
    localStorage.setItem('webcraft_leads', JSON.stringify(existing));
  } catch (e) {}

  // Remove do Firestore
  const db = initFirebase();
  if (db) {
    try {
      await db.collection('leads').doc(leadId).delete();
      console.log(`[WebCraft DB] Lead ${leadId} removido do Firestore`);
    } catch (e) {
      console.error("[WebCraft DB] Erro ao excluir lead no Firestore:", e);
    }
  }
}

// ==========================================================================
// 7. OPERAÇÕES DE PREÇOS, DESCONTOS E CONFIGURAÇÕES
// ==========================================================================

/**
 * Salva a tabela de preços na nuvem
 */
async function dbSavePricing(pricingData) {
  localStorage.setItem('webcraft_pricing', JSON.stringify(pricingData));

  const db = initFirebase();
  if (db) {
    try {
      await db.collection('settings').doc('pricing').set({
        ...pricingData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log("[WebCraft DB] Preços sincronizados com o Firestore!");
    } catch (e) {
      console.error("[WebCraft DB] Erro ao sincronizar preços com o Firestore:", e);
    }
  }
}

/**
 * Escuta atualizações de preços em tempo real
 */
function dbListenPricing(onPricingUpdated) {
  const db = initFirebase();
  if (db) {
    try {
      return db.collection('settings').doc('pricing').onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          localStorage.setItem('webcraft_pricing', JSON.stringify(data));
          if (onPricingUpdated) onPricingUpdated(data);
        }
      });
    } catch (e) {}
  }
  return null;
}

/**
 * Salva as regras de descontos na nuvem
 */
async function dbSaveDiscounts(discountsData) {
  localStorage.setItem('webcraft_discounts', JSON.stringify(discountsData));

  const db = initFirebase();
  if (db) {
    try {
      await db.collection('settings').doc('discounts').set({
        ...discountsData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log("[WebCraft DB] Descontos sincronizados com o Firestore!");
    } catch (e) {
      console.error("[WebCraft DB] Erro ao sincronizar descontos com o Firestore:", e);
    }
  }
}

/**
 * Escuta atualizações de descontos em tempo real
 */
function dbListenDiscounts(onDiscountsUpdated) {
  const db = initFirebase();
  if (db) {
    try {
      return db.collection('settings').doc('discounts').onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          localStorage.setItem('webcraft_discounts', JSON.stringify(data));
          if (onDiscountsUpdated) onDiscountsUpdated(data);
        }
      });
    } catch (e) {}
  }
  return null;
}

/**
 * Salva configurações gerais (WhatsApp, E-mail) na nuvem
 */
async function dbSaveConfig(configData) {
  localStorage.setItem('webcraft_config', JSON.stringify(configData));

  const db = initFirebase();
  if (db) {
    try {
      await db.collection('settings').doc('general').set({
        ...configData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log("[WebCraft DB] Configurações sincronizadas com o Firestore!");
    } catch (e) {
      console.error("[WebCraft DB] Erro ao sincronizar configs com o Firestore:", e);
    }
  }
}

// Inicializa automaticamente se já configurado
document.addEventListener('DOMContentLoaded', () => {
  initFirebase();
});
