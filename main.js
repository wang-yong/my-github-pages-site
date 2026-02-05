// 主应用逻辑
class TextScroller {
    constructor() {
        // DOM 元素
        this.inputSection = document.getElementById('inputSection');
        this.playSection = document.getElementById('playSection');
        this.textInput = document.getElementById('textInput');
        this.scrollText = document.getElementById('scrollText');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resumeBtn = document.getElementById('resumeBtn');
        this.exitBtn = document.getElementById('exitBtn');
        this.charCount = document.getElementById('charCount');
        this.fontSizeSlider = document.getElementById('fontSizeSlider');
        this.fontSizeValue = document.getElementById('fontSizeValue');
        this.speedSlider = document.getElementById('speedSlider');
        this.speedValue = document.getElementById('speedValue');

        // 滚动参数
        this.scrollSpeed = 30; // px/s
        this.fontSize = 32; // px
        this.currentPosition = 0;
        this.isScrolling = false;
        this.animationId = null;
        this.lastTimestamp = 0;
        this.textContent = '';

        this.init();
    }

    init() {
        // 绑定事件
        this.textInput.addEventListener('input', () => this.updateCharCount());
        this.startBtn.addEventListener('click', () => this.startPlay());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resumeBtn.addEventListener('click', () => this.resume());
        this.exitBtn.addEventListener('click', () => this.exit());

        // 字体大小滑块
        this.fontSizeSlider.addEventListener('input', (e) => {
            this.fontSize = parseInt(e.target.value);
            this.fontSizeValue.textContent = `${this.fontSize}px`;
        });

        // 速度滑块
        this.speedSlider.addEventListener('input', (e) => {
            this.scrollSpeed = parseInt(e.target.value);
            this.speedValue.textContent = `${this.scrollSpeed}px/s`;
        });

        // 初始化字符计数
        this.updateCharCount();
    }

    updateCharCount() {
        const count = this.textInput.value.length;
        this.charCount.textContent = count;
        this.startBtn.disabled = count === 0;
    }

    startPlay() {
        this.textContent = this.textInput.value.trim();
        if (!this.textContent) {
            alert('请输入文本内容');
            return;
        }

        // 切换到播放模式
        this.inputSection.classList.add('hidden');
        this.playSection.classList.remove('hidden');

        // 设置文本样式和内容
        this.scrollText.style.fontSize = `${this.fontSize}px`;
        this.scrollText.textContent = this.textContent;

        // 初始化位置（文本从屏幕底部下方开始）
        const containerHeight = this.playSection.offsetHeight;
        this.currentPosition = containerHeight;
        this.scrollText.style.transform = `translateY(${this.currentPosition}px)`;

        // 开始滚动
        this.isScrolling = true;
        this.lastTimestamp = performance.now();
        this.animate(this.lastTimestamp);
    }

    animate(timestamp) {
        if (!this.isScrolling) return;

        // 计算时间差
        const deltaTime = (timestamp - this.lastTimestamp) / 1000; // 转换为秒
        this.lastTimestamp = timestamp;

        // 更新位置
        this.currentPosition -= this.scrollSpeed * deltaTime;
        this.scrollText.style.transform = `translateY(${this.currentPosition}px)`;

        // 检查停止条件
        if (this.shouldStop()) {
            this.stop();
            return;
        }

        // 继续动画
        this.animationId = requestAnimationFrame((ts) => this.animate(ts));
    }

    shouldStop() {
        // 获取文本元素的边界
        const textRect = this.scrollText.getBoundingClientRect();
        const containerHeight = this.playSection.offsetHeight;
        const midline = containerHeight / 2;

        // 当最后一行（文本底部）超过屏幕中线时停止
        return textRect.bottom <= midline;
    }

    stop() {
        this.isScrolling = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    pause() {
        this.stop();
        this.pauseBtn.classList.add('hidden');
        this.resumeBtn.classList.remove('hidden');
    }

    resume() {
        this.isScrolling = true;
        this.lastTimestamp = performance.now();
        this.animate(this.lastTimestamp);
        this.pauseBtn.classList.remove('hidden');
        this.resumeBtn.classList.add('hidden');
    }

    exit() {
        // 停止动画
        this.stop();

        // 切换回输入模式
        this.playSection.classList.add('hidden');
        this.inputSection.classList.remove('hidden');

        // 重置状态
        this.currentPosition = 0;
        this.pauseBtn.classList.remove('hidden');
        this.resumeBtn.classList.add('hidden');
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new TextScroller();
});

export default TextScroller;
