#!/usr/bin/env node
// Структура репозитория. Проверка запускается из pre-commit, pre-push и CI.
//   node scripts/structure.mjs check   код 1, если расхождений больше MAX_DEVIATIONS
//   node scripts/structure.mjs create  создаёт недостающие папки и docs/structure.md

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MAX_DEVIATIONS = 3; // больше расхождений: коммит и push блокируются

// Папки frontend/src и их назначение. Файлы в корне src (main.tsx, index.css) не проверяются.
const SRC_DIRS = {
  App: "общие обёртки: App, Routes, ContentLayout",
  components: "переиспользуемые компоненты",
  pages: "страницы, по одной на маршрут",
  utils: "API, хуки и типы",
};

const REQUIRED_DIRS = [
  "backend",
  "docs",
  ".githooks",
  ".github/workflows",
  "scripts",
  "frontend/public",
  ...Object.keys(SRC_DIRS).map((d) => `frontend/src/${d}`),
];
const REQUIRED_FILES = ["docs/README.md"];

const join = (dir, name) => (dir ? `${dir}/${name}` : name);

// Имена папок с учётом регистра: existsSync на macOS регистр не различает.
function dirNames(rel) {
  try {
    return fs
      .readdirSync(path.join(ROOT, rel), { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch {
    return [];
  }
}

function hasDir(rel) {
  let cur = "";
  for (const part of rel.split("/")) {
    if (!dirNames(cur).includes(part)) return false;
    cur = join(cur, part);
  }
  return true;
}

function diagnose() {
  const problems = [];
  const renamed = new Set();

  for (const rel of REQUIRED_DIRS) {
    if (hasDir(rel)) continue;
    const parent = path.posix.dirname(rel) === "." ? "" : path.posix.dirname(rel);
    const name = path.posix.basename(rel);
    const twin = dirNames(parent).find((d) => d !== name && d.toLowerCase() === name.toLowerCase());
    if (twin) {
      const p = join(parent, twin);
      renamed.add(p);
      problems.push({ kind: "rename", path: p, rel });
    } else {
      problems.push({ kind: "create", path: rel });
    }
  }

  for (const d of dirNames("frontend/src")) {
    const p = join("frontend/src", d);
    if (Object.keys(SRC_DIRS).includes(d) || renamed.has(p)) continue;
    problems.push({ kind: "extra", path: p });
  }

  for (const f of REQUIRED_FILES) {
    if (!fs.existsSync(path.join(ROOT, f))) problems.push({ kind: "file", path: f });
  }

  return problems;
}

const MESSAGES = {
  create: "нет папки",
  rename: "неверный регистр",
  extra: "лишняя папка: перенесите содержимое в App, components, pages или utils и удалите",
  file: "нет обязательного файла",
};

function check() {
  const problems = diagnose();
  if (problems.length === 0) {
    console.log("структура: в порядке");
    return 0;
  }
  for (const p of problems) {
    const hint = p.kind === "rename" ? ` (ожидается ${p.rel})` : "";
    console.log(`  - ${p.path}: ${MESSAGES[p.kind]}${hint}`);
  }
  if (problems.length > MAX_DEVIATIONS) {
    console.error(
      `структура: расхождений ${problems.length}, порог ${MAX_DEVIATIONS}. Коммит и push заблокированы.`,
    );
    return 1;
  }
  console.log(`структура: расхождений ${problems.length}, в пределах порога ${MAX_DEVIATIONS}. Исправьте.`);
  return 0;
}

function create() {
  const problems = diagnose();

  for (const p of problems.filter((x) => x.kind === "create")) {
    const abs = path.join(ROOT, p.path);
    fs.mkdirSync(abs, { recursive: true });
    fs.writeFileSync(path.join(abs, ".gitkeep"), "");
    console.log(`создана папка: ${p.path}`);
  }

  // Смена регистра: делаем вручную в два шага, macOS регистр не различает
  for (const p of problems.filter((x) => x.kind === "rename")) {
    console.log(
      `переименуйте:\n  git mv ${p.path} ${p.path}_tmp && git mv ${p.path}_tmp ${p.rel}`,
    );
  }

  const lines = [
    "# Структура репозитория",
    "",
    "Файл создаёт `node scripts/structure.mjs create`. Не правьте вручную: список задаётся в скрипте.",
    "",
    "## Обязательные папки",
    "",
    ...REQUIRED_DIRS.map((d) => `- \`${d}/\``),
    "",
    "## Слои frontend/src",
    "",
    ...Object.entries(SRC_DIRS).map(([d, desc]) => `- \`${d}/\`: ${desc}`),
    "",
  ];
  fs.mkdirSync(path.join(ROOT, "docs"), { recursive: true });
  fs.writeFileSync(path.join(ROOT, "docs/structure.md"), lines.join("\n"));
  console.log("обновлён: docs/structure.md");
}

const mode = process.argv[2];
if (mode === "check") {
  process.exitCode = check();
} else if (mode === "create") {
  create();
} else {
  console.error("Использование: node scripts/structure.mjs check | create");
  process.exitCode = 2;
}
