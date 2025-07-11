# Habit Tracker Mobile App

Aplicativo mobile para rastreamento de hábitos diários com interface similar ao sistema de commits do GitHub, onde cada dia é representado por um quadrado colorido baseado no progresso dos hábitos.

## ✨ Funcionalidades

- 📱 **Interface intuitiva**: Design moderno e responsivo
- 📊 **Visualização de progresso**: Sistema de quadrados coloridos como o GitHub
- 🎯 **Widget Android**: Acompanhe e marque hábitos diretamente na tela inicial
- 💾 **Persistência local**: Dados salvos localmente com sincronização opcional
- 🔔 **Notificações**: Lembretes para manter a consistência

## 🎯 Widget Android

O aplicativo inclui um widget Android que permite:

- ✅ **Marcar hábitos** diretamente na tela inicial
- 📊 **Ver progresso** do dia em tempo real
- 🎨 **Interface consistente** com o app principal
- 🔄 **Sincronização automática** com o aplicativo

### Como usar o Widget

1. Configure seus hábitos no app principal (botão "Widget" no header)
2. Adicione o widget à tela inicial: Segurar tela inicial → Widgets → "Rastreador de Hábitos"
3. Toque nos hábitos para marcá-los como concluídos
4. Acompanhe seu progresso através da barra colorida

Para mais detalhes, consulte o [WIDGET_README.md](./WIDGET_README.md).

## 🛠 Technologies

**Client:** <br/>
🟢 React.js and Typescript <br/>
🟢 React Native <br/>
🟢 Expo <br/>
🟢 NativeWind (Tailwind CSS) <br/>
🟢 React Navigation <br/>
🟢 AsyncStorage <br/>
🟢 Day.js <br/>
🟢 Axios <br/>
🟢 Lottie React Native

**Server:** <br/>
🟣 Fastify <br/>
🟣 Zod <br/>
🟣 Prisma <br/>
🟣 SQLite

**Widget:** <br/>
🟡 Android Native Layout <br/>
🟡 SharedPreferences <br/>
🟡 AppWidgetProvider

## 🚀 Como Executar

### Pré-requisitos

- Node.js 16+
- Expo CLI
- Android Studio (para widget)
- Yarn ou NPM

### Instalação

```bash
# Clone o repositório
git clone <repository-url>

# Instale as dependências
npm install --legacy-peer-deps

# Execute o app
npm run android
# ou
npm run ios
```

### Testando o Widget

1. Execute o app no Android
2. Configure seus hábitos na tela "Widget"
3. Adicione o widget à tela inicial do dispositivo
4. Teste a interação tocando nos hábitos

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── screens/            # Telas do aplicativo
│   ├── Home.tsx        # Tela principal com quadrados de progresso
│   ├── Habit.tsx       # Detalhes de um dia específico
│   ├── New.tsx         # Criar novo hábito
│   └── WidgetConfig.tsx # Configuração do widget
├── widgets/            # Componentes do widget
│   └── HabitTrackerWidget.tsx
├── services/           # Lógica de negócio
│   └── widgetService.ts
├── hooks/              # Hooks customizados
│   └── useWidgetHabits.ts
└── utils/              # Utilitários

android/                # Configurações nativas Android
├── app/src/main/res/
│   ├── layout/         # Layouts do widget
│   ├── drawable/       # Recursos visuais
│   ├── xml/            # Configurações do widget
│   └── values/         # Strings e recursos
└── app/src/main/java/  # Código Java do widget
```

## 🎨 Design System

### Cores do Progresso
- **0%**: Cinza (`#3f3f46`)
- **1-19%**: Violeta escuro (`#581c87`)
- **20-39%**: Violeta médio-escuro (`#6b21a8`)
- **40-59%**: Violeta médio (`#7c3aed`)
- **60-79%**: Violeta médio-claro (`#8b5cf6`)
- **80-100%**: Violeta claro (`#a855f7`)

### Temas
- **Background**: `#09090a`
- **Superfícies**: `#18181b`, `#27272a`
- **Texto primário**: `#ffffff`
- **Texto secundário**: `#a1a1aa`

## 🔄 Sincronização de Dados

O aplicativo utiliza uma estratégia híbrida de persistência:

1. **Local primeiro**: Dados salvos no AsyncStorage
2. **Sincronização opcional**: API backend quando disponível
3. **Fallback gracioso**: Funciona offline completamente

## 📱 Compatibilidade

- **iOS**: 11.0+
- **Android**: 6.0+ (API level 23+)
- **Widget**: Apenas Android (por enquanto)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
