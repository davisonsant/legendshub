# LegendsHub — LoL Esports Manager

> Simulador manager de League of Legends competitivo.  
> Estilo Brasfoot / Football Manager no universo do LoL.

---

## Stack

| Tecnologia | Uso |
|---|---|
| React 18 | UI components |
| TypeScript | Type safety |
| Vite 5 | Dev server + bundler |
| Tailwind CSS 3 | Utility-first styling |
| Electron 31 | Desktop app Windows/Linux |
| IndexedDB (idb) | Banco offline |
| Zustand | State global |

---

## Instalação

```bash
npm install
```

> Avisos `deprecated` são normais (vêm do electron-builder). Ignore-os.

---

## Rodar no navegador (mais rápido para desenvolvimento)

```bash
npm run dev
```

Abre em: **http://localhost:5173**

---

## Rodar como app desktop Windows/Linux

### Pré-requisito: baixar o Electron manualmente

O Electron precisa ser baixado separadamente.  
Execute **uma única vez**:

```bash
node -e "require('electron')"
```

Se aparecer o mesmo erro (`Electron failed to install`), execute:

```bash
# Deletar e reinstalar o Electron
rmdir /s /q node_modules\electron
npm install electron --save-dev
```

Depois:

```bash
npm run electron:dev
```

---

## Build para distribuição

### Windows (.exe instalador)

```bash
npm run electron:build
```

Gera em: `release/LegendsHub Setup X.X.X.exe`

### Web (pasta dist/)

```bash
npm run build
```

---

## Vídeo de fundo

Coloque o arquivo do vídeo Yunara em:

```
public/
  videos/
    bg.mp4
```

---

## Estrutura do projeto

```
legendshub/
├── electron/
│   ├── main.ts              # Processo principal Electron
│   └── preload.ts           # Bridge renderer ↔ main
│
├── src/
│   ├── types/index.ts       # Tipos: Player, Team, Champion...
│   ├── db/index.ts          # IndexedDB (10 stores, CRUD, export/import)
│   ├── store/index.ts       # Zustand (auth, settings, modals, saves)
│   ├── lib/i18n.ts          # 7 idiomas: PT EN ES FR DE JA RU
│   │
│   ├── pages/
│   │   └── LauncherPage.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.tsx
│   │   ├── ui/
│   │   │   └── Modal.tsx
│   │   └── modals/
│   │       ├── ModalLegalNotice.tsx
│   │       ├── ModalLanguage.tsx
│   │       ├── ModalWelcome.tsx
│   │       ├── ModalNewCareer.tsx
│   │       ├── ModalAuth.tsx
│   │       ├── ModalSettings.tsx
│   │       └── ModalEditor.tsx
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── vite.config.ts           # Config web (npm run dev/build)
├── vite.electron.config.ts  # Config desktop (npm run electron:*)
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

---

## IndexedDB — Stores

| Store | Conteúdo |
|---|---|
| players | 290+ jogadores reais LCK/LPL/LEC/LCS/CBLOL/LCP |
| teams | 60 times por liga |
| leagues | 6 ligas regionais |
| managers | Head coaches |
| influencers | Criadores de conteúdo |
| press | Veículos de imprensa |
| sponsors | Patrocinadores |
| champions | 172 campeões com tier e patch status |
| saves | Até 6 slots de carreira |
| settings | Configurações do usuário |

---

## Próximos passos

- [ ] Setup de nova carreira (escolha de região e time)
- [ ] Dashboard da carreira (elenco, agenda, finanças)
- [ ] Simulação de partidas
- [ ] Sistema de transferências
- [ ] Modo Online
