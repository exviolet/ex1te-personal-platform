# ex1te Personal Platform — Content Blueprint

> Рабочий документ для первой production-версии сайта. Визуальный источник: `004-editorial-field-station/index.html`.

## 1. Главная роль сайта

`ex1te` — личная публичная платформа Бакытжана для мыслей, проектов и экспериментов.

Иерархия ролей:

1. Личное пространство для публикации того, что Бакытжан думает, строит и проверяет.
2. Практический knowledge hub об инструментах, AI workflow и личных системах.
3. Профессиональное портфолио, которое складывается из реальной работы, а не из маркетинговых утверждений.

### Важное ограничение формулировок

Не использовать слово **«архив»** в публичном позиционировании сайта. Оно создаёт ощущение статичного хранилища прошлого. Предпочтительные понятия:

- personal platform;
- personal field station;
- личное пространство;
- рабочая лаборатория;
- мысли, проекты и эксперименты.

## 2. Рабочее первое впечатление

Не строить жёсткий personal brand до появления реального массива контента.

Рабочая формулировка:

> Бакытжан — вдумчивый maker, который строит практичные и красивые системы, проверяет идеи на себе и честно документирует результаты. AI — важная текущая область, но не вся его личность.

Эту формулировку нужно пересмотреть после публикации первых материалов. Контент определяет идентичность сайта, а не наоборот.

## 3. Идентичность

### Основной бренд

```text
ex1te
```

### Имя автора

```text
Бақытжан Избасаров
```

Допустимые варианты в metadata и About:

```text
Бакытжан Избасаров
Бақытжан Избасаров
Bakytzhan Izbassarov
```

### Identity system

- чёрно-белый иллюстрированный портрет Бакытжана — основной personal logo;
- `ex1te` — основной wordmark;
- `Бақытжан Избасаров` — human signature;
- tight crop портрета используется в header и favicon;
- полная композиция используется на About и в profile surfaces;
- editorial-композиция `1200×630` используется для Open Graph previews.

Исходная иллюстрация хранится нетронутой. Web-версии, crops и social assets создаются как производные файлы в `site/public/identity/`.

### Главный визуальный объект

**Steppe Signal** — интерактивное соединение:

- степного ландшафта;
- компаса;
- текущего направления;
- карты разделов `Writing / Lab / Projects / Now`.

Это signature interaction и визуальный мотив платформы, но не personal logo. Не перегружать его дополнительной функциональностью.

## 4. Навигация первой версии

```text
Writing · Lab · Projects · Uses · Now · About
```

Дополнительно:

- логотип / `ex1te` ведёт на главную;
- RSS доступен в footer и metadata;
- `Bookcase` не входит в MVP;
- отдельный раздел `Notes` не нужен: короткие заметки входят в `Writing`.

## 5. Карта сайта

```text
/
├── writing/
│   └── [slug]/
├── lab/
│   └── [slug]/
├── projects/
│   └── [slug]/
├── uses/
├── now/
├── about/
├── rss.xml
└── sitemap-index.xml
```

Будущие языковые версии:

```text
/en/...
/kk/...
```

Русский язык используется без URL-префикса.

## 6. Типы контента

### 6.1 Writing

Опубликованные мысли и объяснения.

Подтипы:

- `essay` — законченная авторская мысль или история;
- `note` — короткое наблюдение или практический вывод;
- `guide` — воспроизводимая инструкция с понятным результатом.

Не называть материал `guide`, если это только личный опыт без последовательного рецепта.

### 6.2 Lab

Эксперименты, прототипы и проверки гипотез.

Lab page отвечает на вопросы:

1. Что проверяется?
2. Почему это интересно?
3. Как устроен эксперимент?
4. Что уже сработало?
5. Что не сработало или пока неизвестно?
6. Какой следующий шаг?

Статусы:

```text
active · paused · complete
```

### 6.3 Projects

Самостоятельные и достаточно долговечные вещи.

Статусы:

```text
active · maintenance · archived
```

Переход между сущностями:

```text
Lab experiment → самостоятельный результат → Project
```

При переходе не создавать две одинаковые страницы. Lab report может ссылаться на Project page или быть преобразован в неё.

### 6.4 Uses

Живая страница текущего рабочего сетапа.

Группы:

- Operating system and desktop;
- Terminal and editor;
- Agent runtime and coding agents;
- Notes and memory;
- Automation;
- Hardware — только если появится желание публиковать.

Каждый инструмент сопровождается коротким ответом «зачем он остался», а не только названием.

### 6.5 Now

Короткая регулярно обновляемая страница.

Поля:

- Current focus;
- Building;
- Current question;
- Reading / learning — опционально;
- Deliberately not doing — опционально;
- Last updated.

### 6.6 About

Не дублировать CV.

Структура:

1. Короткое представление.
2. Чем Бакытжан занимается сейчас.
3. Почему существует этот сайт.
4. Несколько устойчивых интересов вне одной технологии.
5. Контакты и внешние ссылки.
6. Короткая профессиональная история — только если помогает контексту.

## 7. Главная страница

### 7.1 Hero

Eyebrow:

```text
Personal field station
```

Headline:

```text
Systems for real work.
```

Hero intro:

> Здесь я собираю мысли, проекты и эксперименты о том, как инструменты меняют способ думать и работать. Сейчас я строю личную рабочую среду вокруг AI-агентов, терминала, заметок и автоматизации — и пишу о том, что действительно помогает, а что только создаёт шум.

Primary CTA:

```text
Start here
```

Secondary CTA:

```text
Enter the lab
```

Не показывать возле hero повторное перечисление вариантов имени. Не показывать строку `RU writing · EN interface · KZ identity`.

### 7.2 Start here

Первый набор:

1. `Мой личный AI Workflow` — `Writing · Essay · RU`;
2. `Uses` — `Living page · RU`;
3. `Memory Wiki` — `Project · Active · RU`.

### 7.3 Homepage order

```text
Hero
→ Start here
→ Now status strip
→ Recent Writing
→ Featured Lab / Projects
→ Footer
```

### 7.4 Now status strip — рабочий черновик

```text
Now              Dogfooding personal agent workflow
Current question What should agents remember?
Publishing       Notes before polished tutorials
Base             Kazakhstan · local-first
```

Эти значения являются живым контентом и должны обновляться, а не быть зашиты в layout навсегда.

## 8. Стартовый набор материалов

### 8.1 Системные страницы

#### About

Status: `required for launch`

Нужно написать реальный текст от первого лица.

#### Uses

Status: `required for launch`

Первый черновик может включать:

- Arch Linux;
- Niri;
- Neovim;
- tmux;
- Hermes;
- Claude Code;
- Codex;
- систему заметок и памяти.

#### Now

Status: `required for launch`

Короткая страница; не превращать в эссе.

### 8.2 Projects

#### Memory Wiki

```yaml
title: Memory Wiki
status: active
started: 2026-06-18
lang: ru
featured: true
draft: false
```

Роль на сайте:

- первый featured project;
- пример локального инструмента;
- вход в тему памяти агентов;
- демонстрация принципа understandable-by-human tooling.

Реализованная структура страницы:

1. Проблема: прошлые разговоры трудно использовать как рабочий контекст.
2. Идея: локальная browsable-карта разговоров и решений.
3. Как устроено: экспорт Hermes sessions → статическая генерация → локальный сайт.
4. Локальный lexical search без backend.
5. Privacy by default: HTML escaping и исключение tool-output.
6. Проверенный build snapshot и demo screenshot на sample data.
7. Ограничения и различие между history, navigation, retrieval и long-term memory.

#### Rewrite Desktop

```yaml
title: Rewrite Desktop
status: maintenance
lang: ru
featured: true
```

Роль на сайте:

- пример продукта, который развивается через dogfooding;
- площадка для мыслей об интерфейсах и micro-interactions;
- демонстрация maintenance-first подхода вместо выдуманного roadmap.

Предлагаемая структура страницы:

1. Что это за приложение.
2. Для какой ежедневной задачи оно существует.
3. Почему проект перешёл в maintenance / dogfooding.
4. Какие реальные раздражения сейчас исследуются.
5. Что было изучено про editor UX и agent interaction.

### 8.3 Writing

#### Мой личный AI Workflow

```yaml
title: Мой личный AI Workflow
kind: essay
lang: ru
featured: true
startHere: true
```

Роль на сайте:

- cornerstone essay;
- основной `Start here` материал;
- объяснение связи между инструментами, а не список программ.

Предлагаемая структура:

1. Какую проблему решает workflow.
2. Почему одного AI-чата недостаточно.
3. Роль Hermes как runtime.
4. Роль Claude Code и Codex как исполнителей.
5. Роль tmux и Neovim в ручной работе.
6. Где живут заметки и долговременная память.
7. Как проверяется результат.
8. Что всё ещё не работает хорошо.
9. Принципы, которые можно перенести в другой сетап.

## 9. Языковая модель

### Правила запуска

```yaml
interfaceLanguage: en
defaultContentLanguage: ru
supportedContentLanguages:
  - ru
  - en
  - kk
translationsRequired: false
```

### Отображение

У каждого материала в списках показывается маленький label:

```text
RU · EN · KK
```

Label располагается рядом с датой, типом или статусом. Он не должен конкурировать с заголовком.

### Language switcher

Не добавлять глобальный language switcher, пока не появятся реальные параллельные версии страниц.

Если перевод существует, на странице материала появляется локальная ссылка:

```text
Also available in: English · Қазақша
```

## 10. Frontmatter

### 10.1 Common fields

```yaml
---
title: "Название"
description: "Одно конкретное предложение для карточки и metadata."
lang: ru
draft: false
featured: false
tags:
  - workflow
---
```

Обязательные для всех типов поля:

- `title`;
- `description`;
- `lang`;
- `draft`.

`published` обязателен только для Writing. `status` и `started` обязательны для Lab и Projects. `updated` указывается только после содержательного изменения.

### 10.2 Writing

```yaml
---
title: "Мой личный AI Workflow"
description: "Как Hermes, coding agents, терминал и заметки складываются в одну проверяемую рабочую систему."
lang: ru
kind: essay
published: "YYYY-MM-DD"
draft: true
featured: true
startHere: true
tags:
  - agents
  - workflow
  - tools
---
```

`readingTime` вычисляется автоматически и не хранится во frontmatter.

### 10.3 Lab

```yaml
---
title: "Название эксперимента"
description: "Какая гипотеза проверяется."
lang: ru
status: active
started: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
draft: false
featured: false
tags:
  - experiment
repo: null
demo: null
---
```

### 10.4 Projects

```yaml
---
title: "Memory Wiki"
description: "Локальная карта прошлых разговоров и решений."
lang: ru
status: active
started: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
draft: false
featured: true
tags:
  - memory
  - agents
  - local-first
repo: null
demo: null
---
```

Точные даты `started` для реальных проектов нужно подтвердить перед публикацией; не угадывать их.

## 11. URL conventions

Использовать короткие lowercase slugs на английском или устойчивой транслитерации.

Рабочие URL:

```text
/writing/my-personal-ai-workflow/
/projects/memory-wiki/
/projects/rewrite-desktop/
/uses/
/now/
/about/
```

Не включать даты в URL. Не менять slug при небольшом изменении title.

Будущие переводы:

```text
/en/writing/my-personal-ai-workflow/
/kk/writing/my-personal-ai-workflow/
```

## 12. Карточки материалов

Writing card:

```text
[RU] [ESSAY]
Заголовок
Короткое description
Дата · reading time
```

Project card:

```text
[RU] [ACTIVE]
Название
Короткое description
Primary technology / category
```

Lab card:

```text
[RU] [ACTIVE EXPERIMENT]
Название гипотезы
Что проверяется
Last updated
```

## 13. MVP boundaries

В первую версию входят:

- responsive homepage;
- Writing index and article template;
- Lab index and lab template;
- Projects index and project template;
- Uses;
- Now;
- About;
- RSS;
- sitemap;
- basic SEO / Open Graph metadata;
- Steppe Signal;
- RU / EN / KK labels;
- Markdown / MDX content.

В первую версию не входят:

- CMS;
- database;
- authentication;
- comments;
- search;
- newsletter platform;
- обязательные переводы;
- Bookcase;
- сложная taxonomy;
- окончательный логотип;
- тяжёлая analytics;
- динамический backend.

## 14. Production handoff

После утверждения blueprint следующий технический этап:

1. Создать Astro-проект.
2. Настроить TypeScript и Content Collections.
3. Перенести визуальную систему из `004 Editorial Field Station` в компоненты и design tokens.
4. Реализовать content schemas из этого документа.
5. Создать шесть стартовых страниц как drafts.
6. Проверить layout на реальном русском контенте.
7. Добавить RSS, sitemap и metadata.
8. Только после работающего локального сайта выбрать domain и hosting.

## 15. Открытые вопросы, не блокирующие MVP

- Домен.
- Hosting provider.
- Наличие Bookcase.
- Нужен ли отдельный Kazakh introduction на About.
- Какие контакты показывать публично.
- Какие репозитории будут публичными.
