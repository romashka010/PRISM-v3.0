const glossaryData = [
    // А
    {
        term: "Абсолютный ноль",
        termEn: "Absolute Zero",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "T = 0 \\text{ K} \\ (-273.15^\\circ\\text{C})",
        variables: [
            { symbol: "T", name: "Температура", nameEn: "Temperature", desc: "Абсолютная шкала температур Кельвина.", descEn: "Absolute Kelvin temperature scale." },
            { symbol: "K", name: "Кельвин", nameEn: "Kelvin", desc: "Основная единица измерения температуры в СИ.", descEn: "The base SI unit of temperature." }
        ],
        definitionScientific: "Минимальный предел температуры, которую может иметь физическое тело во Вселенной. С точки зрения термодинамики, при этой температуре хаотическое тепловое движение всех атомов полностью прекращается.",
        definitionScientificEn: "The lower limit of the thermodynamic temperature scale. At this temperature, the chaotic thermal motion of all atoms completely ceases.",
        definitionSimple: "Самый сильный холод во Вселенной! Представь, что все атомы замёрзли настолько, что вообще перестали шевелиться. Холоднее этого состояния физически ничего быть не может.",
        definitionSimpleEn: "The ultimate cold in the universe! Imagine that all atoms are so frozen that they completely stop moving. Physically, nothing can ever be colder than this.",
        fact: "Учёные подобрались к нему безумно близко — на миллиардные доли градуса, но достичь идеального нуля мешают законы квантовой механики.",
        factEn: "Scientists have gotten extremely close to it—within billionths of a degree, but quantum mechanics laws prevent reaching a perfect zero."
    },
    {
        term: "Астероид",
        termEn: "Asteroid",
        category: "Космос",
        categoryEn: "Space",
        isPopular: true,
        formula: "D < 1000 \\text{ км}",
        variables: [
            { symbol: "D", name: "Эквивалентный диаметр", nameEn: "Equivalent Diameter", desc: "Максимальный линейный размер тела.", descEn: "The maximum linear size of the cosmic body." }
        ],
        definitionScientific: "Твердое каменистое небесное тело, значительно уступающее по массе и размерам планетам, но превосходящее метеороиды. Не имеет собственной плотной атмосферы.",
        definitionScientificEn: "A minor planet of the inner Solar System. They are metallic or rocky bodies without an atmosphere, ranging in size from micro-meteoroids to several hundred kilometers.",
        definitionSimple: "Огромные космические булыжники и скалы, которые летают вокруг Солнца. Они похожи на остатки деталей, из которых когда-то не успели собраться планеты.",
        definitionSimpleEn: "Giant space rocks drifting around the Sun. They are like leftover building blocks from the formation of the Solar System.",
        fact: "Большинство известных астероидов сосредоточено в поясе между орбитами Марса и Юпитера.",
        factEn: "Most known asteroids are clustered in the asteroid belt situated between the orbits of Mars and Jupiter."
    },
    {
        term: "Антиматерия",
        termEn: "Antimatter",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: false,
        formula: "e^+ + e^- \\rightarrow 2\\gamma",
        variables: [
            { symbol: "e^+", name: "Позитрон", nameEn: "Positron", desc: "Античастица для электрона с положительным зарядом.", descEn: "The antiparticle of the electron with a positive charge." },
            { symbol: "e^-", name: "Электрон", nameEn: "Electron", desc: "Обычная отрицательно заряженная стабильная частица.", descEn: "A common negatively charged stable particle." },
            { symbol: "\\gamma", name: "Гамма-квант", nameEn: "Gamma quantum", desc: "Высокоэнергетический фотон света, выделяющийся при аннигиляции.", descEn: "A high-energy photon of light released during annihilation." }
        ],
        definitionScientific: "Вещество, состоящее из античастиц — зеркальных двойников обычных элементарных частиц, обладающих теми же массами и спинами, но противоположными электрическими и другими квантовыми зарядами.",
        definitionScientificEn: "Matter composed of antiparticles—mirror twins of ordinary elementary particles, having the same masses and spins but opposite electrical and other quantum charges.",
        definitionSimple: "Зеркальный двойник нашего мира! У каждой частицы есть свой близнец-античастица с противоположным зарядом. Если они соприкоснутся, то мгновенно исчезнут в ярчайшей вспышке чистой энергии.",
        definitionSimpleEn: "A mirror twin of our world! Every particle has an antiparticle twin with the opposite charge. If they touch, they instantly disappear in a brilliant flash of pure energy.",
        fact: "Создание и хранение всего одного грамма антиматерии обошлось бы человечеству в сотни триллионов долларов.",
        factEn: "Creating and storing just one gram of antimatter would cost humanity hundreds of trillions of dollars."
    },
    {
        term: "Антрацит",
        termEn: "Anthracite",
        category: "Алхимия",
        categoryEn: "Alchemy",
        isPopular: false,
        formula: "C \\ (95\\%)",
        variables: [
            { symbol: "C", name: "Чистый углерод", nameEn: "Pure Carbon", desc: "Основная масса древнего органического вещества, превратившаяся в уголь.", descEn: "The bulk of ancient organic matter that turned into coal." }
        ],
        definitionScientific: "Самый древний и наиболее метаморфизованный сорт каменного угля. Обладает высоким металлическим блеском, большой плотностью и максимальной теплотворной способностью среди ископаемых углей.",
        definitionScientificEn: "The oldest and most metamorphosed type of coal. It has a high metallic luster, high density, and the highest heat content among fossil coals.",
        definitionSimple: "Король среди всех видов угля! Очень черный, блестит как металл и горит невероятно долго и жарко практически без дыма и запаха.",
        definitionSimpleEn: "The king of all coals! Very black, shines like metal, and burns incredibly long and hot with almost no smoke or smell.",
        firstAppearance: "Образовался сотни миллионов лет назад из гигантских древних папоротников и деревьев, которые оказались глубоко под землей без доступа воздуха и подверглись сильному нагреву и давлению.",
        firstAppearanceEn: "Formed hundreds of millions of years ago from giant ancient ferns and trees buried deep underground without air, subjected to intense heat and pressure.",
        howToGet: "Добывается в глубоких шахтах из древних геологических пластов.",
        howToGetEn: "Mined in deep shafts from ancient geological seams."
    },
    {
        term: "Атом",
        termEn: "Atom",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "Z = N_p",
        variables: [
            { symbol: "Z", name: "Зарядовое число", nameEn: "Atomic Number", desc: "Количество протонов в ядре атома.", descEn: "The number of protons in the nucleus of an atom." }
        ],
        definitionScientific: "Микроскопическая частица вещества, наименьшая часть химического элемента, являющаяся носителем его свойств. Состоит из тяжелого ядра и окружающего его электронного облака.",
        definitionScientificEn: "The basic unit of a chemical element. It consists of a dense central nucleus surrounded by a cloud of negatively charged electrons.",
        definitionSimple: "Маленький строительный кирпичик, из которого состоит вообще всё! В центре у него тяжелое ядро, а вокруг с огромной скоростью летают легкие электроны.",
        definitionSimpleEn: "A tiny building block of all matter! It has a heavy nucleus at its center and incredibly fast, light electrons orbiting around it.",
        fact: "Атом на 99.999% состоит из абсолютной пустоты. Если убрать всю пустоту из атомов всех людей на Земле, всё человечество поместится в кубик сахара.",
        factEn: "An atom is 99.999% empty space. If you removed all the empty space from the atoms of every human on Earth, the entire human race would fit inside a single sugar cube."
    },
    {
        term: "Атмосфера",
        termEn: "Atmosphere",
        category: "Космос",
        categoryEn: "Space",
        isPopular: false,
        formula: "P = \\rho g h",
        variables: [
            { symbol: "P", name: "Гидростатическое давление", nameEn: "Hydrostatic Pressure", desc: "Давление столба газов атмосферы на поверхность.", descEn: "The pressure of the gas column of the atmosphere on the surface." }
        ],
        definitionScientific: "Газовая оболочка небесного тела, удерживаемая около него гравитацией. Состоит из смеси различных газов и аэрозолей.",
        definitionScientificEn: "A layer of gases surrounding a planet or other material body, held in place by the gravity of that body.",
        definitionSimple: "Воздушное одеяло планеты. Она защищает нас от метеоритов, смертельной космической радиации и сохраняет тепло, чтобы океаны не замёрзли.",
        definitionSimpleEn: "The air blanket of a planet. It protects us from meteorites, deadly cosmic radiation, and keeps the heat in so the oceans don't freeze.",
        fact: "Атмосфера Венеры настолько плотная, что на её поверхности человек был бы раздавлен, как на глубине 900 метров под водой.",
        factEn: "The atmosphere of Venus is so dense that on its surface a person would be crushed as if they were 900 meters underwater."
    },
    {
        term: "Аккреционный диск",
        termEn: "Accretion Disk",
        category: "Космос",
        categoryEn: "Space",
        isPopular: false,
        formula: "L = \\eta \\dot{M} c^2",
        variables: [
            { symbol: "L", name: "Светимость диска", nameEn: "Disk Luminosity", desc: "Мощность излучения диска.", descEn: "The radiation power of the disk." },
            { symbol: "\\dot{M}", name: "Темп аккреции", nameEn: "Accretion Rate", desc: "Скорость падения массы в черную дыру.", descEn: "The rate of mass falling into the black hole." }
        ],
        definitionScientific: "Структура, возникающая при падении диффузного материала (газа, плазмы) на массивное центральное тело, обусловленная сохранением момента импульса.",
        definitionScientificEn: "A structure formed by diffuse material (gas, plasma) in orbital motion around a massive central body, driven by the conservation of angular momentum.",
        definitionSimple: "Космическая водоворотка из раскалённого газа, которая закручивается вокруг чёрной дыры перед тем, как навсегда в неё упасть. Трение в этом диске разогревает газ так сильно, что он светится ярче звёзд.",
        definitionSimpleEn: "A cosmic whirlpool of hot gas spinning around a black hole before falling into it forever. Friction heats the gas so much that it shines brighter than stars.",
        fact: "Именно аккреционные диски мы видим на знаменитых фотографиях чёрных дыр — сама дыра невидима.",
        factEn: "It is the accretion disks we see in the famous photographs of black holes—the hole itself is invisible."
    },
    {
        term: "Альфа-распад",
        termEn: "Alpha Decay",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: false,
        formula: "^{A}_{Z}\\text{X} \\rightarrow ^{A-4}_{Z-2}\\text{Y} + ^{4}_{2}\\text{He}",
        variables: [
            { symbol: "^{4}_{2}\\text{He}", name: "Альфа-частица", nameEn: "Alpha Particle", desc: "Ядро атома гелия-4, испускаемое при распаде.", descEn: "The helium-4 nucleus emitted during decay." }
        ],
        definitionScientific: "Вид радиоактивного распада ядра, в результате которого испускается альфа-частица (ядро гелия-4), а массовое число исходного ядра уменьшается на 4.",
        definitionScientificEn: "A type of radioactive decay in which an atomic nucleus emits an alpha particle (helium-4 nucleus) and thereby transforms into a different atomic nucleus, with a mass number that is reduced by four.",
        definitionSimple: "Процесс, когда слишком тяжёлое и нестабильное атомное ядро отплёвывает от себя кусочек, чтобы стать легче и стабильнее. Этот кусочек и называется альфа-частицей (радиацией).",
        definitionSimpleEn: "A process where a heavy and unstable atomic nucleus spits out a piece of itself to become lighter and more stable. This piece is called an alpha particle (radiation).",
        fact: "Альфа-излучение не может пробить даже обычный лист бумаги или слой мертвой кожи на твоей руке, но смертельно опасно при проглатывании источника.",
        factEn: "Alpha radiation cannot even penetrate a simple sheet of paper or the dead skin layer on your hand, but it is deadly if the source is ingested."
    },

    // Б
    {
        term: "Базальт",
        termEn: "Basalt",
        category: "Алхимия",
        categoryEn: "Alchemy",
        isPopular: false,
        formula: "SiO_2 \\ (45-52\\%)",
        variables: [
            { symbol: "SiO_2", name: "Диоксид кремния", nameEn: "Silicon Dioxide", desc: "Основа силикатных минералов базальтовой лавы.", descEn: "The chemical base of silicate minerals in basaltic lava." }
        ],
        definitionScientific: "Магматическая вулканическая горная порода основного состава. Самая распространенная порода на поверхности планет земной группы, формирующая океаническую кору.",
        definitionScientificEn: "An aphanitic igneous rock that contains less than 52% silica by weight. It is the most common rock on the surface of rocky planets and forms the oceanic crust.",
        definitionSimple: "Очень прочный, тяжелый и темный камень, который получается, когда изливающаяся лава остывает прямо на воздухе или под водой.",
        definitionSimpleEn: "An extremely tough, heavy, dark stone that is created when erupting lava cools down rapidly on the surface or underwater.",
        firstAppearance: "Рождается во время извержений подводных и наземных вулканов, формируя целые лавовые поля и грандиозные шестигранные столбы.",
        firstAppearanceEn: "Born during submarine and terrestrial volcanic eruptions, forming vast lava plateaus and giant hexagonal basalt columns.",
        howToGet: "Добывается открытым способом в карьерах. Широко используется для строительства дорог и облицовки зданий.",
        howToGetEn: "Mined openly from stone quarries. It is widely used in construction, road aggregates, and building facades."
    },
    {
        term: "Бозон Хиггса",
        termEn: "Higgs Boson",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "m_H \\approx 125.1 \\text{ ГэВ}/c^2",
        variables: [
            { symbol: "m_H", name: "Масса бозона", nameEn: "Higgs Mass", desc: "Масса элементарной частицы.", descEn: "The rest mass of the elementary particle." }
        ],
        definitionScientific: "Элементарная частица, квант поля Хиггса, с необходимостью возникающая в Стандартной модели физики элементарных частиц. Отвечает за наличие массы у других частиц (W- и Z-бозонов, кварков, лептонов).",
        definitionScientificEn: "An elementary particle in the Standard Model of particle physics, produced by the quantum excitation of the Higgs field, which gives mass to other particles.",
        definitionSimple: "Частица Бога! Она работает как густой космический сироп: когда другие частицы пробираются через это поле, они «прилипают» и обретают свой вес (массу). Без неё всё в мире летало бы со скоростью света.",
        definitionSimpleEn: "The God Particle! It acts like a cosmic syrup: as other fundamental particles travel through it, they attract 'stickiness' and acquire mass. Without it, everything would fly at the speed of light.",
        fact: "Открытие этой частицы на Большом адронном коллайдере в 2012 году стало одним из величайших триумфов науки XXI века.",
        factEn: "The discovery of this particle at the Large Hadron Collider in 2012 was one of the greatest triumphs of 21st-century science."
    },
    {
        term: "Большой взрыв",
        termEn: "Big Bang",
        category: "Космос",
        categoryEn: "Space",
        isPopular: true,
        formula: "H(t)^2 = \\frac{8\\pi G}{3} \\rho + \\frac{\\Lambda}{3}",
        variables: [
            { symbol: "H(t)", name: "Параметр Хаббла", nameEn: "Hubble Parameter", desc: "Скорость расширения Вселенной.", descEn: "The expansion rate of the Universe." }
        ],
        definitionScientific: "Космологическая модель, описывающая раннее развитие Вселенной, согласно которой Вселенная расширяется из состояния с бесконечной плотностью и температурой (сингулярности).",
        definitionScientificEn: "A cosmological model describing the early development of the Universe, proposing that it expanded from a state of infinite density and temperature (a singularity).",
        definitionSimple: "Момент рождения нашего мира! Около 13,8 миллиарда лет назад вся материя, пространство и даже само время вырвались из микроскопической точки и начали стремительно расширяться.",
        definitionSimpleEn: "The moment our world was born! About 13.8 billion years ago, all matter, space, and even time itself burst forth from a microscopic point and began to rapidly expand.",
        fact: "Слово «Взрыв» придумали журналисты. На самом деле это было не извержение в пустом пространстве, а стремительное растягивание самого пространства повсюду одновременно.",
        factEn: "The term 'Bang' was coined by journalists. It wasn't actually an explosion in empty space, but a rapid stretching of space itself everywhere at once."
    },
    {
        term: "Белый карлик",
        termEn: "White Dwarf",
        category: "Космос",
        categoryEn: "Space",
        isPopular: false,
        formula: "M \\le 1.44 M_\\odot",
        variables: [
            { symbol: "1.44 M_\\odot", name: "Предел Чандрасекара", nameEn: "Chandrasekhar Limit", desc: "Максимальная масса, при которой белый карлик стабилен.", descEn: "The maximum mass at which a white dwarf is stable." }
        ],
        definitionScientific: "Компактная звезда с массой, сопоставимой с массой Солнца, но радиусом в сотни раз меньшим, поддерживаемая от гравитационного коллапса давлением вырожденного электронного газа.",
        definitionScientificEn: "A stellar core remnant composed mostly of electron-degenerate matter. A white dwarf is very dense: its mass is comparable to the Sun's, while its volume is comparable to Earth's.",
        definitionSimple: "Светящийся звёздный труп. Когда звезда вроде нашего Солнца сжигает всё топливо, она сбрасывает оболочку, а её ядро сжимается в шар размером с Землю, но весящий миллионы тонн.",
        definitionSimpleEn: "A glowing stellar corpse. When a star like our Sun burns all its fuel, it sheds its outer layers, and its core collapses into a sphere the size of Earth, but weighing millions of tons.",
        fact: "Материал белого карлика настолько плотный, что одна чайная ложка его вещества на Земле весила бы как целый слон.",
        factEn: "A white dwarf's material is so dense that a single teaspoon of it would weigh as much as an elephant on Earth."
    },
    {
        term: "Барионная материя",
        termEn: "Baryonic Matter",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: false,
        formula: "\\Omega_b \\approx 5\\%",
        variables: [
            { symbol: "\\Omega_b", name: "Плотность барионов", nameEn: "Baryon Density", desc: "Доля обычной материи во Вселенной.", descEn: "The fraction of ordinary matter in the Universe." }
        ],
        definitionScientific: "Материя, состоящая из барионов (тяжёлых частиц из трёх кварков, таких как протоны и нейтроны) и электронов. Охватывает всю привычную нам видимую материю.",
        definitionScientificEn: "Matter composed of baryons (heavy particles made of three quarks, like protons and neutrons) and electrons. It encompasses all ordinary visible matter.",
        definitionSimple: "Обычное, нормальное вещество! Ты, твой телефон, Земля, звёзды и вообще всё, что светится или что можно потрогать — это барионная материя. И её во Вселенной всего 5%!",
        definitionSimpleEn: "Ordinary, normal matter! You, your phone, Earth, the stars, and basically anything that glows or can be touched is baryonic matter. And it makes up only 5% of the Universe!",
        fact: "Остальные 95% Вселенной — это загадочные тёмная материя и тёмная энергия, которые мы вообще не понимаем.",
        factEn: "The other 95% of the Universe consists of mysterious dark matter and dark energy, which we still do not fully understand."
    },

    // В
    {
        term: "Вода",
        termEn: "Water",
        category: "Алхимия",
        categoryEn: "Alchemy",
        isPopular: true,
        formula: "H_2O",
        variables: [
            { symbol: "H", name: "Водород", nameEn: "Hydrogen", desc: "Самый легкий и распространенный газ во Вселенной.", descEn: "The lightest and most abundant gas in the Universe." },
            { symbol: "O", name: "Кислород", nameEn: "Oxygen", desc: "Активный неметалл, необходимый для горения и дыхания.", descEn: "An active nonmetal necessary for combustion and respiration." }
        ],
        definitionScientific: "Бинарное неорганическое соединение. Важнейший природный растворитель, определяющий зарождение и существование органической жизни.",
        definitionScientificEn: "An inorganic, transparent, tasteless, odorless, and nearly colorless chemical substance, which is the main constituent of Earth's hydrosphere and the fluids of all known living organisms.",
        definitionSimple: "Главная жидкость жизни! Прозрачная, безвкусная, способная растворять кучу веществ и превращаться в твёрдый лёд или невидимый пар.",
        definitionSimpleEn: "The main liquid of life! Transparent, tasteless, capable of dissolving many substances and turning into solid ice or invisible steam.",
        firstAppearance: "Появилась в виде ледяной пыли в протопланетном диске ещё до рождения Земли. Позже была доставлена на планету кометами.",
        firstAppearanceEn: "Appeared as icy dust in the protoplanetary disk before Earth was born. It was later delivered to the planet by comets.",
        howToGet: "Конденсировать водяной пар, растопить ледники или провести реакцию водорода с кислородом.",
        howToGetEn: "Condense water vapor, melt glaciers, or trigger a chemical reaction between hydrogen and oxygen."
    },
    {
        term: "Воздух",
        termEn: "Air",
        category: "Алхимия",
        categoryEn: "Alchemy",
        isPopular: true,
        formula: "N_2 \\ (78\\%) + O_2 \\ (21\\%)",
        variables: [
            { symbol: "N_2", name: "Молекулярный азот", nameEn: "Molecular Nitrogen", desc: "Инертный газ, разбавляющий активный кислород.", descEn: "An inert gas that dilutes active oxygen." },
            { symbol: "O_2", name: "Молекулярный кислород", nameEn: "Molecular Oxygen", desc: "Газ, обеспечивающий дыхание живых организмов.", descEn: "The gas that provides respiration for living organisms." }
        ],
        definitionScientific: "Естественная смесь газов, главным образом азота и кислорода, составляющая земную атмосферу и необходимая для аэробного дыхания.",
        definitionScientificEn: "The natural mixture of gases, primarily nitrogen and oxygen, that makes up the Earth's atmosphere and is necessary for aerobic respiration.",
        definitionSimple: "Невидимый океан газов, в котором мы все живём и дышим. Мы его не замечаем, пока не подует сильный ветер.",
        definitionSimpleEn: "An invisible ocean of gases in which we all live and breathe. We don't notice it until a strong wind blows.",
        firstAppearance: "Первичная атмосфера выделилась из недр Земли при извержении вулканов. Позже бактерии наполнили её кислородом.",
        firstAppearanceEn: "The primary atmosphere was released from the Earth's interior during volcanic eruptions. Later, bacteria filled it with oxygen.",
        howToGet: "Смешать азот, кислород и немного аргона с углекислым газом.",
        howToGetEn: "Mix nitrogen, oxygen, and a little argon with carbon dioxide."
    },
    {
        term: "Вакуум",
        termEn: "Vacuum",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: false,
        formula: "P \\rightarrow 0",
        variables: [
            { symbol: "P", name: "Давление", nameEn: "Pressure", desc: "Давление газа в пространстве.", descEn: "Gas pressure in space." }
        ],
        definitionScientific: "Среда, свободная от вещества. В квантовой теории поля вакуум не является абсолютно пустым, а наполнен нулевыми колебаниями квантовых полей.",
        definitionScientificEn: "A space devoid of matter. In quantum field theory, a vacuum is not perfectly empty but is filled with zero-point energy fluctuations of quantum fields.",
        definitionSimple: "Абсолютная пустота, в которой нет ни воздуха, ни пылинок, ничего. Именно такой пустотой заполнен космос между планетами.",
        definitionSimpleEn: "Absolute emptiness with no air, no dust, nothing. This is exactly the kind of void that fills the space between planets.",
        fact: "Даже самый идеальный вакуум на самом деле бурлит: в нём из ниоткуда постоянно появляются и исчезают виртуальные частицы.",
        factEn: "Even the most perfect vacuum actually boils: virtual particles constantly pop in and out of existence from nowhere."
    },
    {
        term: "Вселенная",
        termEn: "Universe",
        category: "Космос",
        categoryEn: "Space",
        isPopular: true,
        formula: "r \\approx 46 \\text{ млрд св. лет}",
        variables: [
            { symbol: "r", name: "Радиус", nameEn: "Radius", desc: "Размер наблюдаемой (видимой) части Вселенной.", descEn: "The size of the observable Universe." }
        ],
        definitionScientific: "Не имеющее строгого определения понятие в астрономии и философии, охватывающее всё сущее, включая пространство, время, все формы материи и физические законы, управляющие ими.",
        definitionScientificEn: "All of space and time and their contents, including planets, stars, galaxies, and all other forms of matter and energy.",
        definitionSimple: "Абсолютно всё, что вообще существует! Все планеты, звёзды, галактики, пустота между ними и даже само время находятся внутри Вселенной.",
        definitionSimpleEn: "Absolutely everything that exists! All planets, stars, galaxies, the void between them, and even time itself exist within the Universe.",
        fact: "Вселенная постоянно расширяется с ускорением, и её границы улетают от нас быстрее скорости света.",
        factEn: "The Universe is constantly expanding at an accelerating rate, and its boundaries are moving away from us faster than the speed of light."
    },
    {
        term: "Водород",
        termEn: "Hydrogen",
        category: "Алхимия",
        categoryEn: "Alchemy",
        isPopular: true,
        formula: "H_2",
        variables: [
            { symbol: "H", name: "Атом водорода", nameEn: "Hydrogen Atom", desc: "Самый простой атом во Вселенной (1 протон + 1 электрон).", descEn: "The simplest atom in the Universe (1 proton + 1 electron)." }
        ],
        definitionScientific: "Первый химический элемент Периодической системы. Бесцветный горючий газ без запаха. Самое распространенное вещество во Вселенной (около 75% всей барионной массы).",
        definitionScientificEn: "The first chemical element in the Periodic Table. A colorless, odorless, highly flammable gas. The most abundant substance in the Universe (about 75% of all baryonic mass).",
        definitionSimple: "Элемент №1. Самый лёгкий и простой газ из всех существующих. Именно водород горит внутри звёзд, давая им энергию светить миллиарды лет.",
        definitionSimpleEn: "Element #1. The lightest and simplest gas in existence. Hydrogen is what burns inside stars, giving them the energy to shine for billions of years.",
        firstAppearance: "Единственный элемент (вместе с гелием), который появился прямо во время Большого Взрыва.",
        firstAppearanceEn: "The only element (along with helium) that emerged directly during the Big Bang.",
        howToGet: "Добывается расщеплением обычной воды (электролизом).",
        howToGetEn: "Extracted by splitting ordinary water via electrolysis."
    },
    {
        term: "Волна",
        termEn: "Wave",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: false,
        formula: "v = \\lambda f",
        variables: [
            { symbol: "\\lambda", name: "Длина волны", nameEn: "Wavelength", desc: "Расстояние между двумя гребнями волны.", descEn: "The distance between two wave crests." },
            { symbol: "f", name: "Частота", nameEn: "Frequency", desc: "Количество колебаний в секунду.", descEn: "The number of oscillations per second." }
        ],
        definitionScientific: "Изменение некоторой совокупности физических величин, способное перемещаться, удаляясь от места своего возникновения, и переносящее энергию без переноса вещества.",
        definitionScientificEn: "A propagating dynamic disturbance (change from equilibrium) of one or more quantities, which transfers energy without transferring matter.",
        definitionSimple: "Рябь, бегущая по воде, звуки в воздухе или свет от фонарика. Волна — это когда передается энергия (толчок), но сама среда остаётся на месте.",
        definitionSimpleEn: "Ripples running on water, sounds in the air, or light from a flashlight. A wave transfers energy (a push), but the medium itself stays in place.",
        fact: "Свет — это удивительная волна, которой вообще не нужна среда (вода или воздух) для распространения. Она легко летит в пустом вакууме.",
        factEn: "Light is an amazing wave that doesn't need a medium (like water or air) to travel. It flies easily through an empty vacuum."
    },
    {
        term: "Время",
        termEn: "Time",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "t' = \\frac{t}{\\sqrt{1 - v^2/c^2}}",
        variables: [
            { symbol: "t'", name: "Замедленное время", nameEn: "Dilated Time", desc: "Время, идущее для движущегося объекта.", descEn: "Time experienced by a moving object." }
        ],
        definitionScientific: "Форма протекания физических и психических процессов, условие возможности изменения. Одна из координат единого пространства-времени, в которой мировая линия частиц строго однонаправлена.",
        definitionScientificEn: "The indefinite continued progress of existence and events that occur in an apparently irreversible succession. It is a coordinate of spacetime.",
        definitionSimple: "Невидимая река, которая несёт нас из прошлого через настоящее в будущее. Физики выяснили, что время гибкое — оно замедляется вблизи чёрных дыр или если лететь очень быстро.",
        definitionSimpleEn: "An invisible river that carries us from the past through the present into the future. Physicists discovered that time is flexible—it slows down near black holes or if you fly very fast.",
        fact: "Для света (фотонов) времени вообще не существует. Фотон, родившийся миллиард лет назад, с его точки зрения добрался до твоего глаза мгновенно.",
        factEn: "For light (photons), time doesn't exist at all. A photon born a billion years ago reaches your eye instantaneously from its own perspective."
    },

    // Г
    {
        term: "Глина",
        termEn: "Clay",
        category: "Алхимия",
        categoryEn: "Alchemy",
        isPopular: false,
        formula: "Al_2O_3 \\cdot 2SiO_2 \\cdot 2H_2O",
        variables: [
            { symbol: "Al_2O_3", name: "Оксид алюминия", nameEn: "Aluminum Oxide", desc: "Обеспечивает пластичность и прочность глины.", descEn: "Provides plasticity and strength to the clay." }
        ],
        definitionScientific: "Мелкозернистая осадочная горная порода, пылевидная в сухом состоянии и пластичная при увлажнении.",
        definitionScientificEn: "A fine-grained natural rock or soil material that combines one or more clay minerals, plastic when wet and hard when dry or fired.",
        definitionSimple: "Мягкая природная грязь, которая легко лепится в любую форму, а после обжига на огне становится твёрдой, как камень.",
        definitionSimpleEn: "Soft natural mud that is easily molded into any shape, and after firing in fire becomes as hard as a stone.",
        firstAppearance: "Образуется на протяжении миллионов лет при медленном разрушении и выветривании гранитных скал.",
        firstAppearanceEn: "Formed over millions of years through the slow weathering and erosion of granite rocks.",
        howToGet: "Добыть на дне высохших древних озёр или рек, очистить от песка и смешать с водой.",
        howToGetEn: "Mined from the bottoms of dried ancient lakes or rivers, purified from sand, and mixed with water."
    },
    {
        term: "Гравитация",
        termEn: "Gravity",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "F = G \\frac{m_1 m_2}{r^2}",
        variables: [
            { symbol: "F", name: "Сила притяжения", nameEn: "Gravitational Force", desc: "Взаимная сила притяжения между телами.", descEn: "Mutual force of attraction between bodies." },
            { symbol: "G", name: "Гравитационная постоянная", nameEn: "Gravitational Constant", desc: "Константа связи силы тяжести.", descEn: "The coupling constant for gravity." }
        ],
        definitionScientific: "Универсальное фундаментальное взаимодействие, заключающееся во взаимном притяжении всех тел, обладающих массой или энергией.",
        definitionScientificEn: "A fundamental interaction which causes mutual attraction between all things that have mass or energy.",
        definitionSimple: "Невидимая космическая пружина. Земля притягивает тебя, ты притягиваешь Землю, а Солнце удерживает все планеты на орбитах.",
        definitionSimpleEn: "An invisible cosmic spring. Earth pulls you, you pull Earth, and the Sun keeps all planets in their orbits.",
        fact: "Сила тяжести на самом деле — это не магнит, а искривление пространства. Тяжёлые планеты проминают пространство под собой, как шары для боулинга на батуте.",
        factEn: "Gravity is not actually a magnet, but the curvature of space. Heavy planets dent the space underneath them, like bowling balls on a trampoline."
    },
    {
        term: "Гравитационные волны",
        termEn: "Gravitational Waves",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: false,
        formula: "h_{ij} \\propto \\frac{1}{r}",
        variables: [
            { symbol: "h_{ij}", name: "Амплитуда волны", nameEn: "Wave Amplitude", desc: "Мера искривления пространства-времени.", descEn: "A measure of the spacetime curvature." }
        ],
        definitionScientific: "Рябь пространства-времени, излучаемая движущимися с ускорением массивными объектами, распространяющаяся со скоростью света.",
        definitionScientificEn: "Ripples in spacetime generated by the accelerated masses of binary systems, propagating outward at the speed of light.",
        definitionSimple: "Дрожь самого космоса! Когда сталкиваются сверхмассивные черные дыры, они поднимают волну, которая заставляет само пространство сжиматься и расширяться, словно желе.",
        definitionSimpleEn: "The tremor of the cosmos itself! When supermassive black holes collide, they create a wave that makes space itself squeeze and stretch like jelly.",
        fact: "Первые такие волны физики поймали в 2015 году — они летели к Земле больше миллиарда лет.",
        factEn: "Physicists first detected these waves in 2015—they had been traveling to Earth for over a billion years."
    },
    {
        term: "Гематит",
        termEn: "Hematite",
        category: "Алхимия",
        categoryEn: "Alchemy",
        isPopular: false,
        formula: "Fe_2O_3",
        variables: [
            { symbol: "Fe_2O_3", name: "Оксид железа", nameEn: "Iron Oxide", desc: "Вишнево-красный железняк, основа металлургии.", descEn: "Cherry-red iron ore, the basis of metallurgy." }
        ],
        definitionScientific: "Широко распространенный минерал железа, одна из важнейших железных руд. Имеет вишнево-красный цвет черты.",
        definitionScientificEn: "A common iron oxide mineral and one of the most important iron ores. It leaves a distinct cherry-red streak.",
        definitionSimple: "Тяжелый минерал стального цвета, который оставляет ярко-красный кровавый след, если потереть им по шершавой плитке.",
        definitionSimpleEn: "A heavy, steel-colored mineral that leaves a bright red, blood-like streak when rubbed against a rough tile.",
        firstAppearance: "Образуется при окислении горячих железистых источников в вулканических провинциях.",
        firstAppearanceEn: "Forms during the oxidation of hot iron-rich springs in volcanic provinces.",
        howToGet: "Добывается в огромных железорудных карьерах для последующей выплавки стали.",
        howToGetEn: "Mined in massive iron ore quarries for subsequent steel smelting."
    },
    {
        term: "Галактика",
        termEn: "Galaxy",
        category: "Космос",
        categoryEn: "Space",
        isPopular: true,
        formula: "N \\approx 10^{11} \\text{ звёзд}",
        variables: [
            { symbol: "N", name: "Звездное население", nameEn: "Stellar Population", desc: "Среднее количество звезд в спиральной галактике.", descEn: "The average number of stars in a spiral galaxy." }
        ],
        definitionScientific: "Гравитационно-связанная система из звёзд, звёздных скоплений, межзвёздного газа и пыли, а также тёмной материи. Все объекты движутся вокруг общего центра масс.",
        definitionScientificEn: "A gravitationally bound system of stars, stellar remnants, interstellar gas, dust, and dark matter. Everything orbits a common center of mass.",
        definitionSimple: "Огромный космический город! В нём живут миллиарды звёзд (таких как наше Солнце), которые дружно кружатся вокруг гигантской чёрной дыры в центре.",
        definitionSimpleEn: "A colossal cosmic city! Billions of stars (like our Sun) live there, swirling together around a giant black hole in the center.",
        fact: "Наша галактика Млечный Путь прямо сейчас летит навстречу соседней галактике Андромеды. Они столкнутся через 4 миллиарда лет.",
        factEn: "Our Milky Way galaxy is currently flying towards the neighboring Andromeda galaxy. They will collide in 4 billion years."
    },
    {
        term: "Горизонт событий",
        termEn: "Event Horizon",
        category: "Космос",
        categoryEn: "Space",
        isPopular: true,
        formula: "r_s = \\frac{2GM}{c^2}",
        variables: [
            { symbol: "r_s", name: "Радиус", nameEn: "Radius", desc: "Радиус горизонта событий (радиус Шварцшильда).", descEn: "The radius of the event horizon (Schwarzschild radius)." }
        ],
        definitionScientific: "Воображаемая граница в пространстве-времени, разделяющая события, которые могут повлиять на удалённого наблюдателя, и те, которые не могут. Обозначает «поверхность» черной дыры.",
        definitionScientificEn: "A boundary in spacetime beyond which events cannot affect an outside observer. It marks the 'surface' of a black hole.",
        definitionSimple: "Точка невозврата у чёрной дыры. Если ты пересечешь эту черту, обратно не вернешься никогда, даже если включишь двигатели со скоростью света.",
        definitionSimpleEn: "The point of no return for a black hole. Cross this line, and you will never return, even if you fire engines at the speed of light.",
        fact: "Для внешнего наблюдателя объект, падающий за горизонт событий, будет падать вечно, медленно краснея и застывая во времени.",
        factEn: "To an outside observer, an object falling past the event horizon will appear to fall forever, slowly turning red and freezing in time."
    },

    // Д
    {
        term: "Дифракция",
        termEn: "Diffraction",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: false,
        formula: "d \\sin \\theta = m \\lambda",
        variables: [
            { symbol: "d", name: "Период решетки", nameEn: "Grating Period", desc: "Расстояние между щелями, рассеивающими свет.", descEn: "Distance between the slits scattering light." },
            { symbol: "\\lambda", name: "Длина волны", nameEn: "Wavelength", desc: "Длина волны падающего света.", descEn: "Wavelength of incident light." }
        ],
        definitionScientific: "Явление огибания волнами препятствий, соизмеримых с длиной волны, и их последующая интерференция. Приводит к отклонению волн от прямолинейного распространения.",
        definitionScientificEn: "The phenomenon of waves bending around obstacles comparable to their wavelength and interfering. It causes waves to deviate from straight-line propagation.",
        definitionSimple: "Способность света и звука огибать углы! Именно из-за дифракции ты можешь слышать человека, стоящего за углом дома, хотя ты его не видишь.",
        definitionSimpleEn: "The ability of light and sound to bend around corners! Because of diffraction, you can hear someone around the corner of a building even if you can't see them.",
        fact: "Цветные переливы на поверхности обычного CD-диска — это классический пример дифракции света.",
        factEn: "The colorful iridescent reflections on the surface of an ordinary CD are a classic example of light diffraction."
    },
    {
        term: "Дисперсия",
        termEn: "Dispersion",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "n = f(\\lambda)",
        variables: [
            { symbol: "n", name: "Показатель преломления", nameEn: "Refractive Index", desc: "Степень изменения скорости света в среде.", descEn: "The degree to which the speed of light changes in a medium." },
            { symbol: "\\lambda", name: "Длина волны", nameEn: "Wavelength", desc: "Зависит от цвета света.", descEn: "Depends on the color of the light." }
        ],
        definitionScientific: "Зависимость фазовой скорости волны в среде от её частоты. В оптике проявляется как разложение белого света в спектр при прохождении через прозрачную призму.",
        definitionScientificEn: "The dependence of the phase velocity of a wave on its frequency in a medium. In optics, it manifests as the separation of white light into a color spectrum via a prism.",
        definitionSimple: "Волшебство появления радуги. Когда белый свет (в котором смешаны все цвета) проходит через стекло или каплю воды, он расщепляется на красивую разноцветную полосу.",
        definitionSimpleEn: "The magic behind rainbows. When white light (which mixes all colors) passes through glass or a water drop, it splits into a beautiful multi-colored band.",
        fact: "Красный свет преломляется слабее всего, а фиолетовый — сильнее всего.",
        factEn: "Red light is bent the least, while violet light is bent the most."
    },
    {
        term: "Давление",
        termEn: "Pressure",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: false,
        formula: "p = \\frac{F}{S}",
        variables: [
            { symbol: "F", name: "Сила", nameEn: "Force", desc: "Сила, давящая на поверхность.", descEn: "The force pressing down on the surface." },
            { symbol: "S", name: "Площадь", nameEn: "Area", desc: "Площадь, на которую распределяется сила.", descEn: "The area over which the force is distributed." }
        ],
        definitionScientific: "Физическая величина, численно равная силе, действующей на единицу площади поверхности перпендикулярно этой поверхности.",
        definitionScientificEn: "A physical quantity equal to the force applied perpendicular to the surface of an object per unit area.",
        definitionSimple: "Это то, насколько сильно сила «вдавливается» в поверхность. Если наступить кому-то на ногу кроссовком — больно, а если шпилькой (где площадь крошечная, а давление гигантское) — очень больно!",
        definitionSimpleEn: "It is how hard a force 'presses' into a surface. Stepping on someone's foot with a sneaker hurts, but stepping with a stiletto heel (tiny area, massive pressure) hurts a lot!",
        fact: "На дне Марианской впадины давление воды такое сильное, что оно равно весу слона, стоящего на вашем ногте.",
        factEn: "At the bottom of the Mariana Trench, water pressure is so strong it equals the weight of an elephant standing on your fingernail."
    },
    {
        term: "Динамика",
        termEn: "Dynamics",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: false,
        formula: "\\vec{F} = m\\vec{a}",
        variables: [
            { symbol: "\\vec{F}", name: "Сила", nameEn: "Force", desc: "Равнодействующая всех сил, приложенных к телу.", descEn: "The net force applied to the body." },
            { symbol: "\\vec{a}", name: "Ускорение", nameEn: "Acceleration", desc: "Ускорение, приобретаемое телом.", descEn: "The acceleration acquired by the body." }
        ],
        definitionScientific: "Раздел классической механики, изучающий причины изменения механического движения тел. В её основе лежат три закона Ньютона.",
        definitionScientificEn: "The branch of classical mechanics concerned with the study of forces and their effects on motion, primarily based on Newton's laws.",
        definitionSimple: "Наука о том, почему вещи двигаются! Она объясняет, как сильно нужно пнуть мяч, чтобы он улетел в ворота, и почему ракета летит вверх, выбрасывая огонь вниз.",
        definitionSimpleEn: "The science of why things move! It explains how hard to kick a ball into the goal, and why a rocket flies up by shooting fire down.",
        fact: "Динамика была основана сэром Исааком Ньютоном более 300 лет назад, и её формул до сих пор хватает, чтобы запускать космические корабли.",
        factEn: "Dynamics was established by Sir Isaac Newton over 300 years ago, and its formulas are still enough to launch spacecraft today."
    },

    // Е
    {
        term: "Емкость (электрическая)",
        termEn: "Capacitance",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: false,
        formula: "C = \\frac{q}{U}",
        variables: [
            { symbol: "C", name: "Емкость", nameEn: "Capacitance", desc: "Измеряется в Фарадах (Ф).", descEn: "Measured in Farads (F)." },
            { symbol: "q", name: "Заряд", nameEn: "Charge", desc: "Накопленный на обкладках заряд.", descEn: "The charge accumulated on the plates." }
        ],
        definitionScientific: "Характеристика проводника или системы проводников, мера способности накапливать электрический заряд при заданном напряжении.",
        definitionScientificEn: "The ability of a system of electrical conductors and insulators to store electric charge at a given voltage.",
        definitionSimple: "Электрическое ведёрко! Это способность детали (например, конденсатора) накапливать внутри себя электричество, чтобы потом мгновенно отдать его, как во вспышке фотоаппарата.",
        definitionSimpleEn: "An electric bucket! It is the ability of a component (like a capacitor) to store electricity inside itself, and then instantly release it, like a camera flash.",
        fact: "Емкость всей планеты Земля составляет около 0.7 миллифарад — это очень мало по меркам современной радиоэлектроники.",
        factEn: "The capacitance of the entire Earth is about 0.7 millifarads—which is very small by modern electronics standards."
    },

    // Ж
    {
        term: "Жизнь",
        termEn: "Life",
        category: "Алхимия",
        categoryEn: "Alchemy",
        isPopular: true,
        formula: "\\text{ДНК}",
        variables: [
            { symbol: "\\text{ДНК}", name: "ДНК", nameEn: "DNA", desc: "Главный носитель биологической информации в клетках.", descEn: "The main carrier of biological information in cells." }
        ],
        definitionScientific: "Активная форма существования высокомолекулярных органических структур, характеризующаяся обменом веществ, гомеостазом и способностью к адаптации.",
        definitionScientificEn: "An active form of existence of high-molecular organic structures characterized by metabolism, homeostasis, and the capacity for adaptation.",
        definitionSimple: "Удивительный процесс, превращающий холодные наборы атомов в бегающих, думающих, дышащих и развивающихся существ.",
        definitionSimpleEn: "An amazing process that turns cold sets of atoms into running, thinking, breathing, and evolving beings.",
        firstAppearance: "Зародилась около 4 миллиардов лет назад в горячих гидротермальных источниках на дне первобытного океана.",
        firstAppearanceEn: "Originated about 4 billion years ago in hot hydrothermal vents at the bottom of the primordial ocean.",
        howToGet: "Синтезировать в лаборатории пока не удалось, но эволюция отлично справляется.",
        howToGetEn: "Synthesizing it in a lab hasn't succeeded yet, but evolution does an excellent job."
    },
    {
        term: "Железо",
        termEn: "Iron",
        category: "Алхимия",
        categoryEn: "Alchemy",
        isPopular: false,
        formula: "Fe",
        variables: [
            { symbol: "Fe", name: "Феррум", nameEn: "Ferrum", desc: "Переходный металл восьмой группы.", descEn: "A transition metal in group 8." }
        ],
        definitionScientific: "Химический элемент 8-й группы, атомный номер 26. Является основным компонентом ядра планеты Земля и важнейшим металлом цивилизации.",
        definitionScientificEn: "A chemical element of group 8, atomic number 26. It is the primary component of Earth's core and the most important metal of civilization.",
        definitionSimple: "Самый полезный металл в мире. Из него делают гвозди, машины, мосты, а ещё именно железо делает твою кровь красной!",
        definitionSimpleEn: "The most useful metal in the world. Nails, cars, and bridges are made from it, and it's also what makes your blood red!",
        firstAppearance: "Железо — это «пепел» погибших звёзд. Оно синтезируется в их ядрах прямо перед тем, как звезда взрывается сверхновой.",
        firstAppearanceEn: "Iron is the 'ash' of dead stars. It is synthesized in their cores right before the star explodes in a supernova.",
        howToGet: "Добывают из руды в огромных доменных печах при температуре 1500 градусов.",
        howToGetEn: "Extracted from ore in massive blast furnaces at temperatures of 1500 degrees Celsius."
    },
    {
        term: "Желтый карлик",
        termEn: "Yellow Dwarf",
        category: "Космос",
        categoryEn: "Space",
        isPopular: false,
        formula: "T \\approx 5000-6000 \\text{ K}",
        variables: [
            { symbol: "T", name: "Температура", nameEn: "Temperature", desc: "Температура поверхности (фотосферы) звезды.", descEn: "Surface (photosphere) temperature of the star." }
        ],
        definitionScientific: "Класс звезд главной последовательности, имеющих массу от 0.8 до 1.2 массы Солнца. Спектральный класс G.",
        definitionScientificEn: "A class of main-sequence stars with a mass between 0.8 and 1.2 solar masses. Spectral class G.",
        definitionSimple: "Обычная, ничем не примечательная, спокойная средняя звезда. Наше Солнце — типичный желтый карлик.",
        definitionSimpleEn: "An ordinary, unremarkable, quiet average star. Our Sun is a typical yellow dwarf.",
        fact: "Желтые карлики живут около 10 миллиардов лет. Наше Солнце сейчас находится ровно в середине своей жизни.",
        factEn: "Yellow dwarfs live for about 10 billion years. Our Sun is currently exactly in the middle of its lifespan."
    },

    // З
    {
        term: "Земля",
        termEn: "Earth",
        category: "Космос",
        categoryEn: "Space",
        isPopular: true,
        formula: "M_\\oplus \\approx 5.97 \\times 10^{24} \\text{ кг}",
        variables: [
            { symbol: "M_\\oplus", name: "Масса Земли", nameEn: "Earth Mass", desc: "Фундаментальная астрономическая масса нашей планеты.", descEn: "The fundamental astronomical mass of our planet." }
        ],
        definitionScientific: "Третья от Солнца планета Солнечной системы. Самая плотная, пятая по диаметру и массе среди всех планет и крупнейшая среди планет земной группы.",
        definitionScientificEn: "The third planet from the Sun. The densest and fifth-largest by diameter and mass among all planets, and the largest among terrestrial planets.",
        definitionSimple: "Наш космический корабль, летящий сквозь холодную пустоту. Единственное известное нам место во всей Вселенной, где есть вода, кислород, интернет и котики.",
        definitionSimpleEn: "Our spaceship flying through the cold void. The only known place in the entire Universe that has water, oxygen, the internet, and cats.",
        fact: "Земля на самом деле не круглый шар, а геоид — она немного сплюснута с полюсов из-за постоянного вращения.",
        factEn: "Earth is not a perfect sphere, but a geoid—it is slightly flattened at the poles due to its constant rotation."
    },
    {
        term: "Звезда",
        termEn: "Star",
        category: "Космос",
        categoryEn: "Space",
        isPopular: true,
        formula: "E = mc^2",
        variables: [
            { symbol: "E", name: "Энергия", nameEn: "Energy", desc: "Энергия, высвобождаемая при термоядерном синтезе в ядре.", descEn: "Energy released by thermonuclear fusion in the core." }
        ],
        definitionScientific: "Массивный газовый шар, излучающий свет и удерживаемый в состоянии равновесия силами собственной гравитации и внутренним давлением, в недрах которого происходят реакции термоядерного синтеза.",
        definitionScientificEn: "A massive, luminous sphere of plasma held in equilibrium by its own gravity and internal pressure, fueled by thermonuclear fusion in its core.",
        definitionSimple: "Гигантский кипящий космический реактор. Звезды настолько огромные, что их собственная гравитация сжимает газ в центре до такой степени, что он вспыхивает атомным огнём.",
        definitionSimpleEn: "A gigantic boiling cosmic reactor. Stars are so huge that their own gravity compresses gas in the center until it ignites with atomic fire.",
        fact: "Звезды не мерцают. Нам кажется, что они мигают, потому что их свет проходит через дрожащий земной воздух.",
        factEn: "Stars do not twinkle. They appear to blink to us because their light passes through Earth's turbulent atmosphere."
    },
    {
        term: "Звук",
        termEn: "Sound",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "v \\approx 343 \\text{ м/с}",
        variables: [
            { symbol: "v", name: "Скорость звука", nameEn: "Speed of Sound", desc: "Скорость распространения звуковой волны в воздухе (при 20°C).", descEn: "Speed of sound wave propagation in air (at 20°C)." }
        ],
        definitionScientific: "Физическое явление, представляющее собой распространение в виде упругих волн механических колебаний в твёрдой, жидкой или газообразной среде.",
        definitionScientificEn: "A physical phenomenon consisting of the propagation of mechanical vibrations as elastic waves through a solid, liquid, or gaseous medium.",
        definitionSimple: "Дрожь воздуха, которая бьет тебе по ушам! Звук — это когда молекулы толкают друг друга по цепочке, пока этот толчок не доберется до твоей барабанной перепонки.",
        definitionSimpleEn: "Air vibrations hitting your ears! Sound is when molecules push each other in a chain reaction until the push reaches your eardrum.",
        fact: "В космосе нет воздуха, поэтому там стоит абсолютная, звенящая тишина. Звездные войны без звуковых эффектов были бы очень скучными!",
        factEn: "There is no air in space, so there is absolute, deafening silence. Star Wars without sound effects would be very boring!"
    },
    {
        term: "Золото",
        termEn: "Gold",
        category: "Алхимия",
        categoryEn: "Alchemy",
        isPopular: false,
        formula: "Au",
        variables: [
            { symbol: "Au", name: "Аурум", nameEn: "Aurum", desc: "Благородный тяжелый металл 11-й группы.", descEn: "A noble heavy metal in group 11." }
        ],
        definitionScientific: "Элемент 11 группы, атомный номер 79. Благородный металл желтого цвета, обладающий высокой ковкостью, теплопроводностью и химической инертностью.",
        definitionScientificEn: "A chemical element of group 11, atomic number 79. A yellow noble metal known for its high malleability, thermal conductivity, and chemical inertness.",
        definitionSimple: "Блестящий, мягкий и невероятно тяжелый металл, который никогда не ржавеет. Главная мечта всех алхимиков древности.",
        definitionSimpleEn: "A shiny, soft, and incredibly heavy metal that never rusts. The main dream of all ancient alchemists.",
        firstAppearance: "Золото рождается только в самых экстремальных космических катастрофах — при столкновении мертвых нейтронных звёзд.",
        firstAppearanceEn: "Gold is born only in the most extreme cosmic catastrophes—during the collision of dead neutron stars.",
        howToGet: "Добывают на рудниках или вымывают из речного песка.",
        howToGetEn: "Mined in shafts or panned from river sand."
    },

    // И
    {
        term: "Излучение",
        termEn: "Radiation",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: false,
        formula: "E = h \\nu",
        variables: [
            { symbol: "E", name: "Энергия фотона", nameEn: "Photon Energy", desc: "Зависит от частоты излучения.", descEn: "Depends on the frequency of radiation." }
        ],
        definitionScientific: "Процесс испускания и распространения энергии в виде электромагнитных волн или потока элементарных частиц.",
        definitionScientificEn: "The emission and propagation of energy in the form of electromagnetic waves or a stream of elementary particles.",
        definitionSimple: "Энергия, которая летит сквозь пространство. Свет лампочки, тепло от батареи, сигналы Wi-Fi и рентген в больнице — всё это разные виды излучения.",
        definitionSimpleEn: "Energy flying through space. The light from a bulb, heat from a radiator, Wi-Fi signals, and hospital X-rays—all are different forms of radiation.",
        fact: "Даже твоё тело прямо сейчас светится, испуская невидимое инфракрасное тепловое излучение.",
        factEn: "Even your body is glowing right now, emitting invisible infrared thermal radiation."
    },
    {
        term: "Инерция",
        termEn: "Inertia",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: false,
        formula: "\\sum \\vec{F} = 0 \\implies \\vec{v} = \\text{const}",
        variables: [
            { symbol: "\\vec{v}", name: "Вектор скорости", nameEn: "Velocity Vector", desc: "Скорость остается постоянной при отсутствии сил.", descEn: "Velocity remains constant in the absence of forces." }
        ],
        definitionScientific: "Свойство тел оставаться в некоторых системах отсчёта в состоянии покоя или равномерного прямолинейного движения в отсутствие внешних воздействий (Первый закон Ньютона).",
        definitionScientificEn: "The resistance of any physical object to any change in its velocity, including changes to the object's speed or direction of motion (Newton's First Law).",
        definitionSimple: "Космическая лень! Если вещь стоит, она не хочет двигаться. Если летит — не хочет останавливаться. Из-за инерции ты падаешь вперед, когда автобус резко тормозит.",
        definitionSimpleEn: "Cosmic laziness! If a thing is still, it doesn't want to move. If it's flying, it doesn't want to stop. Because of inertia, you fall forward when a bus suddenly brakes.",
        fact: "В космосе брошенный камень будет лететь по прямой с одной и той же скоростью вечно, пока не врежется в планету или звезду.",
        factEn: "In space, a thrown rock will fly in a straight line at the same speed forever until it crashes into a planet or a star."
    },
    {
        term: "Изотоп",
        termEn: "Isotope",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: false,
        formula: "^{A}_{Z}\\text{X}",
        variables: [
            { symbol: "A", name: "Массовое число", nameEn: "Mass Number", desc: "Сумма протонов и нейтронов в ядре.", descEn: "The sum of protons and neutrons in the nucleus." },
            { symbol: "Z", name: "Зарядовое число", nameEn: "Atomic Number", desc: "Определяет химический элемент.", descEn: "Defines the chemical element." }
        ],
        definitionScientific: "Разновидности атомов одного и того же химического элемента, имеющие одинаковый атомный номер (число протонов), но разные массовые числа (число нейтронов).",
        definitionScientificEn: "Variants of a particular chemical element which differ in neutron number, and consequently in nucleon number, but share the same number of protons.",
        definitionSimple: "Братья-близнецы атомов! Они ведут себя в химии абсолютно одинаково, но одни из них «толстые» (в ядре больше нейтронов), а другие «худые».",
        definitionSimpleEn: "Twin brothers of atoms! They behave exactly the same chemically, but some are 'fat' (more neutrons in the nucleus) while others are 'skinny'.",
        fact: "Некоторые «толстые» изотопы не выдерживают своего веса и разваливаются, создавая радиацию.",
        factEn: "Some 'fat' isotopes cannot support their own weight and fall apart, creating radiation."
    },

    // К
    {
        term: "Квантовый скачок",
        termEn: "Quantum Leap",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: false,
        formula: "\\Delta E = E_2 - E_1",
        variables: [
            { symbol: "\\Delta E", name: "Разница энергий", nameEn: "Energy Difference", desc: "Энергия, выделяемая или поглощаемая при переходе электрона.", descEn: "Energy released or absorbed during an electron transition." }
        ],
        definitionScientific: "Мгновенный переход квантовой системы (например, электрона в атоме) из одного стационарного энергетического состояния в другое.",
        definitionScientificEn: "An instantaneous transition of a quantum system (like an electron in an atom) from one stationary energy state to another.",
        definitionSimple: "Мгновенная телепортация электрона внутри атома! Электрон не может плавно перелететь на другую орбиту — он исчезает в одном месте и тут же появляется в другом.",
        definitionSimpleEn: "Instant teleportation of an electron inside an atom! An electron can't smoothly glide to another orbit—it disappears in one place and instantly appears in another.",
        fact: "Словосочетание «квантовый скачок» в быту означает гигантский рывок, но в физике это самое микроскопическое изменение во Вселенной.",
        factEn: "In everyday language, a 'quantum leap' means a huge breakthrough, but in physics, it's the most microscopic change in the Universe."
    },
    {
        term: "Квазар",
        termEn: "Quasar",
        category: "Космос",
        categoryEn: "Space",
        isPopular: true,
        formula: "L \\approx 10^{40} \\text{ Вт}",
        variables: [
            { symbol: "L", name: "Светимость", nameEn: "Luminosity", desc: "Общая излучаемая мощность квазара, превосходящая галактическую.", descEn: "Total radiated power of the quasar, exceeding galactic levels." }
        ],
        definitionScientific: "Сверхъяркое ядро далекой галактики на ранней стадии формирования, в центре которого находится гигантская сверхмассивная черная дыра, активно поглощающая материю.",
        definitionScientificEn: "An extremely luminous active galactic nucleus containing a supermassive black hole surrounded by a gaseous accretion disk.",
        definitionSimple: "Самый мощный космический прожектор! Черная дыра пожирает газ с такой дикой скоростью, что он разогревается до триллионов градусов и светит ярче тысяч галактик.",
        definitionSimpleEn: "The most powerful cosmic spotlight! A black hole devours gas at such a frantic rate that it heats up to trillions of degrees, shining brighter than thousands of galaxies.",
        fact: "Из-за того, что они так далеко, свет от них летел к нам миллиарды лет — мы видим их такими, какими они были на заре времен.",
        factEn: "Because they are so far away, their light took billions of years to reach us—we see them as they were at the dawn of time."
    },
    {
        term: "Комета",
        termEn: "Comet",
        category: "Космос",
        categoryEn: "Space",
        isPopular: false,
        formula: "v \\propto \\sqrt{\\frac{GM}{r}}",
        variables: [
            { symbol: "v", name: "Скорость", nameEn: "Velocity", desc: "Скорость движения кометы по вытянутой эллиптической орбите.", descEn: "Velocity of the comet along its elongated elliptical orbit." }
        ],
        definitionScientific: "Небольшое небесное тело, вращающееся вокруг Солнца по весьма вытянутой орбите. При приближении к Солнцу образует кому и хвост из газа и пыли.",
        definitionScientificEn: "An icy small Solar System body that, when passing close to the Sun, warms and begins to release gases, producing a visible atmosphere or coma, and sometimes a tail.",
        definitionSimple: "Космическая грязная снежка. Огромный кусок льда и камней. Подлетая к Солнцу, лед начинает кипеть, и за кометой вытягивается роскошный светящийся хвост.",
        definitionSimpleEn: "A dirty cosmic snowball. A giant chunk of ice and rock. As it approaches the Sun, the ice boils, and a magnificent glowing tail stretches behind it.",
        fact: "Хвост кометы всегда направлен строго от Солнца, потому что его сдувает солнечный ветер.",
        factEn: "A comet's tail always points strictly away from the Sun, because it is blown away by the solar wind."
    },
    {
        term: "Кварк",
        termEn: "Quark",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: false,
        formula: "q = +\\frac{2}{3}e \\text{ или } -\\frac{1}{3}e",
        variables: [
            { symbol: "q", name: "Дробный заряд", nameEn: "Fractional Charge", desc: "Кварки имеют уникальный дробный электрический заряд.", descEn: "Quarks have a unique fractional electric charge." }
        ],
        definitionScientific: "Фундаментальная частица в Стандартной модели, не имеющая внутренней структуры. Кварки объединяются в адроны (например, протоны и нейтроны) сильным взаимодействием.",
        definitionScientificEn: "A fundamental particle in the Standard Model, possessing no inner structure. Quarks combine to form hadrons, such as protons and neutrons, via the strong interaction.",
        definitionSimple: "Самая-самая крошечная деталька лего в природе. Именно из трёх таких кварков слеплен каждый протон и нейтрон в твоём теле.",
        definitionSimpleEn: "The absolute smallest Lego piece in nature. Every proton and neutron in your body is built from exactly three such quarks.",
        fact: "Кварки невозможно вытащить по одному. Если попытаться оторвать один кварк, энергия отрыва создаст из пустоты новую пару кварков!",
        factEn: "Quarks cannot be isolated. If you try to pull a quark away, the energy used will spontaneously create a new pair of quarks from the vacuum!"
    },
    {
        term: "Кинетическая энергия",
        termEn: "Kinetic Energy",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "E_k = \\frac{mv^2}{2}",
        variables: [
            { symbol: "m", name: "Масса", nameEn: "Mass", desc: "Масса движущегося объекта.", descEn: "Mass of the moving object." },
            { symbol: "v", name: "Скорость", nameEn: "Velocity", desc: "Скорость объекта (в квадрате).", descEn: "Velocity of the object (squared)." }
        ],
        definitionScientific: "Скалярная функция, являющаяся мерой движения материальных точек, образующих рассматриваемую механическую систему. Равна работе, которую необходимо совершить, чтобы сообщить телу заданную скорость.",
        definitionScientificEn: "A scalar function representing the energy an object possesses due to its motion. It equals the work needed to accelerate a body from rest to its stated velocity.",
        definitionSimple: "Энергия движения! Чем тяжелее вещь и чем быстрее она летит, тем больше в ней прячется кинетической энергии (и тем больнее она ударит при столкновении).",
        definitionSimpleEn: "The energy of motion! The heavier the object and the faster it flies, the more kinetic energy hides inside it (and the harder it hits on impact).",
        fact: "Так как скорость в формуле возводится в квадрат, машина на скорости 100 км/ч имеет в 4 раза больше кинетической энергии (и тормозного пути), чем на 50 км/ч.",
        factEn: "Since velocity is squared in the formula, a car traveling at 100 km/h has 4 times more kinetic energy (and braking distance) than at 50 km/h."
    },
    {
        term: "Кристалл",
        termEn: "Crystal",
        category: "Алхимия",
        categoryEn: "Alchemy",
        isPopular: false,
        formula: "\\text{Решётка}",
        variables: [
            { symbol: "\\text{Решётка}", name: "Кристаллическая решетка", nameEn: "Crystal Lattice", desc: "Строгий геометрический порядок атомов.", descEn: "A strict geometric arrangement of atoms." }
        ],
        definitionScientific: "Твердое тело, в котором атомы расположены строго закономерно, образуя трёхмерную периодическую пространственную укладку — кристаллическую решетку.",
        definitionScientificEn: "A solid material whose constituents are arranged in a highly ordered microscopic structure, forming a crystal lattice that extends in all directions.",
        definitionSimple: "Идеально ровная постройка из атомов. В отличие от стекла, где атомы навалены кучей, в кристалле (алмазе, соли, снежинке) атомы стоят стройными солдатскими рядами.",
        definitionSimpleEn: "A perfectly straight building made of atoms. Unlike glass, where atoms are piled in a mess, atoms in a crystal (like diamond, salt, or snowflake) stand in neat soldierly rows.",
        firstAppearance: "Встречается повсеместно — от снежинок в облаках до гигантских аметистовых пещер под землей.",
        firstAppearanceEn: "Found everywhere—from snowflakes in the clouds to gigantic subterranean amethyst geodes.",
        howToGet: "Медленно охладить расплавленный металл или выпарить перенасыщенный солевой раствор.",
        howToGetEn: "Slowly cool molten metal or evaporate a supersaturated salt solution."
    },

    // Л
    {
        term: "Лазер",
        termEn: "Laser",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "E = h\\nu",
        variables: [
            { symbol: "\\nu", name: "Частота", nameEn: "Frequency", desc: "Частота когерентного излучения лазера.", descEn: "Frequency of the laser's coherent radiation." }
        ],
        definitionScientific: "Устройство, преобразующее энергию накачки в когерентный, монохроматический, поляризованный и узконаправленный поток электромагнитного излучения (вынужденное излучение).",
        definitionScientificEn: "A device that emits light through a process of optical amplification based on the stimulated emission of electromagnetic radiation.",
        definitionSimple: "Идеальный луч света! В отличие от обычной лампочки, которая светит во все стороны всеми цветами, лазер стреляет строго в одну точку фотонами одного цвета, летящими «в ногу».",
        definitionSimpleEn: "The perfect light beam! Unlike a regular light bulb that shines in all directions with all colors, a laser shoots straight to one point with identically colored photons marching 'in step'.",
        fact: "Название LASER — это аббревиатура от «Усиление света методом вынужденного излучения» на английском языке.",
        factEn: "The name LASER is an acronym for 'Light Amplification by Stimulated Emission of Radiation'."
    },
    {
        term: "Линза",
        termEn: "Lens",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "\\frac{1}{F} = \\frac{1}{d} + \\frac{1}{f}",
        variables: [
            { symbol: "F", name: "Фокусное расстояние", nameEn: "Focal Length", desc: "Точка, где собираются лучи.", descEn: "The point where rays converge." }
        ],
        definitionScientific: "Оптическая деталь из прозрачного материала, ограниченная двумя преломляющими поверхностями, способная формировать оптические изображения предметов.",
        definitionScientificEn: "A transmissive optical device that focuses or disperses a light beam by means of refraction to form optical images of objects.",
        definitionSimple: "Изогнутое стекло, которое умеет управлять светом. Собирающая линза (лупа) сводит лучи в одну горячую точку, а рассеивающая — раскидывает их в стороны.",
        definitionSimpleEn: "Curved glass that controls light. A converging lens (magnifying glass) focuses rays into a single hot point, while a diverging lens scatters them apart.",
        fact: "Хрусталик в твоем глазу — это живая линза, которая умеет менять свою кривизну, чтобы наводить фокус на близкие или далёкие предметы.",
        factEn: "The crystalline lens in your eye is a living lens that can change its curvature to focus on near or distant objects."
    },
    {
        term: "Луна",
        termEn: "Moon",
        category: "Космос",
        categoryEn: "Space",
        isPopular: true,
        formula: "g \\approx 1.62 \\text{ м/с}^2",
        variables: [
            { symbol: "g", name: "Гравитация", nameEn: "Gravity", desc: "Ускорение свободного падения на Луне (в 6 раз слабее земного).", descEn: "Gravitational acceleration on the Moon (6 times weaker than Earth's)." }
        ],
        definitionScientific: "Естественный спутник Земли. Второй по яркости объект на земном небосводе. Является единственным астрономическим объектом вне Земли, на котором побывал человек.",
        definitionScientificEn: "Earth's only natural satellite. The second brightest object in the sky after the Sun. It is the only celestial body beyond Earth visited by humans.",
        definitionSimple: "Холодный каменистый шар, вращающийся вокруг нашей планеты. Светится ночью только потому, что отражает свет Солнца, как зеркало.",
        definitionSimpleEn: "A cold rocky sphere orbiting our planet. It glows at night only because it reflects the Sun's light like a mirror.",
        fact: "Луна образовалась миллиарды лет назад, когда огромная планета размером с Марс на огромной скорости врезалась в молодую Землю.",
        factEn: "The Moon formed billions of years ago when a Mars-sized planet slammed into the young Earth at tremendous speed."
    },

    // М
    {
        term: "Металл",
        termEn: "Metal",
        category: "Алхимия",
        categoryEn: "Alchemy",
        isPopular: false,
        formula: "Fe, \\ Al, \\ Cu",
        variables: [
            { symbol: "Fe", name: "Железо", nameEn: "Iron", desc: "Один из важнейших промышленных металлов.", descEn: "One of the most important industrial metals." }
        ],
        definitionScientific: "Группа элементов, обладающих характерными металлическими свойствами: высокой тепло- и электропроводностью, ковкостью и специфическим блеском, обусловленным свободными электронами.",
        definitionScientificEn: "A group of elements characterized by high thermal and electrical conductivity, malleability, and specific luster due to free electrons.",
        definitionSimple: "Блестящие, прочные и холодные на ощупь материалы. Из них делают всё: от машин до микросхем, потому что они отлично проводят электрический ток.",
        definitionSimpleEn: "Shiny, strong, cold-to-the-touch materials. Everything from cars to microchips is made from them because they conduct electricity perfectly.",
        firstAppearance: "Тяжёлые металлы рождаются только в недрах гигантских звёзд и разлетаются по космосу при их мощных взрывах.",
        firstAppearanceEn: "Heavy metals are born only deep inside giant stars and are scattered across the cosmos in massive stellar explosions.",
        howToGet: "Выплавить из руды в сверхгорячей доменной печи.",
        howToGetEn: "Smelted from ore in a super-hot blast furnace."
    },
    {
        term: "Масса",
        termEn: "Mass",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "m = \\frac{\\vec{F}}{\\vec{a}}",
        variables: [
            { symbol: "m", name: "Инертная масса", nameEn: "Inertial Mass", desc: "Мера сопротивления тела изменению его скорости.", descEn: "A measure of a body's resistance to a change in its velocity." }
        ],
        definitionScientific: "Фундаментальная физическая величина, определяющая гравитационное взаимодействие тела и его инертные свойства.",
        definitionScientificEn: "A fundamental physical property determining an object's gravitational interaction and its inertial characteristics.",
        definitionSimple: "Количество вещества в предмете! Это то, насколько тяжело сдвинуть предмет с места или остановить его. Масса пушечного ядра огромна, а воздушного шарика — крошечна.",
        definitionSimpleEn: "The amount of stuff in an object! It's how hard it is to move or stop the object. The mass of a cannonball is huge, but a balloon's mass is tiny.",
        fact: "Вес и масса — разные вещи! Твой вес на Луне будет в 6 раз меньше, но твоя масса останется точно такой же.",
        factEn: "Weight and mass are different! Your weight on the Moon would be 6 times less, but your mass would remain exactly the same."
    },
    {
        term: "Молекула",
        termEn: "Molecule",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: false,
        formula: "H_2O, \\ CO_2",
        variables: [
            { symbol: "H_2O", name: "Молекула воды", nameEn: "Water Molecule", desc: "Связанные атомы кислорода и водорода.", descEn: "Bonded oxygen and hydrogen atoms." }
        ],
        definitionScientific: "Электрически нейтральная частица, образованная из двух или более связанных ковалентными связями атомов. Является наименьшей частицей вещества, обладающей его химическими свойствами.",
        definitionScientificEn: "An electrically neutral group of two or more atoms held together by chemical bonds. It is the smallest fundamental unit of a chemical compound.",
        definitionSimple: "Конструктор из атомов. Атомы редко живут поодиночке, они предпочитают браться за руки (химические связи) и образовывать сложные молекулы, такие как вода или сахар.",
        definitionSimpleEn: "A Lego structure made of atoms. Atoms rarely live alone; they prefer holding hands (chemical bonds) to form complex molecules like water or sugar.",
        fact: "В одном стакане воды молекул больше, чем стаканов воды во всех океанах Земли.",
        factEn: "There are more molecules in a single glass of water than there are glasses of water in all of Earth's oceans."
    },
    {
        term: "Магнитное поле",
        termEn: "Magnetic Field",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "\\vec{F} = q[\\vec{v} \\times \\vec{B}]",
        variables: [
            { symbol: "\\vec{B}", name: "Вектор магнитной индукции", nameEn: "Magnetic Induction Vector", desc: "Силовая характеристика магнитного поля.", descEn: "The force characteristic of the magnetic field." }
        ],
        definitionScientific: "Особый вид материи, посредством которого осуществляется взаимодействие между движущимися электрически заряженными частицами или телами, обладающими магнитным моментом.",
        definitionScientificEn: "A vector field that describes the magnetic influence on moving electric charges, electric currents, and magnetic materials.",
        definitionSimple: "Невидимое силовое поле, которое заставляет магнитики липнуть к холодильнику. Земля тоже является гигантским магнитом, поэтому стрелка компаса всегда смотрит на север.",
        definitionSimpleEn: "An invisible force field that makes magnets stick to your fridge. The Earth is also a giant magnet, which is why a compass needle always points north.",
        fact: "Магнитное поле Земли — это наш главный щит. Без него смертельный солнечный ветер давно бы сдул нашу атмосферу в космос.",
        factEn: "Earth's magnetic field is our ultimate shield. Without it, deadly solar wind would have blown our atmosphere into space long ago."
    },

    // Н
    {
        term: "Нейтрон",
        termEn: "Neutron",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "m_n \\approx 1.008 \\text{ а.е.м.}",
        variables: [
            { symbol: "m_n", name: "Масса нейтрона", nameEn: "Neutron Mass", desc: "Нейтрон чуть-чуть тяжелее протона.", descEn: "The neutron is slightly heavier than a proton." }
        ],
        definitionScientific: "Тяжёлая элементарная частица, не имеющая электрического заряда (нейтральная). Вместе с протонами образует атомные ядра.",
        definitionScientificEn: "A heavy, uncharged (neutral) subatomic particle. Along with protons, it makes up atomic nuclei.",
        definitionSimple: "Один из двух жителей ядра атома. Он такой же тяжелый, как протон, но у него нет электрического заряда. Нейтроны работают как клей, не давая протонам разлететься в стороны.",
        definitionSimpleEn: "One of the two inhabitants of the atomic nucleus. It is as heavy as a proton but has no electric charge. Neutrons act like glue, keeping the protons from flying apart.",
        fact: "Свободный нейтрон (вне атома) живет всего около 15 минут, после чего распадается на протон, электрон и антинейтрино.",
        factEn: "A free neutron (outside an atom) lives for only about 15 minutes before decaying into a proton, an electron, and an antineutrino."
    },
    {
        term: "Нейтронная звезда",
        termEn: "Neutron Star",
        category: "Космос",
        categoryEn: "Space",
        isPopular: false,
        formula: "R \\approx 10 \\text{ км}, \\ M \\approx 1.4 M_\\odot",
        variables: [
            { symbol: "R", name: "Радиус", nameEn: "Radius", desc: "Ультрамалый радиус при огромной массе.", descEn: "Ultra-small radius combined with enormous mass." }
        ],
        definitionScientific: "Сверхплотная космическая структура, образовавшаяся в результате вспышки сверхновой. Состоит практически полностью из нейтронов, сжатых гравитацией до ядерной плотности.",
        definitionScientificEn: "An ultra-dense stellar remnant formed by a supernova explosion. It consists almost entirely of neutrons compressed by gravity to nuclear density.",
        definitionSimple: "Бывшее ядро мертвой звезды, сжатое в шарик размером с небольшой город. Она настолько плотная, что электроны вдавились в протоны, превратившись в сплошной комок нейтронов.",
        definitionSimpleEn: "The former core of a dead star, crushed into a sphere the size of a small city. It is so dense that electrons were squeezed into protons, turning the whole mass into neutrons.",
        fact: "Одна чайная ложка вещества нейтронной звезды весит миллиард тонн — как гора Эверест.",
        factEn: "One teaspoon of neutron star material weighs a billion tons—as much as Mount Everest."
    },
    {
        term: "Напряжение",
        termEn: "Voltage",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "U = I \\cdot R",
        variables: [
            { symbol: "U", name: "Напряжение", nameEn: "Voltage", desc: "Измеряется в Вольтах (В).", descEn: "Measured in Volts (V)." },
            { symbol: "I", name: "Сила тока", nameEn: "Current", desc: "Измеряется в Амперах.", descEn: "Measured in Amperes." }
        ],
        definitionScientific: "Физическая величина, равная работе эффективного электрического поля по перемещению единичного заряда из одной точки в другую.",
        definitionScientificEn: "A physical quantity equal to the work done by an effective electric field in moving a unit charge from one point to another.",
        definitionSimple: "Электрический напор! Представь шланг с водой: ток — это количество воды, а напряжение — это давление помпы, которое толкает эту воду вперёд.",
        definitionSimpleEn: "Electrical pressure! Imagine a water hose: the current is the amount of water, and voltage is the water pressure pushing that water forward.",
        fact: "Птицы спокойно сидят на высоковольтных проводах, потому что они не касаются земли. Току просто некуда через них утекать, поэтому их не бьет.",
        factEn: "Birds can safely sit on high-voltage wires because they aren't touching the ground. The current has nowhere to flow through them, so they don't get shocked."
    },

    // О
    {
        term: "Огонь",
        termEn: "Fire",
        category: "Алхимия",
        categoryEn: "Alchemy",
        isPopular: true,
        formula: "C + O_2 \\rightarrow CO_2",
        variables: [
            { symbol: "C", name: "Углерод", nameEn: "Carbon", desc: "Химическая основа органического топлива.", descEn: "The chemical basis of organic fuel." }
        ],
        definitionScientific: "Быстропротекающий процесс интенсивного окисления, сопровождающийся выделением тепла, излучением света и образованием раскаленных газов.",
        definitionScientificEn: "A rapid, intensive oxidation process accompanied by the release of heat, light emission, and the formation of hot gases.",
        definitionSimple: "Горячий светящийся танец газов. Огонь — это не твёрдое вещество, а химический процесс быстрого сгорания топлива в кислороде.",
        definitionSimpleEn: "A hot, glowing dance of gases. Fire isn't a solid substance, but rather the chemical process of fuel burning rapidly in oxygen.",
        firstAppearance: "Появился на Земле вместе с первыми растениями (топливом) и кислородом в атмосфере. Первые лесные пожары зажигали молнии.",
        firstAppearanceEn: "Appeared on Earth along with the first plants (fuel) and atmospheric oxygen. The first forest fires were ignited by lightning.",
        howToGet: "Сильно нагреть горючее вещество (например, дерево трением) в присутствии кислорода.",
        howToGetEn: "Intensely heat a combustible substance (e.g., rubbing wood) in the presence of oxygen."
    },
    {
        term: "Относительность",
        termEn: "Relativity",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "E = mc^2",
        variables: [
            { symbol: "E", name: "Полная энергия", nameEn: "Total Energy", desc: "Энергия, сокрытая внутри массы покоя.", descEn: "The energy concealed within the rest mass." }
        ],
        definitionScientific: "Положение специальной и общей теорий относительности Эйнштейна, перевернувшее ньютоновскую физику. Устанавливает связь массы, энергии и относительность хода времени.",
        definitionScientificEn: "A core principle from Einstein's special and general theories of relativity that revolutionized Newtonian physics, establishing the link between mass, energy, and the relativity of time.",
        definitionSimple: "Теория, которая доказала: время — гибкое! Если ты будешь лететь на ракете почти со скоростью света, время для тебя замедлится. Ты вернешься на Землю молодым, а твои друзья уже состарятся.",
        definitionSimpleEn: "The theory proving that time is flexible! If you fly in a rocket near the speed of light, time slows down for you. You will return to Earth young, while your friends have aged.",
        fact: "Из-за этого эффекта часы на спутниках GPS на орбите идут чуть-чуть быстрее, чем на Земле. Инженерам приходится программно замедлять их!",
        factEn: "Because of this effect, atomic clocks on GPS satellites run slightly faster than those on Earth. Engineers have to program them to run slower!"
    },
    {
        term: "Оптика",
        termEn: "Optics",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "n_1 \\sin\\alpha = n_2 \\sin\\beta",
        variables: [
            { symbol: "n", name: "Показатель преломления", nameEn: "Refractive Index", desc: "Определяет, как сильно среда ломает свет.", descEn: "Determines how strongly a medium bends light." }
        ],
        definitionScientific: "Раздел физики, изучающий свойства и физическую природу света, закономерности его распространения и взаимодействия с веществом.",
        definitionScientificEn: "The branch of physics that studies the behaviour and properties of light, including its interactions with matter and the construction of instruments that use or detect it.",
        definitionSimple: "Наука о свете! Она изучает, как работают зеркала, линзы, почему небо синее, как возникают радуги и как устроены лазеры и наши собственные глаза.",
        definitionSimpleEn: "The science of light! It studies how mirrors and lenses work, why the sky is blue, how rainbows form, and how lasers and our own eyes function.",
        fact: "Если бы наши глаза могли видеть радиоволны или рентген, ночное небо светилось бы так ярко, что мы никогда бы не увидели тьмы.",
        factEn: "If our eyes could see radio waves or X-rays, the night sky would shine so brightly that we would never experience true darkness."
    },
    {
        term: "Орбита",
        termEn: "Orbit",
        category: "Космос",
        categoryEn: "Space",
        isPopular: false,
        formula: "v = \\sqrt{\\frac{GM}{r}}",
        variables: [
            { symbol: "v", name: "Первая космическая скорость", nameEn: "Orbital Velocity", desc: "Скорость, нужная для выхода на круговую орбиту.", descEn: "The speed required to achieve a circular orbit." }
        ],
        definitionScientific: "Траектория движения материальной точки (например, планеты или спутника) в заданном поле тяготения космического тела.",
        definitionScientificEn: "The gravitationally curved trajectory of an object, such as the trajectory of a planet around a star or a natural satellite around a planet.",
        definitionSimple: "Невидимая кольцевая дорога в космосе. Спутник на орбите на самом деле постоянно падает на Землю, но из-за огромной скорости движения вбок он всё время «промахивается» мимо планеты.",
        definitionSimpleEn: "An invisible ring road in space. A satellite in orbit is actually constantly falling towards Earth, but because of its huge sideways speed, it keeps 'missing' the planet.",
        fact: "МКС летит по орбите со скоростью 28 000 км/ч. Космонавты видят рассвет и закат каждые 45 минут.",
        factEn: "The ISS orbits at a speed of 28,000 km/h. Astronauts witness a sunrise and a sunset every 45 minutes."
    },

    // П
    {
        term: "Плазма",
        termEn: "Plasma",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "N_e \\approx N_i",
        variables: [
            { symbol: "N_e", name: "Количество электронов", nameEn: "Electron Count", desc: "Баланс отрицательных электронов и положительных ионов.", descEn: "The balance of negative electrons and positive ions." }
        ],
        definitionScientific: "Четвертое (после твердого, жидкого и газообразного) агрегатное состояние материи. Представляет собой частично или полностью ионизированный газ.",
        definitionScientificEn: "The fourth state of matter (after solid, liquid, and gas). It is a partially or fully ionized gas.",
        definitionSimple: "Супергорячий газовый суп. Если газ нагреть до диких температур, электроны отрываются от атомов. В состоянии плазмы находятся молнии, неоновые вывески и 99% видимой Вселенной (звёзды).",
        definitionSimpleEn: "A super-hot gas soup. When a gas is heated to extreme temperatures, electrons are stripped from their atoms. Lightning, neon signs, and 99% of the visible Universe (stars) are made of plasma.",
        fact: "Пламя обычной зажигалки в самой своей горячей части тоже содержит немного плазмы.",
        factEn: "The hottest part of an ordinary lighter's flame also contains a small amount of plasma."
    },
    {
        term: "Протон",
        termEn: "Proton",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "q = +1e",
        variables: [
            { symbol: "q", name: "Элементарный заряд", nameEn: "Elementary Charge", desc: "Положительный электрический заряд.", descEn: "A positive electrical charge." }
        ],
        definitionScientific: "Стабильная субатомная частица, барион, состоящий из трех кварков (uud). Вместе с нейтронами образует ядра всех атомов. Количество протонов задаёт химический элемент.",
        definitionScientificEn: "A stable subatomic particle, a baryon consisting of three quarks (uud). Along with neutrons, it forms atomic nuclei. The number of protons determines the chemical element.",
        definitionSimple: "Главный босс в ядре атома! У него положительный заряд. Сколько протонов в атоме — такой это и элемент. Один протон — это газ водород, а 79 протонов — это уже золото!",
        definitionSimpleEn: "The big boss in the atomic nucleus! It carries a positive charge. The number of protons decides the element. One proton makes hydrogen gas, while 79 protons make pure gold!",
        fact: "Один протон тяжелее электрона почти в 2000 раз.",
        factEn: "A single proton is nearly 2000 times heavier than an electron."
    },
    {
        term: "Планета",
        termEn: "Planet",
        category: "Космос",
        categoryEn: "Space",
        isPopular: false,
        formula: "M \\gg \\text{астероиды}",
        variables: [
            { symbol: "M", name: "Масса", nameEn: "Mass", desc: "Масса достаточна для формирования круглой формы.", descEn: "Mass sufficient to form a spherical shape due to gravity." }
        ],
        definitionScientific: "Небесное тело, вращающееся по орбите вокруг звезды, достаточно массивное, чтобы стать круглым под действием собственной гравитации, но недостаточно массивное для термоядерных реакций.",
        definitionScientificEn: "An astronomical body orbiting a star that is massive enough to be rounded by its own gravity, but not massive enough to cause thermonuclear fusion.",
        definitionSimple: "Огромный круглый шар из камня или газа, который покорно летает вокруг звезды. В отличие от звезды, планета не умеет светиться сама — она только отражает чужой свет.",
        definitionSimpleEn: "A giant round sphere of rock or gas that obediently orbits a star. Unlike stars, a planet cannot emit its own light—it only reflects light from elsewhere.",
        fact: "Плутон лишили статуса планеты в 2006 году, потому что он слишком мал и не смог расчистить свою орбиту от ледяного космического мусора.",
        factEn: "Pluto was stripped of its planetary status in 2006 because it was too small and failed to clear its orbit of icy space debris."
    },
    {
        term: "Пульсар",
        termEn: "Pulsar",
        category: "Космос",
        categoryEn: "Space",
        isPopular: false,
        formula: "T_p \\approx 1.4 \\text{ мс}",
        variables: [
            { symbol: "T_p", name: "Период вращения", nameEn: "Rotation Period", desc: "Рекордно короткое время одного оборота.", descEn: "A record-breaking short time for a single rotation." }
        ],
        definitionScientific: "Быстро вращающаяся нейтронная звезда, испускающая узконаправленные пучки радиоизлучения с магнитных полюсов.",
        definitionScientificEn: "A highly magnetized rotating neutron star that emits beams of electromagnetic radiation out of its magnetic poles.",
        definitionSimple: "Космический маяк-стробоскоп! Маленькая сверхплотная звезда, которая вращается сотни раз в секунду и «чиркает» по нам лучом радиации, создавая четкий ритм.",
        definitionSimpleEn: "A cosmic strobe lighthouse! A small, ultra-dense star spinning hundreds of times a second, sweeping a radiation beam across us like a ticking clock.",
        fact: "Когда первый пульсар был открыт в 1967 году, учёные назвали его LGM-1 (Little Green Men — маленькие зеленые человечки), думая, что поймали сигнал пришельцев.",
        factEn: "When the first pulsar was discovered in 1967, scientists dubbed it LGM-1 (Little Green Men), thinking they had caught an alien signal."
    },

    // Р
    {
        term: "Радиация",
        termEn: "Radiation",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "\\alpha, \\beta, \\gamma",
        variables: [
            { symbol: "\\gamma", name: "Гамма-излучение", nameEn: "Gamma Radiation", desc: "Самый проникающий вид жесткого излучения.", descEn: "The most penetrating form of hard radiation." }
        ],
        definitionScientific: "Ионизирующее излучение — потоки фотонов и других элементарных частиц, взаимодействие которых со средой приводит к ионизации её атомов и молекул.",
        definitionScientificEn: "Ionizing radiation—streams of photons and other elementary particles whose interaction with matter leads to the ionization of atoms and molecules.",
        definitionSimple: "Невидимые смертоносные «пули». Осколки разваливающихся тяжелых атомов (урана или радия), которые летят с огромной скоростью и могут прошивать наше тело насквозь, ломая молекулы ДНК.",
        definitionSimpleEn: "Invisible deadly 'bullets'. Fragments of decaying heavy atoms (like uranium or radium) flying at massive speeds, capable of piercing our bodies and breaking DNA molecules.",
        fact: "Бананы слегка радиоактивны из-за природного изотопа Калия-40. Но чтобы получить лучевую болезнь, придется съесть 10 миллионов бананов за раз.",
        factEn: "Bananas are slightly radioactive due to the natural isotope Potassium-40. But you'd have to eat 10 million bananas at once to get radiation sickness."
    },
    {
        term: "Резонанс",
        termEn: "Resonance",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: false,
        formula: "f_{\\text{внеш}} = f_{\\text{собст}}",
        variables: [
            { symbol: "f", name: "Частота колебаний", nameEn: "Oscillation Frequency", desc: "Совпадение внешней и внутренней частоты.", descEn: "The match between external and internal frequencies." }
        ],
        definitionScientific: "Явление резкого возрастания амплитуды вынужденных колебаний, которое наступает при приближении частоты внешнего воздействия к некоторым значениям (резонансным частотам).",
        definitionScientificEn: "The phenomenon of a sharp increase in the amplitude of forced oscillations, which occurs when the frequency of an external force approaches the system's natural resonant frequency.",
        definitionSimple: "Раскачка качелей! Если толкать качели строго в тот момент, когда они катятся от тебя, они будут взлетать всё выше. Это и есть резонанс.",
        definitionSimpleEn: "Pumping a swing! If you push a swing exactly when it moves away from you, it goes higher and higher. That is resonance.",
        fact: "Известны случаи, когда мосты обрушались из-за резонанса, если по ним шёл полк солдат, чеканящих шаг ровно в такт с колебаниями моста.",
        factEn: "There are known cases of bridges collapsing due to resonance when a regiment of soldiers marched across them in exact time with the bridge's natural sway."
    },
    {
        term: "Ртуть",
        termEn: "Mercury",
        category: "Алхимия",
        categoryEn: "Alchemy",
        isPopular: true,
        formula: "Hg",
        variables: [
            { symbol: "Hg", name: "Hydrargyrum", nameEn: "Hydrargyrum", desc: "Тяжелый жидкий металл (номер 80).", descEn: "A heavy liquid metal (atomic number 80)." }
        ],
        definitionScientific: "Переходный металл, при комнатной температуре представляющий собой тяжелую серебристо-белую токсичную жидкость.",
        definitionScientificEn: "A transition metal which, at room temperature, is a heavy, silvery-white, toxic liquid.",
        definitionSimple: "Единственный металл, который тает при комнатной температуре. Он тяжелый, выглядит как расплавленное серебро, но его пары смертельно ядовиты.",
        definitionSimpleEn: "The only metal that is liquid at room temperature. It's heavy, looks like molten silver, but its vapors are lethally toxic.",
        firstAppearance: "Выделилась из мантийных растворов в виде минерала киновари в зонах древних вулканов.",
        firstAppearanceEn: "Emerged from mantle solutions as the mineral cinnabar in ancient volcanic zones.",
        howToGet: "Добывается обжигом красного минерала киновари с последующим сбором ртутных капель.",
        howToGetEn: "Extracted by roasting the red mineral cinnabar and then collecting the condensed mercury droplets."
    },

    // С
    {
        term: "Свет",
        termEn: "Light",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "c \\approx 3 \\times 10^8 \\text{ м/с}",
        variables: [
            { symbol: "c", name: "Скорость света", nameEn: "Speed of Light", desc: "Абсолютный космический предел скорости.", descEn: "The absolute cosmic speed limit." }
        ],
        definitionScientific: "В физической оптике — электромагнитное излучение, воспринимаемое человеческим глазом (длины волн от 380 до 780 нм). Проявляет корпускулярно-волновой дуализм.",
        definitionScientificEn: "In physical optics, it is electromagnetic radiation that can be detected by the human eye. It exhibits wave-particle duality.",
        definitionSimple: "Кусочки чистой энергии (фотоны), которые летят сквозь пространство. Свет может вести себя и как частица-мячик, и как морская волна одновременно!",
        definitionSimpleEn: "Pieces of pure energy (photons) flying through space. Light can behave both like a bouncing particle-ball and like an ocean wave at the same time!",
        fact: "Свету требуется 8 минут и 20 секунд, чтобы долететь от Солнца до Земли. Если Солнце внезапно исчезнет, мы узнаем об этом только через 8 минут.",
        factEn: "It takes light 8 minutes and 20 seconds to travel from the Sun to Earth. If the Sun suddenly disappeared, we wouldn't know for over 8 minutes."
    },
    {
        term: "Сверхпроводимость",
        termEn: "Superconductivity",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "R = 0 \\ \\text{Ом}",
        variables: [
            { symbol: "R", name: "Сопротивление", nameEn: "Resistance", desc: "Полное отсутствие сопротивления току.", descEn: "A complete absence of electrical resistance." }
        ],
        definitionScientific: "Свойство некоторых материалов (металлов, керамик) обладать строго нулевым электрическим сопротивлением при охлаждении ниже критической температуры.",
        definitionScientificEn: "A set of physical properties observed in certain materials where electrical resistance vanishes when cooled below a characteristic critical temperature.",
        definitionSimple: "Электрическая магия мороза! Если сильно заморозить некоторые провода (жидким азотом), электричество потечёт по ним вообще без потерь энергии. Ток будет крутиться вечно!",
        definitionSimpleEn: "Electrical frost magic! If you deeply freeze certain wires, electricity flows through them with absolutely zero energy loss. The current will spin forever!",
        fact: "Сверхпроводники выталкивают из себя магнитное поле. Из-за этого можно заставить магнит левитировать (парить в воздухе) над замороженным сверхпроводником.",
        factEn: "Superconductors expel magnetic fields from their interior. Because of this, you can make a magnet levitate (float in mid-air) above a frozen superconductor."
    },
    {
        term: "Сингулярность",
        termEn: "Singularity",
        category: "Космос",
        categoryEn: "Space",
        isPopular: true,
        formula: "\\rho \\rightarrow \\infty",
        variables: [
            { symbol: "\\rho", name: "Плотность", nameEn: "Density", desc: "Плотность материи стремится к бесконечности.", descEn: "The density of matter tends toward infinity." }
        ],
        definitionScientific: "Точка в пространстве-времени, через которую невозможно гладко продолжить геодезическую линию. Место, где кривизна пространства-времени становится бесконечной, а физические законы ломаются.",
        definitionScientificEn: "A point in spacetime through which a geodesic cannot be smoothly extended. A location where spacetime curvature becomes infinite and the laws of physics break down.",
        definitionSimple: "Сердце чёрной дыры или точка Большого взрыва. В сингулярности масса размером с триллионы Солнц сжата в одну математическую точку размером меньше атома. Никто не знает, что происходит внутри.",
        definitionSimpleEn: "The heart of a black hole or the core of the Big Bang. In a singularity, a mass equal to trillions of Suns is crushed into a mathematical point smaller than an atom. Nobody knows what goes on inside.",
        fact: "Наши текущие законы физики просто перестают работать (выдают ошибки и бесконечности), когда пытаются описать сингулярность.",
        factEn: "Our current laws of physics literally break down (producing math errors and infinities) when trying to describe a singularity."
    },

    // Т
    {
        term: "Темная материя",
        termEn: "Dark Matter",
        category: "Космос",
        categoryEn: "Space",
        isPopular: true,
        formula: "\\Omega_c \\approx 27\\%",
        variables: [
            { symbol: "\\Omega_c", name: "Доля в космосе", nameEn: "Cosmic Fraction", desc: "Темная материя составляет около 27% Вселенной.", descEn: "Dark matter makes up about 27% of the Universe." }
        ],
        definitionScientific: "Гипотетическая небарионная форма материи, не участвующая в электромагнитном взаимодействии. Обнаруживается только по гравитационному влиянию на вращение галактик.",
        definitionScientificEn: "A hypothetical form of non-baryonic matter that does not interact with the electromagnetic field. It is detected solely through its gravitational effects on galaxies.",
        definitionSimple: "Призрачное вещество космоса. Оно невидимо, его нельзя потрогать или осветить, но его гравитация работает как космический клей, не давая вращающимся галактикам разлететься в стороны.",
        definitionSimpleEn: "The ghost matter of the cosmos. It's invisible, untouchable, and emits no light, but its gravity acts like a cosmic glue preventing spinning galaxies from flying apart.",
        fact: "Учёные до сих пор не нашли ни одной частицы темной материи в лабораториях, хотя её во Вселенной в 5 раз больше, чем обычной.",
        factEn: "Scientists have yet to detect a single dark matter particle in a lab, even though there is 5 times more of it in the Universe than regular matter."
    },
    {
        term: "Темная энергия",
        termEn: "Dark Energy",
        category: "Космос",
        categoryEn: "Space",
        isPopular: false,
        formula: "\\Lambda",
        variables: [
            { symbol: "\\Lambda", name: "Космологическая постоянная", nameEn: "Cosmological Constant", desc: "Отвечает за ускоренное расширение.", descEn: "Responsible for accelerated expansion." }
        ],
        definitionScientific: "Гипотетический вид энергии, введённый для объяснения наблюдаемого ускоренного расширения Вселенной. Составляет около 68% всей энергии-массы Вселенной.",
        definitionScientificEn: "A hypothetical form of energy proposed to explain the observed accelerating expansion of the Universe. It makes up roughly 68% of the total mass-energy.",
        definitionSimple: "Анти-гравитация! Загадочная сила, которая заставляет всё пространство Вселенной растягиваться и раздвигать галактики всё быстрее и быстрее друг от друга.",
        definitionSimpleEn: "Anti-gravity! A mysterious force that is causing the very fabric of space to stretch, pushing galaxies apart faster and faster.",
        fact: "Если тёмная энергия продолжит усиливаться, в далёком будущем она разорвёт на части звёзды, планеты и даже сами атомы («Большой разрыв»).",
        factEn: "If dark energy continues to strengthen, in the distant future it will tear apart stars, planets, and even atoms themselves (the 'Big Rip')."
    },
    {
        term: "Теплота",
        termEn: "Heat",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "Q = mc\\Delta T",
        variables: [
            { symbol: "Q", name: "Количество теплоты", nameEn: "Amount of Heat", desc: "Энергия теплового движения атомов.", descEn: "The energy of the thermal motion of atoms." }
        ],
        definitionScientific: "Энергия хаотического движения частиц макроскопической системы (кинетическая энергия атомов и молекул).",
        definitionScientificEn: "The energy transferred from one system to another as a result of thermal interactions (the kinetic energy of atoms and molecules).",
        definitionSimple: "Это просто движение молекул! Когда ты греешь суп, ты просто заставляешь его молекулы дрожать и носиться с огромной скоростью. Чем быстрее они носятся — тем вещь горячее.",
        definitionSimpleEn: "It's just molecule movement! When you heat up soup, you're just making its molecules jiggle and zip around at huge speeds. The faster they move, the hotter the object is.",
        fact: "Холода как физического явления не существует. «Холод» — это просто отсутствие теплоты (медленные атомы).",
        factEn: "Cold as a physical entity does not exist. 'Cold' is simply the absence of heat (slow-moving atoms)."
    },

    // У
    {
        term: "Ускорение",
        termEn: "Acceleration",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "\\vec{a} = \\frac{d\\vec{v}}{dt}",
        variables: [
            { symbol: "\\vec{a}", name: "Ускорение", nameEn: "Acceleration", desc: "Измеряется в метрах в секунду за секунду.", descEn: "Measured in meters per second squared." }
        ],
        definitionScientific: "Производная скорости по времени, физическая величина, определяющая быстроту изменения вектора скорости тела.",
        definitionScientificEn: "The rate of change of the velocity of an object with respect to time.",
        definitionSimple: "То, как быстро ты разгоняешься (или тормозишь). Если машина стартует с перекрёстка и тебя вдавливает в кресло — ты чувствуешь именно ускорение, а не саму скорость.",
        definitionSimpleEn: "How fast you speed up (or slow down). When a car accelerates from a green light and pushes you into your seat, you are feeling the acceleration, not the speed itself.",
        fact: "На орбите МКС (в невесомости) нет ощущения скорости (28 000 км/ч), потому что нет ускорения. Космонавты парят, как будто стоят на месте.",
        factEn: "Aboard the ISS (in zero-G) there is no sensation of speed (28,000 km/h) because there is no acceleration. Astronauts float as if standing perfectly still."
    },
    {
        term: "Ультрафиолет",
        termEn: "Ultraviolet",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "\\lambda \\in [10, 400] \\text{ нм}",
        variables: [
            { symbol: "\\lambda", name: "Длина волны", nameEn: "Wavelength", desc: "Слишком короткая волна для человеческого глаза.", descEn: "A wavelength too short for the human eye." }
        ],
        definitionScientific: "Электромагнитное излучение, занимающее спектральный диапазон между видимым фиолетовым и рентгеновским излучениями.",
        definitionScientificEn: "Electromagnetic radiation with a wavelength from 10 nm to 400 nm, shorter than that of visible light but longer than X-rays.",
        definitionSimple: "Невидимый «обжигающий» свет от Солнца. Твои глаза его не видят, но твоя кожа его чувствует — именно из-за ультрафиолета мы загораем на пляже или получаем солнечные ожоги.",
        definitionSimpleEn: "Invisible 'burning' light from the Sun. Your eyes can't see it, but your skin feels it—UV rays are exactly what give us beach tans or sunburns.",
        fact: "Некоторые животные, например, пчелы и северные олени, прекрасно видят в ультрафиолете. Для них снег не белый, а цветы выглядят совершенно иначе.",
        factEn: "Some animals, like bees and reindeer, can see perfectly well in ultraviolet. To them, snow isn't just white, and flowers look completely different."
    },

    // Ф
    {
        term: "Фотон",
        termEn: "Photon",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "p = \\frac{E}{c}",
        variables: [
            { symbol: "p", name: "Импульс фотона", nameEn: "Photon Momentum", desc: "У фотона нет массы, но есть импульс.", descEn: "A photon has no mass, but it possesses momentum." }
        ],
        definitionScientific: "Элементарная частица, безмассовый квант электромагнитного излучения. Способен существовать в вакууме, только двигаясь со скоростью света.",
        definitionScientificEn: "An elementary particle, a massless quantum of the electromagnetic field. In a vacuum, it can only exist while traveling at the speed of light.",
        definitionSimple: "Маленькая порция чистого света! Это уникальная частица-призрак: у неё вообще нет веса (массы), и она не умеет останавливаться — она всегда мчится на максимальной скорости Вселенной.",
        definitionSimpleEn: "A tiny packet of pure light! It's a unique ghost-particle: it has absolutely no weight (mass), and it cannot stop—it always races at the Universe's maximum speed.",
        fact: "Хотя у света нет массы, он может давить на предметы. Учёные используют «солнечные паруса», чтобы двигать космические корабли светом!",
        factEn: "Even though light has no mass, it can exert pressure. Scientists use 'solar sails' to propel spaceships just by catching light!"
    },
    {
        term: "Фазовый переход",
        termEn: "Phase Transition",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "T = \\text{const}",
        variables: [
            { symbol: "T", name: "Температура", nameEn: "Temperature", desc: "Во время перехода температура не меняется.", descEn: "During a transition, the temperature remains constant." }
        ],
        definitionScientific: "Термодинамический процесс перехода вещества из одной термодинамической фазы в другую (например, из жидкой в газообразную) при изменении внешних условий.",
        definitionScientificEn: "The thermodynamic transition of a substance from one state of matter to another (e.g., from liquid to gas) due to a change in external conditions.",
        definitionSimple: "Волшебное превращение вещества! Например, когда вода замерзает в лёд или кипит, превращаясь в пар. Во время этого процесса её температура замирает на одной точке.",
        definitionSimpleEn: "A magical transformation of matter! For example, when water freezes into ice or boils into steam. During this process, its temperature freezes at a single point.",
        fact: "Существуют сверхкритические жидкости, которые одновременно обладают свойствами и газа, и жидкости. В них нет границы фазового перехода.",
        factEn: "There are supercritical fluids that possess the properties of both gas and liquid simultaneously. There is no phase transition boundary for them."
    },

    // Х
    {
        term: "Хокингское излучение",
        termEn: "Hawking Radiation",
        category: "Космос",
        categoryEn: "Space",
        isPopular: false,
        formula: "T_H = \\frac{\\hbar c^3}{8\\pi G M k_B}",
        variables: [
            { symbol: "T_H", name: "Температура", nameEn: "Temperature", desc: "Чем тяжелее дыра, тем она холоднее.", descEn: "The heavier the black hole, the colder it gets." }
        ],
        definitionScientific: "Квантовомеханический процесс испускания разнообразных элементарных частиц чёрной дырой, предсказанный Стивеном Хокингом. Приводит к её медленному «испарению».",
        definitionScientificEn: "A quantum mechanical process of black holes emitting subatomic particles, predicted by Stephen Hawking. This leads to their slow 'evaporation'.",
        definitionSimple: "Даже чёрные дыры не вечны! Из-за квантовых фокусов на краю дыры из пустоты рождаются частицы, которые уносят с собой её массу. В итоге черная дыра медленно тает, испаряясь в космос.",
        definitionSimpleEn: "Even black holes don't live forever! Due to quantum magic on the edge of the hole, particles are born from the void, carrying away its mass. Eventually, a black hole slowly melts, evaporating into space.",
        fact: "Этот процесс идет так медленно, что для испарения сверхмассивной черной дыры потребуется больше времени, чем вообще существует Вселенная.",
        factEn: "This process is so incredibly slow that evaporating a supermassive black hole would take more time than the Universe has ever existed."
    },

    // Ц
    {
        term: "Центробежная сила",
        termEn: "Centrifugal Force",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "F_c = m\\omega^2 R",
        variables: [
            { symbol: "R", name: "Радиус вращения", nameEn: "Rotation Radius", desc: "Чем больше радиус, тем больше сила.", descEn: "The larger the radius, the stronger the force." }
        ],
        definitionScientific: "Сила инерции, вводимая во вращающейся неинерциальной системе отсчёта. Направлена от оси вращения.",
        definitionScientificEn: "An inertial force introduced in a rotating non-inertial reference frame. It is directed away from the axis of rotation.",
        definitionSimple: "Сила, которая выкидывает тебя наружу, когда ты крутишься на карусели. На самом деле это не настоящая сила, а просто твоя инерция, пытающаяся лететь прямо, пока карусель тянет тебя вбок.",
        definitionSimpleEn: "The force that flings you outward when you spin on a merry-go-round. It's actually not a real force—just your own inertia trying to go straight while the ride pulls you sideways.",
        fact: "Стирая белье, машинка раскручивает барабан, и центробежная сила буквально выдавливает воду из мокрой ткани наружу через дырочки.",
        factEn: "When a washing machine spins, centrifugal force literally squeezes the water out of wet fabrics through the tiny holes in the drum."
    },
    {
        term: "Цикл Карно",
        termEn: "Carnot Cycle",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: false,
        formula: "\\eta = 1 - \\frac{T_{x}}{T_{n}}",
        variables: [
            { symbol: "\\eta", name: "Максимальный КПД", nameEn: "Maximum Efficiency", desc: "Коэффициент полезного действия двигателя.", descEn: "The efficiency of a heat engine." }
        ],
        definitionScientific: "Идеальный термодинамический цикл, состоящий из двух изотерм и двух адиабат. Обладает максимально возможным КПД в заданном температурном диапазоне.",
        definitionScientificEn: "An ideal thermodynamic cycle consisting of two isothermal and two adiabatic processes. It provides the maximum possible efficiency for any engine operating between two temperatures.",
        definitionSimple: "Инструкция к самому совершенному двигателю в мире. Француз Сади Карно доказал математикой, что ни одна машина во Вселенной (даже инопланетная) не может работать со 100% эффективностью.",
        definitionSimpleEn: "A blueprint for the most perfect engine possible. Frenchman Sadi Carnot proved mathematically that no engine in the Universe (not even an alien one) can ever run with 100% efficiency.",
        fact: "Любой бензиновый двигатель теряет около 70% энергии топлива просто на бесполезный нагрев воздуха вокруг.",
        factEn: "Any gasoline car engine loses about 70% of its fuel energy just by uselessly heating up the surrounding air."
    },

    // Ч
    {
        term: "Черная дыра",
        termEn: "Black Hole",
        category: "Космос",
        categoryEn: "Space",
        isPopular: true,
        formula: "r_s = \\frac{2GM}{c^2}",
        variables: [
            { symbol: "r_s", name: "Радиус Шварцшильда", nameEn: "Schwarzschild Radius", desc: "Граница горизонта событий.", descEn: "The boundary of the event horizon." }
        ],
        definitionScientific: "Область пространства-времени с гравитационным притяжением настолько сильным, что её не могут покинуть даже объекты, движущиеся со скоростью света.",
        definitionScientificEn: "A region of spacetime where gravity is so strong that nothing—not even particles moving at the speed of light—can escape from it.",
        definitionSimple: "Экстремальный космический овраг. Место, где огромная звезда сжалась в крошечную точку с дикой силой тяжести. Свет проваливается туда, как вода в водосток, поэтому дыра выглядит абсолютно черной.",
        definitionSimpleEn: "An extreme space sinkhole. A place where a massive star collapsed into a tiny point with immense gravity. Light falls in like water in a drain, making the hole appear completely black.",
        fact: "В самом центре Млечного Пути сидит сверхмассивная черная дыра, масса которой равна 4 миллионам наших Солнц.",
        factEn: "In the very center of the Milky Way sits a supermassive black hole with a mass equal to 4 million of our Suns."
    },
    {
        term: "Частота",
        termEn: "Frequency",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "\\(\\nu \\) = \\frac{1}{T}",
        variables: [
            { symbol: "\\(\\nu \\)", name: "Герц (Гц)", nameEn: "Hertz (Hz)", desc: "Количество повторений в секунду.", descEn: "The number of cycles per second." }
        ],
        definitionScientific: "Физическая величина, характеристика периодического процесса, равная количеству полных циклов (колебаний), совершённых за единицу времени.",
        definitionScientificEn: "A physical quantity representing the number of occurrences of a repeating event per unit of time.",
        definitionSimple: "То, как быстро что-то вибрирует! Бас в музыке вибрирует медленно (низкая частота), а писк комара — очень быстро (высокая частота).",
        definitionSimpleEn: "How fast something vibrates! A deep bass in music vibrates slowly (low frequency), while a mosquito's squeak is incredibly fast (high frequency).",
        fact: "Микроволновка греет еду, обстреливая её радиоволнами с частотой 2.4 миллиарда колебаний в секунду — это заставляет молекулы воды в еде бешено танцевать и нагреваться.",
        factEn: "A microwave heats food by shooting it with radio waves at a frequency of 2.4 billion cycles per second—this makes water molecules dance wildly and heat up."
    },

    // Ш
    {
        term: "Шкала Кельвина",
        termEn: "Kelvin Scale",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "T_K = T_C + 273.15",
        variables: [
            { symbol: "T_C", name: "Градусы Цельсия", nameEn: "Celsius Degrees", desc: "Привычная бытовая температурная шкала.", descEn: "The familiar everyday temperature scale." }
        ],
        definitionScientific: "Абсолютная термодинамическая шкала температур, в которой нулевая точка отсчёта соответствует абсолютному нулю (состоянию минимальной кинетической энергии).",
        definitionScientificEn: "An absolute thermodynamic temperature scale where zero corresponds to absolute zero, the state of minimal kinetic energy.",
        definitionSimple: "Научный термометр без минусов. Если на улице мороз -20°C, то по Кельвину это +253 Кельвина. Ноль по Кельвину — это самая холодная точка во Вселенной, ниже которой температура просто не существует.",
        definitionSimpleEn: "A scientific thermometer without negative numbers. If it's a freezing -20°C outside, it's +253 Kelvins. Zero Kelvin is the coldest point in the Universe, below which temperature simply doesn't exist.",
        fact: "По Кельвину измеряют цвета звёзд и даже цветовую температуру светодиодных лампочек в твоей комнате (например, теплый свет 3000K).",
        factEn: "Kelvins are used to measure the colors of stars and even the color temperature of LED bulbs in your room (e.g., warm light is 3000K)."
    },

    // Э
    {
        term: "Электрон",
        termEn: "Electron",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "m_e \\approx 9.1 \\times 10^{-31} \\text{ кг}",
        variables: [
            { symbol: "m_e", name: "Масса электрона", nameEn: "Electron Mass", desc: "Экстремально малая масса частицы.", descEn: "Extremely small mass of the particle." }
        ],
        definitionScientific: "Стабильная отрицательно заряженная элементарная частица, лептон первого поколения. Главный носитель электрического тока в металлах.",
        definitionScientificEn: "A stable, negatively charged subatomic particle, a first-generation lepton. The primary carrier of electrical current in metals.",
        definitionSimple: "Шустрая искра электричества! Эти крошечные легкие частицы с бешеной скоростью носятся вокруг ядра атома, и именно они бегут по проводам к твоей зарядке для телефона.",
        definitionSimpleEn: "A swift spark of electricity! These tiny, lightweight particles zip around an atomic nucleus at frantic speeds, and they are the exact things running through the wire to charge your phone.",
        fact: "Электрон в атоме не кружится по орбите, как планета. Он «размазан» вокруг ядра, как облако, и находится везде одновременно, пока на него не посмотрят.",
        factEn: "An electron doesn't circle a nucleus like a planet. It's 'smeared' around the core like a cloud and exists everywhere at once until someone observes it."
    },
    {
        term: "Энтропия",
        termEn: "Entropy",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "S = k_B \\ln \\Omega",
        variables: [
            { symbol: "S", name: "Энтропия", nameEn: "Entropy", desc: "Мера термодинамического хаоса.", descEn: "A measure of thermodynamic chaos." }
        ],
        definitionScientific: "Физическая величина, характеризующая меру хаоса, беспорядка или необратимого рассеивания энергии в термодинамической системе.",
        definitionScientificEn: "A physical quantity representing the measure of disorder, randomness, or irreversible energy dissipation within a closed thermodynamic system.",
        definitionSimple: "Закон нарастающего бардака. Комната сама по себе становится грязной, кружка разбивается, но не собирается обратно в целую — вся Вселенная неотвратимо стремится к максимальному хаосу.",
        definitionSimpleEn: "The law of increasing mess. A room gets messy on its own, a mug shatters but never assembles back together—the entire Universe inevitably trends toward maximum chaos.",
        fact: "Стивен Хокинг доказал, что у черных дыр тоже есть своя огромная энтропия.",
        factEn: "Stephen Hawking mathematically proved that black holes also possess an enormous amount of entropy."
    },
    {
        term: "Эффект Доплера",
        termEn: "Doppler Effect",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "f' = f \\frac{v + v_o}{v - v_s}",
        variables: [
            { symbol: "v_s", name: "Скорость источника", nameEn: "Source Velocity", desc: "Если источник едет к нам, волны сжимаются.", descEn: "If the source moves towards us, waves compress." }
        ],
        definitionScientific: "Изменение частоты и длины волн, воспринимаемых наблюдателем, вследствие движения источника волн относительно наблюдателя.",
        definitionScientificEn: "The change in frequency or wavelength of a wave in relation to an observer who is moving relative to the wave source.",
        definitionSimple: "Почему машина скорой помощи меняет звук? Когда она мчится к тебе, звуковые волны сжимаются (звук высокий и писклявый). Когда уезжает — волны растягиваются (звук низкий гул).",
        definitionSimpleEn: "Why does an ambulance siren change pitch? When it races towards you, the sound waves compress (high pitch). When it drives away, the waves stretch out (low rumbling pitch).",
        fact: "Радары полицейских стреляют в машину радиоволнами и измеряют этот эффект, чтобы выписать штраф за превышение скорости.",
        factEn: "Police radars shoot radio waves at cars and measure this exact effect to issue speeding tickets."
    },

    //Ю
    {
        term: "Юпитер",
        termEn: "Jupiter",
        category: "Космос",
        categoryEn: "Space",
        isPopular: false,
        formula: "M \\approx 318 M_\\oplus",
        variables: [
            { symbol: "M_\\oplus", name: "Массы Земли", nameEn: "Earth Masses", desc: "Юпитер тяжелее Земли более чем в 300 раз.", descEn: "Jupiter is over 300 times heavier than Earth." }
        ],
        definitionScientific: "Крупнейшая планета Солнечной системы, пятая по удалённости от Солнца. Газовый гигант, состоящий в основном из водорода и гелия.",
        definitionScientificEn: "The largest planet in the Solar System, fifth from the Sun. A gas giant composed primarily of hydrogen and helium.",
        definitionSimple: "Король планет! Огромный газовый шар без твердой поверхности. Если ты попытаешься на него приземлиться, ты просто провалишься сквозь облака и будешь раздавлен гигантским давлением.",
        definitionSimpleEn: "The king of planets! A massive gas sphere with no solid surface. If you tried to land on it, you would simply fall through the clouds and be crushed by immense pressure.",
        fact: "Его знаменитое «Большое красное пятно» — это бесконечный ураган, который длится сотни лет и в который легко поместились бы три планеты размером с Землю.",
        factEn: "Its famous 'Great Red Spot' is a never-ending hurricane that has raged for centuries and is large enough to easily swallow three Earth-sized planets."
    },

    //Я
    {
        term: "Ядерный синтез",
        termEn: "Nuclear Fusion",
        category: "Физика",
        categoryEn: "Physics",
        isPopular: true,
        formula: "^{2}_{1}\\text{H} + ^{3}_{1}\\text{H} \\rightarrow ^{4}_{2}\\text{He} + n",
        variables: [
            { symbol: "\\text{He}", name: "Гелий-4", nameEn: "Helium-4", desc: "Безопасный продукт термоядерного синтеза.", descEn: "The safe byproduct of thermonuclear fusion." }
        ],
        definitionScientific: "Реакция слияния легких атомных ядер в более тяжелые ядра, протекающая при сверхвысоких температурах и давлениях. Сопровождается выделением колоссальной энергии.",
        definitionScientificEn: "A reaction in which two or more light atomic nuclei combine to form one or more different, heavier atomic nuclei, releasing immense amounts of energy.",
        definitionSimple: "То, как работают звёзды! Атомы водорода сталкиваются так сильно, что сплавляются воедино, выделяя гигантскую вспышку энергии. Физики на Земле пытаются повторить это в реакторах-токамаках.",
        definitionSimpleEn: "How stars work! Hydrogen atoms crash together so violently that they fuse into one, releasing a gigantic burst of energy. Earth physicists are trying to replicate this in tokamak reactors.",
        fact: "Если мы научимся управлять этим процессом, одного стакана морской воды хватит, чтобы обеспечить энергией целый город на целый год без радиации и загрязнений.",
        factEn: "If we master this process, a single glass of seawater could power an entire city for a year, with zero radiation and zero pollution."
    }
];
