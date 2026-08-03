(function() {
    'use strict';

    // Tạo CSS cho bảng HUD
    const style = document.createElement('style');
    style.innerHTML = `
        #custom-status-hud {
            position: fixed !important;
            top: 80px !important;
            right: 20px !important;
            width: 240px !important;
            background: rgba(20, 20, 20, 0.85) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 10px !important;
            padding: 12px !important;
            color: #ffffff !important;
            font-family: monospace !important;
            z-index: 999999 !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.6) !important;
        }
        .status-title {
            font-weight: bold;
            font-size: 13px;
            color: #ffcc00;
            text-align: center;
            margin-bottom: 8px;
            border-bottom: 1px solid rgba(255,255,255,0.15);
            padding-bottom: 4px;
        }
        .status-grid {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        .status-item {
            text-align: center;
            flex: 1;
        }
        .status-circle {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid #ffcc00;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            margin: 0 auto 2px auto;
            background: rgba(0, 0, 0, 0.4);
        }
        .status-text-row {
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            margin: 3px 0;
            border-bottom: 1px dashed rgba(255,255,255,0.1);
            padding-bottom: 2px;
        }
        .status-quest-box {
            margin-top: 8px;
            font-size: 11px;
            background: rgba(255, 255, 255, 0.08);
            padding: 5px;
            border-radius: 6px;
            color: #00ffcc;
            text-align: center;
        }
    `;
    document.head.appendChild(style);

    // Tạo khung HTML
    function createStatusPanel() {
        if (document.getElementById('custom-status-hud')) return;

        const html = `
            <div id="custom-status-hud">
                <div class="status-title">💎 System Status</div>
                <div class="status-grid">
                    <div class="status-item">
                        <div class="status-circle" id="stat-sans">100%</div>
                        <small>SANS</small>
                    </div>
                    <div class="status-item">
                        <div class="status-circle" id="stat-energy">LOCK</div>
                        <small>Energy</small>
                    </div>
                    <div class="status-item">
                        <div class="status-circle" id="stat-hp">1000</div>
                        <small>HP</small>
                    </div>
                </div>
                <div class="status-text-row"><span>Lv:</span> <span id="stat-lv">0</span></div>
                <div class="status-text-row"><span>Strength:</span> <span id="stat-str">40</span></div>
                <div class="status-text-row"><span>Intelligence:</span> <span id="stat-int">100</span></div>
                <div class="status-text-row"><span>Dream Sand:</span> <span id="stat-ds">0</span></div>
                <div class="status-quest-box" id="stat-quest">Quest: 01 - Bảng Đen Bí Ẩn</div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    }

    // Đọc số liệu từ thẻ <status> trong tin nhắn chat
    function parseAndUpdateStatus() {
        const chatTextElements = document.querySelectorAll('.mes_text');
        if (chatTextElements.length === 0) return;

        const lastMessage = chatTextElements[chatTextElements.length - 1].innerText;
        const match = lastMessage.match(/<status>([\s\S]*?)<\/status>/i);
        if (!match) return;

        const statusContent = match[1];
        const getVal = (key) => {
            const regex = new RegExp(`${key}:\\s*(.+)`, 'i');
            const m = statusContent.match(regex);
            return m ? m[1].trim() : null;
        };

        const lv = getVal('Lv');
        const hp = getVal('HP');
        const str = getVal('Strength');
        const intel = getVal('Intelligence');
        const energy = getVal('Energy');
        const ds = getVal('Dream Sand');
        const sans = getVal('SANS');
        const quest = getVal('Quest');

        if (lv && document.getElementById('stat-lv')) document.getElementById('stat-lv').innerText = lv;
        if (hp && document.getElementById('stat-hp')) document.getElementById('stat-hp').innerText = hp;
        if (str && document.getElementById('stat-str')) document.getElementById('stat-str').innerText = str;
        if (intel && document.getElementById('stat-int')) document.getElementById('stat-int').innerText = intel;
        if (energy && document.getElementById('stat-energy')) document.getElementById('stat-energy').innerText = energy;
        if (ds && document.getElementById('stat-ds')) document.getElementById('stat-ds').innerText = ds;
        if (sans && document.getElementById('stat-sans')) document.getElementById('stat-sans').innerText = sans;
        if (quest && document.getElementById('stat-quest')) document.getElementById('stat-quest').innerText = "Quest: " + quest;
    }

    // Khởi chạy
    setTimeout(createStatusPanel, 1500);

    const observer = new MutationObserver(() => {
        parseAndUpdateStatus();
    });

    const checkInterval = setInterval(() => {
        const chatContainer = document.getElementById('chat') || document.querySelector('#chat') || document.querySelector('#chat_container');
        if (chatContainer) {
            observer.observe(chatContainer, { childList: true, subtree: true });
            clearInterval(checkInterval);
            parseAndUpdateStatus();
        }
    }, 1000);
})();
