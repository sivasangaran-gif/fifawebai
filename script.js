// StadiumGPT AI - Main JavaScript logic

// ==================== GLOBAL VARIABLES & STATES ====================
let selectedGate = null;
let stadiumZoom = 1.0;
let charts = {};
const gateTelemetry = {
    'Global': { density: 87, power: 1.42, water: 18.6, waste: 68 },
    'Gate A': { density: 54, power: 0.85, water: 12.4, waste: 42 },
    'Gate B': { density: 82, power: 1.25, water: 16.8, waste: 71 },
    'Gate C': { density: 35, power: 0.52, water: 6.2,  waste: 28 },
    'Gate D': { density: 94, power: 1.82, water: 22.4, waste: 89 },
    'Gate E': { density: 62, power: 0.98, water: 10.5, waste: 55 }
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Initialize Live Clock
    startClock();

    // Initialize Charts
    initCharts();

    // Live Ticker Fluctuation Loop
    setInterval(runLiveTicker, 4000);
});

// ==================== SYSTEM TIME CLOCK ====================
function startClock() {
    const clockEl = document.getElementById('live-clock');
    if (!clockEl) return;

    function updateTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        clockEl.textContent = `${hours}:${minutes}:${seconds}`;
    }

    updateTime();
    setInterval(updateTime, 1000);
}

// ==================== CHARTS INITIALIZATION ====================
function initCharts() {
    const ctxDensity = document.getElementById('chart-crowd-density').getContext('2d');
    const ctxPower = document.getElementById('chart-power-draw').getContext('2d');
    const ctxWater = document.getElementById('chart-water-flow').getContext('2d');
    const ctxWaste = document.getElementById('chart-waste-capacity').getContext('2d');

    // Gradient helper
    function createGlowGradient(ctx, color) {
        const grad = ctx.createLinearGradient(0, 0, 0, 110);
        grad.addColorStop(0, `${color}40`); // 25% opacity
        grad.addColorStop(1, `${color}00`); // 0% opacity
        return grad;
    }

    // Chart Configuration Generator
    function makeChartConfig(ctx, label, color, type = 'line', step = false) {
        const grad = createGlowGradient(ctx, color);
        return {
            type: 'line',
            data: {
                labels: ['20:15', '20:20', '20:25', '20:30', '20:35', '20:40', '20:45'],
                datasets: [{
                    label: label,
                    data: [65, 59, 80, 81, 56, 72, 87],
                    borderColor: color,
                    borderWidth: 2,
                    backgroundColor: grad,
                    fill: true,
                    tension: step ? 0 : 0.4,
                    stepped: step,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    pointHoverBackgroundColor: color,
                    pointHoverBorderColor: '#FFFFFF',
                    pointHoverBorderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        mode: 'index',
                        intersect: false,
                        backgroundColor: '#101B45',
                        titleColor: '#FFFFFF',
                        bodyColor: '#A5B4FC',
                        borderColor: 'rgba(255,255,255,0.08)',
                        borderWidth: 1,
                        padding: 8,
                        titleFont: { size: 9, weight: 'bold' },
                        bodyFont: { size: 10 }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 8 } }
                    },
                    y: {
                        display: false,
                        grid: { display: false }
                    }
                }
            }
        };
    }

    // 1. Crowd Density (Red)
    charts.density = new Chart(ctxDensity, makeChartConfig(ctxDensity, 'Density', '#FF5252'));
    charts.density.data.datasets[0].data = [72, 75, 78, 80, 84, 85, 87];
    charts.density.update();

    // 2. Power Draw (Green)
    charts.power = new Chart(ctxPower, makeChartConfig(ctxPower, 'Power', '#00E676'));
    charts.power.data.datasets[0].data = [1.2, 1.25, 1.3, 1.28, 1.35, 1.38, 1.42];
    charts.power.update();

    // 3. Water Flow (Cyan/Blue)
    charts.water = new Chart(ctxWater, makeChartConfig(ctxWater, 'Water', '#00C8FF'));
    charts.water.data.datasets[0].data = [19.2, 18.9, 18.5, 18.7, 18.3, 18.8, 18.6];
    charts.water.update();

    // 4. Waste Capacity (Yellow stepped)
    charts.waste = new Chart(ctxWaste, makeChartConfig(ctxWaste, 'Waste', '#FFC107', 'line', true));
    charts.waste.data.datasets[0].data = [50, 52, 58, 60, 64, 65, 68];
    charts.waste.update();
}

// ==================== LIVE TICKER SIMULATION ====================
function runLiveTicker() {
    // Only fluctuate if looking at Global view or a selected gate
    const gate = selectedGate || 'Global';
    const base = gateTelemetry[gate];

    // Fluctuate stats
    const deltaDensity = (Math.random() - 0.45) * 1.5;
    const deltaPower = (Math.random() - 0.48) * 0.05;
    const deltaWater = (Math.random() - 0.5) * 0.4;
    const deltaWaste = (Math.random() - 0.3) * 0.8;

    // Apply fluctuations
    base.density = Math.min(100, Math.max(10, +(base.density + deltaDensity).toFixed(1)));
    base.power = Math.min(3.0, Math.max(0.1, +(base.power + deltaPower).toFixed(2)));
    base.water = Math.min(40.0, Math.max(1.0, +(base.water + deltaWater).toFixed(1)));
    base.waste = Math.min(100, Math.max(5, +(base.waste + deltaWaste).toFixed(1)));

    // Update UI elements
    updateTelemetryUI(gate, base);
}

function updateTelemetryUI(gateName, base) {
    // Update dashboard statistics card metrics
    if (gateName === 'Global') {
        const attendanceRaw = 72190 + Math.floor((Math.random() - 0.3) * 12);
        document.getElementById('stat-attendance').innerHTML = `${attendanceRaw.toLocaleString()} <span class="text-xs font-normal text-gray-400">/ 80k</span>`;
        const occupancy = ((attendanceRaw / 80000) * 100).toFixed(1);
        document.getElementById('stat-occupancy').textContent = `${occupancy}%`;
        document.getElementById('attendance-bar').style.width = `${occupancy}%`;
    }

    // Update chart numbers
    document.getElementById('chart-density-val').textContent = `${Math.round(base.density)}%`;
    document.getElementById('chart-power-val').textContent = `${base.power} MW`;
    document.getElementById('chart-water-val').textContent = `${base.water} KL/min`;
    document.getElementById('chart-waste-val').textContent = `${Math.round(base.waste)}%`;

    // Append/Fluctuate chart data arrays
    if (charts.density) {
        updateChartDataset(charts.density, base.density);
        updateChartDataset(charts.power, base.power);
        updateChartDataset(charts.water, base.water);
        updateChartDataset(charts.waste, base.waste);
    }
}

function updateChartDataset(chart, newVal) {
    const data = chart.data.datasets[0].data;
    data.shift();
    data.push(newVal);
    
    // Rotate timestamps labels
    const labels = chart.data.labels;
    const lastLabel = labels[labels.length - 1];
    const parts = lastLabel.split(':');
    let mm = parseInt(parts[1]) + 1;
    let hh = parseInt(parts[0]);
    if (mm >= 60) {
        mm = 0;
        hh = (hh + 1) % 24;
    }
    const newLabel = `${hh < 10 ? '0' + hh : hh}:${mm < 10 ? '0' + mm : mm}`;
    labels.shift();
    labels.push(newLabel);

    chart.update('quiet');
}

// ==================== INTERACTIVE STADIUM MAP SECTOR CLICK ====================
function selectGate(gateId) {
    // If user clicked the already selected gate, revert to Global view
    if (selectedGate === gateId) {
        selectedGate = null;
        document.querySelectorAll('.stadium-sector').forEach(s => s.classList.remove('selected'));
        triggerToast("Viewing Global Arena Analytics Dashboard.");
        updateTelemetryUI('Global', gateTelemetry['Global']);
        return;
    }

    selectedGate = gateId;

    // Apply selected stroke/drop-shadow to SVG path
    document.querySelectorAll('.stadium-sector').forEach(s => {
        s.classList.remove('selected');
    });

    const svgId = `svg-gate-${gateId.toLowerCase().replace(' ', '-')}`;
    const pathEl = document.getElementById(svgId);
    if (pathEl) {
        pathEl.classList.add('selected');
    }

    // Trigger toast notification
    triggerToast(`Inspecting ${gateId}. Showing local telemetry analytics.`);

    // Instantly update stats with static gate data
    const telemetry = gateTelemetry[gateId];
    updateTelemetryUI(gateId, telemetry);
}

// ==================== ZOOM / CONTROLS FOR STADIUM MAP ====================
function zoomStadium(amount) {
    stadiumZoom *= amount;
    stadiumZoom = Math.min(2.5, Math.max(0.6, stadiumZoom)); // constraint
    const svg = document.getElementById('stadium-svg');
    if (svg) {
        svg.style.transform = `scale(${stadiumZoom})`;
    }
}

function toggleFullscreen(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            triggerToast("Fullscreen mode not supported by this browser.");
        });
        container.classList.add('p-10', 'bg-navy-dark');
    } else {
        document.exitFullscreen();
        container.classList.remove('p-10', 'bg-navy-dark');
    }
}

// ==================== AI ASSISTANT CHAT SYSTEM ====================
function sendChatMessage(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('ai-chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    appendChatMessage('User', msg);
    input.value = '';

    // Create AI response typing/delay
    setTimeout(() => {
        const response = getAIResponseText(msg);
        appendChatMessage('AI', response);
    }, 700);
}

function quickAction(promptText) {
    appendChatMessage('User', promptText);
    setTimeout(() => {
        const response = getAIResponseText(promptText);
        appendChatMessage('AI', response);
    }, 600);
}

function appendChatMessage(sender, text) {
    const feed = document.getElementById('ai-chat-feed');
    if (!feed) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isAi = sender === 'AI';

    const msgHtml = isAi ? `
        <div class="flex items-start space-x-2 fade-in">
            <div class="w-6 h-6 rounded-lg bg-neon-purple/10 border border-neon-purple/30 flex items-center justify-center text-neon-purple text-[10px] font-bold">AI</div>
            <div class="bg-navy-dark/80 border border-navy-border/60 rounded-r-xl rounded-bl-xl p-2.5 text-gray-300 max-w-[85%]">
                <p>${text}</p>
                <span class="text-[8px] text-gray-500 block text-right mt-1">${time}</span>
            </div>
        </div>
    ` : `
        <div class="flex items-start justify-end space-x-2 fade-in">
            <div class="bg-neon-purple/10 border border-neon-purple/20 rounded-l-xl rounded-br-xl p-2.5 text-white max-w-[85%]">
                <p>${text}</p>
                <span class="text-[8px] text-gray-400 block text-right mt-1">${time}</span>
            </div>
            <div class="w-6 h-6 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan text-[10px] font-bold">U</div>
        </div>
    `;

    feed.insertAdjacentHTML('beforeend', msgHtml);
    feed.scrollTop = feed.scrollHeight;
}

function getAIResponseText(query) {
    const q = query.toLowerCase();
    const lang = document.getElementById('language-selector').value;

    const responses = {
        en: {
            exit: "Emergency exits are located at Gates A, B, D, and E. The nearest exit from your current position is Gate E. Follow the green glowing floor markings.",
            food: "Food courts are located on Concourse Levels 1 (Section 107) and 2 (Section 224). Level 1 has pizza and burgers; Level 2 features global cuisine.",
            medical: "The nearest First Aid station is at Gate C (West Concourse). Support team has been alerted and can be contacted via the Volunteer hub.",
            congestion: "Gate D is currently experiencing critical congestion (94% density). We recommend fans exit via Gate A or E where crowd flow is normal.",
            shuttle: "Shuttle buses run every 5 minutes from Lot 4 to the central metro station. Transit status is On Time.",
            generic: "I've analyzed the request. Stadium telemetry shows normal operations. Let me know if you need specific route planning or gate capacity forecasts."
        },
        es: {
            exit: "Las salidas de emergencia están ubicadas en las Puertas A, B, D y E. La salida más cercana es la Puerta E. Siga las marcas iluminadas en verde.",
            food: "Las plazas de comida están en los niveles 1 (Sección 107) y 2 (Sección 224). Hamburguesas y pizza disponibles.",
            medical: "La estación de primeros auxilios más cercana está en la Puerta C. Hemos alertado al equipo médico de apoyo.",
            congestion: "La Puerta D tiene congestión crítica (94%). Le recomendamos salir por la Puerta A o E.",
            shuttle: "Los autobuses lanzadera salen cada 5 minutos hacia el metro. Estado del tránsito: A tiempo.",
            generic: "Entendido. La telemetría del estadio muestra operaciones normales. ¿En qué más puedo ayudarle?"
        },
        fr: {
            exit: "Les sorties de secours sont situées aux Portes A, B, D et E. La sortie la plus proche est la Porte E. Suivez les flèches lumineuses vertes.",
            food: "Les restaurants sont situés au Niveau 1 (Section 107) et Niveau 2 (Section 224). Pizzas, burgers et spécialités mondiales.",
            medical: "Le poste de secours le plus proche est à la Porte C (Hall Ouest). L'équipe médicale a été prévenue.",
            congestion: "La Porte D est très encombrée (94% de densité). Veuillez utiliser les Portes A ou E pour sortir.",
            shuttle: "Navettes gratuites toutes les 5 minutes vers le métro. Statut du transit: À l'heure.",
            generic: "Demande analysée. Les systèmes fonctionnent normalement. Posez-moi des questions sur les navettes ou la sécurité."
        },
        ar: {
            exit: "مخارج الطوارئ تقع عند البوابات A و B و D و E. المخرج الأقرب هو البوابة E. يرجى اتباع الإشارات المضيئة باللون الأخضر.",
            food: "صالة الطعام تقع في الطابق الأول (قسم 107) والطابق الثاني (قسم 224). تتوفر الوجبات السريعة والمأكولات العالمية.",
            medical: "أقرب وحدة إسعافات أولية تقع عند البوابة C. تم إخطار فريق الدعم الطبي.",
            congestion: "البوابة D تشهد ازدحاماً حرجاً (94%). ننصح باستخدام البوابة A أو E للخروج الآمن.",
            shuttle: "الحافلات الترددية تعمل كل 5 دقائق إلى محطة المترو الرئيسية. حركة المرور منتظمة.",
            generic: "تمت معالجة الطلب. القياسات الحيوية للملعب طبيعية. كيف يمكنني مساعدتك أكثر؟"
        },
        ja: {
            exit: "非常口はゲートA、B、D、Eにあります。現在地から最も近いのはゲートEです。緑色の誘導表示に従ってください。",
            food: "フードコートは1階（107セクション）と2階（224セクション）にあります。ピザ、バーガー、多国籍料理があります。",
            medical: "最寄りの救護所はゲートC（西コンコース）にあります。ボランティアチームがサポート可能です。",
            congestion: "ゲートDは現在非常に混雑しています（混雑率94%）。ゲートAまたはEからの退場をお勧めします。",
            shuttle: "シャトルバスは5分間隔で中央駅まで運行しています。運行状況：平常通り。",
            generic: "スタジアムの運行システムは正常です。ルート案内、ゲート混雑予測など何でもお尋ねください。"
        }
    };

    const dict = responses[lang] || responses['en'];

    if (q.includes('exit') || q.includes('out') || q.includes('salida') || q.includes('sortie') || q.includes('مخرج') || q.includes('出口') || q.includes('非常')) {
        return dict.exit;
    } else if (q.includes('food') || q.includes('eat') || q.includes('comida') || q.includes('nourriture') || q.includes('طعام') || q.includes('フード') || q.includes('飯')) {
        return dict.food;
    } else if (q.includes('medical') || q.includes('doctor') || q.includes('help') || q.includes('aid') || q.includes('médical') || q.includes('إسعاف') || q.includes('救護') || q.includes('医')) {
        return dict.medical;
    } else if (q.includes('congestion') || q.includes('crowd') || q.includes('gate d') || q.includes('tráfico') || q.includes('ازدحام') || q.includes('混雑')) {
        return dict.congestion;
    } else if (q.includes('shuttle') || q.includes('bus') || q.includes('metro') || q.includes('autobús') || q.includes('navette') || q.includes('バス') || q.includes('電車')) {
        return dict.shuttle;
    } else {
        return dict.generic;
    }
}

function switchLanguage() {
    const lang = document.getElementById('language-selector').value;
    const greetEl = document.getElementById('ai-greet-message');
    const inputEl = document.getElementById('ai-chat-input');

    const greets = {
        en: "Hello! I am your StadiumGPT assistant. Ask me anything about routes, crowds, accessibility or emergency status.",
        es: "¡Hola! Soy tu asistente StadiumGPT. Pregúntame sobre rutas, multitudes, accesibilidad o seguridad de emergencia.",
        fr: "Bonjour! Je suis votre assistant StadiumGPT. Posez-moi des questions sur les navettes, la foule ou la sécurité.",
        ar: "مرحباً! أنا مساعدك الذكي في الملعب. اسألني عن مسارات التنقل، الازدحام، الإسعافات أو الطوارئ.",
        ja: "こんにちは！スタジアムGPTアシスタントです。混雑状況、非常口、シャトルバスについてお気軽にご質問ください。"
    };

    const placeholders = {
        en: "Ask anything...",
        es: "Pregunta algo...",
        fr: "Poser une question...",
        ar: "اسأل عن أي شيء...",
        ja: "質問を入力してください..."
    };

    if (greetEl) greetEl.textContent = greets[lang] || greets['en'];
    if (inputEl) inputEl.placeholder = placeholders[lang] || placeholders['en'];

    triggerToast(`Language switched to: ${document.getElementById('language-selector').options[document.getElementById('language-selector').selectedIndex].text}`);
}

function triggerMicMock() {
    triggerToast("Listening... Speak now. (Voice transcription simulation activated)");
    setTimeout(() => {
        const input = document.getElementById('ai-chat-input');
        if (input) {
            input.value = "Where is the nearest emergency exit?";
            triggerToast("Voice transcription complete: 'Where is the nearest emergency exit?'");
        }
    }, 2000);
}

// ==================== VOLUNTEER AI COPILOT HUB ====================
function volunteerPill(text) {
    const searchInput = document.getElementById('copilot-search');
    if (searchInput) {
        searchInput.value = text;
        triggerToast(`Query populated: "${text}"`);
    }
}

function triggerCopilotSearch() {
    const input = document.getElementById('copilot-search');
    const val = input.value.trim();
    if (!val) {
        triggerToast("Please enter a question or click a quick prompt pill.");
        return;
    }

    triggerToast(`AI Copilot Searching: "${val}"`);

    // Simulated responses
    setTimeout(() => {
        let answer = "Volunteer Copilot: Query resolved. Showing guide protocol on screen.";
        if (val.toLowerCase().includes('lost')) {
            answer = "Lost & Found is located at Central Gate Lobby desk A. Open until 23:00.";
        } else if (val.toLowerCase().includes('exit')) {
            answer = "All 24 emergency gate doors are unlocked. Evacuation routes clear.";
        } else if (val.toLowerCase().includes('medical')) {
            answer = "Emergency MEDICAL broadcast initiated to Section C12 crew. Response team dispatched.";
            // Add a new alert to feed!
            addNewAlert("Medical Team Dispatch", "Block C12 Responder dispatched", "High");
        } else if (val.toLowerCase().includes('shift')) {
            answer = "Shift Schedule: Volunteer Group C shift ends in 15 minutes. Group D standby.";
        }

        // Show answer in modal / toast
        triggerToast(answer, 5000);
    }, 800);
}

// ==================== ALERTS LOG & SIDEBAR ====================
function toggleNotifications() {
    const dropdown = document.getElementById('notifications-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
}

function toggleAlertsFeed(show) {
    const sidebar = document.getElementById('alerts-sidebar');
    const overlay = document.getElementById('alerts-overlay');

    if (show) {
        sidebar.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.remove('opacity-0'), 50);
    } else {
        sidebar.classList.add('translate-x-full');
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }

    // Hide notifications dropdown if open
    const dropdown = document.getElementById('notifications-dropdown');
    if (dropdown) dropdown.classList.add('hidden');
}

function addNewAlert(title, desc, priority) {
    const feed = document.getElementById('main-alerts-feed');
    const logList = document.getElementById('alerts-log-list');
    if (!feed || !logList) return;

    const time = "Just now";
    const priorityColor = priority.toLowerCase() === 'high' ? 'neon-red' : 'neon-yellow';
    
    // Create feed item HTML
    const feedItem = `
        <div class="p-2.5 bg-navy-dark/50 border-l-2 border-${priorityColor} border-y border-r border-navy-border rounded-r-xl flex items-center justify-between fade-in">
            <div class="flex items-center space-x-3 text-xs">
                <div class="w-7 h-7 rounded-lg bg-${priorityColor}/10 flex items-center justify-center text-${priorityColor}"><i data-lucide="bell" class="w-3.5 h-3.5"></i></div>
                <div>
                    <p class="font-semibold text-white">${title}</p>
                    <p class="text-[9px] text-gray-400">${desc}</p>
                </div>
            </div>
            <div class="text-right">
                <span class="px-2 py-0.5 rounded bg-${priorityColor}/15 text-${priorityColor} border border-${priorityColor}/20 text-[9px] font-bold uppercase">${priority}</span>
                <p class="text-[8px] text-gray-500 mt-1">${time}</p>
            </div>
        </div>
    `;

    // Create log item HTML
    const logItem = `
        <div class="p-3 bg-navy-dark/50 border border-navy-border rounded-xl fade-in">
            <div class="flex justify-between items-start mb-1">
                <span class="text-xs font-semibold text-white">${title}</span>
                <span class="px-1.5 py-0.5 rounded bg-${priorityColor}/10 border border-${priorityColor}/20 text-${priorityColor} text-[8px] font-bold uppercase">${priority}</span>
            </div>
            <p class="text-[10px] text-gray-400">${desc}</p>
            <span class="text-[8px] text-gray-500 mt-2 block">${new Date().toLocaleString()} (Just now)</span>
        </div>
    `;

    // Insert at top of lists
    feed.insertAdjacentHTML('afterbegin', feedItem);
    logList.insertAdjacentHTML('afterbegin', logItem);

    // Limit feed items to 3
    if (feed.children.length > 3) {
        feed.removeChild(feed.lastChild);
    }

    // Refresh lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Fluctuates active alerts counter
    const counter = document.getElementById('stat-alerts');
    if (counter) {
        const currentAlerts = parseInt(counter.textContent) || 8;
        counter.textContent = `${currentAlerts + 1} Alerts`;
    }
}

function clearAlertsLog() {
    const logList = document.getElementById('alerts-log-list');
    if (logList) {
        logList.innerHTML = '<p class="text-xs text-gray-500 text-center py-8">Historical log cleared. No active alerts.</p>';
    }
    const counter = document.getElementById('stat-alerts');
    if (counter) counter.textContent = '0 Alerts';
    triggerToast("Cleared all historical operations alerts.");
}

// ==================== MODALS OPEN/CLOSE ====================
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.remove('opacity-0'), 50);
    } else {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
}

function closeModalOnOuterClick(e, modalId) {
    if (e.target.id === modalId) {
        toggleModal(modalId);
    }
}

// ==================== TOAST NOTIFICATIONS ENGINE ====================
function triggerToast(message, duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const id = 'toast-' + Math.random().toString(36).substr(2, 9);
    const toastHtml = `
        <div id="${id}" class="pointer-events-auto flex items-center p-3 bg-navy-card/95 border border-neon-cyan/40 hover:border-neon-cyan text-white text-xs font-semibold rounded-xl shadow-xl w-72 animate-toast transition-all">
            <div class="mr-3 p-1.5 bg-neon-cyan/10 rounded-lg text-neon-cyan">
                <i data-lucide="info" class="w-4 h-4"></i>
            </div>
            <div class="flex-1">${message}</div>
            <button onclick="removeToast('${id}')" class="ml-3 text-gray-400 hover:text-white transition-colors">
                <i data-lucide="x" class="w-4.5 h-4.5"></i>
            </button>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', toastHtml);
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Auto dismiss
    setTimeout(() => {
        removeToast(id);
    }, duration);
}

function removeToast(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.add('opacity-0', 'scale-95');
        setTimeout(() => el.remove(), 300);
    }
}
