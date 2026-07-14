// JS - LIGA PODS Sales Management System

document.addEventListener('DOMContentLoaded', () => {
    // === ESTADO DA APLICAÇÃO ===
    let sales = JSON.parse(localStorage.getItem('ligapods_sales')) || [];

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
    
    // Botões de Navegação
    const btnStart = document.getElementById('btn-start');
    const btnBackHome = document.getElementById('btn-back-home');
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabPanels = document.querySelectorAll('.tab-panel');

    // Formulário
    const saleForm = document.getElementById('sale-form');
    const productNameInput = document.getElementById('product-name');
    const productPriceInput = document.getElementById('product-price');
    const customerNameInput = document.getElementById('customer-name');
    const customerContactInput = document.getElementById('customer-contact');
    const shippingFeeInput = document.getElementById('shipping-fee');
    const isCreditCheckbox = document.getElementById('is-credit');
    const creditFields = document.getElementById('credit-fields');
    const dueDateInput = document.getElementById('due-date');
    const interestRateInput = document.getElementById('interest-rate');
    const partnerSelect = document.getElementById('partner-select');
    const btnResetForm = document.getElementById('btn-reset-form');

    // Sócios Elementos
    const partnerTotalLipe = document.getElementById('partner-total-lipe');
    const partnerCreditLipe = document.getElementById('partner-credit-lipe');
    const partnerTotalAnna = document.getElementById('partner-total-anna');
    const partnerCreditAnna = document.getElementById('partner-credit-anna');
    const partnerTotalLeon = document.getElementById('partner-total-leon');
    const partnerCreditLeon = document.getElementById('partner-credit-leon');

    // Tabelas e Listas
    const tableBodyCredit = document.getElementById('table-body-credit');
    const tableBodyCash = document.getElementById('table-body-cash');
    const tableBodyCustomers = document.getElementById('table-body-customers');

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

    // Estatísticas
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

    // Classe para bocanadas de fumaça pixeladas (Grandes blocos de fumaça na lateral)
    class SmokePuff {
        constructor(x, y, side) {
            this.x = x;
            this.y = y;
            this.side = side; // 'left' ou 'right'
            this.size = Math.random() * 60 + 40; // tamanho do puff de fumaça
            this.vx = (side === 'left' ? 1 : -1) * (Math.random() * 0.5 + 0.2);
            this.vy = -(Math.random() * 0.8 + 0.4);
            this.alpha = Math.random() * 0.15 + 0.05;
            this.color = Math.random() > 0.3 ? '#ff003c' : '#440011';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            // Efeito de oscilação horizontal (drift)
            this.vx += (Math.random() - 0.5) * 0.1;
            
            // Reduzir opacidade conforme sobe
            if (this.y < canvas.height * 0.8) {
                this.alpha -= 0.0008;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.fillStyle = this.color;
            // Desenhar como blocos de pixel art (quadrados) combinados
            const pSize = Math.floor(this.size / 10) * 10; // Arredondar para estilo pixel
            
            // Renderiza bloco central
            ctx.fillRect(this.x - pSize / 2, this.y - pSize / 2, pSize, pSize);
            
            // Sub-blocos laterais para dar aparência de fumaça irregular
            ctx.fillStyle = '#ff3366';
            ctx.fillRect(this.x - pSize * 0.4, this.y - pSize * 0.2, pSize * 0.8, pSize * 0.8);
            ctx.fillStyle = '#110004';
            ctx.fillRect(this.x - pSize * 0.2, this.y - pSize * 0.4, pSize * 0.5, pSize * 0.5);
            
            ctx.restore();
        }
    }

    // Classe para partículas vermelhas e cruzes (+) saindo da fumaça
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 4 + 4; // tamanho da partícula
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = -(Math.random() * 1.5 + 1.2);
            this.alpha = 1;
            this.color = '#ff003c';
            this.isCross = Math.random() > 0.4; // 60% de chance de ser uma cruz (+)
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
                // Desenha símbolo "+" pixelado
                const p = Math.floor(this.size / 2) || 2;
                // Barra horizontal
                ctx.fillRect(this.x - p * 1.5, this.y - p / 2, p * 3, p);
                // Barra vertical
                ctx.fillRect(this.x - p / 2, this.y - p * 1.5, p, p * 3);
            } else {
                // Desenha quadrado pixelado (■)
                ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
            }
            ctx.restore();
        }
    }

    // Loop de Animação
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Criar novas fumaças nas laterais da base da tela
        if (Math.random() < 0.08) {
            // Fumaça esquerda
            smokePuffs.push(new SmokePuff(Math.random() * (canvas.width * 0.25), canvas.height + 50, 'left'));
        }
        if (Math.random() < 0.08) {
            // Fumaça direita
            smokePuffs.push(new SmokePuff(canvas.width - Math.random() * (canvas.width * 0.25), canvas.height + 50, 'right'));
        }

        // Partículas emanando por trás da caixa da logo na tela de início
        if (startScreen && startScreen.classList.contains('active')) {
            const startBox = document.querySelector('.start-box');
            if (startBox) {
                const rect = startBox.getBoundingClientRect();
                if (Math.random() < 0.35) {
                    const side = Math.floor(Math.random() * 4);
                    let px, py;
                    if (side === 0) { // Topo
                        px = rect.left + Math.random() * rect.width;
                        py = rect.top;
                    } else if (side === 1) { // Base
                        px = rect.left + Math.random() * rect.width;
                        py = rect.bottom;
                    } else if (side === 2) { // Esquerda
                        px = rect.left;
                        py = rect.top + Math.random() * rect.height;
                    } else { // Direita
                        px = rect.right;
                        py = rect.top + Math.random() * rect.height;
                    }
                    particles.push(new Particle(px, py));
                }
            }
        }

        // Atualizar e desenhar fumaça
        for (let i = smokePuffs.length - 1; i >= 0; i--) {
            const puff = smokePuffs[i];
            puff.update();
            puff.draw();

            // Emitir partículas da fumaça conforme ela sobe
            if (Math.random() < 0.25 && puff.alpha > 0.02) {
                particles.push(new Particle(puff.x + (Math.random() - 0.5) * puff.size * 0.5, puff.y));
            }

            // Remove se sumir totalmente ou sair do topo
            if (puff.alpha <= 0 || puff.y < -100) {
                smokePuffs.splice(i, 1);
            }
        }

        // Atualizar e desenhar partículas (+ e ■)
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


    // === LOGICA DE SELEÇÃO E PREÇO DOS PRODUTOS ===
    // Auto-preenchimento de valores com base no pod selecionado
    productNameInput.addEventListener('input', (e) => {
        const text = e.target.value.toLowerCase();
        
        // Verifica se o texto inserido corresponde a algum prefixo conhecido
        for (const [key, price] of Object.entries(productPrices)) {
            if (text.includes(key.toLowerCase())) {
                productPriceInput.value = price.toFixed(2);
                showToast(`Preço sugerido para ${key}: R$ ${price.toFixed(2)}`, 'success');
                break;
            }
        }
    });

    // === NAVEGAÇÃO DE TELAS E ABAS ===
    // Iniciar Gerenciamento
    btnStart.addEventListener('click', () => {
        startScreen.classList.remove('active');
        // Pequeno atraso para a animação retrô
        setTimeout(() => {
            dashboardScreen.classList.add('active');
            renderDashboard();
            showToast('Sistema Inicializado!', 'success');
        }, 100);
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

            // Renderizar dados da aba
            renderDashboard();
        });
    });


    // === REGISTRO DE VENDAS ===
    // Mostrar/Esconder campos do fiado ao marcar checkbox
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
            // Definir data padrão de vencimento para 7 dias a partir de hoje
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

    // Processar Formulário de Venda
    saleForm.addEventListener('submit', (e) => {
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

        // Criar venda
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
            isPaid: false, // se for fiado inicia como não pago
            saleDate: new Date().toISOString()
        };

        // Salvar venda
        sales.push(newSale);
        saveSales();

        showToast('VENDA REGISTRADA COM SUCESSO!', 'success');
        
        // Resetar formulário
        resetForm();

        // Ir para a aba apropriada
        if (isCredit) {
            switchTab('tab-fiados');
        } else {
            switchTab('tab-vista');
        }
    });

    // Botão Limpar Formulário
    btnResetForm.addEventListener('click', () => {
        resetForm();
    });

    function resetForm() {
        saleForm.reset();
        creditFields.classList.add('hidden');
        dueDateInput.required = false;
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
        renderDashboard();
    }


    // === COMPUTAÇÃO DE DATAS E STATUS DO FIADO ===
    function calculateFiadoStatus(dueDateStr) {
        if (!dueDateStr) return { label: 'PENDENTE', class: 'badge-pending' };

        // Formatar datas ignorando fusos para comparação exata de dias
        const parts = dueDateStr.split('-'); // [YYYY, MM, DD]
        const due = new Date(parts[0], parts[1] - 1, parts[2]);
        
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Diferença em milissegundos
        const diffTime = due.getTime() - today.getTime();
        // Converter em dias
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
        // 1. Calcular estatísticas gerais e por sócio
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
            const partnerName = sale.partner || 'Lipe'; // fallback de compatibilidade

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
                // Verificar se vence hoje
                const status = calculateFiadoStatus(sale.dueDate);
                if (status.label === 'DIA DE PAGAR') {
                    dueTodayCount++;
                }
            }
        });

        // Atualizar textos no Header
        statCashTotal.textContent = formatCurrency(cashTotal);
        statCreditTotal.textContent = formatCurrency(creditTotal);
        statDueToday.textContent = dueTodayCount;
        if (dueTodayCount > 0) {
            statDueToday.classList.add('blink');
        } else {
            statDueToday.classList.remove('blink');
        }

        // Atualizar textos por Sócio no Sub-header
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

        // 2. Renderizar Tabelas
        renderFiadosTable();
        renderVistaTable();
        renderCustomersTable();
    }

    // Renderizar Tabela de Fiados
    function renderFiadosTable() {
        const creditSales = sales.filter(s => s.isCredit);
        tableBodyCredit.innerHTML = '';

        if (creditSales.length === 0) {
            tableBodyCredit.innerHTML = `<tr><td colspan="8" class="text-center">Nenhum produto fiado cadastrado.</td></tr>`;
            return;
        }

        // Ordena por prazo de vencimento (vencidos e vencendo hoje primeiro)
        creditSales.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        creditSales.forEach(sale => {
            const total = calculateTotalValue(sale);
            const statusInfo = calculateFiadoStatus(sale.dueDate);

            const tr = document.createElement('tr');
            
            // Nome do cliente + Link do WhatsApp se houver contato
            const contactLink = formatWhatsAppLink(sale.contact, sale.customer);
            const customerCell = contactLink 
                ? `<strong>${sale.customer}</strong><br><a href="${contactLink}" target="_blank" class="whatsapp-link">📱 Chat WhatsApp</a>`
                : `<strong>${sale.customer}</strong><br><span class="text-muted">${sale.contact || 'Sem contato'}</span>`;

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

        // Configurar listeners do dropdown de ações
        setupDropdownListeners('#table-body-credit', true);
    }

    // Renderizar Tabela À Vista
    function renderVistaTable() {
        const cashSales = sales.filter(s => !s.isCredit);
        tableBodyCash.innerHTML = '';

        if (cashSales.length === 0) {
            tableBodyCash.innerHTML = `<tr><td colspan="5" class="text-center">Nenhuma venda à vista registrada.</td></tr>`;
            return;
        }

        // Ordena por data mais recente
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

        // Configurar listeners do dropdown de ações
        setupDropdownListeners('#table-body-cash', false);
    }

    // Renderizar Tabela de Clientes
    function renderCustomersTable() {
        // Agrupar dados por cliente
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
            tableBodyCustomers.innerHTML = `<tr><td colspan="6" class="text-center">Nenhum cliente no banco de dados.</td></tr>`;
            return;
        }

        // Ordena por saldo devedor ou total comprado
        customerList.sort((a, b) => b.outstandingDebt - a.outstandingDebt || b.totalSpent - a.totalSpent);

        customerList.forEach(c => {
            const tr = document.createElement('tr');
            const totalCompradoTotal = c.totalSpent + c.outstandingDebt;
            const contactLink = formatWhatsAppLink(c.contact, c.name);
            const contactText = contactLink 
                ? `<a href="${contactLink}" target="_blank" class="whatsapp-link">Chat WhatsApp</a>`
                : (c.contact || 'Sem contato');

            // Determinar relação / classificação
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
    // Salvar no localStorage
    function saveSales() {
        localStorage.setItem('ligapods_sales', JSON.stringify(sales));
    }

    // Liquidar Fiado (Mudar para à Vista)
    function payCreditSale(id) {
        const sale = sales.find(s => s.id === id);
        if (sale) {
            sale.isCredit = false;
            sale.isPaid = true;
            // Atualizar data para marcar quando foi pago
            sale.saleDate = new Date().toISOString();
            saveSales();
            showToast(`DÉBITO DE ${sale.customer.toUpperCase()} PAGO!`, 'success');
            renderDashboard();
        }
    }

    // Calcular valor total de uma venda
    function calculateTotalValue(sale) {
        const base = sale.price + sale.shipping;
        if (sale.isCredit && sale.interestRate > 0) {
            const interestAmount = base * (sale.interestRate / 100);
            return base + interestAmount;
        }
        return base;
    }

    // Formatar Moeda Real (R$)
    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    // Formatar Data (DD/MM/AAAA)
    function formatDate(dateStr) {
        if (!dateStr) return '-';
        const parts = dateStr.split('-');
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    // Formatar Data e Hora (DD/MM/AAAA HH:MM)
    function formatDateTime(isoString) {
        const d = new Date(isoString);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    // Criar link WhatsApp direto
    function formatWhatsAppLink(contactStr, name) {
        if (!contactStr) return null;
        // Limpar tudo que não é número
        const numbers = contactStr.replace(/\D/g, '');
        if (numbers.length < 8) return null; // Número inválido
        
        // Se não tiver o prefixo internacional, adiciona o do Brasil (55)
        let formatted = numbers;
        if (numbers.length === 10 || numbers.length === 11) {
            formatted = '55' + numbers;
        }

        const msg = encodeURIComponent(`Olá, tudo bem? Estou entrando em contato sobre sua compra na LIGA PODS!`);
        return `https://api.whatsapp.com/send?phone=${formatted}&text=${msg}`;
    }

    // Sistema de Notificações Toast
    let toastTimeout;
    function showToast(message, type = 'success') {
        clearTimeout(toastTimeout);
        toastMessage.textContent = message;
        toast.className = 'toast-container pixel-border-single'; // Reset classes
        
        if (type === 'success') {
            toast.classList.add('toast-success');
        } else if (type === 'danger') {
            toast.classList.add('toast-danger');
        }

        toast.classList.remove('hidden');

        // Tocar um bipe retrô simples de áudio sintético usando Web Audio API!
        playBeep(type);

        toastTimeout = setTimeout(() => {
            toast.classList.add('hidden');
        }, 3500);
    }

    // Função para tocar bipes estilo Arcade (Retro Web Audio API)
    function playBeep(type) {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            if (type === 'success') {
                // Bipe duplo feliz (agudo)
                osc.type = 'square';
                osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
                gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
                osc.start();
                
                osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.08); // A5
                gain.gain.setValueAtTime(0.05, audioCtx.currentTime + 0.08);
                
                osc.stop(audioCtx.currentTime + 0.22);
            } else {
                // Bipe triste de falha/limpeza (grave)
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(220, audioCtx.currentTime); // A3
                gain.gain.setValueAtTime(0.07, audioCtx.currentTime);
                osc.start();
                
                osc.frequency.setValueAtTime(146.83, audioCtx.currentTime + 0.1); // D3
                
                osc.stop(audioCtx.currentTime + 0.25);
            }
        } catch (e) {
            console.log("Web Audio não suportado ou bloqueado:", e);
        }
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

    editForm.addEventListener('submit', (e) => {
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

        // Atualizar
        sales[index].product = editProductName.value.trim();
        sales[index].price = parseFloat(editProductPrice.value) || 0;
        sales[index].customer = editCustomerName.value.trim();
        sales[index].contact = editCustomerContact.value.trim();
        sales[index].shipping = parseFloat(editShippingFee.value) || 0;
        sales[index].partner = editPartnerSelect.value;
        sales[index].isCredit = isCredit;
        sales[index].dueDate = dueDate;
        sales[index].interestRate = interestRate;

        saveSales();
        showToast('VENDA ATUALIZADA COM SUCESSO!', 'success');
        editModal.classList.add('hidden');
        renderDashboard();
    });

    function deleteSale(id) {
        if (confirm('Tem certeza que deseja excluir esta venda do sistema? Esta ação não pode ser desfeita!')) {
            sales = sales.filter(s => s.id !== id);
            saveSales();
            showToast('VENDA EXCLUÍDA COM SUCESSO!', 'success');
            renderDashboard();
        }
    }

    // === DROPDOWNS E CONFIGURAÇÃO DE EVENTOS DE AÇÃO ===
    function setupDropdownListeners(tableSelector, includePay) {
        const table = document.querySelector(tableSelector);
        if (!table) return;

        // Abrir/Fechar dropdown correspondente
        table.querySelectorAll('.btn-dropdown-trigger').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = e.target.getAttribute('data-id');
                const menu = document.getElementById(`dropdown-${id}`);
                
                // Ocultar outros menus ativos
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

        // Eventos internos de ação
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

    // Fechar menus globais ao clicar fora
    document.addEventListener('click', () => {
        document.querySelectorAll('.pixel-dropdown-menu').forEach(menu => {
            menu.classList.add('hidden');
        });
    });
});
