// ==========================================
// 1. 注入专业的 CSS 样式 (尺寸已优化)
// ==========================================
const style = document.createElement('style');
style.textContent = `
    :root {
        --neon-green: #39ff14;
    }

    #ai-floating-bubble {
        position: fixed;
        bottom: 100px;
        right: 20px;
        /* 📏 尺寸调整：从 50px -> 38px (缩小约 1/4) */
        width: 38px;
        height: 38px;
        border-radius: 50%;
        
        background-color: var(--neon-green);
        color: black;
        /* 🔡 字体调整：从 24px -> 18px (保持比例) */
        font-size: 18px;
        
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        user-select: none;
        cursor: grab;
        
        /* 光晕也相应调整得细腻一点 */
        box-shadow: 0 0 8px rgba(57, 255, 20, 0.6), 
                    0 0 16px rgba(57, 255, 20, 0.4);
                    
        transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    /* --- 鼠标悬停状态 --- */
    #ai-floating-bubble:not(.dragging):hover {
        /* 悬停时放大倍率保持 1.2，依然有弹出的感觉 */
        transform: scale(1.2) translateY(-3px);
        
        box-shadow: 0 0 15px rgba(57, 255, 20, 1), 
                    0 0 30px rgba(57, 255, 20, 0.8),
                    0 0 45px rgba(57, 255, 20, 0.6);
        filter: brightness(1.1);
    }

    /* --- 拖拽中状态 --- */
    #ai-floating-bubble.dragging {
        cursor: grabbing !important;
        transform: scale(1.0) !important;
        box-shadow: 0 0 10px rgba(57, 255, 20, 0.8) !important;
        transition: none !important;
    }
    
    /* --- 处理中状态 --- */
    #ai-floating-bubble.processing {
        background-color: #ff9800 !important;
        box-shadow: 0 0 15px rgba(255, 152, 0, 0.8), 
                    0 0 30px rgba(255, 152, 0, 0.6) !important;
        animation: pulse 1s infinite alternate;
    }
    
    @keyframes pulse {
        from { transform: scale(1); }
        to { transform: scale(1.1); }
    }
`;
document.head.appendChild(style);


// ==========================================
// 2. 创建 DOM 元素
// ==========================================
const button = document.createElement("div");
button.innerText = "🪄"; 
button.id = "ai-floating-bubble";
document.body.appendChild(button);


// ==========================================
// 3. JS 逻辑 (保持不变)
// ==========================================
let isDragging = false;
let hasMoved = false;
let startX, startY, initialLeft, initialTop;

button.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    hasMoved = false;
    button.classList.add('dragging');
    
    const rect = button.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    initialLeft = rect.left;
    initialTop = rect.top;

    button.style.bottom = "auto";
    button.style.right = "auto";
    button.style.left = `${initialLeft}px`;
    button.style.top = `${initialTop}px`;
});

window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasMoved = true;
    button.style.left = `${initialLeft + dx}px`;
    button.style.top = `${initialTop + dy}px`;
});

window.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    button.classList.remove('dragging');
});

// ==========================================
// 4. 点击事件
// ==========================================
button.addEventListener("click", () => {
    if (hasMoved) return; 

    const inputBox = document.querySelector('div[contenteditable="true"]');
    if (!inputBox) { alert("❌ 找不到输入框！"); return; }
    
    const originalText = inputBox.innerText;
    if (!originalText.trim()) { alert("⚠️ 请先写点什么！"); return; }

    const originalIcon = button.innerText;
    button.innerText = "⏳";
    button.classList.add('processing');

    chrome.runtime.sendMessage(
        { action: "optimize_prompt", text: originalText },
        (response) => {
            button.innerText = originalIcon;
            button.classList.remove('processing');

            if (response && response.result) {
                inputBox.focus();
                document.execCommand('selectAll', false, null);
                document.execCommand('insertText', false, response.result);
            }
        }
    );
});