let currentMode = "simple";
let currentCategory = "Все";
let searchQuery = "";
let currentLetter = null;
let isLightMode = false;
let currentQuizTerm = null;

let quizScore = parseInt(localStorage.getItem('prism_quiz_score')) || 0;
let quizStreak = parseInt(localStorage.getItem('prism_quiz_streak')) || 0;

let themeToggleBtn, themeIcon, grid, searchInput, filterContainer, alphabetContainer, noResults, gridTitle;
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
    themeToggleBtn = document.getElementById('themeToggleBtn');
    themeIcon = document.getElementById('themeIcon');
    grid = document.getElementById('glossaryGrid');
    searchInput = document.getElementById('searchInput');
    filterContainer = document.getElementById('filterContainer');
    alphabetContainer = document.getElementById('alphabetContainer');
    noResults = document.getElementById('noResults');
    gridTitle = document.getElementById('gridTitle');
    modeSimpleBtn = document.getElementById('modeSimple');
    modeScientificBtn = document.getElementById('modeScientific');
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

function transitionBack(e, url) {
    e.preventDefault();
    const overlay = document.getElementById('page-transition');
    if (!overlay) {
        window.location.href = url;
        return;
    }
    overlay.style.transition = 'none';
    overlay.style.transform = 'translateY(100%)';
    overlay.style.backgroundColor = '#020202';
    void overlay.offsetWidth;
    overlay.style.transition = 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)';
    overlay.style.transform = 'translateY(0)';
    setTimeout(() => {
        window.location.href = url;
    }, 800);
}

function handleThemeToggle() {
    isLightMode = !isLightMode;
    if (isLightMode) {
        document.documentElement.classList.remove('dark');
        document.body.classList.add('light-theme');
        themeIcon.setAttribute('data-lucide', 'sun');
    } else {
        document.documentElement.classList.add('dark');
        document.body.classList.remove('light-theme');
        themeIcon.setAttribute('data-lucide', 'moon');
    }
    if (window.lucide) lucide.createIcons();
}

function updateModeButtons() {
    if (currentMode === "simple") {
        modeSimpleBtn.className = "flex-1 sm:flex-initial px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 bg-gemini-border text-gemini-text";
        modeScientificBtn.className = "flex-1 sm:flex-initial px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 text-gemini-textMuted hover:text-gemini-text";
    } else {
        modeScientificBtn.className = "flex-1 sm:flex-initial px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 bg-gemini-border text-gemini-text";
        modeSimpleBtn.className = "flex-1 sm:flex-initial px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 text-gemini-textMuted hover:text-gemini-text";
    }
}

function renderFilters() {
    filterContainer.innerHTML = '';
    const categories = ["Все", "Космос", "Алхимия", "Физика"];
    categories.forEach(category => {
        const btn = document.createElement('button');
        const isActive = currentCategory === category;
        const baseStyle = "px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 border";
        const activeStyle = isActive
            ? "bg-gemini-border text-gemini-text border-gemini-border shadow-sm"
            : "bg-transparent text-gemini-textMuted border-transparent hover:border-gemini-border hover:bg-gemini-card hover:text-gemini-text";
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
        let style = "w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 ";
        if (isActive) {
            style += "bg-gemini-purple/20 text-gemini-purple border border-gemini-purple/30";
        } else if (hasTerms) {
            style += "text-gemini-textMuted hover:bg-gemini-card hover:text-gemini-text border border-transparent cursor-pointer";
        } else {
            style += "text-gemini-border cursor-not-allowed opacity-40 border border-transparent";
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
        btn.className = "w-full py-4 px-6 bg-gemini-bg border border-gemini-border hover:border-gemini-blue rounded-2xl text-sm font-medium hover:bg-gemini-card transition-all text-left duration-200 focus:outline-none text-gemini-text";
        btn.textContent = option;

        btn.onclick = () => {
            const buttons = gameOptionsGrid.querySelectorAll('button');
            buttons.forEach(b => b.disabled = true);
            nextQuestionBtn.classList.remove('hidden');
            showTermBtn.classList.remove('hidden');

            if (option === currentQuizTerm.term) {
                btn.classList.add('border-emerald-500', 'bg-emerald-500/10', 'text-emerald-500');
                gameFeedbackBlock.className = "mt-6 p-4 rounded-xl text-sm font-semibold flex items-center gap-3 text-emerald-500 bg-emerald-500/10";
                gameFeedbackIcon.setAttribute('data-lucide', 'check-circle');
                gameFeedbackText.textContent = "✨ Абсолютно верно! Твои знания расширяются.";
                quizScore++;
                quizStreak++;
                localStorage.setItem('prism_quiz_score', quizScore);
                localStorage.setItem('prism_quiz_streak', quizStreak);
            } else {
                btn.classList.add('border-red-500', 'bg-red-500/10', 'text-red-500');
                gameFeedbackBlock.className = "mt-6 p-4 rounded-xl text-sm font-semibold flex items-center gap-3 text-red-500 bg-red-500/10";
                gameFeedbackIcon.setAttribute('data-lucide', 'alert-circle');
                gameFeedbackText.textContent = `🪐 Ошибка! Верный ответ: «${currentQuizTerm.term}».`;
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
    modalCategory.className = `px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-gemini-border mb-3 inline-block ${tagColors}`;
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
            varItem.className = "p-3.5 rounded-xl bg-gemini-bg border border-gemini-border flex items-start gap-3.5";
            const MathContainer = document.createElement('span');
            MathContainer.className = "text-base font-serif font-semibold text-gemini-blue bg-gemini-card px-2.5 py-1 rounded-md border border-gemini-border min-w-[40px] text-center shrink-0";
            try {
                katex.render(v.symbol, MathContainer, { throwOnError: false });
            } catch (e) {
                MathContainer.textContent = v.symbol;
            }
            varItem.appendChild(MathContainer);
            const textContainer = document.createElement('div');
            textContainer.innerHTML = `
                <p class="text-xs font-bold text-gemini-text leading-tight mb-0.5">${v.name}</p>
                <p class="text-[11px] text-gemini-textMuted leading-relaxed">${v.desc}</p>
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
            <div class="space-y-5">
                <div class="space-y-1.5">
                    <span class="text-xs font-bold text-purple-500 uppercase tracking-widest block">🌠 Первое появление в природе:</span>
                    <p class="text-sm text-gemini-textMuted leading-relaxed text-justify">${termObj.firstAppearance}</p>
                </div>
                <div class="pt-4 border-t border-gemini-border/50 space-y-1.5">
                    <span class="text-xs font-bold text-purple-500 uppercase tracking-widest block">🛠️ Как можно создать или добыть в реальности:</span>
                    <p class="text-sm text-gemini-textMuted leading-relaxed text-justify">${termObj.howToGet}</p>
                </div>
            </div>
        `;
        modalDynamicBlock.classList.remove('hidden');
    } else if (termObj.fact) {
        modalDynamicBlock.innerHTML = `
            <div class="space-y-1.5">
                <span class="text-xs font-bold text-blue-500 uppercase tracking-widest block">💡 Интригующий факт:</span>
                <p class="text-sm text-gemini-textMuted leading-relaxed italic text-justify">"${termObj.fact}"</p>
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

    if (searchQuery !== "") {
        const searchLower = searchQuery.toLowerCase();
        filteredData.sort((a, b) => {
            const aTerm = a.term.toLowerCase();
            const bTerm = b.term.toLowerCase();

            if (aTerm === searchLower && bTerm !== searchLower) return -1;
            if (bTerm === searchLower && aTerm !== searchLower) return 1;

            if (aTerm.startsWith(searchLower) && !bTerm.startsWith(searchLower)) return -1;
            if (bTerm.startsWith(searchLower) && !aTerm.startsWith(searchLower)) return 1;

            if (aTerm.includes(searchLower) && !bTerm.includes(searchLower)) return -1;
            if (bTerm.includes(searchLower) && !aTerm.includes(searchLower)) return 1;

            return aTerm.localeCompare(bTerm);
        });
    }

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

            card.className = `fade-in bg-gemini-card border border-transparent hover:border-gemini-border/80 rounded-3xl p-7 transition-all duration-300 hover:bg-gemini-cardHover hover:-translate-y-1.5 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 flex flex-col cursor-pointer`;
            card.style.animationDelay = `${delay}s`;
            card.onclick = () => openDetails(item);

            const formulaBadge = item.formula
                ? `<span class="text-xs font-mono text-gemini-text opacity-70 max-w-[130px] truncate text-right inline-block mt-1">\\(${item.formula}\\)</span>`
                : '';

            card.innerHTML = `
                <div class="flex justify-between items-start mb-5 gap-3">
                    <div>
                        <h3 class="text-xl md:text-2xl font-bold text-gemini-text leading-snug tracking-tight">${item.term}</h3>
                        ${formulaBadge}
                    </div>
                    <span class="px-3 py-1.5 rounded-full text-xs font-semibold border ${tagColors} bg-gemini-bg h-fit whitespace-nowrap">
                        ${item.category}
                    </span>
                </div>
                <p class="text-gemini-textMuted text-sm leading-relaxed flex-grow line-clamp-4">
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
    themeToggleBtn.onclick = handleThemeToggle;

    modeSimpleBtn.onclick = () => {
        currentMode = "simple";
        updateModeButtons();
        renderCards();
    };

    modeScientificBtn.onclick = () => {
        currentMode = "scientific";
        updateModeButtons();
        renderCards();
    };

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

    updateModeButtons();
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
