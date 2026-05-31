const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);

// 🎯 [উইনগো কালার ট্রেড সিঙ্ক - মেগা সকেট প্রোটোকল লক]
const io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "ALLOWALL");
    res.setHeader("Content-Security-Policy", "frame-ancestors *; default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob:; style-src * 'unsafe-inline'; font-src * data:;");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// 🎰 [উইনগো কালার ট্রেড ওরিজিনাল ডোমেইন সিঙ্ক]
const MAIN_SITE_URL = "https://betlover247.onrender.com"; 

// ⚽ ওরিজিনাল পেনাল্টি শুটআউট ৫টি কিক ডাইনামিক কম্বো ওッズ লেভেল ম্যাট্রিক্স (পরপর গোলে ওッズ বুস্টার ভাই ভাই)
const penaltyOddsMultiplier = [1.92, 3.84, 7.68, 15.36, 30.72, 100.00];

// 💰 ১. লাইভ অ্যাকাউন্ট ব্যালেন্স নিয়ে আসার ডেডিকেটেড গেটওয়ে
app.get('/api/penalty-balance', async (req, res) => {
    const { userId, wallet } = req.query;
    const targetWallet = wallet || "main";
    try {
        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet",
            username: userId,
            amount: 0,
            wallet: targetWallet
        }, { timeout: 30000 });

        if (response.data && response.data.status === "ok" && response.data.balance !== undefined) {
            return res.json({ success: true, balance: response.data.balance });
        }
        return res.json({ success: false, balance: 0 });
    } catch (e) { return res.json({ success: false, balance: 0 }); }
});

// 🛫 ২. রিয়েল-টাইম কিক বাজি কস্ট রাউট (ব্যালেন্স ডিডাকশন প্রোটেকশন বর্ম ভাই ভাই)
app.post('/api/penalty-shoot', async (req, res) => {
    const { userId, betAmount, wallet } = req.body;
    const targetWallet = wallet || "main";
    const cost = parseFloat(betAmount) || 50;

    // 🔒 [বেট লিমিট ফিল্টার]: বাজি ১ টাকা থেকে ২০০০০ টাকা পর্যন্ত কঠোর লক!
    if (cost < 1 || cost > 20000) {
        return res.json({ success: false, message: "🚨 Invalid Bet Amount (৳১ - ৳Subcontinent)" });
    }

    try {
        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet",
            username: userId,
            amount: cost,
            wallet: targetWallet
        }, { timeout: 30000 });

        if (response.data && response.data.status === "ok") {
            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });
            return res.json({ success: true, balance: response.data.balance });
        }
        return res.json({ success: false, message: "❌ Kick Declined by Database!" });
    } catch (e) { return res.json({ success: false, message: "⚠️ Timeout!" }); }
});

// 🎯 ৩. গোল ভ্যালিডেশন রাউট - ওরিজিনাল ৯৫% ক্যাসিনো RTP ফিল্টার লুপ
app.post('/api/penalty-kick', async (req, res) => {
    const { userId, currentStreak, betAmount, targetSlot, wallet } = req.body;
    const targetWallet = wallet || "main";
    const originalBetValue = parseFloat(betAmount) || 50;
    const streakIndex = parseInt(currentStreak) || 0; // পরপর কয়টি গোল হলো তার ট্র্যাকার

    if (streakIndex < 0 || streakIndex >= penaltyOddsMultiplier.length) {
        return res.json({ success: false, message: "🚨 Invalid Streak State!" });
    }

    let isGoal = false;
    let hitRandomizer = Math.random();
    
    // 🎰 [৯৫% ওরিজিনাল ক্যাসিনো RTP লুপ কন্ট্রোল ট্র্যাকে কড়া সিকিউরিটি লক ভাই ভাই]
    // প্রথম দিকের গোল সহজে হবে, ৫ম গোল বা ১০০ গুণ জ্যাকপট হিট করা স্বাভাবিক ট্র্যাকে ব্যালেন্সড টাইট লক
    if (streakIndex === 0 && hitRandomizer <= 0.50) isGoal = true;
    else if (streakIndex === 1 && hitRandomizer <= 0.48) isGoal = true;
    else if (streakIndex === 2 && hitRandomizer <= 0.45) isGoal = true;
    else if (streakIndex === 3 && hitRandomizer <= 0.42) isGoal = true;
    else if (streakIndex === 4 && hitRandomizer <= 0.38) isGoal = true;
    else if (streakIndex === 5 && hitRandomizer <= 0.01) isGoal = true; // ১০০ গুণ আলটিমেট গোল চান্স ১% এ লক!

    if (!isGoal) {
        return res.json({ success: true, goal: false, winAmount: 0 });
    }

    let currentWinMultiplier = penaltyOddsMultiplier[streakIndex];
    let calculatedWinAmount = parseFloat((originalBetValue * currentWinMultiplier).toFixed(2));

    try {
        let phpPayload = {
            action: "win",
            username: userId,
            amount: calculatedWinAmount,
            wallet: targetWallet,
            bet_amount: originalBetValue,
            multiplier: currentWinMultiplier.toFixed(2),
            status: "win",
            type: "win",
            is_win: 1,
            win_status: "win",
            log_status: "win"
        };

        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, phpPayload, { timeout: 30000 });

        if (response.data && response.data.status === "ok") {
            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });
            return res.json({
                success: true,
                goal: true,
                balance: response.data.balance,
                winAmount: calculatedWinAmount,
                odds: currentWinMultiplier
            });
        }
        return res.json({ success: false, message: "❌ Goal Sync Error!" });
    } catch (e) {
        return res.json({ success: false, message: "⚠️ Connection Timeout!" });
    }
});

app.get('/', (req, res) => { res.sendFile(path.resolve(__dirname, 'index.html')); });

io.on('connection', (socket) => { console.log("Player connected to Royal Penalty Shootout Football Engine!"); });

// পেনাল্টি শুটআউট গেম নিজস্ব কাস্টম ৭৪০০ পোর্টে কড়া নিয়নে অন ফায়ার ভাই ভাই!
const PORT = process.env.PORT || 7400; 
server.listen(PORT, () => { console.log(`🎡 Royal Penalty Shootout Engine Running on port ${PORT}`); });
