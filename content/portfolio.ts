export type Locale = "en" | "ru";

export const locales: Locale[] = ["en", "ru"];

export const portfolio = {
  en: {
    title: "Roman Titov — Senior Product Designer",
    description: "Roman Titov is a senior product designer working on digital products, design systems and comics.",
    name: "ROMAN TITOV",
    role: "Senior Product Designer",
    intro: [
      'I\'ve worked on products used by millions of people, from customer-facing apps to design systems and internal tools. I go beyond Figma. I build prototypes, experiment with code, and turn rough ideas into something people can actually use, even when the brief is little more than "we need this by today."',
      "I'm always curious about new tools, but I believe good design still starts with strong fundamentals.",
    ],
    contacts: ["CV", "Telegram", "Email", "Linkedin"],
    x5: {
      date: "2023 — Present",
      introAccent: "#1 grocery delivery app",
      intro: "I worked on Russia's #1 grocery delivery app on the App Store. I redesigned nearly every major part of the product, validated ideas through user research and A/B testing, and worked closely with product managers. After a while, you get to know the product inside out",
      achievements: [
        ["Increased average order value.", "Reduced the scroll distance to recommendations, improved how promotions are presented, and made product information easier to scan"],
        ["Made products easier to find.", "Fit more products on the screen and created space for future promotional features"],
        ["Saved designers time.", "Built a tool that fills mockups with real products in one click. No more copying product names and prices by hand!"],
        ["Shortened the path to the loyalty card.", "Moved the barcode to the home screen, added shortcuts to key sections, and sped up promotional campaigns with server-driven banners"],
        ["Defined the visual direction.", "Took part in dozens of workshops, explored different concepts, and presented design proposals"],
      ],
      concepts: ["What if you could compare product sizes at a glance?", "Displaying product attributes", "Promotional features concept", "Expanded product description", "Exploring promotions in the shopping cart"],
    },
    experience: [
      { date: "2023", company: "MTS", textBefore: "Developed and improved the MTS ", linkText: "design-system", textAfter: " by redesigning components, conducting research, and reviewing design decisions, making it easier for teams to build consistent interfaces", href: "https://design.mts.ru/dspromo" },
      { date: "2022 — 2023", company: "Gazprom Neft", text: "Turned endless Excel spreadsheets into a modern, user-friendly interface" },
      { date: "2022", company: "Rosgosstrakh", text: "Built a replacement for an existing task management tool and improved its functionality" },
    ],
    comicsTitle: "I also draw comics professionally",
    comics: [
      { title: "The Witcher: Blood Stone", image: "The Witcher - Blood Stone 01-0000.webp", firstPage: "the-witcher-blood-stone-page-01.webp" },
      { title: "Cyberpunk 2077: Big City Dreams", image: "Cyberpunk 2077 - Big City Dreams-000.webp", firstPage: "cyberpunk-big-city-dreams-page-01.webp", award: "Hugo Award Winner" },
      { title: "Cowboy Bebop: Supernova Swing", image: "9571792-cowboybebop-supernovaswing-0000.jpg", firstPage: "cowboy-bebop-supernova-swing-page-01.webp", aspectRatio: "843 / 1280" },
      { title: "Cyberpunk 2077: Where's Johnny?", image: "Cyberpunk 2077 - Where's Johnny-0000.webp", firstPage: "cyberpunk-wheres-johnny-page-01.webp" },
      { title: "Eat the Rich", image: "Eat the Rich  000.webp", firstPage: "eat-the-rich-page-01.webp", award: "Bram Stoker Award Nominee" },
      { title: "Stuff of Nightmares", image: "Stuff of Nightmares - The Monsters Makers-0000.webp", firstPage: "stuff-of-nightmares-page-01.webp" },
    ],
    footer: "Roman Titov, 2026",
  },
  ru: {
    title: "Рома Титов — Дизайнер в бигтехе",
    description: "Рома Титов — дизайнер цифровых продуктов и дизайн-систем. Работал с X5, МТС, Газпромом и Росгосстрахом, профессионально рисует комиксы.",
    name: "ROMAN TITOV",
    role: "Дизайнер в бигтехе",
    intro: [
      "Успел поработать с X5, МТС, Газпромом, Росгосстрахом и не выгорел. Не боюсь защищать решения, хорошо общаюсь с разработкой и всегда держу в запасе несколько альтернатив. Работал с задачами, описанными на коленке, и со сроком «сегодня».",
      "Открыт к новым знаниям и инструментам, но и про базовую базу не забываю.",
    ],
    contacts: ["CV", "Telegram", "Email", "Linkedin"],
    x5: {
      date: "2023 — Настоящее время",
      introAccent: "приложения «Пятёрочка»",
      intro: "Работал над редизайном всех ключевых разделов приложения «Пятёрочка», знаю про продукт абсолютно всё. Проверял идеи через исследования и A/B-тесты, проводил дизайн-ревью, тесно работал с оунерами.",
      achievements: [
        ["Увеличил средний чек.", "Сократил скролл до рекомендаций, переосмыслил отображение специальных предложений и улучшил подачу товара"],
        ["Ускорил поиск товаров.", "Уместил больше товаров на экране и освободил место для новых промо-механик"],
        ["Упростил жизнь дизайнерам.", "Создал инструмент, который наполняет макеты реальными товарами в один клик"],
        ["Сократил путь до карты лояльности.", "Вынес штрихкод на главный экран, добавил точки входа в стратегически важные разделы. Ускорил запуск промо-кампаний благодаря внедрению SDUI-баннеров"],
        ["Определил визуальное направление.", "Участвовал в десятках воркшопов и защите концептов"],
      ],
      concepts: ["Что, если объём товара будет виден сразу относительно других?", "Отображение свойств продуктов в карточке товара", "Концепт промо-механик", "Расширенное описание товара", "Редизайн корзины с примером продвижения промо"],
    },
    experience: [
      { date: "2023", company: "МТС", textBefore: "Развивал и оптимизировал ", linkText: "дизайн-систему", textAfter: " МТС: перерабатывал компоненты, проводил исследования и дизайн-ревью, упрощая работу команд и повышая удобство системы", href: "https://design.mts.ru/dspromo" },
      { date: "2022 — 2023", company: "Газпром нефть", text: "Помог перевести сотрудников с Excel-таблиц на современный интерфейс" },
      { date: "2022", company: "Росгосстрах", text: "Импортозаместил привычный сервис задач, улучшив его функционал" },
    ],
    comicsTitle: "Ещё я профессионально рисую комиксы",
    comics: [
      { title: "The Witcher: Blood Stone", image: "The Witcher - Blood Stone 01-0000.webp", firstPage: "the-witcher-blood-stone-page-01.webp" },
      { title: "Cyberpunk 2077: Big City Dreams", image: "Cyberpunk 2077 - Big City Dreams-000.webp", firstPage: "cyberpunk-big-city-dreams-page-01.webp", award: "Hugo Awards" },
      { title: "Cowboy Bebop: Supernova Swing", image: "9571792-cowboybebop-supernovaswing-0000.jpg", firstPage: "cowboy-bebop-supernova-swing-page-01.webp", aspectRatio: "843 / 1280" },
      { title: "Cyberpunk 2077: Where's Johnny?", image: "Cyberpunk 2077 - Where's Johnny-0000.webp", firstPage: "cyberpunk-wheres-johnny-page-01.webp" },
      { title: "Eat the Rich", image: "Eat the Rich  000.webp", firstPage: "eat-the-rich-page-01.webp", award: "Bram Stoker Awards" },
      { title: "Stuff of Nightmares", image: "Stuff of Nightmares - The Monsters Makers-0000.webp", firstPage: "stuff-of-nightmares-page-01.webp" },
    ],
    footer: "Рома Т., 2026",
  },
} as const;

export const phoneAlt = {
  en: ["Product detail: poke bowl", "Product detail: broccoli pancakes", "Product detail: raspberry panna cotta", "Product detail: sandwich", "Product catalogue", "Product detail: salad", "Product detail: Nutella", "Pet food product detail", "Loyalty card on the home screen", "Promotional calendar", "Shopping cart", "Product catalogue concept", "Product detail concept", "Promotional feature concept", "Shopping cart concept"],
  ru: ["Карточка товара: поке", "Карточка товара: блинчики с брокколи", "Карточка товара: панна-котта с малиной", "Карточка товара: сэндвич", "Каталог товаров", "Карточка товара: салат", "Карточка товара: Nutella", "Карточка товара: корм для животных", "Карта лояльности на главном экране", "Календарь промоакций", "Корзина", "Концепт каталога товаров", "Концепт карточки товара", "Концепт промо-механики", "Концепт корзины"],
} satisfies Record<Locale, readonly string[]>;

export const snippetAlt = {
  en: Array.from({ length: 14 }, (_, i) => `Product card mockup ${i + 1}`),
  ru: Array.from({ length: 14 }, (_, i) => `Макет карточки товара ${i + 1}`),
} satisfies Record<Locale, readonly string[]>;
