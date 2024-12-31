const CONFIG = {
    fireworkCount: 20,          // 增加烟花数量
    fireworkSpeed: 4,           
    particleCount: 200,         // 增加粒子数量
    particleSize: 1.5,          // 减小粒子大小
    particleSpeed: 12,          // 增加扩散速度
    colors: [                   // 增加更多颜色
        '255, 0, 0',           // 红
        '0, 255, 0',           // 绿
        '0, 0, 255',           // 蓝
        '255, 255, 0',         // 黄
        '255, 0, 255',         // 紫
        '0, 255, 255',         // 青
        '255, 165, 0',         // 橙
        '255, 192, 203',       // 粉
        '255, 255, 255',       // 白
        '255, 215, 0',         // 金
        '138, 43, 226',        // 紫罗兰
        '0, 255, 127',         // 春绿
        '255, 69, 0',          // 红橙
        '147, 112, 219',       // 淡紫
        '64, 224, 208'         // 青绿
    ]
};

const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
const countdownElement = document.getElementById('countdown');

// 设置画布大小
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 烟花粒子类
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * CONFIG.particleSpeed,
            y: (Math.random() - 0.5) * CONFIG.particleSpeed
        };
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.015;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, CONFIG.particleSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fill();
    }

    update() {
        this.velocity.y += 0.1;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
    }
}

// 烟花类
class Firework {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * (canvas.height * 0.5);
        this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
        this.speed = CONFIG.fireworkSpeed;
        this.particles = [];
        this.dead = false;
    }

    explode() {
        for (let i = 0; i < CONFIG.particleCount; i++) {
            this.particles.push(new Particle(this.x, this.y, this.color));
        }
    }

    update() {
        if (this.y > this.targetY) {
            this.y -= this.speed;
        } else if (!this.dead) {
            this.explode();
            this.dead = true;
        }

        this.particles.forEach((particle, index) => {
            particle.update();
            if (particle.alpha <= 0) {
                this.particles.splice(index, 1);
            }
        });

        if (this.dead && this.particles.length === 0) {
            this.reset();
        }
    }

    draw() {
        if (!this.dead) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, CONFIG.particleSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, 1)`;
            ctx.fill();
        }

        this.particles.forEach(particle => {
            particle.draw();
        });
    }
}

// 创建多个烟花实例
const fireworks = Array(CONFIG.fireworkCount).fill().map(() => new Firework());

// 倒计时函数
function updateCountdown() {
    const now = new Date();
    const targetYear = new Date('2025-01-01T00:00:00');
    const diff = targetYear - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    countdownElement.innerHTML = `${days}天 ${hours}时 ${minutes}分 ${seconds}秒`;
}

// 动画循环
function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach(firework => {
        firework.update();
        firework.draw();
    });

    requestAnimationFrame(animate);
}

// 启动动画和倒计时
animate();
setInterval(updateCountdown, 1000);
updateCountdown(); 