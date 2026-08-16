// JS - LIGA PODS Sales Management System (Full Stack MySQL Version with LocalStorage Fallback)

document.addEventListener('DOMContentLoaded', () => {
    // === ESTADO DA APLICAÇÃO ===
    let sales = [];
    let comandas = JSON.parse(localStorage.getItem('ligapods_comandas')) || [];

    // Produtos populares e preços padrão para auto-preenchimento
    const productPrices = {
        'Ignite V50': 120.00,
        'Elf Bar BC5000': 90.00,
        'Waka SoPro DM8000': 140.00,
        'Lost Mary MO5000': 100.00,
        'Oxbar G8000': 110.00,
        'Cerveja Heineken': 15.00,
        'Cerveja Corona': 16.00,
        'Red Bull': 18.00,
        'Vodka Absolut': 220.00,
        'Gin Tanqueray': 240.00,
        'Whisky Red Label': 190.00,
        'Água Mineral': 6.00,
        'Refrigerante': 8.00
    };

    // Estado do Racha no PDV
    let splitMode = 'equal'; // 'equal' ou 'custom'
    let splitParticipants = [
        { name: '', contact: '', payType: 'credit', shareAmount: 0, dueDate: '', interestRate: 0 },
        { name: '', contact: '', payType: 'credit', shareAmount: 0, dueDate: '', interestRate: 0 }
    ];

    // Estado do Racha no Fechamento de Comanda
    let checkoutSplitMode = 'equal';
    let checkoutSplitParticipants = [];

    // === ELEMENTOS DO DOM ===
    // Telas
    const startScreen = document.getElementById('start-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    
    // Formulários e Autenticação
    const loginForm = document.getElementById('login-form');
    const loginUsernameInput = document.getElementById('login-username');
    const loginPasswordInput = document.getElementById('login-password');
    const registerAdminForm = document.getElementById('register-admin-form');
    const regUsernameInput = document.getElementById('reg-username');
    const regPasswordInput = document.getElementById('reg-password');
    
    const btnBackHome = document.getElementById('btn-back-home');
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabPanels = document.querySelectorAll('.tab-panel');

    // Formulário de Venda (PDV)
    const saleForm = document.getElementById('sale-form');
    const productNameInput = document.getElementById('product-name');
    const productPriceInput = document.getElementById('product-price');
    const singleCustomerFields = document.getElementById('single-customer-fields');
    const customerNameInput = document.getElementById('customer-name');
    const customerContactInput = document.getElementById('customer-contact');
    const customersDatalist = document.getElementById('customers-datalist');
    const shippingFeeInput = document.getElementById('shipping-fee');
    const partnerSelect = document.getElementById('partner-select');
    const isCreditCheckbox = document.getElementById('is-credit');
    const isSplitCheckbox = document.getElementById('is-split');
    const creditFields = document.getElementById('credit-fields');
    const dueDateInput = document.getElementById('due-date');
    const interestRateInput = document.getElementById('interest-rate');
    const btnResetForm = document.getElementById('btn-reset-form');

    // Elementos de Racha de Produto (PDV)
    const splitSection = document.getElementById('split-section');
    const splitTotalBadge = document.getElementById('split-total-badge');
    const btnSplitEqual = document.getElementById('btn-split-equal');
    const btnSplitCustom = document.getElementById('btn-split-custom');
    const splitParticipantsContainer = document.getElementById('split-participants-container');
    const btnAddSplitParticipant = document.getElementById('btn-add-split-participant');
    const splitSumDistributed = document.getElementById('split-sum-distributed');
    const splitSumRemaining = document.getElementById('split-sum-remaining');

    // Elementos de Preview de Juros em Tempo Real
    const liveTotalPreview = document.getElementById('live-total-preview');
    const liveTotalValue = document.getElementById('live-total-value');

    // Comandas Elementos
    const openComandaForm = document.getElementById('open-comanda-form');
    const comandaNumberInput = document.getElementById('comanda-number');
    const comandaCustomerInput = document.getElementById('comanda-customer');
    const comandaContactInput = document.getElementById('comanda-contact');
    const comandaPartnerSelect = document.getElementById('comanda-partner');
    const comandasGrid = document.getElementById('comandas-grid');
    const comandasCountBadge = document.getElementById('comandas-count-badge');

    // Modal Adicionar Item na Comanda
    const comandaAddItemModal = document.getElementById('comanda-add-item-modal');
    const comandaAddItemForm = document.getElementById('comanda-add-item-form');
    const modalComandaId = document.getElementById('modal-comanda-id');
    const modalItemProduct = document.getElementById('modal-item-product');
    const modalItemPrice = document.getElementById('modal-item-price');
    const modalItemQty = document.getElementById('modal-item-qty');
    const btnCancelAddItem = document.getElementById('btn-cancel-add-item');

    // Modal Checkout Comanda
    const comandaCheckoutModal = document.getElementById('comanda-checkout-modal');
    const comandaCheckoutForm = document.getElementById('comanda-checkout-form');
    const checkoutComandaId = document.getElementById('checkout-comanda-id');
    const checkoutComandaInfo = document.getElementById('checkout-comanda-info');
    const checkoutComandaItemsSummary = document.getElementById('checkout-comanda-items-summary');
    const checkoutTotalVal = document.getElementById('checkout-total-val');
    const checkoutIsSplit = document.getElementById('checkout-is-split');
    const checkoutSinglePanel = document.getElementById('checkout-single-panel');
    const checkoutIsCredit = document.getElementById('checkout-is-credit');
    const checkoutCreditFields = document.getElementById('checkout-credit-fields');
    const checkoutDueDate = document.getElementById('checkout-due-date');
    const checkoutInterestRate = document.getElementById('checkout-interest-rate');
    const checkoutSplitPanel = document.getElementById('checkout-split-panel');
    const checkoutSplitTotalBadge = document.getElementById('checkout-split-total-badge');
    const btnCheckoutSplitEqual = document.getElementById('btn-checkout-split-equal');
    const btnCheckoutSplitCustom = document.getElementById('btn-checkout-split-custom');
    const checkoutSplitParticipantsContainer = document.getElementById('checkout-split-participants');
    const btnAddCheckoutParticipant = document.getElementById('btn-add-checkout-participant');
    const checkoutSplitSumDist = document.getElementById('checkout-split-sum-dist');
    const checkoutSplitSumRem = document.getElementById('checkout-split-sum-rem');
    const btnCancelCheckout = document.getElementById('btn-cancel-checkout');

    // Modal de Edição Elementos
    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    const editSaleId = document.getElementById('edit-sale-id');
    const editProductName = document.getElementById('edit-product-name');
    const editProductPrice = document.getElementById('edit-product-price');
    const editCustomerName = document.getElementById('edit-customer-name');
    const editCustomerContact = document.getElementById('edit-customer-contact');
    const editShippingFee = document.getElementById('edit-shipping-fee');
    const editPartnerSelect = document.getElementById('edit-partner-select');
    const editIsCredit = document.getElementById('edit-is-credit');
    const editCreditInputs = document.getElementById('edit-credit-inputs');
    const editDueDate = document.getElementById('edit-due-date');
    const editInterestRate = document.getElementById('edit-interest-rate');
    const editLiveTotalPreview = document.getElementById('edit-live-total-preview');
    const editLiveTotalValue = document.getElementById('edit-live-total-value');
    const btnCancelEdit = document.getElementById('btn-cancel-edit');

    // Tabelas e Listas
    const tableBodyCredit = document.getElementById('table-body-credit');
    const tableBodyCash = document.getElementById('table-body-cash');
    const tableBodyCustomers = document.getElementById('table-body-customers');

    // Sócios Elementos
    const partnerTotalLipe = document.getElementById('partner-total-lipe');
    const partnerCreditLipe = document.getElementById('partner-credit-lipe');
    const partnerTotalAnna = document.getElementById('partner-total-anna');
    const partnerCreditAnna = document.getElementById('partner-credit-anna');
    const partnerTotalLeon = document.getElementById('partner-total-leon');
    const partnerCreditLeon = document.getElementById('partner-credit-leon');

    // Estatísticas Gerais
    const statCashTotal = document.getElementById('stat-cash-total');
    const statCreditTotal = document.getElementById('stat-credit-total');
    const statDueToday = document.getElementById('stat-due-today');

    // Toast
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    // Canvas
    const canvas = document.getElementById('smokeCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    // === SISTEMA DE ANIMAÇÃO DE FUMAÇA E PARTÍCULAS (CANVAS 2D) ===
    let particles = [];
    let smokePuffs = [];

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class SmokePuff {
        constructor(x, y, side) {
            this.x = x;
            this.y = y;
            this.side = side;
            this.size = Math.random() * 60 + 40;
            this.vx = (side === 'left' ? 1 : -1) * (Math.random() * 0.5 + 0.2);
            this.vy = -(Math.random() * 0.8 + 0.4);
            this.alpha = Math.random() * 0.15 + 0.05;
            this.color = Math.random() > 0.3 ? '#ff003c' : '#440011';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vx += (Math.random() - 0.5) * 0.1;
            if (this.y < canvas.height * 0.8) {
                this.alpha -= 0.0008;
            }
        }

        draw() {
            if (!ctx) return;
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.fillStyle = this.color;
            const pSize = Math.floor(this.size / 10) * 10;
            ctx.fillRect(this.x - pSize / 2, this.y - pSize / 2, pSize, pSize);
            ctx.fillStyle = '#ff3366';
            ctx.fillRect(this.x - pSize * 0.4, this.y - pSize * 0.2, pSize * 0.8, pSize * 0.8);
            ctx.fillStyle = '#110004';
            ctx.fillRect(this.x - pSize * 0.2, this.y - pSize * 0.4, pSize * 0.5, pSize * 0.5);
            ctx.restore();
        }
    }

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 4 + 4;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = -(Math.random() * 1.5 + 1.2);
            this.alpha = 1;
            this.color = '#ff003c';
            this.isCross = Math.random() > 0.4;
            this.rotation = Math.random() * Math.PI;
            this.decay = Math.random() * 0.015 + 0.008;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
        }

        draw() {
            if (!ctx) return;
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ff003c';
            if (this.isCross) {
                const p = Math.floor(this.size / 2) || 2;
                ctx.fillRect(this.x - p * 1.5, this.y - p / 2, p * 3, p);
                ctx.fillRect(this.x - p / 2, this.y - p * 1.5, p, p * 3);
            } else {
                ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
            }
            ctx.restore();
        }
    }

    function animate() {
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (Math.random() < 0.08) {
            smokePuffs.push(new SmokePuff(Math.random() * (canvas.width * 0.25), canvas.height + 50, 'left'));
        }
        if (Math.random() < 0.08) {
            smokePuffs.push(new SmokePuff(canvas.width - Math.random() * (canvas.width * 0.25), canvas.height + 50, 'right'));
        }

        if (startScreen && startScreen.classList.contains('active')) {
            const startBox = document.querySelector('.start-box');
            if (startBox) {
                const rect = startBox.getBoundingClientRect();
                if (Math.random() < 0.35) {
                    const side = Math.floor(Math.random() * 4);
                    let px, py;
                    if (side === 0) {
                        px = rect.left + Math.random() * rect.width; py = rect.top;
                    } else if (side === 1) {
                        px = rect.left + Math.random() * rect.width; py = rect.bottom;
                    } else if (side === 2) {
                        px = rect.left; py = rect.top + Math.random() * rect.height;
                    } else {
                        px = rect.right; py = rect.top + Math.random() * rect.height;
                    }
                    particles.push(new Particle(px, py));
                }
            }
        }

        for (let i = smokePuffs.length - 1; i >= 0; i--) {
            const puff = smokePuffs[i];
            puff.update();
            puff.draw();
            if (Math.random() < 0.25 && puff.alpha > 0.02) {
                particles.push(new Particle(puff.x + (Math.random() - 0.5) * puff.size * 0.5, puff.y));
            }
            if (puff.alpha <= 0 || puff.y < -100) {
                smokePuffs.splice(i, 1);
            }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw();
            if (p.alpha <= 0) {
                particles.splice(i, 1);
            }
        }

        requestAnimationFrame(animate);
    }
    animate();

    // === COMUNICAÇÃO COM O BACKEND (API MYSQL COM FALLBACK LOCALSTORAGE) ===

    async function loadSales() {
        try {
            const response = await fetch('/api/sales');
            if (!response.ok) throw new Error();
            sales = await response.json();
            renderDashboard();
            updateCustomersDatalist();
        } catch (err) {
            console.warn('API /api/sales indisponível. Usando LocalStorage como backup.');
            sales = JSON.parse(localStorage.getItem('ligapods_sales')) || [];
            renderDashboard();
            updateCustomersDatalist();
        }
    }

    function updateCustomersDatalist() {
        if (!customersDatalist) return;
        const customerMap = new Map();
        sales.forEach(s => {
            if (s.customer && !customerMap.has(s.customer.toLowerCase())) {
                customerMap.set(s.customer.toLowerCase(), { name: s.customer, contact: s.contact || '' });
            }
        });
        comandas.forEach(c => {
            if (c.customer && !customerMap.has(c.customer.toLowerCase())) {
                customerMap.set(c.customer.toLowerCase(), { name: c.customer, contact: c.contact || '' });
            }
        });

        customersDatalist.innerHTML = '';
        customerMap.forEach(client => {
            const opt = document.createElement('option');
            opt.value = client.name;
            customersDatalist.appendChild(opt);
        });
    }

    function findCustomerContact(name) {
        if (!name) return '';
        const found = sales.find(s => s.customer && s.customer.toLowerCase() === name.toLowerCase().trim());
        if (found && found.contact) return found.contact;
        const foundComanda = comandas.find(c => c.customer && c.customer.toLowerCase() === name.toLowerCase().trim());
        if (foundComanda && foundComanda.contact) return foundComanda.contact;
        return '';
    }

    if (customerNameInput) {
        customerNameInput.addEventListener('input', (e) => {
            const contact = findCustomerContact(e.target.value);
            if (contact && customerContactInput && !customerContactInput.value) {
                customerContactInput.value = contact;
            }
        });
    }

    if (comandaCustomerInput) {
        comandaCustomerInput.addEventListener('input', (e) => {
            const contact = findCustomerContact(e.target.value);
            if (contact && comandaContactInput && !comandaContactInput.value) {
                comandaContactInput.value = contact;
            }
        });
    }

    // === LÓGICA DE SELEÇÃO E PREÇO DOS PRODUTOS ===
    productNameInput.addEventListener('input', (e) => {
        const text = e.target.value.toLowerCase();
        for (const [key, price] of Object.entries(productPrices)) {
            if (text.includes(key.toLowerCase())) {
                productPriceInput.value = price.toFixed(2);
                showToast(`Preço sugerido para ${key}: R$ ${price.toFixed(2)}`, 'success');
                break;
            }
        }
        updateLiveTotal();
    });

    if (modalItemProduct) {
        modalItemProduct.addEventListener('input', (e) => {
            const text = e.target.value.toLowerCase();
            for (const [key, price] of Object.entries(productPrices)) {
                if (text.includes(key.toLowerCase())) {
                    modalItemPrice.value = price.toFixed(2);
                    break;
                }
            }
        });
    }

    // === NAVEGAÇÃO E AUTENTICAÇÃO ===
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = loginUsernameInput.value.trim();
        const password = loginPasswordInput.value;

        try {
            const response = await fetch('/api/admins?action=login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (!response.ok) throw new Error();
            const result = await response.json();

            if (result.success) {
                startScreen.classList.remove('active');
                setTimeout(async () => {
                    dashboardScreen.classList.add('active');
                    await loadSales();
                    renderComandas();
                    showToast(`Olá, ${username}! Login efetuado via Banco.`, 'success');
                    loginForm.reset();
                    setInterval(loadSales, 10000);
                }, 100);
            } else {
                showToast(result.message || 'Usuário ou senha incorretos!', 'danger');
            }
        } catch (err) {
            console.warn('Backend indisponível. Efetuando autenticação no LocalStorage.');
            let localAdmins = JSON.parse(localStorage.getItem('ligapods_admins')) || [
                { username: 'felipencs', password: '01102030' }
            ];
            if (!localStorage.getItem('ligapods_admins')) {
                localStorage.setItem('ligapods_admins', JSON.stringify(localAdmins));
            }

            const foundAdmin = localAdmins.find(adm => adm.username === username && adm.password === password);
            if (foundAdmin) {
                startScreen.classList.remove('active');
                setTimeout(async () => {
                    dashboardScreen.classList.add('active');
                    await loadSales();
                    renderComandas();
                    showToast(`Olá, ${username}! Conectado localmente (Offline).`, 'success');
                    loginForm.reset();
                }, 100);
            } else {
                showToast('ERRO: Usuário ou senha incorretos (Offline)!', 'danger');
            }
        }
    });

    registerAdminForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = regUsernameInput.value.trim();
        const password = regPasswordInput.value;

        if (password.length < 6) {
            showToast('Erro: Senha deve ter no mínimo 6 caracteres!', 'danger');
            return;
        }

        try {
            const response = await fetch('/api/admins?action=register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (!response.ok) throw new Error();
            const result = await response.json();

            if (result.success) {
                showToast(`Admin ${username.toUpperCase()} cadastrado com sucesso no MySQL!`, 'success');
                registerAdminForm.reset();
                switchTab('tab-vender');
            } else {
                showToast(result.message || 'Falha ao cadastrar!', 'danger');
            }
        } catch (err) {
            let localAdmins = JSON.parse(localStorage.getItem('ligapods_admins')) || [
                { username: 'felipencs', password: '01102030' }
            ];
            const exists = localAdmins.some(adm => adm.username.toLowerCase() === username.toLowerCase());
            if (exists) {
                showToast('ERRO: Este usuário já existe localmente!', 'danger');
                return;
            }
            localAdmins.push({ username, password });
            localStorage.setItem('ligapods_admins', JSON.stringify(localAdmins));
            showToast(`Admin ${username.toUpperCase()} cadastrado localmente!`, 'success');
            registerAdminForm.reset();
            switchTab('tab-vender');
        }
    });

    btnBackHome.addEventListener('click', () => {
        dashboardScreen.classList.remove('active');
        setTimeout(() => {
            startScreen.classList.add('active');
        }, 100);
    });

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            navTabs.forEach(t => t.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const targetPanel = document.getElementById(tab.getAttribute('data-tab'));
            if (targetPanel) targetPanel.classList.add('active');

            if (tab.getAttribute('data-tab') === 'tab-comandas') {
                renderComandas();
            } else {
                loadSales();
            }
        });
    });

    // === SISTEMA DE RACHA NO PDV (FRENTE DE CAIXA) ===

    function getDefaultDueDate() {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        return d.toISOString().split('T')[0];
    }

    function initSplitParticipants() {
        const leadName = customerNameInput ? customerNameInput.value.trim() : '';
        const leadContact = customerContactInput ? customerContactInput.value.trim() : '';
        const globalInterest = parseFloat(interestRateInput.value) || 0;
        const defaultDue = dueDateInput.value || getDefaultDueDate();

        splitParticipants = [
            {
                name: leadName || '',
                contact: leadContact || '',
                payType: isCreditCheckbox.checked ? 'credit' : 'cash',
                shareAmount: 0,
                dueDate: defaultDue,
                interestRate: globalInterest
            },
            {
                name: '',
                contact: '',
                payType: 'credit',
                shareAmount: 0,
                dueDate: defaultDue,
                interestRate: globalInterest
            }
        ];
        renderSplitParticipants();
    }

    function renderSplitParticipants() {
        if (!splitParticipantsContainer) return;
        splitParticipantsContainer.innerHTML = '';

        const globalInterest = parseFloat(interestRateInput.value) || 0;
        const defaultDue = dueDateInput.value || getDefaultDueDate();

        splitParticipants.forEach((p, idx) => {
            if (p.payType === 'credit') {
                if (!p.interestRate && globalInterest > 0) p.interestRate = globalInterest;
                if (!p.dueDate) p.dueDate = defaultDue;
            }

            const card = document.createElement('div');
            card.className = 'split-card';
            card.innerHTML = `
                <div class="split-card-header">
                    <span class="split-card-title">> CLIENTE ${idx + 1} ${idx === 0 ? '(PRINCIPAL)' : ''}</span>
                    ${splitParticipants.length > 2 ? `<button type="button" class="split-card-remove" data-idx="${idx}">REMOVER</button>` : ''}
                </div>
                <div class="split-card-body">
                    <div class="form-group">
                        <label>NOME DO CLIENTE *</label>
                        <input type="text" class="split-input-name" data-idx="${idx}" list="customers-datalist" value="${p.name}" placeholder="Ex: Cliente ${idx + 1}" required>
                    </div>
                    <div class="form-group">
                        <label>CONTATO (WHATSAPP)</label>
                        <input type="text" class="split-input-contact" data-idx="${idx}" value="${p.contact}" placeholder="Ex: 47999999999">
                    </div>
                    <div class="form-group">
                        <label>FORMA DE PGTO *</label>
                        <select class="split-select-pay" data-idx="${idx}">
                            <option value="credit" ${p.payType === 'credit' ? 'selected' : ''}>⏳ FIADO (DÉBITO)</option>
                            <option value="cash" ${p.payType === 'cash' ? 'selected' : ''}>💵 À VISTA</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>VALOR FATIA (R$) *</label>
                        <input type="number" step="0.01" min="0" class="split-input-amount" data-idx="${idx}" value="${p.shareAmount.toFixed(2)}" ${splitMode === 'equal' ? 'readonly style="background:#151520;color:#00ff66;font-weight:bold;"' : 'required'}>
                    </div>
                </div>
                ${p.payType === 'credit' ? `
                    <div class="split-card-credit-details">
                        <div class="form-group">
                            <label style="font-size:11px;">VENCIMENTO *</label>
                            <input type="date" class="split-input-due" data-idx="${idx}" value="${p.dueDate || defaultDue}" required>
                        </div>
                        <div class="form-group">
                            <label style="font-size:11px;">JUROS (%)</label>
                            <input type="number" min="0" max="100" class="split-input-interest" data-idx="${idx}" value="${p.interestRate || globalInterest}">
                        </div>
                        <div class="form-group" style="display:flex;flex-direction:column;justify-content:flex-end;">
                            <span style="font-size:11px;color:#8a8a93;">Total com Juros:</span>
                            <strong style="color:#00ff66;font-size:14px;">${formatCurrency(p.shareAmount + (p.shareAmount * ((p.interestRate || globalInterest) / 100)))}</strong>
                        </div>
                    </div>
                ` : ''}
            `;
            splitParticipantsContainer.appendChild(card);
        });

        splitParticipantsContainer.querySelectorAll('.split-input-name').forEach(inp => {
            inp.addEventListener('input', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                splitParticipants[idx].name = e.target.value;
                const contact = findCustomerContact(e.target.value);
                if (contact && !splitParticipants[idx].contact) {
                    splitParticipants[idx].contact = contact;
                    const contactInp = splitParticipantsContainer.querySelector(`.split-input-contact[data-idx="${idx}"]`);
                    if (contactInp) contactInp.value = contact;
                }
            });
        });

        splitParticipantsContainer.querySelectorAll('.split-input-contact').forEach(inp => {
            inp.addEventListener('input', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                splitParticipants[idx].contact = e.target.value;
            });
        });

        splitParticipantsContainer.querySelectorAll('.split-select-pay').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                splitParticipants[idx].payType = e.target.value;
                renderSplitParticipants();
                recalculateSplit();
            });
        });

        splitParticipantsContainer.querySelectorAll('.split-input-amount').forEach(inp => {
            inp.addEventListener('input', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                splitParticipants[idx].shareAmount = parseFloat(e.target.value) || 0;
                recalculateSplitBalanceOnly();
            });
        });

        splitParticipantsContainer.querySelectorAll('.split-input-due').forEach(inp => {
            inp.addEventListener('change', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                splitParticipants[idx].dueDate = e.target.value;
            });
        });

        splitParticipantsContainer.querySelectorAll('.split-input-interest').forEach(inp => {
            inp.addEventListener('input', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                splitParticipants[idx].interestRate = parseFloat(e.target.value) || 0;
                renderSplitParticipants();
            });
        });

        splitParticipantsContainer.querySelectorAll('.split-card-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                if (splitParticipants.length > 2) {
                    splitParticipants.splice(idx, 1);
                    renderSplitParticipants();
                    recalculateSplit();
                }
            });
        });

        recalculateSplit();
    }

    function recalculateSplit() {
        const price = parseFloat(productPriceInput.value) || 0;
        const shipping = parseFloat(shippingFeeInput.value) || 0;
        const totalToSplit = price + shipping;

        if (splitTotalBadge) {
            splitTotalBadge.textContent = `Total da Venda: ${formatCurrency(totalToSplit)}`;
        }

        if (splitMode === 'equal') {
            const count = splitParticipants.length || 1;
            const equalShare = totalToSplit / count;
            splitParticipants.forEach(p => {
                p.shareAmount = equalShare;
            });

            if (splitParticipantsContainer) {
                splitParticipantsContainer.querySelectorAll('.split-input-amount').forEach(inp => {
                    inp.value = equalShare.toFixed(2);
                });
            }
        }

        recalculateSplitBalanceOnly();
    }

    function recalculateSplitBalanceOnly() {
        const price = parseFloat(productPriceInput.value) || 0;
        const shipping = parseFloat(shippingFeeInput.value) || 0;
        const totalToSplit = price + shipping;

        const sumDist = splitParticipants.reduce((acc, p) => acc + (parseFloat(p.shareAmount) || 0), 0);
        const rem = totalToSplit - sumDist;

        if (splitSumDistributed) splitSumDistributed.textContent = formatCurrency(sumDist);
        if (splitSumRemaining) {
            splitSumRemaining.textContent = formatCurrency(rem);
            if (Math.abs(rem) < 0.01) {
                splitSumRemaining.className = 'text-green font-bold';
                splitSumRemaining.textContent = 'R$ 0,00 (100% FECHADO)';
            } else if (rem > 0) {
                splitSumRemaining.className = 'text-yellow';
                splitSumRemaining.textContent = `Falta: ${formatCurrency(rem)}`;
            } else {
                splitSumRemaining.className = 'text-red';
                splitSumRemaining.textContent = `Excedeu: ${formatCurrency(Math.abs(rem))}`;
            }
        }
    }

    if (btnSplitEqual) {
        btnSplitEqual.addEventListener('click', () => {
            splitMode = 'equal';
            btnSplitEqual.classList.add('active');
            btnSplitCustom.classList.remove('active');
            renderSplitParticipants();
        });
    }

    if (btnSplitCustom) {
        btnSplitCustom.addEventListener('click', () => {
            splitMode = 'custom';
            btnSplitCustom.classList.add('active');
            btnSplitEqual.classList.remove('active');
            renderSplitParticipants();
        });
    }

    if (btnAddSplitParticipant) {
        btnAddSplitParticipant.addEventListener('click', () => {
            const globalInterest = parseFloat(interestRateInput.value) || 0;
            const defaultDue = dueDateInput.value || getDefaultDueDate();
            splitParticipants.push({
                name: '',
                contact: '',
                payType: 'credit',
                shareAmount: 0,
                dueDate: defaultDue,
                interestRate: globalInterest
            });
            renderSplitParticipants();
        });
    }
    // === SELETORES DE MODO DE VENDA NO PDV ===
    const btnModeSingle = document.getElementById('btn-mode-single');
    const btnModeSplit = document.getElementById('btn-mode-split');
    const btnSubmitSale = document.getElementById('btn-submit-sale');
    const singleCreditGroup = document.getElementById('single-credit-checkbox-group');

    function setSaleMode(mode) {
        if (mode === 'split') {
            isSplitCheckbox.checked = true;
            if (btnModeSplit) btnModeSplit.classList.add('active');
            if (btnModeSingle) btnModeSingle.classList.remove('active');
            if (splitSection) splitSection.classList.remove('hidden');
            if (singleCustomerFields) singleCustomerFields.classList.add('hidden');
            if (creditFields) creditFields.classList.add('hidden');
            if (singleCreditGroup) singleCreditGroup.classList.add('hidden');
            if (btnSubmitSale) btnSubmitSale.textContent = '🍕 CONFIRMAR RACHA E LANÇAR DÉBITOS [ENTER]';
            initSplitParticipants();
        } else {
            isSplitCheckbox.checked = false;
            if (btnModeSingle) btnModeSingle.classList.add('active');
            if (btnModeSplit) btnModeSplit.classList.remove('active');
            if (splitSection) splitSection.classList.add('hidden');
            if (singleCustomerFields) singleCustomerFields.classList.remove('hidden');
            if (singleCreditGroup) singleCreditGroup.classList.remove('hidden');
            if (isCreditCheckbox.checked && creditFields) {
                creditFields.classList.remove('hidden');
            }
            if (btnSubmitSale) btnSubmitSale.textContent = 'CONFIRMAR VENDA [ENTER]';
        }
        updateLiveTotal();
    }

    if (btnModeSingle) btnModeSingle.addEventListener('click', () => setSaleMode('single'));
    if (btnModeSplit) btnModeSplit.addEventListener('click', () => setSaleMode('split'));

    // Toggle de Rachar Produto (Checkbox oculto sincronizado)
    isSplitCheckbox.addEventListener('change', () => {
        setSaleMode(isSplitCheckbox.checked ? 'split' : 'single');
    });

    // === REGISTRO DE VENDAS (PDV) ===

    function updateLiveTotal() {
        const price = parseFloat(productPriceInput.value) || 0;
        const shipping = parseFloat(shippingFeeInput.value) || 0;
        const interest = parseFloat(interestRateInput.value) || 0;
        const isCredit = isCreditCheckbox.checked;

        if (isCredit) {
            const base = price + shipping;
            const interestAmt = base * (interest / 100);
            const total = base + interestAmt;
            liveTotalValue.textContent = formatCurrency(total);
        } else {
            const base = price + shipping;
            liveTotalValue.textContent = formatCurrency(base);
        }

        if (isSplitCheckbox.checked) {
            recalculateSplit();
        }
    }

    productPriceInput.addEventListener('input', updateLiveTotal);
    shippingFeeInput.addEventListener('input', updateLiveTotal);
    interestRateInput.addEventListener('input', () => {
        updateLiveTotal();
        if (isSplitCheckbox.checked) {
            const globalInterest = parseFloat(interestRateInput.value) || 0;
            splitParticipants.forEach(p => {
                if (p.payType === 'credit') p.interestRate = globalInterest;
            });
            renderSplitParticipants();
        }
    });

    isCreditCheckbox.addEventListener('change', () => {
        if (isCreditCheckbox.checked) {
            if (!isSplitCheckbox.checked) creditFields.classList.remove('hidden');
            dueDateInput.required = true;
            dueDateInput.value = getDefaultDueDate();
        } else {
            creditFields.classList.add('hidden');
            dueDateInput.required = false;
            dueDateInput.value = '';
            interestRateInput.value = '0';
        }
        updateLiveTotal();
    });

    // Enviar Venda (Normal ou Rachada)
    saleForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const productName = productNameInput.value.trim();
        const productPrice = parseFloat(productPriceInput.value);
        const shippingFee = parseFloat(shippingFeeInput.value) || 0;
        const partner = partnerSelect.value;
        const isSplit = isSplitCheckbox.checked;

        if (productPrice <= 0) {
            showToast('ERRO: Insira um valor válido para o produto!', 'danger');
            return;
        }

        if (isSplit) {
            // === VALIDAÇÕES DO RACHA ===
            if (splitParticipants.length < 2) {
                showToast('ERRO: Adicione pelo menos 2 clientes para rachar!', 'danger');
                return;
            }

            for (let i = 0; i < splitParticipants.length; i++) {
                if (!splitParticipants[i].name || !splitParticipants[i].name.trim()) {
                    showToast(`ERRO: Preencha o nome do Cliente ${i + 1} no racha!`, 'danger');
                    return;
                }
                if (splitParticipants[i].shareAmount <= 0) {
                    showToast(`ERRO: O valor da fatia do Cliente ${i + 1} deve ser maior que zero!`, 'danger');
                    return;
                }
                if (splitParticipants[i].payType === 'credit' && !splitParticipants[i].dueDate) {
                    showToast(`ERRO: Defina a data de vencimento para o Cliente ${i + 1}!`, 'danger');
                    return;
                }
            }

            const totalExpected = productPrice + shippingFee;
            const totalDistributed = splitParticipants.reduce((acc, p) => acc + p.shareAmount, 0);
            if (Math.abs(totalExpected - totalDistributed) > 0.05) {
                showToast(`ERRO: A soma das fatias (${formatCurrency(totalDistributed)}) difere do total da venda (${formatCurrency(totalExpected)})!`, 'danger');
                return;
            }

            // === CRIAÇÃO DAS VENDAS INDIVIDUAIS DO RACHA ===
            const salesToInsert = [];
            const now = new Date().toISOString();
            const totalParts = splitParticipants.length;
            const globalInterest = parseFloat(interestRateInput.value) || 0;

            splitParticipants.forEach((p, idx) => {
                const ratio = p.shareAmount / totalExpected;
                const sharePrice = productPrice * ratio;
                const shareShipping = shippingFee * ratio;
                const isCreditPart = p.payType === 'credit';
                // Juros fiado proporcional aplicado para todos os que estão no fiado
                const partInterest = isCreditPart ? (p.interestRate || globalInterest) : 0;

                const saleRecord = {
                    id: Date.now() + idx,
                    product: `[Racha ${idx + 1}/${totalParts}] ${productName}`,
                    price: parseFloat(sharePrice.toFixed(2)),
                    customer: p.name.trim(),
                    contact: p.contact ? p.contact.trim() : '',
                    shipping: parseFloat(shareShipping.toFixed(2)),
                    partner: partner,
                    isCredit: isCreditPart,
                    dueDate: isCreditPart ? p.dueDate : null,
                    interestRate: partInterest,
                    isPaid: !isCreditPart,
                    saleDate: now
                };
                salesToInsert.push(saleRecord);
            });

            // Enviar cada fatia para o banco/localStorage
            let anyError = false;
            for (const saleRecord of salesToInsert) {
                try {
                    const response = await fetch('/api/sales', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(saleRecord)
                    });
                    if (!response.ok) throw new Error();
                } catch (err) {
                    anyError = true;
                    sales.push(saleRecord);
                }
            }

            if (anyError) {
                localStorage.setItem('ligapods_sales', JSON.stringify(sales));
                showToast(`RACHA CONCLUÍDO! ${totalParts} DÉBITOS LANÇADOS LOCALMENTE (OFFLINE)!`, 'success');
            } else {
                showToast(`PRODUTO RACHADO ENTRE ${totalParts} CLIENTES COM SUCESSO! DÉBITOS LANÇADOS!`, 'success');
            }

            resetForm();
            await loadSales();
            const hasCredit = salesToInsert.some(s => s.isCredit);
            if (hasCredit) switchTab('tab-fiados');
            else switchTab('tab-vista');
            return;
        }

        // === VENDA INDIVIDUAL (NORMAL) ===
        const customerName = customerNameInput.value.trim();
        const customerContact = customerContactInput.value.trim();
        const isCredit = isCreditCheckbox.checked;

        let dueDate = null;
        let interestRate = 0;

        if (isCredit) {
            dueDate = dueDateInput.value;
            interestRate = parseFloat(interestRateInput.value) || 0;

            if (!dueDate) {
                showToast('ERRO: Insira a data de vencimento!', 'danger');
                return;
            }
        }

        const newSale = {
            id: Date.now(),
            product: productName,
            price: productPrice,
            customer: customerName,
            contact: customerContact,
            shipping: shippingFee,
            partner: partner,
            isCredit: isCredit,
            dueDate: dueDate,
            interestRate: interestRate,
            isPaid: !isCredit,
            saleDate: new Date().toISOString()
        };

        try {
            const response = await fetch('/api/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSale)
            });

            if (response.ok) {
                showToast('VENDA REGISTRADA COM SUCESSO!', 'success');
                resetForm();
                await loadSales();
                if (isCredit) switchTab('tab-fiados');
                else switchTab('tab-vista');
            } else {
                throw new Error();
            }
        } catch (err) {
            console.warn('Erro ao salvar no MySQL. Registrando venda localmente no LocalStorage.');
            sales.push(newSale);
            localStorage.setItem('ligapods_sales', JSON.stringify(sales));
            showToast('VENDA SALVA LOCALMENTE (OFFLINE)!', 'success');
            resetForm();
            renderDashboard();
            if (isCredit) switchTab('tab-fiados');
            else switchTab('tab-vista');
        }
    });

    btnResetForm.addEventListener('click', resetForm);

    function resetForm() {
        saleForm.reset();
        setSaleMode('single');
        dueDateInput.required = false;
        liveTotalValue.textContent = 'R$ 0,00';
    }

    function switchTab(tabId) {
        navTabs.forEach(t => {
            if (t.getAttribute('data-tab') === tabId) {
                t.classList.add('active');
            } else {
                t.classList.remove('active');
            }
        });
        tabPanels.forEach(p => {
            if (p.id === tabId) {
                p.classList.add('active');
            } else {
                p.classList.remove('active');
            }
        });

        if (tabId === 'tab-comandas') {
            renderComandas();
        } else {
            loadSales();
        }
    }

    // === MÓDULO DE COMANDAS & CONSUMO ===

    function saveComandas() {
        localStorage.setItem('ligapods_comandas', JSON.stringify(comandas));
        renderComandas();
        updateCustomersDatalist();
    }

    // Abrir Nova Comanda
    if (openComandaForm) {
        openComandaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const number = comandaNumberInput.value.trim();
            const customer = comandaCustomerInput.value.trim();
            const contact = comandaContactInput.value.trim();
            const partner = comandaPartnerSelect.value;

            const exists = comandas.some(c => c.number.toLowerCase() === number.toLowerCase());
            if (exists) {
                showToast(`AVISO: Já existe uma comanda ativa com o identificador "${number}"!`, 'danger');
                return;
            }

            const newComanda = {
                id: Date.now(),
                number: number,
                customer: customer,
                contact: contact,
                partner: partner,
                openedAt: new Date().toISOString(),
                items: []
            };

            comandas.unshift(newComanda);
            saveComandas();
            showToast(`COMANDA "${number.toUpperCase()}" ABERTA COM SUCESSO!`, 'success');
            openComandaForm.reset();
        });
    }

    function renderComandas() {
        if (!comandasGrid) return;
        comandasGrid.innerHTML = '';

        if (comandasCountBadge) {
            comandasCountBadge.textContent = `${comandas.length} COMANDAS ATIVAS`;
        }

        if (comandas.length === 0) {
            comandasGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align:center; padding: 40px; color:#8a8a93; font-family:'Orbitron', sans-serif;">
                    NENHUMA COMANDA ABERTA NO MOMENTO.<br>
                    <span style="font-size: 13px; color:#ff3366;">USE O FORMULÁRIO ACIMA PARA INICIAR UM ATENDIMENTO.</span>
                </div>
            `;
            return;
        }

        comandas.forEach(c => {
            const total = c.items.reduce((acc, item) => acc + (item.price * item.qty), 0);
            const card = document.createElement('div');
            card.className = 'comanda-card';
            card.innerHTML = `
                <div class="comanda-card-header">
                    <div class="comanda-title-group">
                        <span class="comanda-number-title">📋 ${c.number.toUpperCase()}</span>
                        <span class="comanda-customer-sub">👤 ${c.customer}</span>
                    </div>
                    <span class="badge badge-near">${c.partner}</span>
                </div>

                <div class="comanda-items-box">
                    ${c.items.length === 0 ? '<span style="color:#555566;font-size:13px;text-align:center;padding:10px;">Nenhum produto lançado.</span>' : ''}
                    ${c.items.map((it, idx) => `
                        <div class="comanda-item-row">
                            <span class="comanda-item-name"><span class="comanda-item-qty">${it.qty}x</span> ${it.product}</span>
                            <div>
                                <span class="comanda-item-val">${formatCurrency(it.price * it.qty)}</span>
                                <button type="button" class="comanda-item-del" data-cid="${c.id}" data-idx="${idx}" title="Remover item">✕</button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="comanda-total-row">
                    <span>TOTAL:</span>
                    <span class="text-green font-bold">${formatCurrency(total)}</span>
                </div>

                <div class="comanda-actions-grid">
                    <button type="button" class="pixel-btn-action btn-comanda-add-item" data-cid="${c.id}">+ PRODUTO</button>
                    <button type="button" class="pixel-btn-action btn-comanda-close" data-cid="${c.id}">FECHAR</button>
                    <button type="button" class="pixel-btn-action action-split btn-comanda-split" data-cid="${c.id}">🍕 RACHAR COMANDA / ITENS</button>
                </div>
            `;
            comandasGrid.appendChild(card);
        });

        comandasGrid.querySelectorAll('.btn-comanda-add-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const cid = parseInt(btn.dataset.cid);
                openAddItemModal(cid);
            });
        });

        comandasGrid.querySelectorAll('.btn-comanda-close').forEach(btn => {
            btn.addEventListener('click', () => {
                const cid = parseInt(btn.dataset.cid);
                openCheckoutModal(cid, false);
            });
        });

        comandasGrid.querySelectorAll('.btn-comanda-split').forEach(btn => {
            btn.addEventListener('click', () => {
                const cid = parseInt(btn.dataset.cid);
                openCheckoutModal(cid, true);
            });
        });

        comandasGrid.querySelectorAll('.comanda-item-del').forEach(btn => {
            btn.addEventListener('click', () => {
                const cid = parseInt(btn.dataset.cid);
                const idx = parseInt(btn.dataset.idx);
                deleteItemFromComanda(cid, idx);
            });
        });
    }

    function deleteItemFromComanda(cid, itemIdx) {
        const comanda = comandas.find(c => c.id === cid);
        if (!comanda) return;
        comanda.items.splice(itemIdx, 1);
        saveComandas();
        showToast('Produto removido da comanda.', 'success');
    }

    // Modal Adicionar Item
    function openAddItemModal(comandaId) {
        const comanda = comandas.find(c => c.id === comandaId);
        if (!comanda) return;
        modalComandaId.value = comandaId;
        comandaAddItemForm.reset();
        comandaAddItemModal.classList.remove('hidden');
    }

    if (btnCancelAddItem) {
        btnCancelAddItem.addEventListener('click', () => {
            comandaAddItemModal.classList.add('hidden');
        });
    }

    if (comandaAddItemForm) {
        comandaAddItemForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const cid = parseInt(modalComandaId.value);
            const comanda = comandas.find(c => c.id === cid);
            if (!comanda) return;

            const product = modalItemProduct.value.trim();
            const price = parseFloat(modalItemPrice.value) || 0;
            const qty = parseInt(modalItemQty.value) || 1;

            if (price <= 0 || qty <= 0) {
                showToast('ERRO: Insira preço e quantidade válidos!', 'danger');
                return;
            }

            comanda.items.push({ product, price, qty });
            saveComandas();
            comandaAddItemModal.classList.add('hidden');
            showToast(`${qty}x ${product} ADICIONADO À COMANDA!`, 'success');
        });
    }

    // Modal Fechamento & Racha de Comanda
    function openCheckoutModal(comandaId, isSplitInitially) {
        const comanda = comandas.find(c => c.id === comandaId);
        if (!comanda) return;

        if (comanda.items.length === 0) {
            showToast('ERRO: Esta comanda não possui nenhum produto lançado!', 'danger');
            return;
        }

        const total = comanda.items.reduce((acc, it) => acc + (it.price * it.qty), 0);

        checkoutComandaId.value = comandaId;
        checkoutComandaInfo.innerHTML = `
            <span>📋 <strong>${comanda.number.toUpperCase()}</strong></span>
            <span>👤 ${comanda.customer} (Sócio: ${comanda.partner})</span>
        `;

        checkoutComandaItemsSummary.innerHTML = comanda.items.map(it => `
            <div>• <strong>${it.qty}x ${it.product}</strong> - ${formatCurrency(it.price * it.qty)}</div>
        `).join('');

        checkoutTotalVal.textContent = formatCurrency(total);
        if (checkoutSplitTotalBadge) checkoutSplitTotalBadge.textContent = `Total: ${formatCurrency(total)}`;

        setComandaCheckoutMode(isSplitInitially ? 'split' : 'single');
        comandaCheckoutModal.classList.remove('hidden');
    }

    const btnComandaModeSingle = document.getElementById('btn-comanda-mode-single');
    const btnComandaModeSplit = document.getElementById('btn-comanda-mode-split');
    const btnSubmitCheckout = document.getElementById('btn-submit-checkout');

    function setComandaCheckoutMode(mode) {
        const cid = parseInt(checkoutComandaId.value);
        const comanda = comandas.find(c => c.id === cid);
        const total = comanda ? comanda.items.reduce((acc, it) => acc + (it.price * it.qty), 0) : 0;

        if (mode === 'split') {
            checkoutIsSplit.checked = true;
            if (btnComandaModeSplit) btnComandaModeSplit.classList.add('active');
            if (btnComandaModeSingle) btnComandaModeSingle.classList.remove('active');
            if (checkoutSplitPanel) checkoutSplitPanel.classList.remove('hidden');
            if (checkoutSinglePanel) checkoutSinglePanel.classList.add('hidden');
            if (btnSubmitCheckout) btnSubmitCheckout.textContent = '🍕 CONFIRMAR RACHA DA COMANDA E LANÇAR DÉBITOS';
            if (comanda) initCheckoutSplit(comanda, total);
        } else {
            checkoutIsSplit.checked = false;
            if (btnComandaModeSingle) btnComandaModeSingle.classList.add('active');
            if (btnComandaModeSplit) btnComandaModeSplit.classList.remove('active');
            if (checkoutSplitPanel) checkoutSplitPanel.classList.add('hidden');
            if (checkoutSinglePanel) checkoutSinglePanel.classList.remove('hidden');
            if (checkoutIsCredit.checked && checkoutCreditFields) {
                checkoutCreditFields.classList.remove('hidden');
            }
            if (btnSubmitCheckout) btnSubmitCheckout.textContent = 'CONFIRMAR FECHAMENTO E LANÇAR DÉBITOS';
        }
    }

    if (btnComandaModeSingle) btnComandaModeSingle.addEventListener('click', () => setComandaCheckoutMode('single'));
    if (btnComandaModeSplit) btnComandaModeSplit.addEventListener('click', () => setComandaCheckoutMode('split'));

    if (btnCancelCheckout) {
        btnCancelCheckout.addEventListener('click', () => {
            comandaCheckoutModal.classList.add('hidden');
        });
    }

    checkoutIsCredit.addEventListener('change', () => {
        if (checkoutIsCredit.checked) {
            checkoutCreditFields.classList.remove('hidden');
            checkoutDueDate.required = true;
            checkoutDueDate.value = getDefaultDueDate();
        } else {
            checkoutCreditFields.classList.add('hidden');
            checkoutDueDate.required = false;
            checkoutDueDate.value = '';
            checkoutInterestRate.value = '0';
        }
    });

    checkoutIsSplit.addEventListener('change', () => {
        setComandaCheckoutMode(checkoutIsSplit.checked ? 'split' : 'single');
    });

    function initCheckoutSplit(comanda, total) {
        const defaultDue = getDefaultDueDate();
        checkoutSplitParticipants = [
            {
                name: comanda.customer || '',
                contact: comanda.contact || '',
                payType: 'credit',
                shareAmount: total / 2,
                dueDate: defaultDue,
                interestRate: 0
            },
            {
                name: '',
                contact: '',
                payType: 'credit',
                shareAmount: total / 2,
                dueDate: defaultDue,
                interestRate: 0
            }
        ];
        renderCheckoutSplitParticipants(total);
    }

    function renderCheckoutSplitParticipants(total) {
        if (!checkoutSplitParticipantsContainer) return;
        checkoutSplitParticipantsContainer.innerHTML = '';

        checkoutSplitParticipants.forEach((p, idx) => {
            const card = document.createElement('div');
            card.className = 'split-card';
            card.innerHTML = `
                <div class="split-card-header">
                    <span class="split-card-title">> PARTICIPANTE ${idx + 1} ${idx === 0 ? '(COMANDANTE)' : ''}</span>
                    ${checkoutSplitParticipants.length > 2 ? `<button type="button" class="split-card-remove checkout-participant-remove" data-idx="${idx}">REMOVER</button>` : ''}
                </div>
                <div class="split-card-body">
                    <div class="form-group">
                        <label>NOME DO CLIENTE *</label>
                        <input type="text" class="checkout-split-name" data-idx="${idx}" list="customers-datalist" value="${p.name}" placeholder="Ex: Cliente ${idx + 1}" required>
                    </div>
                    <div class="form-group">
                        <label>CONTATO (WHATSAPP)</label>
                        <input type="text" class="checkout-split-contact" data-idx="${idx}" value="${p.contact}" placeholder="Ex: 47999999999">
                    </div>
                    <div class="form-group">
                        <label>FORMA PGTO *</label>
                        <select class="checkout-split-pay" data-idx="${idx}">
                            <option value="credit" ${p.payType === 'credit' ? 'selected' : ''}>⏳ FIADO (DÉBITO)</option>
                            <option value="cash" ${p.payType === 'cash' ? 'selected' : ''}>💵 À VISTA</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>VALOR FATIA (R$) *</label>
                        <input type="number" step="0.01" min="0" class="checkout-split-amount" data-idx="${idx}" value="${p.shareAmount.toFixed(2)}" ${checkoutSplitMode === 'equal' ? 'readonly style="background:#151520;color:#00ff66;font-weight:bold;"' : 'required'}>
                    </div>
                </div>
                ${p.payType === 'credit' ? `
                    <div class="split-card-credit-details">
                        <div class="form-group">
                            <label style="font-size:11px;">VENCIMENTO *</label>
                            <input type="date" class="checkout-split-due" data-idx="${idx}" value="${p.dueDate || getDefaultDueDate()}" required>
                        </div>
                        <div class="form-group">
                            <label style="font-size:11px;">JUROS (%)</label>
                            <input type="number" min="0" max="100" class="checkout-split-interest" data-idx="${idx}" value="${p.interestRate || 0}">
                        </div>
                        <div class="form-group" style="display:flex;flex-direction:column;justify-content:flex-end;">
                            <span style="font-size:11px;color:#8a8a93;">Total c/ Juros:</span>
                            <strong style="color:#00ff66;font-size:14px;">${formatCurrency(p.shareAmount + (p.shareAmount * ((p.interestRate || 0) / 100)))}</strong>
                        </div>
                    </div>
                ` : ''}
            `;
            checkoutSplitParticipantsContainer.appendChild(card);
        });

        checkoutSplitParticipantsContainer.querySelectorAll('.checkout-split-name').forEach(inp => {
            inp.addEventListener('input', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                checkoutSplitParticipants[idx].name = e.target.value;
                const contact = findCustomerContact(e.target.value);
                if (contact && !checkoutSplitParticipants[idx].contact) {
                    checkoutSplitParticipants[idx].contact = contact;
                    const contactInp = checkoutSplitParticipantsContainer.querySelector(`.checkout-split-contact[data-idx="${idx}"]`);
                    if (contactInp) contactInp.value = contact;
                }
            });
        });

        checkoutSplitParticipantsContainer.querySelectorAll('.checkout-split-contact').forEach(inp => {
            inp.addEventListener('input', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                checkoutSplitParticipants[idx].contact = e.target.value;
            });
        });

        checkoutSplitParticipantsContainer.querySelectorAll('.checkout-split-pay').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                checkoutSplitParticipants[idx].payType = e.target.value;
                renderCheckoutSplitParticipants(total);
                recalculateCheckoutSplit(total);
            });
        });

        checkoutSplitParticipantsContainer.querySelectorAll('.checkout-split-amount').forEach(inp => {
            inp.addEventListener('input', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                checkoutSplitParticipants[idx].shareAmount = parseFloat(e.target.value) || 0;
                recalculateCheckoutSplitBalanceOnly(total);
            });
        });

        checkoutSplitParticipantsContainer.querySelectorAll('.checkout-split-due').forEach(inp => {
            inp.addEventListener('change', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                checkoutSplitParticipants[idx].dueDate = e.target.value;
            });
        });

        checkoutSplitParticipantsContainer.querySelectorAll('.checkout-split-interest').forEach(inp => {
            inp.addEventListener('input', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                checkoutSplitParticipants[idx].interestRate = parseFloat(e.target.value) || 0;
                renderCheckoutSplitParticipants(total);
            });
        });

        checkoutSplitParticipantsContainer.querySelectorAll('.checkout-participant-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                if (checkoutSplitParticipants.length > 2) {
                    checkoutSplitParticipants.splice(idx, 1);
                    renderCheckoutSplitParticipants(total);
                    recalculateCheckoutSplit(total);
                }
            });
        });

        recalculateCheckoutSplit(total);
    }

    function recalculateCheckoutSplit(total) {
        if (checkoutSplitMode === 'equal') {
            const count = checkoutSplitParticipants.length || 1;
            const equalShare = total / count;
            checkoutSplitParticipants.forEach(p => {
                p.shareAmount = equalShare;
            });
            if (checkoutSplitParticipantsContainer) {
                checkoutSplitParticipantsContainer.querySelectorAll('.checkout-split-amount').forEach(inp => {
                    inp.value = equalShare.toFixed(2);
                });
            }
        }
        recalculateCheckoutSplitBalanceOnly(total);
    }

    function recalculateCheckoutSplitBalanceOnly(total) {
        const sumDist = checkoutSplitParticipants.reduce((acc, p) => acc + (parseFloat(p.shareAmount) || 0), 0);
        const rem = total - sumDist;

        if (checkoutSplitSumDist) checkoutSplitSumDist.textContent = formatCurrency(sumDist);
        if (checkoutSplitSumRem) {
            checkoutSplitSumRem.textContent = formatCurrency(rem);
            if (Math.abs(rem) < 0.01) {
                checkoutSplitSumRem.className = 'text-green font-bold';
                checkoutSplitSumRem.textContent = 'R$ 0,00 (100% FECHADO)';
            } else if (rem > 0) {
                checkoutSplitSumRem.className = 'text-yellow';
                checkoutSplitSumRem.textContent = `Falta: ${formatCurrency(rem)}`;
            } else {
                checkoutSplitSumRem.className = 'text-red';
                checkoutSplitSumRem.textContent = `Excedeu: ${formatCurrency(Math.abs(rem))}`;
            }
        }
    }

    if (btnCheckoutSplitEqual) {
        btnCheckoutSplitEqual.addEventListener('click', () => {
            checkoutSplitMode = 'equal';
            btnCheckoutSplitEqual.classList.add('active');
            btnCheckoutSplitCustom.classList.remove('active');
            const cid = parseInt(checkoutComandaId.value);
            const comanda = comandas.find(c => c.id === cid);
            const total = comanda ? comanda.items.reduce((acc, it) => acc + (it.price * it.qty), 0) : 0;
            renderCheckoutSplitParticipants(total);
        });
    }

    if (btnCheckoutSplitCustom) {
        btnCheckoutSplitCustom.addEventListener('click', () => {
            checkoutSplitMode = 'custom';
            btnCheckoutSplitCustom.classList.add('active');
            btnCheckoutSplitEqual.classList.remove('active');
            const cid = parseInt(checkoutComandaId.value);
            const comanda = comandas.find(c => c.id === cid);
            const total = comanda ? comanda.items.reduce((acc, it) => acc + (it.price * it.qty), 0) : 0;
            renderCheckoutSplitParticipants(total);
        });
    }

    if (btnAddCheckoutParticipant) {
        btnAddCheckoutParticipant.addEventListener('click', () => {
            const cid = parseInt(checkoutComandaId.value);
            const comanda = comandas.find(c => c.id === cid);
            const total = comanda ? comanda.items.reduce((acc, it) => acc + (it.price * it.qty), 0) : 0;

            checkoutSplitParticipants.push({
                name: '',
                contact: '',
                payType: 'credit',
                shareAmount: 0,
                dueDate: getDefaultDueDate(),
                interestRate: 0
            });
            renderCheckoutSplitParticipants(total);
        });
    }

    // Submissão do Fechamento de Comanda
    if (comandaCheckoutForm) {
        comandaCheckoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const cid = parseInt(checkoutComandaId.value);
            const comandaIndex = comandas.findIndex(c => c.id === cid);
            if (comandaIndex === -1) return;

            const comanda = comandas[comandaIndex];
            const total = comanda.items.reduce((acc, it) => acc + (it.price * it.qty), 0);
            const itemsSummaryStr = comanda.items.map(it => `${it.qty}x ${it.product}`).join(', ');
            const isSplit = checkoutIsSplit.checked;
            const now = new Date().toISOString();

            const salesToInsert = [];

            if (isSplit) {
                if (checkoutSplitParticipants.length < 2) {
                    showToast('ERRO: Adicione pelo menos 2 clientes para rachar a comanda!', 'danger');
                    return;
                }

                for (let i = 0; i < checkoutSplitParticipants.length; i++) {
                    if (!checkoutSplitParticipants[i].name || !checkoutSplitParticipants[i].name.trim()) {
                        showToast(`ERRO: Preencha o nome do Cliente ${i + 1} no racha!`, 'danger');
                        return;
                    }
                    if (checkoutSplitParticipants[i].shareAmount <= 0) {
                        showToast(`ERRO: O valor da fatia do Cliente ${i + 1} deve ser maior que zero!`, 'danger');
                        return;
                    }
                    if (checkoutSplitParticipants[i].payType === 'credit' && !checkoutSplitParticipants[i].dueDate) {
                        showToast(`ERRO: Defina a data de vencimento para o Cliente ${i + 1}!`, 'danger');
                        return;
                    }
                }

                const totalDist = checkoutSplitParticipants.reduce((acc, p) => acc + p.shareAmount, 0);
                if (Math.abs(total - totalDist) > 0.05) {
                    showToast(`ERRO: A soma das fatias (${formatCurrency(totalDist)}) difere do total da comanda (${formatCurrency(total)})!`, 'danger');
                    return;
                }

                const totalParts = checkoutSplitParticipants.length;
                checkoutSplitParticipants.forEach((p, idx) => {
                    const isCreditPart = p.payType === 'credit';
                    const partInterest = isCreditPart ? (parseFloat(p.interestRate) || 0) : 0;

                    salesToInsert.push({
                        id: Date.now() + idx,
                        product: `[Comanda ${comanda.number}] [Racha ${idx + 1}/${totalParts}] ${itemsSummaryStr}`,
                        price: parseFloat(p.shareAmount.toFixed(2)),
                        customer: p.name.trim(),
                        contact: p.contact ? p.contact.trim() : '',
                        shipping: 0,
                        partner: comanda.partner,
                        isCredit: isCreditPart,
                        dueDate: isCreditPart ? p.dueDate : null,
                        interestRate: partInterest,
                        isPaid: !isCreditPart,
                        saleDate: now
                    });
                });
            } else {
                const isCredit = checkoutIsCredit.checked;
                let dueDate = null;
                let interestRate = 0;

                if (isCredit) {
                    dueDate = checkoutDueDate.value;
                    interestRate = parseFloat(checkoutInterestRate.value) || 0;
                    if (!dueDate) {
                        showToast('ERRO: Insira a data de vencimento do fiado!', 'danger');
                        return;
                    }
                }

                salesToInsert.push({
                    id: Date.now(),
                    product: `[Comanda ${comanda.number}] ${itemsSummaryStr}`,
                    price: total,
                    customer: comanda.customer,
                    contact: comanda.contact,
                    shipping: 0,
                    partner: comanda.partner,
                    isCredit: isCredit,
                    dueDate: dueDate,
                    interestRate: interestRate,
                    isPaid: !isCredit,
                    saleDate: now
                });
            }

            let anyError = false;
            for (const saleRecord of salesToInsert) {
                try {
                    const response = await fetch('/api/sales', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(saleRecord)
                    });
                    if (!response.ok) throw new Error();
                } catch (err) {
                    anyError = true;
                    sales.push(saleRecord);
                }
            }

            comandas.splice(comandaIndex, 1);
            saveComandas();
            comandaCheckoutModal.classList.add('hidden');

            if (anyError) {
                localStorage.setItem('ligapods_sales', JSON.stringify(sales));
                showToast(`COMANDA FECHADA! DÉBITOS LANÇADOS LOCALMENTE (OFFLINE)!`, 'success');
            } else {
                showToast(`COMANDA ${comanda.number.toUpperCase()} FINALIZADA COM SUCESSO! DÉBITOS LANÇADOS!`, 'success');
            }

            await loadSales();
            const hasCredit = salesToInsert.some(s => s.isCredit);
            if (hasCredit) switchTab('tab-fiados');
            else switchTab('tab-vista');
        });
    }

    // === COMPUTAÇÃO DE DATAS E STATUS DO FIADO ===
    function calculateFiadoStatus(dueDateStr) {
        if (!dueDateStr) return { label: 'PENDENTE', class: 'badge-pending' };
        const parts = dueDateStr.split('-');
        const due = new Date(parts[0], parts[1] - 1, parts[2]);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { label: 'ATRASADO', class: 'badge-overdue' };
        } else if (diffDays === 0) {
            return { label: 'DIA DE PAGAR', class: 'badge-today' };
        } else if (diffDays <= 2) {
            return { label: 'PERTO DE PAGAR', class: 'badge-near' };
        } else {
            return { label: 'PENDENTE', class: 'badge-pending' };
        }
    }

    // === RENDERIZAÇÃO DAS TELAS E DADOS ===
    function renderDashboard() {
        let cashTotal = 0;
        let creditTotal = 0;
        let dueTodayCount = 0;

        let partnerStats = {
            'Lipe': { cash: 0, credit: 0 },
            'Anna': { cash: 0, credit: 0 },
            'Leon': { cash: 0, credit: 0 }
        };

        sales.forEach(sale => {
            const finalVal = calculateTotalValue(sale);
            const partnerName = sale.partner || 'Lipe';

            if (!sale.isCredit) {
                cashTotal += finalVal;
                if (partnerStats[partnerName]) {
                    partnerStats[partnerName].cash += finalVal;
                }
            } else {
                creditTotal += finalVal;
                if (partnerStats[partnerName]) {
                    partnerStats[partnerName].credit += finalVal;
                }
                const status = calculateFiadoStatus(sale.dueDate);
                if (status.label === 'DIA DE PAGAR') {
                    dueTodayCount++;
                }
            }
        });

        statCashTotal.textContent = formatCurrency(cashTotal);
        statCreditTotal.textContent = formatCurrency(creditTotal);
        statDueToday.textContent = dueTodayCount;
        if (dueTodayCount > 0) {
            statDueToday.classList.add('blink');
        } else {
            statDueToday.classList.remove('blink');
        }

        if (partnerTotalLipe) {
            partnerTotalLipe.textContent = formatCurrency(partnerStats['Lipe'].cash);
            partnerCreditLipe.textContent = `(Fiado: ${formatCurrency(partnerStats['Lipe'].credit)})`;
        }
        if (partnerTotalAnna) {
            partnerTotalAnna.textContent = formatCurrency(partnerStats['Anna'].cash);
            partnerCreditAnna.textContent = `(Fiado: ${formatCurrency(partnerStats['Anna'].credit)})`;
        }
        if (partnerTotalLeon) {
            partnerTotalLeon.textContent = formatCurrency(partnerStats['Leon'].cash);
            partnerCreditLeon.textContent = `(Fiado: ${formatCurrency(partnerStats['Leon'].credit)})`;
        }

        renderFiadosTable();
        renderVistaTable();
        renderCustomersTable();
    }

    function renderFiadosTable() {
        const creditSales = sales.filter(s => s.isCredit);
        tableBodyCredit.innerHTML = '';

        if (creditSales.length === 0) {
            tableBodyCredit.innerHTML = `<tr><td colspan="9" class="text-center">Nenhum produto fiado cadastrado no banco.</td></tr>`;
            return;
        }

        creditSales.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        creditSales.forEach(sale => {
            const total = calculateTotalValue(sale);
            const statusInfo = calculateFiadoStatus(sale.dueDate);
            const contactLink = formatWhatsAppLink(sale.contact, sale.customer);
            const customerCell = contactLink 
                ? `<strong>${sale.customer}</strong><br><a href="${contactLink}" target="_blank" class="whatsapp-link">📱 Chat WhatsApp</a>`
                : `<strong>${sale.customer}</strong><br><span class="text-muted">${sale.contact || 'Sem contato'}</span>`;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${customerCell}</td>
                <td><span style="font-family:'Outfit'; font-size:14px; font-weight:600; color:#ff3366;">${sale.partner || 'Lipe'}</span></td>
                <td>${sale.product}</td>
                <td>${formatCurrency(sale.price + sale.shipping)} <span style="font-size:13px;color:#8a8a93;">(F: ${formatCurrency(sale.shipping)})</span></td>
                <td>${sale.interestRate}%</td>
                <td style="color:#00ff66;font-weight:bold;">${formatCurrency(total)}</td>
                <td>${formatDate(sale.dueDate)}</td>
                <td><span class="badge ${statusInfo.class}">${statusInfo.label}</span></td>
                <td>
                    <div class="pixel-dropdown">
                        <button class="pixel-btn-dropdown btn-dropdown-trigger" data-id="${sale.id}">⋮</button>
                        <div class="pixel-dropdown-menu hidden" id="dropdown-${sale.id}">
                            <button class="dropdown-item btn-pay" data-id="${sale.id}">RECEBER</button>
                            <button class="dropdown-item btn-edit" data-id="${sale.id}">EDITAR</button>
                            <button class="dropdown-item btn-delete" data-id="${sale.id}">EXCLUIR</button>
                        </div>
                    </div>
                </td>
            `;
            tableBodyCredit.appendChild(tr);
        });

        setupDropdownListeners('#table-body-credit', true);
    }

    function renderVistaTable() {
        const cashSales = sales.filter(s => !s.isCredit);
        tableBodyCash.innerHTML = '';

        if (cashSales.length === 0) {
            tableBodyCash.innerHTML = `<tr><td colspan="7" class="text-center">Nenhuma venda à vista registrada no banco.</td></tr>`;
            return;
        }

        cashSales.sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate));

        cashSales.forEach(sale => {
            const total = calculateTotalValue(sale);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${formatDateTime(sale.saleDate)}</td>
                <td><span style="font-family:'Outfit'; font-size:14px; font-weight:600; color:#ff3366;">${sale.partner || 'Lipe'}</span></td>
                <td><strong>${sale.customer}</strong></td>
                <td>${sale.product}</td>
                <td>${formatCurrency(sale.shipping)}</td>
                <td style="color:#00ff66;font-weight:bold;">${formatCurrency(total)}</td>
                <td>
                    <div class="pixel-dropdown">
                        <button class="pixel-btn-dropdown btn-dropdown-trigger" data-id="${sale.id}">⋮</button>
                        <div class="pixel-dropdown-menu hidden" id="dropdown-${sale.id}">
                            <button class="dropdown-item btn-edit" data-id="${sale.id}">EDITAR</button>
                            <button class="dropdown-item btn-delete" data-id="${sale.id}">EXCLUIR</button>
                        </div>
                    </div>
                </td>
            `;
            tableBodyCash.appendChild(tr);
        });

        setupDropdownListeners('#table-body-cash', false);
    }

    function renderCustomersTable() {
        const customerData = {};
        sales.forEach(sale => {
            const name = sale.customer;
            if (!name) return;
            if (!customerData[name]) {
                customerData[name] = {
                    name: name,
                    contact: sale.contact,
                    purchasesCount: 0,
                    totalSpent: 0,
                    outstandingDebt: 0
                };
            }
            const total = calculateTotalValue(sale);
            customerData[name].purchasesCount++;
            if (sale.isCredit) {
                customerData[name].outstandingDebt += total;
            } else {
                customerData[name].totalSpent += total;
            }
            if (sale.contact && !customerData[name].contact) {
                customerData[name].contact = sale.contact;
            }
        });

        const customerList = Object.values(customerData);
        tableBodyCustomers.innerHTML = '';

        if (customerList.length === 0) {
            tableBodyCustomers.innerHTML = `<tr><td colspan="6" class="text-center">Nenhum cliente cadastrado no banco.</td></tr>`;
            return;
        }

        customerList.sort((a, b) => b.outstandingDebt - a.outstandingDebt || b.totalSpent - a.totalSpent);

        customerList.forEach(c => {
            const tr = document.createElement('tr');
            const totalCompradoTotal = c.totalSpent + c.outstandingDebt;
            const contactLink = formatWhatsAppLink(c.contact, c.name);
            const contactText = contactLink 
                ? `<a href="${contactLink}" target="_blank" class="whatsapp-link">Chat WhatsApp</a>`
                : (c.contact || 'Sem contato');

            let statusText = 'REGULAR';
            let statusClass = 'text-green';
            if (c.outstandingDebt > 0) {
                statusText = 'DEVEDOR';
                statusClass = 'text-red blink';
            } else if (totalCompradoTotal > 500) {
                statusText = 'VIP';
                statusClass = 'text-yellow';
            }

            tr.innerHTML = `
                <td><strong>${c.name}</strong></td>
                <td>${contactText}</td>
                <td>${c.purchasesCount} vendas</td>
                <td>${formatCurrency(totalCompradoTotal)}</td>
                <td style="${c.outstandingDebt > 0 ? 'color:#ff3366;font-weight:bold;' : ''}">${formatCurrency(c.outstandingDebt)}</td>
                <td><span class="${statusClass}">${statusText}</span></td>
            `;
            tableBodyCustomers.appendChild(tr);
        });
    }

    // === FUNÇÕES AUXILIARES ===

    async function payCreditSale(id) {
        const sale = sales.find(s => s.id === id);
        if (sale) {
            const updatedSale = {
                ...sale,
                isCredit: false,
                isPaid: true,
                saleDate: new Date().toISOString()
            };

            try {
                const response = await fetch('/api/sales', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedSale)
                });

                if (response.ok) {
                    showToast(`DÉBITO DE ${sale.customer.toUpperCase()} RECEBIDO NO MYSQL!`, 'success');
                    await loadSales();
                } else {
                    throw new Error();
                }
            } catch (err) {
                console.warn('Backend indisponível. Atualizando venda como paga localmente.');
                const idx = sales.findIndex(s => s.id === id);
                if (idx !== -1) {
                    sales[idx] = updatedSale;
                    localStorage.setItem('ligapods_sales', JSON.stringify(sales));
                    showToast(`DÉBITO DE ${sale.customer.toUpperCase()} RECEBIDO LOCALMENTE!`, 'success');
                    renderDashboard();
                }
            }
        }
    }

    function calculateTotalValue(sale) {
        const base = (parseFloat(sale.price) || 0) + (parseFloat(sale.shipping) || 0);
        if (sale.isCredit && parseFloat(sale.interestRate) > 0) {
            const interestAmount = base * (parseFloat(sale.interestRate) / 100);
            return base + interestAmount;
        }
        return base;
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
    }

    function formatDate(dateStr) {
        if (!dateStr) return '-';
        const parts = dateStr.split('-');
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    function formatDateTime(isoString) {
        if (!isoString) return '-';
        const d = new Date(isoString);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    function formatWhatsAppLink(contactStr, name) {
        if (!contactStr) return null;
        const numbers = contactStr.replace(/\D/g, '');
        if (numbers.length < 8) return null;
        let formatted = numbers;
        if (numbers.length === 10 || numbers.length === 11) {
            formatted = '55' + numbers;
        }
        const msg = encodeURIComponent(`Olá ${name}, tudo bem? Estou entrando em contato sobre sua compra na LIGA PODS!`);
        return `https://api.whatsapp.com/send?phone=${formatted}&text=${msg}`;
    }

    let toastTimeout;
    function showToast(message, type = 'success') {
        clearTimeout(toastTimeout);
        toastMessage.textContent = message;
        toast.className = 'toast-container pixel-border-single';
        if (type === 'success') {
            toast.classList.add('toast-success');
        } else if (type === 'danger') {
            toast.classList.add('toast-danger');
        }
        toast.classList.remove('hidden');
        playBeep(type);
        toastTimeout = setTimeout(() => {
            toast.classList.add('hidden');
        }, 3500);
    }

    function playBeep(type) {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            if (type === 'success') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
                osc.start();
                osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.08);
                gain.gain.setValueAtTime(0.05, audioCtx.currentTime + 0.08);
                osc.stop(audioCtx.currentTime + 0.22);
            } else {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(220, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.07, audioCtx.currentTime);
                osc.start();
                osc.frequency.setValueAtTime(146.83, audioCtx.currentTime + 0.1);
                osc.stop(audioCtx.currentTime + 0.25);
            }
        } catch (e) {}
    }

    // === SISTEMA DE EDIÇÃO E EXCLUSÃO ===
    function updateEditLiveTotal() {
        const price = parseFloat(editProductPrice.value) || 0;
        const shipping = parseFloat(editShippingFee.value) || 0;
        const interest = parseFloat(editInterestRate.value) || 0;
        const isCredit = editIsCredit.checked;

        if (isCredit) {
            const base = price + shipping;
            const interestAmt = base * (interest / 100);
            const total = base + interestAmt;
            editLiveTotalValue.textContent = formatCurrency(total);
            editLiveTotalPreview.classList.remove('hidden');
        } else {
            editLiveTotalPreview.classList.add('hidden');
        }
    }

    editProductPrice.addEventListener('input', updateEditLiveTotal);
    editShippingFee.addEventListener('input', updateEditLiveTotal);
    editInterestRate.addEventListener('input', updateEditLiveTotal);
    
    editIsCredit.addEventListener('change', () => {
        if (editIsCredit.checked) {
            editCreditInputs.classList.remove('hidden');
            editDueDate.required = true;
        } else {
            editCreditInputs.classList.add('hidden');
            editDueDate.required = false;
        }
        updateEditLiveTotal();
    });

    function openEditModal(saleId) {
        const sale = sales.find(s => s.id === saleId);
        if (!sale) return;

        editSaleId.value = sale.id;
        editProductName.value = sale.product;
        editProductPrice.value = sale.price;
        editCustomerName.value = sale.customer;
        editCustomerContact.value = sale.contact || '';
        editShippingFee.value = sale.shipping;
        editPartnerSelect.value = sale.partner || 'Lipe';
        editIsCredit.checked = sale.isCredit;

        if (sale.isCredit) {
            editCreditInputs.classList.remove('hidden');
            editDueDate.required = true;
            editDueDate.value = sale.dueDate || '';
            editInterestRate.value = sale.interestRate || 0;
        } else {
            editCreditInputs.classList.add('hidden');
            editDueDate.required = false;
            editDueDate.value = '';
            editInterestRate.value = 0;
        }

        updateEditLiveTotal();
        editModal.classList.remove('hidden');
    }

    btnCancelEdit.addEventListener('click', () => {
        editModal.classList.add('hidden');
    });

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = parseInt(editSaleId.value);
        const index = sales.findIndex(s => s.id === id);
        if (index === -1) return;

        const isCredit = editIsCredit.checked;
        let dueDate = null;
        let interestRate = 0;

        if (isCredit) {
            dueDate = editDueDate.value;
            interestRate = parseFloat(editInterestRate.value) || 0;
            if (!dueDate) {
                showToast('ERRO: Insira a data de vencimento!', 'danger');
                return;
            }
        }

        const updatedSale = {
            id,
            product: editProductName.value.trim(),
            price: parseFloat(editProductPrice.value) || 0,
            customer: editCustomerName.value.trim(),
            contact: editCustomerContact.value.trim(),
            shipping: parseFloat(editShippingFee.value) || 0,
            partner: editPartnerSelect.value,
            isCredit: isCredit,
            dueDate: dueDate,
            interestRate: interestRate,
            isPaid: !isCredit,
            saleDate: sales[index].saleDate
        };

        try {
            const response = await fetch('/api/sales', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedSale)
            });

            if (response.ok) {
                showToast('VENDA ATUALIZADA NO MYSQL!', 'success');
                editModal.classList.add('hidden');
                await loadSales();
            } else {
                throw new Error();
            }
        } catch (err) {
            console.warn('API /api/sales indisponível. Editando localmente no LocalStorage.');
            sales[index] = updatedSale;
            localStorage.setItem('ligapods_sales', JSON.stringify(sales));
            showToast('VENDA ATUALIZADA LOCALMENTE (OFFLINE)!', 'success');
            editModal.classList.add('hidden');
            renderDashboard();
        }
    });

    async function deleteSale(id) {
        if (confirm('Tem certeza que deseja excluir esta venda do sistema? Esta ação não pode ser desfeita!')) {
            try {
                const response = await fetch(`/api/sales?id=${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    showToast('VENDA EXCLUÍDA DO BANCO DE DADOS!', 'success');
                    await loadSales();
                } else {
                    throw new Error();
                }
            } catch (err) {
                console.warn('API /api/sales indisponível. Excluindo localmente no LocalStorage.');
                sales = sales.filter(s => s.id !== id);
                localStorage.setItem('ligapods_sales', JSON.stringify(sales));
                showToast('VENDA EXCLUÍDA LOCALMENTE (OFFLINE)!', 'success');
                renderDashboard();
            }
        }
    }

    // === DROPDOWNS E CONFIGURAÇÃO DE EVENTOS DE AÇÃO ===
    function setupDropdownListeners(tableSelector, includePay) {
        const table = document.querySelector(tableSelector);
        if (!table) return;

        table.querySelectorAll('.btn-dropdown-trigger').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = e.target.getAttribute('data-id');
                const menu = document.getElementById(`dropdown-${id}`);
                
                document.querySelectorAll('.pixel-dropdown-menu').forEach(m => {
                    if (m !== menu) {
                        m.classList.add('hidden');
                    }
                });

                if (menu) {
                    menu.classList.toggle('hidden');
                }
            });
        });

        if (includePay) {
            table.querySelectorAll('.btn-pay').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const saleId = parseInt(e.target.getAttribute('data-id'));
                    payCreditSale(saleId);
                });
            });
        }

        table.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const saleId = parseInt(e.target.getAttribute('data-id'));
                openEditModal(saleId);
            });
        });

        table.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const saleId = parseInt(e.target.getAttribute('data-id'));
                deleteSale(saleId);
            });
        });
    }

    document.addEventListener('click', () => {
        document.querySelectorAll('.pixel-dropdown-menu').forEach(menu => {
            menu.classList.add('hidden');
        });
    });
});
