const db = {
    'water': {
        name: 'Вода', nameEn: 'Water', icon: '💧', tier: 1,
        desc: 'Простейшая жидкость, основа биологической жизни и универсальный растворитель.',
        descEn: 'The simplest liquid, the basis of biological life and a universal solvent.'
    },
    'fire':  {
        name: 'Огонь', nameEn: 'Fire', icon: '🔥', tier: 1,
        desc: 'Активный плазменный процесс окисления, источник тепловой энергии.',
        descEn: 'Active plasma process of oxidation, a source of thermal energy.'
    },
    'earth': {
        name: 'Земля', nameEn: 'Earth', icon: '🌍', tier: 1,
        desc: 'Твердое кремниевое основание, несущее в себе тяжелые минералы.',
        descEn: 'Solid silicon base, carrying heavy minerals inside.'
    },
    'air':   {
        name: 'Воздух', nameEn: 'Air', icon: '💨', tier: 1,
        desc: 'Прозрачная газовая оболочка, создающая атмосферное давление.',
        descEn: 'Transparent gas envelope that creates atmospheric pressure.'
    },
    'time':  {
        name: 'Время', nameEn: 'Time', icon: '⏳', tier: 1,
        desc: 'Фундаментальное измерение Вселенной, определяющее энтропию.',
        descEn: 'Fundamental dimension of the Universe that determines entropy.'
    },
    'void':  {
        name: 'Пустота', nameEn: 'Void', icon: '🌌', tier: 1,
        desc: 'Космический вакуум, пространство для существования материи и полей.',
        descEn: 'Cosmic vacuum, space for the existence of matter and fields.'
    },

    'steam':  {
        name: 'Пар', nameEn: 'Steam', icon: '☁️', tier: 2,
        desc: 'Газообразное состояние воды под тепловым воздействием.',
        descEn: 'Gaseous state of water under thermal influence.'
    },
    'lava':   {
        name: 'Лава', nameEn: 'Lava', icon: '🌋', tier: 2,
        desc: 'Расплавленная силикатная порода, вырывающаяся из мантии планеты.',
        descEn: 'Molten silicate rock erupting from the planet\'s mantle.'
    },
    'energy': {
        name: 'Энергия', nameEn: 'Energy', icon: '⚡', tier: 2,
        desc: 'Квантовая мера движения и взаимодействия материальных тел.',
        descEn: 'Quantum measure of motion and interaction of material bodies.'
    },
    'dust':   {
        name: 'Пыль', nameEn: 'Dust', icon: '🌪️', tier: 2,
        desc: 'Мелкодисперсная фаза твердых микрочастиц, взвешенная в газах.',
        descEn: 'Fine dispersed phase of solid microparticles suspended in gases.'
    },
    'plant':  {
        name: 'Растение', nameEn: 'Plant', icon: '🌱', tier: 2,
        desc: 'Фотосинтезирующий организм, преобразующий свет в органику.',
        descEn: 'Photosynthetic organism that converts light into organic matter.'
    },
    'mud':    {
        name: 'Грязь', nameEn: 'Mud', icon: '💩', tier: 2,
        desc: 'Пластичная взвесь почвы, глины и воды.',
        descEn: 'Plastic suspension of soil, clay, and water.'
    },
    'rain':   {
        name: 'Дождь', nameEn: 'Rain', icon: '🌧️', tier: 2,
        desc: 'Жидкие атмосферные осадки, очищающие экосистемы.',
        descEn: 'Liquid atmospheric precipitation that purifies ecosystems.'
    },
    'sea':    {
        name: 'Море', nameEn: 'Sea', icon: '🌊', tier: 2,
        desc: 'Обширный соленый водный резервуар, колыбель жизни.',
        descEn: 'Vast salty water reservoir, the cradle of life.'
    },
    'stone':  {
        name: 'Камень', nameEn: 'Stone', icon: '🪨', tier: 2,
        desc: 'Твердый обломок горной породы кристаллической структуры.',
        descEn: 'Solid fragment of rock of crystalline structure.'
    },
    'sand':   {
        name: 'Песок', nameEn: 'Sand', icon: '🏖️', tier: 2,
        desc: 'Осадочная порода из измельченных зерен кварца.',
        descEn: 'Sedimentary rock made of crushed quartz grains.'
    },
    'clay':   {
        name: 'Глина', nameEn: 'Clay', icon: '🏺', tier: 2,
        desc: 'Вязкий гидросиликат алюминия, идеальный для формовки.',
        descEn: 'Viscous aluminum hydrosilicate, ideal for molding.'
    },
    'cloud':  {
        name: 'Облако', nameEn: 'Cloud', icon: '⛅', tier: 2,
        desc: 'Конденсированная водяная взвесь, парящая в атмосфере.',
        descEn: 'Condensed water suspension floating in the atmosphere.'
    },
    'smoke':  {
        name: 'Дым', nameEn: 'Smoke', icon: '💨', tier: 2,
        desc: 'Взвесь углерода и газов, выделяющаяся при горении.',
        descEn: 'Suspension of carbon and gases released during combustion.'
    },
    'grass':  {
        name: 'Трава', nameEn: 'Grass', icon: '🌿', tier: 2,
        desc: 'Зеленый травянистый покров планеты, поглощающий углекислый газ.',
        descEn: 'Green herbaceous cover of the planet absorbing carbon dioxide.'
    },
    'pressure': {
        name: 'Давление', nameEn: 'Pressure', icon: '🏋️', tier: 2,
        desc: 'Физическая величина, характеризующая силу сжатия атомов.',
        descEn: 'Physical quantity characterizing the force of atom compression.'
    },
    'ice':     {
        name: 'Лёд', nameEn: 'Ice', icon: '❄️', tier: 2,
        desc: 'Твердая кристаллическая фаза воды при температуре ниже 0°C.',
        descEn: 'Solid crystalline phase of water at temperatures below 0°C.'
    },

    'ocean':    {
        name: 'Океан', nameEn: 'Ocean', icon: '🔱', tier: 3,
        desc: 'Глобальный гидрологический объект планетарного масштаба.',
        descEn: 'Global hydrological object of planetary scale.'
    },
    'glass':    {
        name: 'Стекло', nameEn: 'Glass', icon: '🍷', tier: 3,
        desc: 'Аморфный прозрачный материал, получаемый плавлением песка.',
        descEn: 'Amorphous transparent material obtained by melting sand.'
    },
    'metal':    {
        name: 'Металл', nameEn: 'Metal', icon: '⚙️', tier: 3,
        desc: 'Плотный кристаллический проводник с высокой электропроводностью.',
        descEn: 'Dense crystalline conductor with high electrical conductivity.'
    },
    'swamp':    {
        name: 'Болото', nameEn: 'Swamp', icon: '🐊', tier: 3,
        desc: 'Топкая экосистема с высокой органической активностью.',
        descEn: 'Mire ecosystem with high organic activity.'
    },
    'life':     {
        name: 'Жизнь', nameEn: 'Life', icon: '✨', tier: 3,
        desc: 'Сложный органический процесс самовоспроизведения макромолекул.',
        descEn: 'Complex organic process of macromolecule self-replication.'
    },
    'bacteria': {
        name: 'Бактерия', nameEn: 'Bacteria', icon: '👾', tier: 3,
        desc: 'Простейший одноклеточный организм, заселивший микромир.',
        descEn: 'Simplest single-celled organism inhabiting the microworld.'
    },
    'tree':     {
        name: 'Дерево', nameEn: 'Tree', icon: '🪵', tier: 3,
        desc: 'Многолетний одревесневший растительный организм.',
        descEn: 'Perennial woody plant organism.'
    },
    'forest':   {
        name: 'Лес', nameEn: 'Forest', icon: '🌲', tier: 3,
        desc: 'Сложный растительный биоценоз с древесной доминантой.',
        descEn: 'Complex plant biocenosis with woody dominance.'
    },
    'charcoal': {
        name: 'Уголь', nameEn: 'Charcoal', icon: '⚫', tier: 3,
        desc: 'Твердое высокоуглеродистое ископаемое топливо.',
        descEn: 'Solid high-carbon fossil fuel.'
    },
    'storm':    {
        name: 'Шторм', nameEn: 'Storm', icon: '⛈️', tier: 3,
        desc: 'Атмосферный вихрь с сильным ветром и разрядами молний.',
        descEn: 'Atmospheric vortex with strong wind and lightning strikes.'
    },
    'obsidian': {
        name: 'Обсидиан', nameEn: 'Obsidian', icon: '💎', tier: 3,
        desc: 'Однородное вулканическое стекло аморфной структуры.',
        descEn: 'Homogeneous volcanic glass with an amorphous structure.'
    },
    'brick':    {
        name: 'Кирпич', nameEn: 'Brick', icon: '🧱', tier: 3,
        desc: 'Искусственный строительный блок из обожженной глины.',
        descEn: 'Artificial building block made of fired clay.'
    },
    'wall':     {
        name: 'Стена', nameEn: 'Wall', icon: '🛡️', tier: 3,
        desc: 'Прочная разделительная или защитная конструкция.',
        descEn: 'Sturdy dividing or protective structure.'
    },
    'house':    {
        name: 'Дом', nameEn: 'House', icon: '🏠', tier: 3,
        desc: 'Защищенное и организованное пространство обитания человека.',
        descEn: 'Protected and organized human living space.'
    },
    'sun':      {
        name: 'Солнце', nameEn: 'Sun', icon: '☀️', tier: 3,
        desc: 'Центральное светило нашей системы, дарующее свет и тепло.',
        descEn: 'Central luminary of our system, giving light and heat.'
    },
    'moon':     {
        name: 'Луна', nameEn: 'Moon', icon: '🌙', tier: 3,
        desc: 'Каменистый естественный спутник, вызывающий приливы.',
        descEn: 'Rocky natural satellite causing tides.'
    },
    'sky':      {
        name: 'Небо', nameEn: 'Sky', icon: '🌌', tier: 3,
        desc: 'Оптический купол атмосферы, переходящий в космос.',
        descEn: 'Optical dome of the atmosphere transitioning into space.'
    },
    'star':     {
        name: 'Звезда', nameEn: 'Star', icon: '⭐', tier: 3,
        desc: 'Раскаленный газовый гигант, вырабатывающий термоядерную энергию.',
        descEn: 'Incandescent gas giant producing thermonuclear energy.'
    },
    'electricity': {
        name: 'Электро', nameEn: 'Electricity', icon: '🔌', tier: 3,
        desc: 'Направленный поток свободных заряженных электронов.',
        descEn: 'Directed flow of free charged electrons.'
    },
    'flower':   {
        name: 'Цветок', nameEn: 'Flower', icon: '🌸', tier: 3,
        desc: 'Орган полового размножения цветковых растений.',
        descEn: 'Organ of sexual reproduction in flowering plants.'
    },
    'garden':   {
        name: 'Сад', nameEn: 'Garden', icon: '🏡', tier: 3,
        desc: 'Окультуренный человеком растительный оазис.',
        descEn: 'Cultivated plant oasis created by humans.'
    },
    'animal':   {
        name: 'Животное', nameEn: 'Animal', icon: '🐾', tier: 3,
        desc: 'Многоклеточный гетеротрофный подвижный организм.',
        descEn: 'Multicellular heterotrophic motile organism.'
    },
    'golem':    {
        name: 'Голем', nameEn: 'Golem', icon: '🗿', tier: 3,
        desc: 'Анимированная глиняная фигура, символ ручного труда.',
        descEn: 'Animated clay figure, symbol of manual labor.'
    },
    'paper':    {
        name: 'Бумага', nameEn: 'Paper', icon: '📄', tier: 3,
        desc: 'Тонкое прессованное полотно из растительных волокон.',
        descEn: 'Thin pressed sheet made of plant fibers.'
    },
    'steam_engine': {
        name: 'Паровой двигатель', nameEn: 'Steam Engine', icon: '🚂', tier: 3,
        desc: 'Механический тепловой двигатель, преобразующий энергию пара.',
        descEn: 'Mechanical heat engine converting steam energy.'
    },
    'diamond':  {
        name: 'Алмаз', nameEn: 'Diamond', icon: '💎', tier: 3,
        desc: 'Сверхпрочная аллотропная углеродная кристаллическая решетка.',
        descEn: 'Super-strong allotropic carbon crystal lattice.'
    },
    'gunpowder': {
        name: 'Порох', nameEn: 'Gunpowder', icon: '🧨', tier: 3,
        desc: 'Взрывчатая многокомпонентная химическая смесь.',
        descEn: 'Explosive multi-component chemical mixture.'
    },

    'human':    {
        name: 'Человек', nameEn: 'Human', icon: '👤', tier: 4,
        desc: 'Разумный наблюдатель, способный изменять структуру Вселенной.',
        descEn: 'Sentient observer capable of altering the Universe\'s structure.'
    },
    'tools':    {
        name: 'Инструменты', nameEn: 'Tools', icon: '⚒️', tier: 4,
        desc: 'Устройства, расширяющие физические возможности человека.',
        descEn: 'Devices extending human physical capabilities.'
    },
    'fish':     {
        name: 'Рыба', nameEn: 'Fish', icon: '🐟', tier: 4,
        desc: 'Позвоночное водное существо с жаберным дыханием.',
        descEn: 'Vertebrate aquatic creature with branchial respiration.'
    },
    'bird':     {
        name: 'Птица', nameEn: 'Bird', icon: '🐦', tier: 4,
        desc: 'Теплокровный летающий пернатый позвоночный организм.',
        descEn: 'Warm-blooded flying feathered vertebrate organism.'
    },
    'egg':      {
        name: 'Яйцо', nameEn: 'Egg', icon: '🥚', tier: 4,
        desc: 'Защитная органическая сфера инкубации новой жизни.',
        descEn: 'Protective organic sphere for new life incubation.'
    },
    'turtle':   {
        name: 'Черепаха', nameEn: 'Turtle', icon: '🐢', tier: 4,
        desc: 'Пресмыкающееся в прочном костяном панцире.',
        descEn: 'Reptile enclosed in a tough bony shell.'
    },
    'lizard':   {
        name: 'Ящерица', nameEn: 'Lizard', icon: '🦎', tier: 4,
        desc: 'Проворное хладнокровное чешуйчатое существо.',
        descEn: 'Agile cold-blooded scaly creature.'
    },
    'beast':    {
        name: 'Зверь', nameEn: 'Beast', icon: '🐺', tier: 4,
        desc: 'Крупный развитый представитель класса млекопитающих.',
        descEn: 'Large developed representative of the mammal class.'
    },
    'blood':    {
        name: 'Кровь', nameEn: 'Blood', icon: '🩸', tier: 4,
        desc: 'Жидкая ткань внутренней среды, переносящая газы и питательные вещества.',
        descEn: 'Liquid internal tissue transporting gases and nutrients.'
    },
    'phoenix':  {
        name: 'Феникс', nameEn: 'Phoenix', icon: '🐦‍🔥', tier: 4,
        desc: 'Мифический символ теплового перерождения энергии.',
        descEn: 'Mythical symbol of thermal energy rebirth.'
    },
    'book':     {
        name: 'Книга', nameEn: 'Book', icon: '📖', tier: 4,
        desc: 'Хранилище накопленной информации и цивилизационного опыта.',
        descEn: 'Repository of accumulated information and civilizational experience.'
    },
    'acid':     {
        name: 'Кислота', nameEn: 'Acid', icon: '🧪', tier: 4,
        desc: 'Едкое химическое вещество с высокой концентрацией ионов водорода.',
        descEn: 'Corrosive chemical substance with high hydrogen ion concentration.'
    },
    'dynamite': {
        name: 'Динамит', nameEn: 'Dynamite', icon: '🧨', tier: 4,
        desc: 'Смесевое твердое взрывчатое вещество на основе нитроглицерина.',
        descEn: 'Solid explosive mixture based on nitroglycerin.'
    },
    'cyborg':   {
        name: 'Киборг', nameEn: 'Cyborg', icon: '🤖', tier: 4,
        desc: 'Биологический организм, содержащий механические компоненты.',
        descEn: 'Biological organism containing mechanical components.'
    },
    'scientist': {
        name: 'Учёный', nameEn: 'Scientist', icon: '🥼', tier: 4,
        desc: 'Человек, исследующий структуру Вселенной научными методами.',
        descEn: 'Person exploring the Universe\'s structure using scientific methods.'
    },
    'potion':   {
        name: 'Эликсир', nameEn: 'Potion', icon: '🧪', tier: 4,
        desc: 'Высококонцентрированный раствор сложных органических веществ.',
        descEn: 'Highly concentrated solution of complex organic substances.'
    },

    'microscope': {
        name: 'Микроскоп', nameEn: 'Microscope', icon: '🔬', tier: 5,
        desc: 'Оптический прибор для исследования микромира на уровне бактерий.',
        descEn: 'Optical instrument for exploring the microworld at the bacterial level.'
    },
    'telescope':  {
        name: 'Телескоп', nameEn: 'Telescope', icon: '🔭', tier: 5,
        desc: 'Астрономический прибор для наблюдения за далекими звездами.',
        descEn: 'Astronomical instrument for observing distant stars.'
    },
    'laser':      {
        name: 'Лазер', nameEn: 'Laser', icon: '🚨', tier: 5,
        desc: 'Оптический квантовый генератор узконаправленного луча света.',
        descEn: 'Optical quantum generator of a highly directional light beam.'
    },
    'computer':   {
        name: 'Компьютер', nameEn: 'Computer', icon: '💻', tier: 5,
        desc: 'Вычислительная машина на базе кремниевых полупроводников.',
        descEn: 'Computing machine based on silicon semiconductors.'
    },
    'ai':         {
        name: 'ИИ', nameEn: 'AI', icon: '🧠', tier: 5,
        desc: 'Искусственный интеллект, способный к самообучению.',
        descEn: 'Artificial intelligence capable of self-learning.'
    },
    'internet':   {
        name: 'Интернет', nameEn: 'Internet', icon: '🌐', tier: 5,
        desc: 'Глобальная распределенная информационная сеть.',
        descEn: 'Global distributed information network.'
    },
    'spacecraft': {
        name: 'Космолёт', nameEn: 'Spacecraft', icon: '🚀', tier: 5,
        desc: 'Космический аппарат для полетов за пределы атмосферы.',
        descEn: 'Space vehicle for flights beyond the atmosphere.'
    },
    'black_hole': {
        name: 'Черная дыра', nameEn: 'Black Hole', icon: '🕳️', tier: 5,
        desc: 'Область пространства с экстремальной гравитацией, сжатая давлением.',
        descEn: 'Region of space with extreme gravity, compressed by pressure.'
    },
    'wormhole':   {
        name: 'Червоточина', nameEn: 'Wormhole', icon: '🌀', tier: 5,
        desc: 'Пространственно-временной мост, искривляющий топологию Вселенной.',
        descEn: 'Spacetime bridge distorting the topology of the Universe.'
    },
    'galaxy':     {
        name: 'Галактика', nameEn: 'Galaxy', icon: '🌌', tier: 5,
        desc: 'Гигантская гравитационно-связанная система из миллиардов звезд.',
        descEn: 'Giant gravitationally bound system of billions of stars.'
    },
    'gold':       {
        name: 'Золото', nameEn: 'Gold', icon: '🪙', tier: 5,
        desc: 'Благородный тяжелый металл, алхимическая цель трансмутации.',
        descEn: 'Noble heavy metal, the alchemical goal of transmutation.'
    },
    'philosopher_stone': {
        name: 'Филос. камень', nameEn: 'Philosopher\'s Stone', icon: '🔴', tier: 5,
        desc: 'Легендарное вещество, символ совершенного химического катализа.',
        descEn: 'Legendary substance, symbol of perfect chemical catalysis.'
    },
    'silicon':    {
        name: 'Кремний', nameEn: 'Silicon', icon: '🪨', tier: 5,
        desc: 'Полупроводниковый кристалл, основа микроэлектроники.',
        descEn: 'Semiconductor crystal, the foundation of microelectronics.'
    },
    'radiation':  {
        name: 'Радиация', nameEn: 'Radiation', icon: '☢️', tier: 5,
        desc: 'Поток высокоэнергетических элементарных частиц.',
        descEn: 'Stream of high-energy elementary particles.'
    }
};

const recipes = {
    'water+fire': 'steam',
    'earth+fire': 'lava',
    'air+fire': 'energy',
    'air+earth': 'dust',
    'earth+water': 'plant',
    'water+earth': 'mud',
    'water+air': 'rain',
    'water+water': 'sea',
    'sea+sea': 'ocean',
    'air+air': 'cloud',
    'cloud+water': 'rain',
    'lava+water': 'stone',
    'stone+air': 'sand',
    'fire+sand': 'glass',
    'fire+stone': 'metal',
    'mud+plant': 'swamp',
    'stone+pressure': 'diamond',
    'water+fire+time': 'energy',
    'water+time': 'ice',

    'swamp+energy': 'life',
    'life+swamp': 'bacteria',
    'plant+earth': 'tree',
    'tree+tree': 'forest',
    'fire+tree': 'charcoal',
    'fire+plant': 'smoke',
    'air+energy': 'storm',
    'lava+stone': 'obsidian',
    'mud+fire': 'clay',
    'clay+fire': 'brick',
    'brick+brick': 'wall',
    'wall+wall': 'house',
    'sky+fire': 'sun',
    'sun+stone': 'moon',
    'air+cloud': 'sky',
    'time+sky': 'night',
    'sky+night': 'star',
    'energy+metal': 'electricity',
    'plant+water': 'grass',
    'grass+sun': 'flower',
    'flower+flower': 'garden',
    'charcoal+stone': 'gunpowder',
    'energy+steam': 'steam_engine',

    'life+earth': 'animal',
    'life+clay': 'golem',
    'life+beast': 'human',
    'human+metal': 'tools',
    'water+life': 'fish',
    'air+life': 'bird',
    'bird+bird': 'egg',
    'egg+sand': 'turtle',
    'egg+swamp': 'lizard',
    'animal+earth': 'beast',
    'human+beast': 'blood',
    'bird+fire': 'phoenix',
    'tools+tree': 'paper',
    'paper+paper': 'book',
    'bacteria+water': 'acid',
    'acid+metal': 'energy',
    'gunpowder+charcoal': 'dynamite',
    'human+electricity': 'cyborg',
    'human+book': 'scientist',
    'plant+acid': 'potion',

    'glass+bacteria': 'microscope',
    'glass+tools': 'telescope',
    'electricity+glass': 'laser',
    'sand+pressure': 'silicon',
    'silicon+electricity': 'computer',
    'computer+computer': 'internet',
    'computer+scientist': 'ai',
    'metal+sky': 'spacecraft',
    'star+pressure': 'black_hole',
    'black_hole+time': 'wormhole',
    'star+void': 'galaxy',
    'stone+potion': 'philosopher_stone',
    'philosopher_stone+metal': 'gold',
    'star+energy': 'radiation'
};
