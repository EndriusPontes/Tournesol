/* ============================================
   TOURNESOL* — APP.JS
   Loja virtual | Drop 04 — Girassol de Concreto
============================================ */

/* 1. CATÁLOGO DE PRODUTOS */

const P = [
    {
        id: 1,
        n: 'Blazer Tournesol',
        c: 'Alfaiataria',
        p: 1290,
        o: 1590,
        bg: '#f2b705',
        fg: '#141210',
        cores: [
            ['Girassol', '#463504'],
            ['Tinta', '#141210']
        ],
        t: ['P', 'M', 'G', 'GG'],
        d: 'Blazer oversized de lã fria, ombros estruturados e forro estampado. Alfaiataria feita para andar na rua.',
        img: 'blazer.jpg'
    },
    {
        id: 2,
        n: 'Calça Pregueada',
        c: 'Alfaiataria',
        p: 690,
        bg: '#1f4d3a',
        fg: '#f3ead8',
        cores: [
            ['Pinho', '#1f4d3a'],
            ['Areia', '#d8c9a8']
        ],
        t: ['36', '38', '40', '42', '44'],
        d: 'Cintura alta, duas pregas e barra larga. Caimento fluido, tecido com leve brilho.',
        img: 'calca pregueada.jpg'
    },
    {
        id: 3,
        n: 'Moletom Touresol*',
        c: 'Streetwear',
        p: 420,
        o: 520,
        bg: '#e8472b',
        fg: '#f3ead8',
        cores: [
            ['Tomate', '#04455e'],
            ['Creme', '#f3ead8']
        ],
        t: ['P', 'M', 'G', 'GG'],
        d: 'Moletom Tournesol* com bordado em alto-relevo. Corte boxy, punhos largos.',
        img: 'blusa.jpg'
    },
    {
        id: 4,
        n: 'Camiseta Tournesol*',
        c: 'Camisaria',
        p: 380,
        bg: '#f4b6c2',
        fg: '#141210',
        cores: [
            ['Azul-Escuro', '#000445'],
            ['Caramelo', '#b68117']
        ],
        t: ['P', 'M', 'G'],
        d: 'Camiseta Tournesol* 100% algodão e confortável de usar.',
        img: 'camiseta.jpg'
    },
    {
        id: 5,
        n: 'Trench Concreto',
        c: 'Casacos',
        p: 1850,
        bg: '#9a968c',
        fg: '#141210',
        cores: [
            ['Concreto', '#cfc19e']
        ],
        t: ['M', 'G', 'GG'],
        d: 'Trench longo em gabardine impermeável, cinto removível e fenda traseira.',
        img: 'Trench.jpg'
    },
    {
        id: 6,
        n: 'Bermuda Sartorial',
        c: 'Streetwear',
        p: 340,
        o: 420,
        bg: '#080502',
        fg: '#f2b705',
        cores: [
            ['Madeira', '#4e3011'],
            ['Pinho', '#1f4d3a']
        ],
        t: ['P', 'M', 'G'],
        d: 'Bermuda de alfaiataria na altura do joelho, passantes largos e bolso.',
        img: 'bermuda.jpg'
    },
    {
        id: 7,
        n: 'Colete Retrô',
        c: 'Alfaiataria',
        p: 520,
        bg: '#e8472b',
        fg: '#f2b705',
        cores: [
            ['Tomate', '#096c8a'],
            ['Girassol', '#f2b705']
        ],
        t: ['P', 'M', 'G'],
        d: 'Colete de jacquard inspirado nos anos 70. Costas em cetim com ajuste de fivela.',
        img: 'colete.jpg'
    },
    {
        id: 8,
        n: 'Boné Tournesol*',
        c: 'Acessórios',
        p: 190,
        bg: '#1f4d3a',
        fg: '#f2b705',
        cores: [
            ['Pinho', '#d4cbb7'],
            ['Creme', '#665635']
        ],
        t: ['Único'],
        d: 'Boné de seis gomos em sarja, aba curva e asterisco bordado na frente.',
        img: 'bone.jpg'
    }
];


/* 2. FUNÇÕES AUXILIARES */

const $ = selector => document.querySelector(selector);

const brl = value => {
    return Number(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
};


/* 3. CARRINHO E LOCAL STORAGE */

let cart = [];

try {
    const savedCart = JSON.parse(
        localStorage.getItem('t_cart') || '[]'
    );

    if (Array.isArray(savedCart)) {
        cart = savedCart.filter(item =>
            P.some(product => product.id === item.id) &&
            Number.isInteger(item.q) &&
            item.q > 0
        );
    }
} catch (error) {
    console.warn('Erro ao carregar carrinho:', error);
    cart = [];
}

const save = () => {
    try {
        localStorage.setItem('t_cart', JSON.stringify(cart));
    } catch (error) {
        console.warn('Não foi possível salvar o carrinho.', error);
    }

    const counter = $('#cnt');

    if (counter) {
        counter.textContent = cart.reduce(
            (total, item) => total + item.q,
            0
        );
    }
};

const subtotalCart = () => {
    return cart.reduce((total, item) => {
        const product = P.find(p => p.id === item.id);
        return total + (product ? product.p * item.q : 0);
    }, 0);
};


/* 4. COMPONENTES DOS PRODUTOS */

const art = product => `
    <div class="art"
        style="--bg:${product.bg};--fg:${product.fg}">

        ${
            product.img
                ? `<img src="${product.img}"
                    alt="${product.n}"
                    loading="lazy"
                    onerror="this.remove()">`
                : ''
        }

        <span>${product.n.split(' ')[0]}</span>
        <i>*</i>
    </div>
`;

const price = product => `
    <div class="price">
        ${product.o ? `<s>${brl(product.o)}</s>` : ''}
        ${brl(product.p)}
        ${
            product.o
                ? `<span class="tag">
                    -${Math.round(100 - product.p / product.o * 100)}%
                   </span>`
                : ''
        }
    </div>
`;

const card = product => `
    <a class="card rv" href="#/produto/${product.id}">
        ${art(product)}
        <div class="cat">${product.c}</div>
        <h3>${product.n}</h3>
        ${price(product)}
    </a>
`;


/* 5. NOTIFICAÇÕES */

function toast(message) {
    const notification = document.createElement('div');

    notification.className = 'toast';
    notification.textContent = message;

    document.body.append(notification);

    requestAnimationFrame(() => {
        notification.classList.add('on');
    });

    setTimeout(() => {
        notification.classList.remove('on');

        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 2200);
}


/* 6. PÁGINAS DA LOJA */

const V = {

    home: () => `
        <div class="hero">
            <div class="sun l"></div>
            <div class="sun"></div>

            <div style="position:relative">
                <h1 aria-label="Tournesol*">${'Tournesol'.split('').map((l, i) => `<span aria-hidden="true" style="--i:${i}">${l}</span>`).join('')}<b aria-hidden="true">*</b></h1>

                <p>
                    Alfaiataria de rua · Drop 04 · Outono/Inverno 26
                </p>

                <a class="btn" href="#/loja">
                    Ver coleção
                </a>
            </div>
        </div>

        <section>
            <div class="h2 rv">
                Em destaque
                <small><a href="#/loja">Ver tudo →</a></small>
            </div>

            <div class="grid">
                ${P.slice(0, 4).map(card).join('')}
            </div>
        </section>

        <section>
            <div class="h2 rv">Coleções</div>

            <div class="cols rv">
                <a class="col"
                    href="#/loja/Alfaiataria"
                    style="background:var(--sun)">
                    <small>01</small>
                    <h3>Alfaiataria<br>de rua</h3>
                    <small>Explorar →</small>
                </a>

                <a class="col"
                    href="#/loja/Streetwear"
                    style="background:var(--tom);color:var(--cream)">
                    <small>02</small>
                    <h3>Streetwear<br>sartorial</h3>
                    <small>Explorar →</small>
                </a>

                <a class="col"
                    href="#/loja/Casacos"
                    style="background:var(--pink)">
                    <small>03</small>
                    <h3>Casacos<br>& camadas</h3>
                    <small>Explorar →</small>
                </a>
            </div>
        </section>

        <section class="manifesto">
            <p class="rv">
                Roupa que veste o <em>terno</em>
                com atitude de <em>rua</em>.

                Pequenas tiragens, cortes precisos
                e cor onde ninguém espera.
            </p>
        </section>

        <section>
            <div class="h2 rv">
                Novidades
                <small>Chegou agora</small>
            </div>

            <div class="grid">
                ${P.slice(4).map(card).join('')}
            </div>
        </section>
    `,

    loja: category => {
        const categories = [
            'Todas',
            ...new Set(P.map(product => product.c))
        ];

        const filteredProducts = P.filter(product => {
            return !category || product.c === category;
        });

        return `
            <section>
                <div class="h2 rv">
                    Loja
                    <small>${category || 'Todas'}</small>
                </div>

                <div class="filters">
                    ${categories.map(categoryName => `
                        <a
                            class="chip ${
                                (category || 'Todas') === categoryName
                                    ? 'on'
                                    : ''
                            }"
                            href="#/loja${
                                categoryName === 'Todas'
                                    ? ''
                                    : '/' + encodeURIComponent(categoryName)
                            }">
                            ${categoryName}
                        </a>
                    `).join('')}
                </div>

                <div class="grid">
                    ${filteredProducts.map(card).join('')}
                </div>
            </section>
        `;
    },

    produto: id => {
        const product = P.find(item => item.id == id);

        if (!product) {
            return V.loja();
        }

        window.sel = {
            id: product.id,
            t: product.t[0],
            c: product.cores[0][0]
        };

        return `
            <div class="pd">

                <div class="rv">
                    ${art(product)}
                </div>

                <div class="rv">
                    <div class="crumb">
                        <a href="#/loja">Loja</a>
                        / ${product.c}
                    </div>

                    <h1>${product.n}</h1>

                    ${price(product)}

                    <p>${product.d}</p>

                    <div class="lbl">
                        Cor — <span id="cn">${product.cores[0][0]}</span>
                    </div>

                    ${product.cores.map((color, index) => `
                        <button
                            class="sw ${index === 0 ? 'on' : ''}"
                            style="background:${color[1]}"
                            aria-label="Cor ${color[0]}"
                            onclick="pick('c','${color[0]}',this,'.sw')">
                        </button>
                    `).join('')}

                    <div class="lbl">Tamanho</div>

                    ${product.t.map((size, index) => `
                        <button
                            class="sz ${index === 0 ? 'on' : ''}"
                            onclick="pick('t','${size}',this,'.sz')">
                            ${size}
                        </button>
                    `).join('')}

                    <div style="margin-top:30px">
                        <button class="btn" onclick="add(${product.id}, this)">
                            Adicionar à sacola
                        </button>
                    </div>

                    <p style="margin-top:20px;opacity:.6;font-size:13px">
                        Troca grátis em 30 dias ·
                        Pague em até 6x sem juros
                    </p>
                </div>
            </div>

            <section>
                <div class="h2 rv">Combine com</div>

                <div class="grid">
                    ${P.filter(item => item.id !== product.id)
                        .slice(0, 4)
                        .map(card)
                        .join('')}
                </div>
            </section>
        `;
    },

    carrinho: () => {
        const subtotal = subtotalCart();

        return `
            <div class="cart">
                <div class="h2">Sacola</div>

                ${
                    cart.length
                        ? `
                            ${cart.map((item, index) => {
                                const product = P.find(
                                    p => p.id === item.id
                                );

                                if (!product) return '';

                                return `
                                    <div class="row">
                                        ${art(product)}

                                        <div>
                                            <b style="color:inherit">
                                                ${product.n}
                                            </b>

                                            <br>

                                            <small>
                                                ${item.c} ·
                                                ${item.t} ·
                                                ${item.q}x
                                            </small>

                                            <br>

                                            <button onclick="rm(${index})">
                                                remover
                                            </button>
                                        </div>

                                        <div class="price">
                                            ${brl(product.p * item.q)}
                                        </div>
                                    </div>
                                `;
                            }).join('')}

                            <div class="box">
                                <div class="lbl" style="margin-top:0">
                                    Calcular frete
                                </div>

                                <input
                                    id="cep"
                                    placeholder="00000-000"
                                    maxlength="9"
                                    inputmode="numeric"
                                    autocomplete="postal-code">

                                <button class="btn"
                                    onclick="frete(${subtotal})">
                                    Calcular
                                </button>

                                <div id="fr"></div>
                            </div>

                            <div class="tot">
                                <span>Subtotal</span>
                                <span id="tt">${brl(subtotal)}</span>
                            </div>

                            <p style="margin-top:20px">
                                <a class="btn"
                                    href="#"
                                    onclick="toast('Checkout é a próxima etapa do projeto');return false">
                                    Finalizar compra
                                </a>
                            </p>
                        `
                        : `
                            <p>Sua sacola está vazia.</p>

                            <p style="margin-top:20px">
                                <a class="btn" href="#/loja">
                                    Ir às compras
                                </a>
                            </p>
                        `
                }
            </div>
        `;
    }
};


/* 7. SELEÇÃO DE COR E TAMANHO */

window.pick = (key, value, element, selector) => {
    if (!window.sel) return;

    window.sel[key] = value;

    document.querySelectorAll('.pd ' + selector)
        .forEach(item => item.classList.remove('on'));

    element.classList.add('on');

    if (key === 'c') {
        const colorName = $('#cn');

        if (colorName) {
            colorName.textContent = value;
        }
    }
};


/* 8. ADICIONAR PRODUTOS AO CARRINHO */

const FLOR = '<svg class="flor" aria-hidden="true"><use href="#flor"/></svg>';
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

window.add = (id, button) => {
    const selection = window.sel;

    if (!selection || selection.id !== id) {
        toast('Selecione um tamanho e uma cor.');
        return;
    }

    if (button && button.dataset.busy) return;

    const { t, c } = selection;

    const commit = () => {
        const existing = cart.find(item =>
            item.id === id && item.t === t && item.c === c
        );

        if (existing) {
            existing.q++;
        } else {
            cart.push({ id, t, c, q: 1 });
        }

        save();
        toast('Adicionado à sacola ✺');
    };

    if (!button) {
        commit();
        return;
    }

    // flor girando no botão, depois confirma
    const label = button.innerHTML;

    button.dataset.busy = '1';
    button.style.minWidth = button.offsetWidth + 'px';
    button.innerHTML = FLOR;

    setTimeout(() => {
        commit();
        button.innerHTML = label;
        delete button.dataset.busy;
    }, 650);
};


/* 9. REMOVER PRODUTOS DO CARRINHO */

window.rm = index => {
    cart.splice(index, 1);
    save();
    render(true);
};


/* 10. CÁLCULO DE FRETE */

async function frete(subtotal) {
    const input = $('#cep');
    const result = $('#fr');

    if (!input || !result) return;

    const cep = input.value.replace(/\D/g, '');

    if (cep.length !== 8) {
        result.innerHTML = '<p>Informe um CEP válido com 8 dígitos.</p>';
        return;
    }

    const started = performance.now();
    result.innerHTML = `<p class="loading">${FLOR} Calculando frete...</p>`;

    let response;

    try {
        const request = await fetch(
            `/api/frete?cep=${cep}&subtotal=${subtotal}`
        );

        if (!request.ok) {
            throw new Error('Erro ao consultar frete.');
        }

        response = await request.json();

        if (!Array.isArray(response.opcoes) || !response.opcoes.length) {
            throw new Error('Resposta de frete inválida.');
        }

    } catch (error) {
        console.warn(
            'API indisponível. Utilizando cálculo local.',
            error
        );

        response = local(cep, subtotal);
    }

    await wait(Math.max(0, 750 - (performance.now() - started)));

    result.innerHTML = `
        ${response.opcoes.map((option, index) => `
            <label class="opt">
                <span>
                    <input
                        type="radio"
                        name="fx"
                        style="width:auto"
                        ${index === 0 ? 'checked' : ''}
                        onchange="tot(${subtotal},${option.valor})">

                    ${option.nome} · ${option.prazo} dias úteis
                </span>

                <b style="color:inherit">
                    ${option.valor ? brl(option.valor) : 'Grátis'}
                </b>
            </label>
        `).join('')}

        <small>${response.regiao || ''}</small>
    `;

    tot(subtotal, response.opcoes[0].valor);
}

window.frete = frete;


/* 11. ATUALIZAR VALOR TOTAL */

window.tot = (subtotal, shipping) => {
    const total = $('#tt');

    if (!total) return;

    total.textContent = brl(subtotal + shipping);
};


/* 12. CÁLCULO LOCAL DE FRETE */

function local(cep, subtotal) {
    const T = {
        0: [22, 5],
        1: [22, 5],
        2: [26, 6],
        3: [28, 7],
        4: [34, 9],
        5: [38, 10],
        6: [44, 12],
        7: [36, 9],
        8: [24, 6],
        9: [26, 7]
    };

    const [value, days] = T[cep[0]];

    return {
        regiao: 'Estimativa offline (rode server.py para a API)',

        opcoes: [
            {
                nome: 'PAC',
                valor: subtotal >= 800 ? 0 : value,
                prazo: days
            },
            {
                nome: 'SEDEX',
                valor: +(value * 1.7).toFixed(2),
                prazo: Math.ceil(days / 2)
            }
        ]
    };
}


/* 13. SISTEMA DE NAVEGAÇÃO */

function render(quiet = false) {
    const [, route, parameter] = (
        location.hash || '#/'
    ).split('/');

    const decodedParameter = parameter
        ? decodeURIComponent(parameter)
        : parameter;

    const go = () => {
        const app = $('#app');

        if (!app) return;

        if (route === 'loja') {
            app.innerHTML = V.loja(decodedParameter);

        } else if (route === 'produto') {
            app.innerHTML = V.produto(decodedParameter);

        } else if (route === 'carrinho') {
            app.innerHTML = V.carrinho();

        } else {
            app.innerHTML = V.home();
        }

        if (!quiet) {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }

        io();
    };

    if (quiet) {
        go();
        return;
    }

    const curtain = $('#curtain');

    if (!curtain) {
        go();
        return;
    }

    curtain.classList.remove('go');

    void curtain.offsetWidth;

    curtain.classList.add('go');

    setTimeout(go, 500);
}


/* 14. ANIMAÇÕES AO ROLAR A PÁGINA */

// Revela elementos quando entram na área visível.
let obs = null;

if ('IntersectionObserver' in window) {
    obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -6% 0px'
    });
}

// Ativa as animações em todos os elementos .rv.
const io = () => {
    const elements = document.querySelectorAll('.rv:not(.in)');

    elements.forEach(element => {
        if (obs) {
            obs.observe(element);
        } else {
            element.classList.add('in');
        }
    });
};


/* 15. INICIALIZAÇÃO DO SITE */

save();

// Renderiza a página inicial.
render(true);

// Escuta mudanças de rota.
window.addEventListener('hashchange', () => {
    render();
});

// Garante que os elementos sejam revelados após o carregamento.
window.addEventListener('load', () => {
    io();
});

// Atualiza as animações caso a janela seja redimensionada.
window.addEventListener('resize', () => {
    io();
});


/* 16. TEMA ESCURO (botão + código secreto) */

const THEME_KEY = 't_theme';
const themeBtn = $('#theme');
let themeBusy = false;

const isDark = () => document.documentElement.dataset.theme === 'dark';

function applyTheme(dark) {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';

    if (themeBtn) {
        themeBtn.setAttribute('aria-pressed', String(dark));
    }

    try {
        localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    } catch (error) {
        console.warn('Não foi possível salvar o tema.', error);
    }
}

// Troca o tema com uma onda circular que nasce de (x, y).
function setTheme(dark, x = innerWidth / 2, y = innerHeight / 2, secret = false) {
    if (themeBusy) return;

    if (dark === isDark()) {
        if (secret) toast('Já é noite por aqui ✺');
        return;
    }

    const done = () => {
        if (secret) toast('Modo noite ativado ✺');
    };

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || !document.body.animate) {
        applyTheme(dark);
        done();
        return;
    }

    themeBusy = true;

    const wipe = document.createElement('div');
    wipe.className = 'wipe';
    wipe.style.background = dark ? '#15110e' : '#f3ead8';
    wipe.innerHTML = FLOR;
    document.body.append(wipe);

    wipe.animate([
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(150vmax at ${x}px ${y}px)` }
    ], {
        duration: 700,
        easing: 'cubic-bezier(.77, 0, .18, 1)'
    }).onfinish = () => {
        applyTheme(dark);

        wipe.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 350,
            fill: 'forwards'
        }).onfinish = () => {
            wipe.remove();
            themeBusy = false;
            done();
        };
    };
}

if (themeBtn) {
    themeBtn.setAttribute('aria-pressed', String(isDark()));

    themeBtn.addEventListener('click', () => {
        const box = themeBtn.getBoundingClientRect();
        setTheme(!isDark(), box.left + box.width / 2, box.top + box.height / 2);
    });
}

// Código secreto: digitar "tournesol*" (fora de campos de texto) liga o modo noite.
const SECRET = 'tournesol*';
let typed = '';

window.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const el = event.target;

    if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) {
        return;
    }

    if (event.key.length !== 1) return;

    typed = (typed + event.key.toLowerCase()).slice(-SECRET.length);

    if (typed === SECRET) {
        typed = '';
        setTheme(true, innerWidth / 2, innerHeight / 2, true);
    }
});


/* FIM DO APP.JS — TOURNESOL* */