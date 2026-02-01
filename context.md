# Documentação do Jogo - Captura de Estrelas

## Visão Geral

Jogo simples e infantil desenvolvido em HTML, CSS e JavaScript usando Canvas. O objetivo é capturar estrelas movendo apenas o mouse pela tela. O jogo foi projetado para ser calmo e com baixo estímulo visual, adequado para crianças.

## Características do Jogo

### Objetivo
- O jogo inicia com uma tela de configurações onde o usuário pode ajustar a dificuldade
- A criança move o mouse (desktop) ou o dedo (mobile) pela tela
- O cursor/toque age como um buraco negro que atrai e absorve estrelas
- Ao aproximar o buraco negro de uma estrela (dentro do campo de atração), ela começa a ser atraída
- As estrelas são absorvidas com uma animação de espiral e encolhimento
- O objetivo é capturar o máximo de estrelas possível

### Mecânicas

1. **Sistema de Estrelas**
   - **Configurável pelo usuário**: Quantidade máxima de estrelas (10, 20, 30, 40 ou 50)
   - **Configurável pelo usuário**: Velocidade de aparição (1000ms, 800ms, 600ms, 400ms ou 200ms)
   - Novas estrelas aparecem no intervalo configurado (apenas se houver menos estrelas que o máximo)
   - Quando o limite é atingido, novas estrelas só aparecem após capturar as existentes
   - Estrelas são douradas com efeito de brilho suave e rotação lenta
   - Tamanho igual ao buraco negro (proporção 1:1 visual)
   - **Respawn Automático**: Se uma estrela sair da área visível, ela é removida e uma nova aparece imediatamente
   - **Animação de Absorção**: Quando atraídas pelo buraco negro:
     - Movem-se em espiral em direção ao buraco negro
     - Rotação acelera progressivamente
     - Tamanho diminui gradualmente (até 90% de redução)
     - Brilho aumenta durante a absorção
     - Efeito de rastro quando próximas do buraco negro
   - **Amortecimento**: Quando saem do campo de atração, perdem velocidade gradualmente até parar

2. **Sistema de Nuvens (Fundo Animado)**
   - 10 nuvens estilo fumaça se movendo suavemente pela tela
   - Cada nuvem é composta por 3-5 partes orgânicas com gradientes radiais
   - Movimento contínuo e lento (velocidade: 0.5)
   - Nuvens reaparecem quando saem da tela
   - Opacidade baixa (20-35%) para não distrair
   - Cores em tons de cinza/azul escuro para simular céu/espaço

3. **Buraco Negro (Cursor)**
   - O mouse (desktop) ou toque (mobile) funciona como um buraco negro visual
   - **Tamanhos adaptativos**: Tamanhos diferentes para desktop e mobile (configuráveis nas constantes)
   - Detecção automática de dispositivo (mobile/desktop)
   - Anéis rotativos ao redor (horizonte de eventos)
   - Efeito de distorção com gradientes radiais
   - Anel interno brilhante azul
   - Ponto central brilhante
   - Rotação contínua dos anéis para efeito dinâmico
   - Campo de atração configurável (definido nas constantes)

4. **Sistema de Pontuação**
   - Contador no canto superior esquerdo
   - Mostra quantas estrelas foram capturadas
   - Atualiza automaticamente ao capturar uma estrela

5. **Tela de Configurações Inicial**
   - Diálogo modal aparece ao carregar o jogo
   - **Controle deslizante de quantidade**: Permite escolher entre 10, 20, 30, 40 ou 50 estrelas
   - **Controle deslizante de velocidade**: Permite escolher intervalo de spawn (1000ms, 800ms, 600ms, 400ms ou 200ms)
   - Valores atualizados em tempo real enquanto o usuário arrasta os sliders
   - Botão "Iniciar Jogo" para começar com as configurações escolhidas
   - Interface responsiva para desktop e mobile

## Estrutura de Arquivos

```
mouse-snow/
├── index.html      # Estrutura HTML do jogo
├── style.css       # Estilos e layout fullscreen
├── script.js       # Lógica do jogo
└── context.md      # Esta documentação
```

## Detalhes Técnicos

### index.html
- Estrutura básica HTML5
- Canvas para renderização do jogo
- Elemento de pontuação
- Diálogo modal de configurações iniciais
- Controles deslizantes (sliders) para configuração
- Botão de iniciar jogo
- Link para CSS e JavaScript

### style.css
- Layout fullscreen (100vw x 100vh)
- Fundo escuro (#0f0f1a)
- Canvas ocupa toda a tela
- Cursor oculto (apenas o buraco negro é visível)
- Estilo do contador de pontuação
- Estilos do diálogo modal de configurações
- Estilos dos controles deslizantes (sliders)
- Design responsivo para mobile

### script.js

#### Classes Principais

**Cloud (Nuvem)**
- `reset()`: Inicializa/reinicializa a nuvem com posição e propriedades aleatórias
- `update()`: Move a nuvem e gerencia o reaparecimento quando sai da tela
- `draw()`: Desenha a nuvem usando gradientes radiais para efeito de fumaça

**Star (Estrela)**
- `draw()`: Desenha estrela de 5 pontas com efeito de brilho e rastro durante absorção
- `update(mouseX, mouseY)`: 
  - Calcula distância do buraco negro
  - Aplica física de atração gravitacional
  - Adiciona movimento espiral quando sendo absorvida
  - Acelera rotação e brilho durante absorção
  - Reduz tamanho progressivamente
  - Aplica amortecimento quando sai do campo de atração
  - Retorna `true` quando completamente absorvida
  - Retorna `'outOfBounds'` quando sai da área visível
- Propriedades de absorção:
  - `isBeingAbsorbed`: Estado de absorção
  - `absorptionProgress`: Progresso da absorção (0 a 1)
  - `vx`, `vy`: Velocidade da estrela (com amortecimento)

#### Funções Principais

- `resizeCanvas()`: Ajusta o canvas para fullscreen considerando device pixel ratio
- `initClouds()`: Inicializa todas as nuvens
- `getRandomPosition()`: Gera posição aleatória para estrelas
- `spawnStar()`: Cria nova estrela se houver espaço
- `gameLoop()`: Loop principal de animação do jogo
- `updateStarsValue()`: Atualiza valor da quantidade de estrelas baseado no slider
- `updateSpeedValue()`: Atualiza valor da velocidade de spawn baseado no slider

#### Event Listeners

- `load`: Inicializa o jogo quando a página carrega (mostra diálogo de configurações)
- `resize`: Redimensiona canvas e reinicializa nuvens
- `mousemove`: Atualiza posição do buraco negro (desktop)
- `touchstart`, `touchmove`, `touchend`, `touchcancel`: Atualiza posição do buraco negro (mobile)
- `input` (sliders): Atualiza valores de configuração em tempo real
- `click` (botão iniciar): Inicia o jogo com as configurações escolhidas
- `updateBlackHolePosition()`: Função unificada para atualizar posição (mouse ou touch)

## Configurações Ajustáveis

### No código (script.js)

```javascript
// Opções de configuração (definidas pelo usuário)
const STAR_OPTIONS = [10, 20, 30, 40, 50];        // Opções de quantidade de estrelas
const SPEED_OPTIONS = [1000, 800, 600, 400, 200]; // Opções de velocidade (ms)

// Configurações do jogo (definidas pelo usuário via diálogo)
let MAX_STARS = STAR_OPTIONS[0];              // Limite de estrelas na tela (configurável)
let STAR_SPAWN_INTERVAL = SPEED_OPTIONS[0];   // Intervalo de spawn (ms) (configurável)

// Configurações fixas
const ATTRACTION_DISTANCE = 100;  // Distância para começar a atrair (px)
const GRAVITY_STRENGTH = 0.5;     // Força de atração gravitacional

// Buraco Negro (tamanhos adaptativos)
const BLACK_HOLE_SIZE_DESKTOP = 20; // Tamanho para desktop (px)
const BLACK_HOLE_SIZE_MOBILE = 40; // Tamanho para mobile (px)
const BLACK_HOLE_SIZE = isMobile ? BLACK_HOLE_SIZE_MOBILE : BLACK_HOLE_SIZE_DESKTOP;
const STAR_SIZE = BLACK_HOLE_SIZE; // Estrela sempre do mesmo tamanho (proporção 1:1)

// Nuvens
const NUM_CLOUDS = 10;            // Quantidade de nuvens
const CLOUD_SPEED = 0.5;          // Velocidade de movimento
```

### Cores

- Fundo: `#0f0f1a` (azul muito escuro)
- Estrelas: `#FFD700` (dourado) com borda `#FFA500` (laranja)
- Nuvens: Tons de cinza/azul escuro (RGB: 30-70)
- Buraco Negro: Preto (#000000) com anéis azuis rotativos

## Histórico de Desenvolvimento

### Versão Inicial
- Criação da estrutura básica do jogo
- Sistema de estrelas com limite e spawn controlado
- Captura por proximidade do mouse
- Fundo estático escuro

### Adição de Nuvens Animadas
- Implementação de sistema de nuvens estilo fumaça
- Movimento suave e contínuo
- Efeito de gradiente radial para aparência orgânica
- Fundo animado para simular céu/espaço

### Correções e Melhorias
- Correção do cálculo de posição do mouse (getBoundingClientRect)
- Aumento da visibilidade dos elementos
- Melhorias na inicialização (evento 'load')
- Adição de verificações de erro
- Ajuste de opacidades e tamanhos para melhor visibilidade

### Sistema de Buraco Negro e Absorção
- Implementação de física gravitacional para atrair estrelas
- Animação de absorção com movimento espiral
- Efeito visual de buraco negro com anéis rotativos
- Progressão visual durante absorção (encolhimento, rotação acelerada, brilho)
- Campo de atração configurável (definido nas constantes)
- Força gravitacional ajustável
- **Amortecimento de velocidade**: Estrelas perdem velocidade gradualmente quando saem do campo de atração
- **Respawn automático**: Estrelas que saem da tela são removidas e novas aparecem imediatamente
- **Tamanhos adaptativos**: Tamanhos diferentes para desktop e mobile
- **Device Pixel Ratio**: Suporte para telas de alta densidade (retina)

### Tela de Configurações Inicial
- Implementação de diálogo modal de configurações
- Controles deslizantes para quantidade de estrelas (5 níveis)
- Controles deslizantes para velocidade de spawn (5 níveis)
- Interface responsiva e intuitiva
- Valores atualizados em tempo real
- Jogo só inicia após configuração

### Suporte Mobile
- Controle via touch (toque na tela)
- Prevenção de scroll e zoom durante o jogo
- Suporte a múltiplos toques (usa o primeiro toque)
- Meta tags otimizadas para mobile
- CSS com `touch-action: none` para melhor controle (exceto no diálogo de configurações)
- Viewport configurado para fullscreen em dispositivos móveis
- **Cálculo preciso de posição**: Correção do cálculo de posição do touch para centralizar o buraco negro no dedo
- **Tamanhos adaptativos**: Buraco negro maior em mobile para facilitar o toque (tamanhos configuráveis nas constantes)
- **Detecção automática**: Sistema detecta automaticamente se é mobile ou desktop
- **Device Pixel Ratio**: Canvas ajustado para alta resolução em telas de alta densidade

### Tela de Configurações Inicial
- **Diálogo modal**: Aparece ao carregar o jogo antes de iniciar
- **Controles deslizantes**: Interface intuitiva para configurar dificuldade
- **Quantidade de estrelas**: 5 níveis (10, 20, 30, 40, 50) - padrão: 10
- **Velocidade de spawn**: 5 níveis (1000ms, 800ms, 600ms, 400ms, 200ms) - padrão: 1000ms
- **Atualização em tempo real**: Valores mostrados enquanto o usuário arrasta os sliders
- **Design responsivo**: Funciona bem em desktop e mobile
- **Botão de iniciar**: Inicia o jogo apenas após configuração

## Como Usar

### Desktop
1. Abra o arquivo `index.html` em um navegador moderno
2. Uma tela de configurações aparecerá
3. Ajuste a quantidade de estrelas e velocidade de aparição usando os controles deslizantes
4. Clique em "Iniciar Jogo" para começar
5. Mova o mouse pela tela para controlar o buraco negro
6. Aproxime o buraco negro das estrelas para absorvê-las

### Mobile
1. Abra o arquivo `index.html` em um navegador mobile
2. Uma tela de configurações aparecerá
3. Ajuste a quantidade de estrelas e velocidade de aparição usando os controles deslizantes
4. Toque em "Iniciar Jogo" para começar
5. Toque e arraste o dedo pela tela para controlar o buraco negro
6. Aproxime o buraco negro das estrelas para absorvê-las
7. Novas estrelas aparecerão automaticamente quando houver espaço

## Requisitos

- Navegador moderno com suporte a Canvas API
- JavaScript habilitado
- Resolução de tela: qualquer (fullscreen responsivo)
- **Suporte Mobile**: Funciona em dispositivos móveis com touch

## Notas de Design

- **Baixo Estímulo Visual**: Cores escuras, movimentos lentos, opacidades baixas
- **Simplicidade**: Apenas movimento do mouse necessário
- **Feedback Visual**: 
  - Estrelas são atraídas e absorvidas com animação suave
  - Buraco negro visual indica a posição do mouse
  - Contador atualiza ao completar absorção
- **Ambiente Calmo**: Fundo animado suave, sem sons ou efeitos bruscos
- **Física Realista**: Movimento espiral e aceleração gradual criam sensação de gravidade

## Possíveis Melhorias Futuras

- Mais opções de configuração (força gravitacional, campo de atração)
- Salvar configurações preferidas do usuário
- Efeitos de partículas ao absorver estrelas
- Sons suaves (opcional)
- Diferentes tipos de estrelas com propriedades diferentes
- Sistema de níveis ou tempo limite
- Estatísticas de jogo
- Efeito de distorção visual ao redor do buraco negro
- Múltiplos buracos negros (modo multiplayer)
- Modo de pausa durante o jogo