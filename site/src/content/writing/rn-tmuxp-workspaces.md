---
title: "rn: проектные tmux-workspaces одной командой"
description: "Как маленький Bash-launcher, tmuxp-конфиги и правило attach-or-load убрали повторную настройку терминала для каждого проекта."
lang: ru
kind: guide
published: 2026-07-29
draft: false
featured: true
startHere: false
tags:
  - tmux
  - terminal
  - workflow
  - tools
---

## Проблема была не в запуске tmux

Для одного проекта у меня уже был отдельный launcher. Он открывал Alacritty, создавал tmux-сессию с четырьмя окнами, запускал Claude Code и Codex в нужных директориях. Если сессия существовала, launcher просто подключался к ней.

Это работало, пока проект был один. Для следующего проекта пришлось бы снова просить coding agent сгенерировать почти такой же Bash-скрипт, менять названия окон и вручную проверять пути. Набор одноразовых команд быстро превратился бы в ещё одну конфигурацию, только без общего формата.

Мне нужен был один вход:

```bash
rn
```

После него я выбираю workspace через `fzf`. Можно сразу передать имя:

```bash
rn my-project
```

В обоих случаях результат одинаковый: отдельный Alacritty с готовой tmux-сессией. Существующая работа при этом не пересоздаётся.

## Я не стал писать менеджер layout с нуля

Окна, panes, стартовые директории и команды уже умеет описывать `tmuxp`. Поэтому мой слой остался маленьким:

```text
rn
└── выбрать tmuxp config
    ├── сессия уже есть → tmux attach-session
    └── сессии нет      → tmuxp load
```

У инструментов разные обязанности:

- `tmuxp` хранит декларативный layout проекта;
- `tmux` держит живую сессию;
- `rn` находит config, открывает terminal и решает, подключаться или создавать.

Так YAML не прячется внутри Bash, а launcher не пытается стать ещё одной версией tmuxp.

## Один workspace — один config

Конфиги лежат в `~/.config/tmuxp`. Вот сокращённый `personal-site.yaml` для Astro-проекта:

```yaml
session_name: "personal-site"
startup_window: root

windows:
  - window_name: root
    start_directory: /home/user/Projects/personal-site
    panes:
      - "zsh -i"

  - window_name: site
    start_directory: /home/user/Projects/personal-site/site
    panes:
      - "zsh -i"
```

`session_name` связывает config с tmux-сессией. `startup_window` определяет первое активное окно. У каждого окна своя рабочая директория и команда для pane.

В минимальном launcher ниже имя файла является именем сессии: `personal-site.yaml` должен содержать `session_name: "personal-site"`. Благодаря этому короткий Bash-скрипт не пытается самостоятельно разбирать YAML. Имена workspace ограничены буквами, цифрами, точкой, `_` и `-`; в этом варианте значение `session_name` указывается в кавычках, чтобы имя вроде `true` или `2026-07-29` осталось строкой.

Для workspace с coding agents структура остаётся такой же:

```yaml
windows:
  - window_name: claude
    start_directory: /home/user/Projects/app
    panes:
      - "zsh -ic 'claude; exec zsh -i'"

  - window_name: codex
    start_directory: /home/user/Projects/app
    panes:
      - "zsh -ic 'codex; exec zsh -i'"
```

`exec zsh -i` оставляет интерактивный shell после выхода из агента. Без него окно завершилось бы вместе с командой.

Я использую абсолютные пути в `start_directory`. Интерактивный alias вроде `z project-name` может работать в моей обычной shell-сессии и отсутствовать в контексте, из которого tmuxp поднимает окно. Здесь явный путь надёжнее.

## Главное правило: не трогать живую сессию

Проверка перед загрузкой занимает несколько строк:

```bash
if tmux has-session -t "=$session" 2>/dev/null; then
  exec tmux attach-session -t "=$session"
fi

exec tmuxp load "$config"
```

Знак `=` заставляет tmux искать точное имя. Без него target считается шаблоном: запрос к `app` может совпасть с уже работающей сессией `app-prod` и подключить не тот workspace.

Это правило важнее автоматического создания layout. В окнах могут оставаться запущенные агенты, dev-server, незакоммиченный вывод или просто нужная позиция в shell history. Повторный вызов `rn my-project` должен вернуть меня туда же, а не применить YAML заново.

Изменение config тоже не перестраивает уже работающую сессию. Новый layout появится после её обычного завершения и следующего запуска. Я предпочитаю это поведение автоматической синхронизации: config описывает старт, но не получает право уничтожать runtime state.

## Минимальное ядро launcher

Ниже не весь мой скрипт, а воспроизводимое ядро. Оно открывает Alacritty, позволяет выбрать YAML через `fzf`, использует имя файла как имя сессии и выполняет attach-or-load:

```bash
#!/usr/bin/env bash
set -euo pipefail

CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/tmuxp"

if [[ "${1:-}" != "--inside" ]]; then
  exec alacritty -e "$0" --inside "$@"
fi
shift

name="${1:-}"
if [[ -z "$name" ]]; then
  name="$(
    for file in "$CONFIG_DIR"/*.yaml; do
      [[ -f "$file" ]] && basename "${file%.yaml}"
    done | sort | fzf --prompt='tmux workspace> '
  )"
fi

[[ "$name" =~ ^[A-Za-z0-9._-]+$ ]] || {
  printf 'rn: unsupported workspace name: %s\n' "$name" >&2
  exit 1
}

config="$CONFIG_DIR/$name.yaml"
[[ -f "$config" ]] || {
  printf 'rn: workspace not found: %s\n' "$name" >&2
  exit 1
}

session="$name"

if tmux has-session -t "=$session" 2>/dev/null; then
  exec tmux attach-session -t "=$session"
fi

exec tmuxp load "$config"
```

Для такого варианта нужны `tmux`, `tmuxp`, `fzf` и Alacritty. `tmuxp` я установил как отдельный Python tool:

```bash
uv tool install tmuxp
mkdir -p ~/.config/tmuxp ~/.local/bin
```

Скрипт можно сохранить как `~/.local/bin/rn`, выдать право на запуск и добавить первый YAML:

```bash
chmod +x ~/.local/bin/rn
rn personal-site
```

Каталог `~/.local/bin` должен входить в `PATH`. Пути `/home/user/...` в примере нужно заменить на реальные директории своего проекта.

Моя рабочая версия длиннее. Она понимает `.yaml`, `.yml` и `.json`, проверяет наличие runtime dependencies, позволяет переопределить terminal через `RN_TERMINAL` и имеет несколько дешёвых служебных команд:

```text
rn list
rn path my-project
rn inspect my-project
rn edit my-project
rn new my-project
```

`rn inspect` особенно полезен при отладке. Он показывает найденный config, вычисленное имя сессии и статус `running` или `not running`, ничего не запуская.

## Где лежит конфигурация

Launcher и configs находятся в моём dotfiles-дереве, а активные пути остаются обычными symlink:

```text
~/.local/bin/rn  → ~/.dotfiles/.local/bin/rn
~/.config/tmuxp → ~/.dotfiles/.config/tmuxp
```

Это даёт одну точку редактирования и не привязывает `rn` к конкретному репозиторию проекта. Чтобы добавить workspace, достаточно положить новый YAML в каталог tmuxp. Сам launcher менять не приходится.

## Как я проверяю новый workspace

Сначала идут проверки без создания сессии:

```bash
bash -n ~/.local/bin/rn
rn list
rn path personal-site
rn inspect personal-site
tmuxp ls --full
tmuxp ls --json --full
```

Обычный `tmuxp ls --full` показывает окна, panes и стартовые команды после разбора config, но не стартовые директории. Они доступны в машинном выводе `tmuxp ls --json --full`. Так ошибку в YAML, неожиданную команду или неверный `start_directory` можно заметить до запуска агентов. Tmuxp-конфиг может выполнять команды из `panes`, поэтому я отношусь к нему как к исполняемой конфигурации и не загружаю случайные workspace-файлы из сети.

Для smoke-test лучше создать отдельную временную сессию и удалить именно её:

```bash
cat > /tmp/rn-smoke.yaml <<'YAML'
session_name: "rn_smoke"
windows:
  - window_name: shell
    start_directory: /tmp
    panes:
      - "zsh -i"
YAML

tmuxp load -d --no-progress /tmp/rn-smoke.yaml
tmux list-windows -t '=rn_smoke' -F '#S:#I:#W:#{pane_current_path}'
tmux kill-session -t '=rn_smoke'
```

Я не убиваю реальную рабочую сессию ради проверки launcher. Если `rn inspect` сообщает `running`, attach-путь уже можно проверить без пересоздания layout.

## Что rn не восстанавливает

`tmuxp` описывает начальную форму workspace. Он не сохраняет состояние запущенных процессов после перезагрузки, текущие команды в panes или позицию внутри editor. Для восстановления runtime state существуют `tmux-resurrect` и `tmux-continuum`; это другая задача.

`rn` также не решает переносимость абсолютных путей между машинами. Если структура каталогов изменится, YAML придётся обновить. Можно добавить переменные или генерацию configs, но в моём случае это сделало бы простую систему сложнее без практической выгоды.

Сейчас launcher делает ровно то, ради чего появился: я запускаю `rn`, выбираю проект и попадаю в знакомый layout. Новый workspace остаётся небольшим YAML-файлом, а живая tmux-сессия остаётся под контролем tmux.
