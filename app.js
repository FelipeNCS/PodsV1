// JS - LIGA PODS Sales Management System (Full Stack MySQL Version)

document.addEventListener('DOMContentLoaded', () => {
    // === ESTADO DA APLICAÇÃO ===
    let sales = [];

    // Produtos populares e preços padrão para auto-preenchimento
    const productPrices = {
        'Ignite V50': 120.00,
        'Elf Bar BC5000': 90.00,
        'Waka SoPro DM8000': 140.00,
        'Lost Mary MO5000': 100.00,
        'Oxbar G8000': 110.00
    };

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

    // Formulário de Venda
    const saleForm = document.getElementById('sale-form');
    const productNameInput = document.getElementById('product-name');
    const productPriceInput = document.getElementById('product-price');
    const customerNameInput = document.getElementById('customer-name');
    const customerContactInput = document.getElementById('customer-contact');
    const shippingFeeInput = document.getElementById('shipping-fee');
    const partnerSelect = document.getElementById('partner-select');
    const isCreditCheckbox = document.getElementById('is-credit');
    const creditFields = document.getElementById('credit-fields');
    const dueDateInput = document.getElementById('due-date');
    const interestRateInput = document.getElementById('interest-rate');
    const btnResetForm = document.getElementById('btn-reset-form');

    // Elementos de Preview de Juros em Tempo Real
    const liveTotalPreview = document.getElementById('live-total-preview');
    const liveTotalValue = document.getElementById('live-total-value');

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
    const ctx = canvas.getContext('2d');

    // === SISTEMA DE ANIMAÇÃO DE FUMAÇA E PARTÍCULAS (CANVAS 2D) ===
    let particles = [];
    let smokePuffs = [];

    function resizeCanvas() {
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (Math.random() < 0.08) {
            smokePuffs.push(new SmokePuff(Math.random() * (canvas.width * 0.25), canvas.height + 50, 'left'));
        }
        if (Math.random() < 0.08) {
            smokePuffs.push(new SmokePuff(canvas.width - Math.random() * (canvas.width * 0.25), canvas.height + 50, 'right'));
        }

        // Partículas na tela inicial
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

    // === COMUNICAÇÃO COM O BACKEND (API MYSQL) ===

    // Buscar Vendas do MySQL
    async function loadSales() {
        try {
            const response = await fetch('/api/sales');
            if (!response.ok) throw new Error('Erro ao buscar dados do MySQL');
            sales = await response.json();
            renderDashboard();
        } catch (err) {
            console.error('Falha ao carregar vendas:', err);
            showToast('Erro ao sincronizar com o banco de dados!', 'danger');
        }
    }

    // === LOGICA DE SELEÇÃO E PREÇO DOS PRODUTOS ===
    productNameInput.addEventListener('input', (e) => {
        const text = e.target.value.toLowerCase();
        for (const [key, price] of Object.entries(productPrices)) {
            if (text.includes(key.toLowerCase())) {
                productPriceInput.value = price.toFixed(2);
                showToast(`Preço sugerido para ${key}: R$ ${price.toFixed(2)}`, 'success');
                break;
            }
        }
    });

    // === NAVEGAÇÃO E AUTENTICAÇÃO ===
    
    // Login do Administrador
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
            const result = await response.json();

            if (result.success) {
                startScreen.classList.remove('active');
                setTimeout(async () => {
                    dashboardScreen.classList.add('active');
                    await loadSales();
                    showToast(`Olá, ${username}! Login realizado.`, 'success');
                    loginForm.reset();
                    // Sincronização automática em segundo plano a cada 10 segundos
                    setInterval(loadSales, 10000);
                }, 100);
            } else {
                showToast(result.message || 'Usuário ou senha incorretos!', 'danger');
            }
        } catch (err) {
            console.error('Erro no login:', err);
            showToast('Falha na autenticação. Verifique o banco!', 'danger');
        }
    });

    // Registro de Novo Administrador (dentro do painel)
    registerAdminForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = regUsernameInput.value.trim();
        const password = regPasswordInput.value;

        if (password.length < 6) {
            showToast('Erro: Senha muito curta (mínimo 6 dígitos)', 'danger');
            return;
        }

        try {
            const response = await fetch('/api/admins?action=register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();

            if (result.success) {
                showToast(`Admin ${username.toUpperCase()} cadastrado com sucesso!`, 'success');
                registerAdminForm.reset();
                switchTab('tab-vender');
            } else {
                showToast(result.message || 'Falha ao cadastrar!', 'danger');
            }
        } catch (err) {
            console.error('Erro no registro:', err);
            showToast('Erro ao cadastrar novo administrador!', 'danger');
        }
    });

    // Sair do painel
    btnBackHome.addEventListener('click', () => {
        dashboardScreen.classList.remove('active');
        setTimeout(() => {
            startScreen.classList.add('active');
        }, 100);
    });

    // Alternar Abas (Tabs)
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            navTabs.forEach(t => t.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const targetPanel = document.getElementById(tab.getAttribute('data-tab'));
            targetPanel.classList.add('active');

            // Recarregar do MySQL sempre que trocar de aba para garantir dados frescos
            loadSales();
        });
    });

    // === REGISTRO DE VENDAS ===

    // Cálculo em Tempo Real de Juros e Total (Formulário Principal)
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
    }

    productPriceInput.addEventListener('input', updateLiveTotal);
    shippingFeeInput.addEventListener('input', updateLiveTotal);
    interestRateInput.addEventListener('input', updateLiveTotal);

    isCreditCheckbox.addEventListener('change', () => {
        if (isCreditCheckbox.checked) {
            creditFields.classList.remove('hidden');
            dueDateInput.required = true;
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            dueDateInput.value = nextWeek.toISOString().split('T')[0];
        } else {
            creditFields.classList.add('hidden');
            dueDateInput.required = false;
            dueDateInput.value = '';
            interestRateInput.value = '0';
        }
        updateLiveTotal();
    });

    // Enviar Nova Venda ao MySQL
    saleForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const productName = productNameInput.value.trim();
        const productPrice = parseFloat(productPriceInput.value);
        const customerName = customerNameInput.value.trim();
        const customerContact = customerContactInput.value.trim();
        const shippingFee = parseFloat(shippingFeeInput.value) || 0;
        const partner = partnerSelect.value;
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
                if (isCredit) {
                    switchTab('tab-fiados');
                } else {
                    switchTab('tab-vista');
                }
            } else {
                throw new Error('Falha ao registrar venda');
            }
        } catch (err) {
            console.error(err);
            showToast('Erro ao salvar venda no MySQL!', 'danger');
        }
    });

    btnResetForm.addEventListener('click', resetForm);

    function resetForm() {
        saleForm.reset();
        creditFields.classList.add('hidden');
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
        loadSales();
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

    // Liquidar Fiado no MySQL (Receber)
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
                    showToast(`DÉBITO DE ${sale.customer.toUpperCase()} RECEBIDO!`, 'success');
                    await loadSales();
                } else {
                    throw new Error();
                }
            } catch (err) {
                showToast('Erro ao receber venda no MySQL!', 'danger');
            }
        }
    }

    function calculateTotalValue(sale) {
        const base = sale.price + sale.shipping;
        if (sale.isCredit && sale.interestRate > 0) {
            const interestAmount = base * (sale.interestRate / 100);
            return base + interestAmount;
        }
        return base;
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    function formatDate(dateStr) {
        if (!dateStr) return '-';
        const parts = dateStr.split('-');
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    function formatDateTime(isoString) {
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
        const msg = encodeURIComponent(`Olá, tudo bem? Estou entrando em contato sobre sua compra na LIGA PODS!`);
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
            showToast('Erro ao atualizar venda no banco!', 'danger');
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
                showToast('Erro ao excluir venda no MySQL!', 'danger');
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
