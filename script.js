// Aguardar o DOM estar pronto
window.addEventListener('load', () => {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Canvas não encontrado!');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Contexto do canvas não disponível!');
        return;
    }
    
    const scoreElement = document.getElementById('score');

    // Configurações do jogo
    const MAX_STARS = 10;
    const STAR_SPAWN_INTERVAL = 1000;
    const STAR_SIZE = 40;
    const ATTRACTION_DISTANCE = 100; // Distância para começar a atrair
    const BLACK_HOLE_SIZE = 40; // Tamanho do buraco negro
    const GRAVITY_STRENGTH = 0.5; // Força de atração

    // Configurações das nuvens
    const NUM_CLOUDS = 10;
    const CLOUD_SPEED = 0.5;

    let stars = [];
    let clouds = [];
    let score = 0;
    let lastStarSpawn = Date.now();
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let blackHoleRotation = 0; // Rotação do buraco negro

    // Ajustar canvas para fullscreen
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        if (clouds.length > 0) {
            initClouds();
        }
    });

    // Classe Nuvem
    class Cloud {
        constructor() {
            this.reset();
        }

        reset() {
            const width = canvas.width || window.innerWidth;
            const height = canvas.height || window.innerHeight;
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * CLOUD_SPEED;
            this.vy = (Math.random() - 0.5) * CLOUD_SPEED;
            this.size = 100 + Math.random() * 200;
            this.parts = [];
            
            const numParts = 3 + Math.floor(Math.random() * 3);
            for (let i = 0; i < numParts; i++) {
                this.parts.push({
                    offsetX: (Math.random() - 0.5) * this.size * 0.8,
                    offsetY: (Math.random() - 0.5) * this.size * 0.8,
                    radius: this.size * (0.3 + Math.random() * 0.4),
                    opacity: 0.2 + Math.random() * 0.15
                });
            }
            
            const baseColor = 30 + Math.random() * 40;
            this.color = `rgb(${Math.floor(baseColor)}, ${Math.floor(baseColor + 10)}, ${Math.floor(baseColor + 20)})`;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < -this.size * 2) {
                this.x = canvas.width + this.size;
            } else if (this.x > canvas.width + this.size * 2) {
                this.x = -this.size;
            }
            
            if (this.y < -this.size * 2) {
                this.y = canvas.height + this.size;
            } else if (this.y > canvas.height + this.size * 2) {
                this.y = -this.size;
            }
        }

        draw() {
            this.parts.forEach(part => {
                const x = this.x + part.offsetX;
                const y = this.y + part.offsetY;
                
                const gradient = ctx.createRadialGradient(
                    x, y, 0,
                    x, y, part.radius
                );
                const rgbValues = this.color.match(/\d+/g);
                if (rgbValues && rgbValues.length >= 3) {
                    gradient.addColorStop(0, `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${part.opacity})`);
                    gradient.addColorStop(0.5, `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${part.opacity * 0.5})`);
                    gradient.addColorStop(1, `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, 0)`);
                    
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.scale(1, 0.8);
                    ctx.arc(0, 0, part.radius, 0, Math.PI * 2);
                    ctx.restore();
                    ctx.fill();
                }
            });
        }
    }

    function initClouds() {
        clouds = [];
        for (let i = 0; i < NUM_CLOUDS; i++) {
            clouds.push(new Cloud());
        }
    }

    // Classe Estrela
    class Star {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.originalX = x;
            this.originalY = y;
            this.size = STAR_SIZE;
            this.originalSize = STAR_SIZE;
            this.rotation = 0;
            this.rotationSpeed = 0.02;
            this.twinkle = Math.random() * Math.PI * 2;
            this.twinkleSpeed = 0.05;
            this.isBeingAbsorbed = false;
            this.absorptionProgress = 0; // 0 a 1
            this.vx = 0;
            this.vy = 0;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            
            // Efeito de brilho mais intenso quando sendo absorvida
            let alpha = 0.8 + Math.sin(this.twinkle) * 0.2;
            if (this.isBeingAbsorbed) {
                alpha = 0.9 + Math.sin(this.twinkle * 3) * 0.1; // Pisca mais rápido
            }
            ctx.globalAlpha = alpha;
            
            // Cor mais brilhante quando sendo absorvida
            const colorIntensity = this.isBeingAbsorbed ? 1.3 : 1;
            ctx.fillStyle = `rgb(${255 * colorIntensity}, ${215 * colorIntensity}, 0)`;
            ctx.strokeStyle = `rgb(${255 * colorIntensity}, ${165 * colorIntensity}, 0)`;
            ctx.lineWidth = 3;
            
            // Tamanho reduzido durante absorção
            const currentSize = this.size * (1 - this.absorptionProgress * 0.7);
            
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (i * 4 * Math.PI / 5) - Math.PI / 2;
                const xPos = Math.cos(angle) * currentSize / 2;
                const yPos = Math.sin(angle) * currentSize / 2;
                if (i === 0) {
                    ctx.moveTo(xPos, yPos);
                } else {
                    ctx.lineTo(xPos, yPos);
                }
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Efeito de rastro quando sendo absorvida
            if (this.isBeingAbsorbed && this.absorptionProgress > 0.3) {
                ctx.globalAlpha = (1 - this.absorptionProgress) * 0.5;
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            
            ctx.restore();
        }

        update(mouseX, mouseY) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Verificar se está dentro do campo de atração
            const wasBeingAbsorbed = this.isBeingAbsorbed;
            this.isBeingAbsorbed = distance < ATTRACTION_DISTANCE;
            
            // Se saiu do campo de atração, resetar propriedades e aplicar amortecimento
            if (wasBeingAbsorbed && !this.isBeingAbsorbed) {
                // Resetar progresso de absorção
                this.absorptionProgress = 0;
                // Restaurar tamanho original gradualmente
                this.size = this.originalSize;
                // Resetar rotação e twinkle para valores normais
                this.rotationSpeed = 0.02;
                this.twinkleSpeed = 0.05;
            }
            
            if (this.isBeingAbsorbed) {
                // Calcular força de atração (mais forte quando mais próximo)
                const force = GRAVITY_STRENGTH * (1 - distance / ATTRACTION_DISTANCE);
                const angle = Math.atan2(dy, dx);
                
                // Adicionar componente espiral (rotação ao redor do buraco negro)
                const spiralAngle = angle + (Math.PI / 2) * (1 - distance / ATTRACTION_DISTANCE);
                const spiralForce = force * 0.3; // Componente tangencial
                
                // Acelerar em direção ao mouse com componente espiral
                this.vx += Math.cos(angle) * force * 0.1 + Math.cos(spiralAngle) * spiralForce * 0.05;
                this.vy += Math.sin(angle) * force * 0.1 + Math.sin(spiralAngle) * spiralForce * 0.05;
                
                // Aplicar velocidade
                this.x += this.vx;
                this.y += this.vy;
                
                // Acelerar rotação durante absorção (mais rápido quando mais próximo)
                const rotationBoost = (1 - distance / ATTRACTION_DISTANCE) * 0.1;
                this.rotationSpeed += rotationBoost;
                this.rotation += this.rotationSpeed;
                
                // Acelerar twinkle
                this.twinkleSpeed += 0.15;
                this.twinkle += this.twinkleSpeed;
                
                // Calcular progresso da absorção
                this.absorptionProgress = 1 - (distance / BLACK_HOLE_SIZE);
                this.absorptionProgress = Math.min(1, Math.max(0, this.absorptionProgress));
                
                // Reduzir tamanho gradualmente (mais rápido no final)
                const sizeReduction = this.absorptionProgress * this.absorptionProgress; // Curva quadrática
                this.size = this.originalSize * (1 - sizeReduction * 0.9);
            } else {
                // Se não está sendo absorvida, aplicar amortecimento à velocidade
                const friction = 0.95; // Reduz velocidade em 5% por frame
                this.vx *= friction;
                this.vy *= friction;
                
                // Aplicar velocidade residual (se houver)
                if (Math.abs(this.vx) > 0.01 || Math.abs(this.vy) > 0.01) {
                    this.x += this.vx;
                    this.y += this.vy;
                } else {
                    // Parar completamente se a velocidade for muito baixa
                    this.vx = 0;
                    this.vy = 0;
                }
                
                // Rotação normal
                this.rotation += this.rotationSpeed;
                this.twinkle += this.twinkleSpeed;
            }
            
            // Verificar se o centro da estrela saiu da área visível (antes de verificar absorção)
            if (this.x < 0 || this.x > canvas.width ||
                this.y < 0 || this.y > canvas.height) {
                return 'outOfBounds'; // Estrela saiu da tela
            }
            
            // Verificar se foi completamente absorvida (após verificar se saiu da tela)
            if (this.isBeingAbsorbed) {
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < BLACK_HOLE_SIZE * 0.8) {
                    return true; // Estrela foi absorvida
                }
            }
            
            return false; // Estrela ainda existe
        }
    }

    function getRandomPosition() {
        const margin = 50;
        const width = canvas.width || window.innerWidth;
        const height = canvas.height || window.innerHeight;
        return {
            x: margin + Math.random() * (width - 2 * margin),
            y: margin + Math.random() * (height - 2 * margin)
        };
    }

    function spawnStar() {
        if (stars.length < MAX_STARS) {
            const pos = getRandomPosition();
            stars.push(new Star(pos.x, pos.y));
        }
    }

    // Função para atualizar posição do buraco negro
    function updateBlackHolePosition(x, y) {
        const rect = canvas.getBoundingClientRect();
        
        // Calcular posição relativa ao canvas
        // Em mobile, o canvas pode ter escala diferente, então calculamos a proporção
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        // Posição relativa ao canvas
        const relativeX = (x - rect.left) * scaleX;
        const relativeY = (y - rect.top) * scaleY;
        
        // Atualizar posição (garantir que está dentro dos limites)
        mouseX = Math.max(0, Math.min(canvas.width, relativeX));
        mouseY = Math.max(0, Math.min(canvas.height, relativeY));
    }

    // Eventos de mouse (desktop)
    canvas.addEventListener('mousemove', (e) => {
        updateBlackHolePosition(e.clientX, e.clientY);
    });

    // Eventos de touch (mobile) - cálculo direto para melhor precisão
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            // Calcular posição considerando a escala do canvas
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            mouseX = (touch.clientX - rect.left) * scaleX;
            mouseY = (touch.clientY - rect.top) * scaleY;
            // Garantir limites
            mouseX = Math.max(0, Math.min(canvas.width, mouseX));
            mouseY = Math.max(0, Math.min(canvas.height, mouseY));
        }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            // Calcular posição considerando a escala do canvas
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            mouseX = (touch.clientX - rect.left) * scaleX;
            mouseY = (touch.clientY - rect.top) * scaleY;
            // Garantir limites
            mouseX = Math.max(0, Math.min(canvas.width, mouseX));
            mouseY = Math.max(0, Math.min(canvas.height, mouseY));
        }
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        // Manter última posição conhecida quando o toque terminar
    });

    canvas.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        // Manter última posição conhecida se o toque for cancelado
    });

    function gameLoop() {
        const currentTime = Date.now();
        
        // Limpar canvas
        ctx.fillStyle = '#0f0f1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Desenhar nuvens
        clouds.forEach(cloud => {
            cloud.update();
            cloud.draw();
        });
        
        // Spawn de estrelas
        if (currentTime - lastStarSpawn > STAR_SPAWN_INTERVAL) {
            spawnStar();
            lastStarSpawn = currentTime;
        }
        
        // Atualizar e desenhar estrelas
        for (let i = stars.length - 1; i >= 0; i--) {
            const star = stars[i];
            const result = star.update(mouseX, mouseY);
            
            if (result === true) {
                // Estrela foi absorvida pelo buraco negro
                stars.splice(i, 1);
                score++;
                if (scoreElement) {
                    scoreElement.textContent = `Estrelas: ${score}`;
                }
            } else if (result === 'outOfBounds') {
                // Estrela saiu da tela - remover e criar nova
                stars.splice(i, 1);
                spawnStar(); // Criar nova estrela imediatamente
            } else {
                // Estrela ainda está na tela - desenhar
                star.draw();
            }
        }
        
        // Atualizar rotação do buraco negro
        blackHoleRotation += 0.05;
        
        // Desenhar buraco negro (cursor)
        ctx.globalAlpha = 1;
        ctx.save();
        ctx.translate(mouseX, mouseY);
        
        // Anel externo rotativo (horizonte de eventos)
        ctx.rotate(blackHoleRotation);
        const gradient = ctx.createRadialGradient(0, 0, BLACK_HOLE_SIZE * 0.5, 0, 0, BLACK_HOLE_SIZE * 2);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(0.3, 'rgba(30, 30, 60, 0.4)');
        gradient.addColorStop(0.6, 'rgba(50, 50, 100, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, BLACK_HOLE_SIZE * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Anel médio rotativo (mais rápido)
        ctx.rotate(-blackHoleRotation * 1.5);
        ctx.strokeStyle = 'rgba(80, 80, 150, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, BLACK_HOLE_SIZE * 1.2, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
        
        // Buraco negro central (preto sólido)
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, BLACK_HOLE_SIZE, 0, Math.PI * 2);
        ctx.fill();
        
        // Anel interno brilhante (efeito de distorção)
        ctx.strokeStyle = 'rgba(120, 120, 200, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, BLACK_HOLE_SIZE * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        
        // Ponto central brilhante
        ctx.fillStyle = 'rgba(150, 150, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, BLACK_HOLE_SIZE * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        requestAnimationFrame(gameLoop);
    }

    // Iniciar
    initClouds();
    spawnStar();
    requestAnimationFrame(gameLoop);
});
