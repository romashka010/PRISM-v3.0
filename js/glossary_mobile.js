let currentMode = "simple";
let currentCategory = "Все";
let searchQuery = "";
let currentLetter = null;
let currentQuizTerm = null;

let quizScore = parseInt(localStorage.getItem('prism_quiz_score')) || 0;
let quizStreak = parseInt(localStorage.getItem('prism_quiz_streak')) || 0;

let grid, searchInput, filterContainer, alphabetContainer, noResults, gridTitle;
let modeSimpleBtn, modeScientificBtn;
let detailsModal, closeModalBtn, bottomCloseBtn;
let modalCategory, modalTerm, modalDefinition, modalFormulaBlock, modalFormula, modalVariablesBlock, modalVariablesList, modalDynamicBlock;
let quizGameScreen, openQuizBtn, exitQuizBtn, gameQuestionText, gameOptionsGrid, gameFeedbackBlock, gameFeedbackIcon, gameFeedbackText, gameScoreLabel, showTermBtn, nextQuestionBtn, gameStreakContainer, gameStreakVal;

const russianAlphabet = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЭЮЯ".split("");

const categoryColors = {
    "Космос": "text-blue-500 bg-blue-500/10 border-blue-500/20",
    "Алхимия": "text-purple-500 bg-purple-500/10 border-purple-500/20",
    "Физика": "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    "Все": "text-gray-500 bg-gray-500/10 border-gray-500/20"
};

function initializeDOMElements() {
    grid = document.getElementById('glossaryGrid');
    searchInput = document.getElementById('searchInput');
    filterContainer = document.getElementById('filterContainer');
    alphabetContainer = document.getElementById('alphabetContainer');
    noResults = document.getElementById('noResults');
    gridTitle = document.getElementById('gridTitle');
    detailsModal = document.getElementById('detailsModal');
    closeModalBtn = document.getElementById('closeModalBtn');
    bottomCloseBtn = document.getElementById('bottomCloseBtn');
    modalCategory = document.getElementById('modalCategory');
    modalTerm = document.getElementById('modalTerm');
    modalDefinition = document.getElementById('modalDefinition');
    modalFormulaBlock = document.getElementById('modalFormulaBlock');
    modalFormula = document.getElementById('modalFormula');
    modalVariablesBlock = document.getElementById('modalVariablesBlock');
    modalVariablesList = document.getElementById('modalVariablesList');
    modalDynamicBlock = document.getElementById('modalDynamicBlock');
    quizGameScreen = document.getElementById('quizGameScreen');
    openQuizBtn = document.getElementById('openQuizBtn');
    exitQuizBtn = document.getElementById('exitQuizBtn');
    gameQuestionText = document.getElementById('gameQuestionText');
    gameOptionsGrid = document.getElementById('gameOptionsGrid');
    gameFeedbackBlock = document.getElementById('gameFeedbackBlock');
    gameFeedbackIcon = document.getElementById('gameFeedbackIcon');
    gameFeedbackText = document.getElementById('gameFeedbackText');
    gameScoreLabel = document.getElementById('gameScoreLabel');
    showTermBtn = document.getElementById('showTermBtn');
    nextQuestionBtn = document.getElementById('nextQuestionBtn');
    gameStreakContainer = document.getElementById('gameStreakContainer');
    gameStreakVal = document.getElementById('gameStreakVal');
}

function renderFilters() {
    filterContainer.innerHTML = '';
    const categories = ["Все", "Космос", "Алхимия", "Физика"];
    categories.forEach(category => {
        const btn = document.createElement('button');
        const isActive = currentCategory === category;
        const baseStyle = "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 transition-colors";
        const activeStyle = isActive
            ? "bg-white text-black"
            : "text-neutral-500 bg-transparent";
        btn.className = `${baseStyle} ${activeStyle}`;
        btn.textContent = category;
        btn.onclick = () => {
            currentCategory = category;
            if (category === "Все") {
                currentLetter = null;
                searchQuery = "";
                searchInput.value = "";
                renderAlphabet();
            }
            renderFilters();
            renderCards();
        };
        filterContainer.appendChild(btn);
    });
}

function renderAlphabet() {
    alphabetContainer.innerHTML = '';
    const availableLetters = [...new Set(glossaryData.map(item => item.term[0].toUpperCase()))];
    russianAlphabet.forEach(letter => {
        const btn = document.createElement('button');
        const hasTerms = availableLetters.includes(letter);
        const isActive = currentLetter === letter;
        let style = "w-9 h-9 flex items-center justify-center rounded-xl text-xs font-semibold shrink-0 transition-all ";
        if (isActive) {
            style += "bg-gemini-purple/20 text-gemini-purple border border-gemini-purple/30";
        } else if (hasTerms) {
            style += "text-neutral-300 bg-neutral-900/50 border border-white/5 active:bg-neutral-800";
        } else {
            style += "text-neutral-700 opacity-30 border border-transparent";
        }
        btn.className = style;
        btn.textContent = letter;
        if (hasTerms) {
            btn.onclick = () => {
                currentLetter = isActive ? null : letter;
                renderAlphabet();
                renderCards();
            };
        } else {
            btn.disabled = true;
        }
        alphabetContainer.appendChild(btn);
    });
}

function updateScoreDisplay() {
    gameScoreLabel.textContent = quizScore;
    if (quizStreak >= 3) {
        gameStreakContainer.classList.remove('hidden');
        gameStreakVal.textContent = quizStreak;
    } else {
        gameStreakContainer.classList.add('hidden');
    }
}

function startNewQuizQuestion() {
    gameFeedbackBlock.classList.add('hidden');
    nextQuestionBtn.classList.add('hidden');
    showTermBtn.classList.add('hidden');
    gameOptionsGrid.innerHTML = '';

    const randomIndex = Math.floor(Math.random() * glossaryData.length);
    currentQuizTerm = glossaryData[randomIndex];
    gameQuestionText.textContent = currentQuizTerm.definitionSimple;

    let wrongOptions = glossaryData
        .filter(item => item.term !== currentQuizTerm.term)
        .map(item => item.term)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    const allOptions = [currentQuizTerm.term, ...wrongOptions].sort(() => 0.5 - Math.random());

    allOptions.forEach(option => {
        const btn = document.createElement('button');
        btn.className = "w-full py-3 px-4 bg-neutral-950 border border-white/5 active:border-gemini-blue rounded-2xl text-xs text-white text-left font-sans";
        btn.textContent = option;

        btn.onclick = () => {
            const buttons = gameOptionsGrid.querySelectorAll('button');
            buttons.forEach(b => b.disabled = true);
            nextQuestionBtn.classList.remove('hidden');
            showTermBtn.classList.remove('hidden');

            if (option === currentQuizTerm.term) {
                btn.classList.add('border-emerald-500', 'bg-emerald-500/10', 'text-emerald-500');
                gameFeedbackBlock.className = "mt-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 text-emerald-500 bg-emerald-500/10";
                gameFeedbackIcon.setAttribute('data-lucide', 'check-circle');
                gameFeedbackText.textContent = "✓ Верно!";
                quizScore++;
                quizStreak++;
                localStorage.setItem('prism_quiz_score', quizScore);
                localStorage.setItem('prism_quiz_streak', quizStreak);
            } else {
                btn.classList.add('border-red-500', 'bg-red-500/10', 'text-red-500');
                gameFeedbackBlock.className = "mt-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 text-red-500 bg-red-500/10";
                gameFeedbackIcon.setAttribute('data-lucide', 'alert-circle');
                gameFeedbackText.textContent = `Ошибка! Ответ: «${currentQuizTerm.term}».`;
                quizStreak = 0;
                localStorage.setItem('prism_quiz_streak', quizStreak);
            }
            updateScoreDisplay();
            if (window.lucide) lucide.createIcons();
        };
        gameOptionsGrid.appendChild(btn);
    });
}

function openDetails(termObj) {
    modalTerm.textContent = termObj.term;
    modalCategory.textContent = termObj.category;
    const tagColors = categoryColors[termObj.category] || categoryColors["Все"];
    modalCategory.className = `px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider border border-white/10 mb-2 inline-block ${tagColors}`;
    modalDefinition.textContent = currentMode === "simple" ? termObj.definitionSimple : termObj.definitionScientific;

    if (termObj.formula) {
        modalFormulaBlock.classList.remove('hidden');
        try {
            katex.render(termObj.formula, modalFormula, { throwOnError: false });
        } catch (err) {
            modalFormula.textContent = termObj.formula;
        }
    } else {
        modalFormulaBlock.classList.add('hidden');
    }

    if (termObj.variables && termObj.variables.length > 0) {
        modalVariablesBlock.classList.remove('hidden');
        modalVariablesList.innerHTML = '';
        termObj.variables.forEach(v => {
            const varItem = document.createElement('div');
            varItem.className = "p-3 rounded-xl bg-neutral-950 border border-white/5 flex items-start gap-3";
            const MathContainer = document.createElement('span');
            MathContainer.className = "text-sm font-serif font-semibold text-gemini-blue bg-neutral-900 px-2 py-0.5 rounded border border-white/5 min-w-[32px] text-center shrink-0";
            try {
                katex.render(v.symbol, MathContainer, { throwOnError: false });
            } catch (e) {
                MathContainer.textContent = v.symbol;
            }
            varItem.appendChild(MathContainer);
            const textContainer = document.createElement('div');
            textContainer.innerHTML = `
                <p class="text-[11px] font-bold text-white leading-tight mb-0.5">${v.name}</p>
                <p class="text-[10px] text-neutral-400 leading-normal">${v.desc}</p>
            `;
            varItem.appendChild(textContainer);
            modalVariablesList.appendChild(varItem);
        });
    } else {
        modalVariablesBlock.classList.add('hidden');
    }

    modalDynamicBlock.innerHTML = '';
    if (termObj.category === "Алхимия") {
        modalDynamicBlock.innerHTML = `
            <div class="space-y-3.5">
                <div class="space-y-1">
                    <span class="text-[9px] font-bold text-purple-400 uppercase tracking-wider block">🌠 Первое появление:</span>
                    <p class="text-[11px] text-neutral-400 leading-relaxed text-justify">${termObj.firstAppearance}</p>
                </div>
                <div class="pt-3 border-t border-white/5 space-y-1">
                    <span class="text-[9px] font-bold text-purple-400 uppercase tracking-wider block">🛠️ Реальный синтез:</span>
                    <p class="text-[11px] text-neutral-400 leading-relaxed text-justify">${termObj.howToGet}</p>
                </div>
            </div>
        `;
        modalDynamicBlock.classList.remove('hidden');
    } else if (termObj.fact) {
        modalDynamicBlock.innerHTML = `
            <div class="space-y-1">
                <span class="text-[9px] font-bold text-blue-400 uppercase tracking-wider block">💡 Факт:</span>
                <p class="text-[11px] text-neutral-400 leading-relaxed italic text-justify">"${termObj.fact}"</p>
            </div>
        `;
        modalDynamicBlock.classList.remove('hidden');
    } else {
        modalDynamicBlock.classList.add('hidden');
    }
    detailsModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    detailsModal.classList.add('hidden');
    document.body.style.overflow = '';
}

function renderCards() {
    grid.innerHTML = '';
    const isFiltering = searchQuery !== "" || currentCategory !== "Все" || currentLetter !== null;
    let filteredData = glossaryData.filter(item => {
        const matchesCategory = currentCategory === "Все" || item.category === currentCategory;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = item.term.toLowerCase().includes(searchLower) ||
                              item.definitionScientific.toLowerCase().includes(searchLower) ||
                              item.definitionSimple.toLowerCase().includes(searchLower) ||
                              (item.formula && item.formula.toLowerCase().includes(searchLower));
        const matchesLetter = currentLetter ? item.term[0].toUpperCase() === currentLetter : true;
        return matchesCategory && matchesSearch && matchesLetter;
    });

    if (!isFiltering) {
        filteredData = filteredData.filter(item => item.isPopular);
        gridTitle.textContent = "Популярные темы";
    } else {
        if (currentLetter) {
            gridTitle.textContent = `Темы на букву «${currentLetter}» (${filteredData.length})`;
        } else if (currentCategory !== "Все") {
            gridTitle.textContent = `Темы категории «${currentCategory}» (${filteredData.length})`;
        } else {
            gridTitle.textContent = `Результаты поиска (${filteredData.length})`;
        }
    }

    if (filteredData.length === 0) {
        grid.classList.add('hidden');
        noResults.classList.remove('hidden');
    } else {
        grid.classList.remove('hidden');
        noResults.classList.add('hidden');
        filteredData.forEach((item, index) => {
            const card = document.createElement('div');
            const delay = (index % 12) * 0.04;
            const tagColors = categoryColors[item.category] || categoryColors["Все"];
            const activeDef = currentMode === "simple" ? item.definitionSimple : item.definitionScientific;

            card.className = `fade-in bg-gemini-card border border-transparent active:border-white/10 rounded-2xl p-5 shadow flex flex-col cursor-pointer`;
            card.style.animationDelay = `${delay}s`;
            card.onclick = () => openDetails(item);

            const formulaBadge = item.formula
                ? `<span class="text-[10px] font-mono text-neutral-400 max-w-[130px] truncate block mt-0.5">\\(${item.formula}\\)</span>`
                : '';

            card.innerHTML = `
                <div class="flex justify-between items-start mb-4 gap-3">
                    <div>
                        <h3 class="text-base font-bold text-white leading-snug tracking-tight">${item.term}</h3>
                        ${formulaBadge}
                    </div>
                    <span class="px-2.5 py-0.5 rounded-full text-[9px] font-semibold border ${tagColors} bg-neutral-950 h-fit whitespace-nowrap">
                        ${item.category}
                    </span>
                </div>
                <p class="text-neutral-400 text-[11px] leading-relaxed flex-grow line-clamp-4">
                    ${activeDef}
                </p>
            `;
            grid.appendChild(card);
        });

        if (window.renderMathInElement) {
            renderMathInElement(grid, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\]', display: true}
                ],
                throwOnError: false
            });
        }
    }
}

function bindEvents() {
    openQuizBtn.onclick = () => {
        document.getElementById('mainGlossaryScreen').classList.add('hidden');
        quizGameScreen.classList.remove('hidden');
        updateScoreDisplay();
        startNewQuizQuestion();
    };

    exitQuizBtn.onclick = () => {
        quizGameScreen.classList.add('hidden');
        document.getElementById('mainGlossaryScreen').classList.remove('hidden');
    };

    nextQuestionBtn.onclick = startNewQuizQuestion;

    showTermBtn.onclick = () => {
        quizGameScreen.classList.add('hidden');
        document.getElementById('mainGlossaryScreen').classList.remove('hidden');
        openDetails(currentQuizTerm);
    };

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderCards();
    });

    closeModalBtn.addEventListener('click', closeModal);
    bottomCloseBtn.addEventListener('click', closeModal);
    detailsModal.addEventListener('click', (e) => {
        if (e.target === detailsModal) closeModal();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

window.addEventListener('DOMContentLoaded', () => {
    initializeDOMElements();
    bindEvents();

    setTimeout(() => {
        const overlay = document.getElementById('page-transition');
        if (overlay) {
            overlay.style.transform = 'translateY(-100%)';
        }
    }, 50);

    renderFilters();
    renderAlphabet();
    renderCards();
    updateScoreDisplay();

    if (window.lucide) {
        lucide.createIcons();
    }

    if (window.renderMathInElement) {
        renderMathInElement(document.body, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ],
            throwOnError: false
        });
    }
});