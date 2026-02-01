# Documentação do Jogo - Captura de Estrelas

## Visão Geral

Jogo simples e infantil desenvolvido em HTML, CSS e JavaScript usando Canvas. O objetivo é capturar estrelas movendo apenas o mouse pela tela. O jogo foi projetado para ser calmo e com baixo estímulo visual, adequado para crianças.

## Características do Jogo

### Objetivo
- A criança move o mouse (desktop) ou o dedo (mobile) pela tela
- O cursor/toque age como um buraco negro que atrai e absorve estrelas
- Ao aproximar o buraco negro de uma estrela (dentro de 100px), ela começa a ser atraída
- As estrelas são absorvidas com uma animação de espiral e encolhimento
- O objetivo é capturar o máximo de estrelas possível

### Mecânicas

1. **Sistema de Estrelas**
   - Máximo de 10 estrelas na tela simultaneamente
   - Novas estrelas aparecem a cada 1 segundo (apenas se houver menos de 10 estrelas)
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
   - **Tamanhos adaptativos**:
     - Desktop: 20px de raio
     - Mobile: 30px de raio (maior para facilitar o toque)
   - Detecção automática de dispositivo (mobile/desktop)
   - Anéis rotativos ao redor (horizonte de eventos)
   - Efeito de distorção com gradientes radiais
   - Anel interno brilhante azul
   - Ponto central brilhante
   - Rotação contínua dos anéis para efeito dinâmico
   - Campo de atração: 100px de raio

4. **Sistema de Pontuação**
   - Contador no canto superior esquerdo
   - Mostra quantas estrelas foram capturadas
   - Atualiza automaticamente ao capturar uma estrela

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
- Link para CSS e JavaScript

### style.css
- Layout fullscreen (100vw x 100vh)
- Fundo escuro (#0f0f1a)
- Canvas ocupa toda a tela
- Cursor personalizado (crosshair)
- Estilo do contador de pontuação

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

- `resizeCanvas()`: Ajusta o canvas para fullscreen
- `initClouds()`: Inicializa todas as nuvens
- `getRandomPosition()`: Gera posição aleatória para estrelas
- `spawnStar()`: Cria nova estrela se houver espaço
- `gameLoop()`: Loop principal de animação do jogo

#### Event Listeners

- `load`: Inicializa o jogo quando a página carrega
- `resize`: Redimensiona canvas e reinicializa nuvens
- `mousemove`: Atualiza posição do buraco negro (desktop)
- `touchstart`, `touchmove`, `touchend`, `touchcancel`: Atualiza posição do buraco negro (mobile)
- `updateBlackHolePosition()`: Função unificada para atualizar posição (mouse ou touch)

## Configurações Ajustáveis

### No código (script.js)

```javascript
// Estrelas
const MAX_STARS = 10;             // Limite de estrelas na tela
const STAR_SPAWN_INTERVAL = 1000; // Intervalo de spawn (ms)
const ATTRACTION_DISTANCE = 100;  // Distância para começar a atrair (px)
const GRAVITY_STRENGTH = 0.5;     // Força de atração gravitacional

// Buraco Negro (tamanhos adaptativos)
const BLACK_HOLE_SIZE_DESKTOP = 20; // Tamanho para desktop (px)
const BLACK_HOLE_SIZE_MOBILE = 30; // Tamanho para mobile (px)
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
- Campo de atração configurável (100px)
- Força gravitacional ajustável
- **Amortecimento de velocidade**: Estrelas perdem velocidade gradualmente quando saem do campo de atração
- **Respawn automático**: Estrelas que saem da tela são removidas e novas aparecem imediatamente
- **Tamanhos adaptativos**: Tamanhos diferentes para desktop e mobile

### Suporte Mobile
- Controle via touch (toque na tela)
- Prevenção de scroll e zoom durante o jogo
- Suporte a múltiplos toques (usa o primeiro toque)
- Meta tags otimizadas para mobile
- CSS com `touch-action: none` para melhor controle
- Viewport configurado para fullscreen em dispositivos móveis
- **Cálculo preciso de posição**: Correção do cálculo de posição do touch para centralizar o buraco negro no dedo
- **Tamanhos adaptativos**: Buraco negro maior em mobile (30px) para facilitar o toque
- **Detecção automática**: Sistema detecta automaticamente se é mobile ou desktop

## Como Usar

### Desktop
1. Abra o arquivo `index.html` em um navegador moderno
2. O jogo inicia automaticamente em tela cheia
3. Mova o mouse pela tela para controlar o buraco negro
4. Aproxime o buraco negro das estrelas para absorvê-las

### Mobile
1. Abra o arquivo `index.html` em um navegador mobile
2. O jogo inicia automaticamente em tela cheia
3. Toque e arraste o dedo pela tela para controlar o buraco negro
4. Aproxime o buraco negro das estrelas para absorvê-las
5. Novas estrelas aparecerão automaticamente quando houver espaço

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

- Ajuste de dificuldade (velocidade, quantidade de estrelas, força gravitacional)
- Efeitos de partículas ao absorver estrelas
- Sons suaves (opcional)
- Diferentes tipos de estrelas com propriedades diferentes
- Sistema de níveis ou tempo limite
- Estatísticas de jogo
- Efeito de distorção visual ao redor do buraco negro
- Múltiplos buracos negros (modo multiplayer)
