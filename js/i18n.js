/**
 * Глобальная система интернационализации (i18n) для Prism
 * Автоматически управляет кнопкой выбора языка и сохраняет выбор пользователя
 */

const translations = {
    ru: {
        "warn_opt": "ОПТИМИЗИРОВАНО ДЛЯ ПК",
        "warn_txt1": "Пожалуйста, откройте этот раздел на компьютере или включите режим отображения «Версия для ПК» в браузере.",
        "warn_txt2": "Нажимая эту кнопку, вы продолжаете на свой страх и риск.",
        "warn_btn": "Продолжить все равно",
        "trans_phys": "Физика",
        "trans_phys_desc": "Данный сектор исследований находится в процессе симуляций. Физическое ядро Prism подготавливается к запуску и станет доступно в следующих циклах обновления.",
        "trans_back": "Вернуться назад",

        "contact_tag": "Шлюз связи",
        "contact_title": "Написать Prism",
        "contact_name_label": "Ваше Имя",
        "contact_name_ph": "Введите ваше имя...",
        "contact_email_label": "Адрес Почты (Email)",
        "contact_email_err": "Некорректный адрес",
        "contact_msg_label": "Сообщение",
        "contact_msg_ph": "Опишите ваше предложение или вопрос...",
        "contact_send": "Открыть Gmail и подготовить письмо",
        "contact_succ_title": "Письмо сгенерировано",
        "contact_succ_desc": "Данные успешно экспортированы. В новой вкладке открылся Gmail для отправки сообщения. Если вкладка не открылась, проверьте настройки блокировщика всплывающих окон.",
        "contact_succ_btn": "Вернуться к сайту",

        "hero_sub": "Обучение • Исследования",
        "hero_desc": "Исследование фундаментальных основ Вселенной",
        "hero_scroll": "Прокрутите вниз для ознакомления",

        "man_step": "02 / Концепция",
        "man_sub": "Исследование фундаментальных истин",
        "man_tag": "Концепция знаний",
        "man_title": "Добро пожаловать в <span class=\"text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-orange-400\">Prism</span>",
        "man_desc": "Жизнь состоит из множества граней, и каждая из них заслуживает понимания. Это пространство создано для тех, кто не боится задавать сложные вопросы и искать на них честные ответы.",
        "man_btn": "Перейти к выбору дисциплин →",

        "menu_tag": "Направления научных исследований",
        "menu_title": "Научные Грани",
        "menu_phys": "Физика",
        "menu_phys_sub": "Естествознание",
        "menu_space": "Космос",
        "menu_space_sub": "Астрофизика",
        "menu_alc": "Алхимия",
        "menu_alc_sub": "Молекулярный синтез",
        "menu_glo": "Глоссарий",
        "menu_glo_sub": "Терминология",
        "menu_footer": "ВЫБЕРИТЕ ПРИЗМУ ИНТЕРЕСА",

        "out_step": "04 / Синтез",
        "out_sub": "Новые Горизонты",
        "out_tag": "Сотрудничество",
        "out_title": "Раздвигая <br><span class=\"text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-rose-400 to-purple-500\">грани познания</span>",
        "out_desc": "Эта открытая среда создана для всех, кто хочет познать мир. Ваша идея заслуживает внимания.",
        "out_btn1": "К исследованиям",
        "out_btn2": "Связаться с Prism",
        "out_tg": "Ссылка на канал",
        "out_gh": "Ссылка на github",
        "out_boosty": "Поддержать автора",
        "out_footer": "PRISM | 2026 • ИСКУССТВО ЧИСТОГО ПОЗНАНИЯ",

        //===АЛХИМИЯ===
        "alc_back": "← На главную",
        "alc_subtitle": "SEC_03 // Молекулярный Синтез",
        "alc_beta": "Это игра, и она находится в бета-тестировании",
        "alc_reactor": "РЕАКТОР СИНТЕЗА",
        "alc_clear": "ОЧИСТИТЬ ПАНЕЛЬ",
        "alc_storage": "Хранилище",
        "alc_decoded": "Раскодировано:",
        "alc_filter_all": "Все",
        "alc_filter_base": "Базовые",
        "alc_filter_nature": "Природа",
        "alc_filter_high": "Высшие",
        "alc_monitor": "Панель мониторинга",
        "alc_monitor_desc": "Выберите элемент из хранилища для анализа его молекулярного строения.",
        "alc_status": "Состояние ядра: Стабильно (100.0%)",
        "alc_footer_sec": "PRISM // SEC_03"
    },
    en: {
        "warn_opt": "OPTIMIZED FOR PC",
        "warn_txt1": "Please open this section on a computer or enable 'Desktop site' mode in your mobile browser.",
        "warn_txt2": "By clicking this button, you proceed at your own risk.",
        "warn_btn": "Continue anyway",
        "trans_phys": "Physics",
        "trans_phys_desc": "This research sector is undergoing simulations. The Prism physical engine is preparing for launch and will be available in future update cycles.",
        "trans_back": "Go back",

        "contact_tag": "Comms Gateway",
        "contact_title": "Contact Prism",
        "contact_name_label": "Your Name",
        "contact_name_ph": "Enter your name...",
        "contact_email_label": "Email Address",
        "contact_email_err": "Invalid address",
        "contact_msg_label": "Message",
        "contact_msg_ph": "Describe your suggestion or question...",
        "contact_send": "Open Gmail and prepare email",
        "contact_succ_title": "Email Generated",
        "contact_succ_desc": "Data successfully exported. A new tab opened Gmail to send the message. If it didn't open, check your pop-up blocker settings.",
        "contact_succ_btn": "Return to site",

        "hero_sub": "Education • Research",
        "hero_desc": "Exploring the fundamental foundations of the Universe",
        "hero_scroll": "Scroll down to explore",

        "man_step": "02 / Concept",
        "man_sub": "Exploring fundamental truths",
        "man_tag": "Concept of Knowledge",
        "man_title": "Welcome to <span class=\"text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-orange-400\">Prism</span>",
        "man_desc": "Life consists of many facets, and each deserves understanding. This space is created for those who aren't afraid to ask complex questions and seek honest answers.",
        "man_btn": "Proceed to disciplines →",

        "menu_tag": "Scientific Research Directions",
        "menu_title": "Scientific Facets",
        "menu_phys": "Physics",
        "menu_phys_sub": "Natural Sciences",
        "menu_space": "Space",
        "menu_space_sub": "Astrophysics",
        "menu_alc": "Alchemy",
        "menu_alc_sub": "Molecular Synthesis",
        "menu_glo": "Glossary",
        "menu_glo_sub": "Terminology",
        "menu_footer": "SELECT A PRISM OF INTEREST",

        "out_step": "04 / Synthesis",
        "out_sub": "New Horizons",
        "out_tag": "Collaboration",
        "out_title": "Expanding <br><span class=\"text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-rose-400 to-purple-500\">the boundaries of knowledge</span>",
        "out_desc": "This open environment is created for everyone who wants to understand the world. Your idea deserves attention.",
        "out_btn1": "To Research",
        "out_btn2": "Contact Prism",
        "out_tg": "Telegram Channel",
        "out_gh": "GitHub Repository",
        "out_boosty": "Support the Author",
        "out_footer": "PRISM | 2026 • THE ART OF PURE KNOWLEDGE",

        //===ALCHEMY===
        "alc_back": "← To Main",
        "alc_subtitle": "SEC_03 // Molecular Synthesis",
        "alc_beta": "This is a game in beta testing phase",
        "alc_reactor": "SYNTHESIS REACTOR",
        "alc_clear": "CLEAR PANEL",
        "alc_storage": "Storage",
        "alc_decoded": "Decoded:",
        "alc_filter_all": "All",
        "alc_filter_base": "Basic",
        "alc_filter_nature": "Nature",
        "alc_filter_high": "Higher",
        "alc_monitor": "Monitoring Panel",
        "alc_monitor_desc": "Select an element from the storage to analyze its molecular structure.",
        "alc_status": "Core status: Stable (100.0%)",
        "alc_footer_sec": "PRISM // SEC_03"
    }
};

let currentLang = localStorage.getItem('prism_language') || 'ru';

function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');

        if (translations[currentLang] && translations[currentLang][key] !== undefined) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[currentLang][key];
            } else {
                el.innerHTML = translations[currentLang][key];
            }
        }
    });

    const langText = document.getElementById('current-lang-text');
    if (langText) {
        langText.innerText = currentLang === 'ru' ? 'RU' : 'ENG';
    }

    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.getAttribute('data-lang') === currentLang) {
            opt.classList.add('active');
        }
    });
}

window.setLanguage = function(lang) {
    currentLang = lang;
    localStorage.setItem('prism_language', lang);
    applyTranslations();

    const dropdown = document.getElementById('lang-dropdown');
    if (dropdown) dropdown.classList.remove('show');

    if (typeof window.onLanguageChanged === 'function') {
        window.onLanguageChanged(lang);
    }
};

function buildLanguageSwitcher() {
    if (document.getElementById('lang-switcher-container')) return;

    const container = document.createElement('div');
    container.id = 'lang-switcher-container';
    container.innerHTML = `
        <button id="lang-btn" onclick="document.getElementById('lang-dropdown').classList.toggle('show')">
            🌐 <span id="current-lang-text">${currentLang === 'ru' ? 'RU' : 'ENG'}</span>
        </button>
        <div id="lang-dropdown">
            <div class="lang-option ${currentLang === 'ru' ? 'active' : ''}" data-lang="ru" onclick="setLanguage('ru')">🇷🇺 Русский (RU)</div>
            <div class="lang-option ${currentLang === 'en' ? 'active' : ''}" data-lang="en" onclick="setLanguage('en')">🇬🇧 English (ENG)</div>
        </div>
    `;
    document.body.appendChild(container);

    document.addEventListener('click', (e) => {
        const btn = document.getElementById('lang-btn');
        const dropdown = document.getElementById('lang-dropdown');
        if (btn && dropdown && !btn.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    buildLanguageSwitcher();
    applyTranslations();
});