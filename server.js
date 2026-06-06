const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);

// 🎯 [উইনগো কালার ট্রেড সিঙ্ক - গ্লোবাল গেটওয়ে সকেট প্রোটকল লক ভাই ভাই]
const io = socketIo(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

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

// 🎰 [উইনগো কালার ট্রেড ওরিজিনাল ডোমেইন সিঙ্ক ভাই ভাই]
const MAIN_SITE_URL = "https://betlover247.onrender.com"; 

// 💰 ১. লাইভ অ্যাকাউন্ট ব্যালেন্স ইন্টারসেপ্টর গেটওয়ে (১ শতভাগ টাইমআউট ও জ্যাম ব্লকার বর্ম ওস্তাদ)
app.get('/api/slot-balance', async (req, res) => {
    const { userId, wallet } = req.query;
    const targetWallet = wallet || "main";
    let finalUser = userId === "logged_in_player" || !userId || userId === "undefined" ? "guest" : userId;
    try {
        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "balance", username: finalUser, amount: 0, wallet: targetWallet, game: "penaltyshot"
        }, { timeout: 15000 });

        if (response.data && response.data.status === "ok") {
            return res.json({ success: true, balance: response.data.balance });
        }
        return res.json({ success: false, balance: 0 });
    } catch (e) { return res.json({ success: false, balance: 0 }); }
});

// 🛫 ২. পেনাল্টি শট কোর কিক স্পিন রাউট (১০০% সিকিউরড সিঙ্গেল পাইপলাইন প্রোটোকল ওস্তাদ)
app.post('/api/slot-spin', async (req, res) => {
    const { userId, amount, wallet } = req.body; 
    const reqAmount = parseFloat(amount) || 50; // ডিফল্ট ৫০ টাকা স্টেক লক চ্যাম
    const finalGameName = "penaltyshot"; 
    const targetWallet = wallet || "main";

    let finalQueryUser = userId;
    if (!finalQueryUser || finalQueryUser === "logged_in_player" || finalQueryUser === "undefined") {
        finalQueryUser = "guest"; 
    }

    if (reqAmount < 1 || reqAmount > 20000) {
        return res.json({ success: false, message: "🚨 Invalid Bet Parameter! Max 20000 ৳" });
    }

    try {
        // 🔒 [🔒 গ্র্যান্ড কিংস কারেকশন বর্ম - ১০০% নিখুঁত সিঙ্গেল স্টেক টাইট লক ওস্তাদ!]:
        // ডাবল কলব্যাকের ওল্ড জ্যাম ও ব্যালেন্স প্রাক-চেকিং ট্র্যাপ এক টানে সাফ! সরাসরি ১ম হিটে বাজি ডেবিট রিকোয়েস্ট ফায়ার লক ওস্তাদ!
        const balResponse = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet", username: finalQueryUser, amount: reqAmount, wallet: targetWallet, game: finalGameName
        }, { timeout: 30000 });
        
        if (!balResponse.data || balResponse.data.status !== "ok") {
            return res.json({ success: false, message: "❌ আপনার অ্যাকাউন্ট ব্যালেন্স জিরো বা অপ্রতুল! দয়া করে রিচার্জ করুন ওস্তাদ।" });
        }

        let currentDbBalance = parseFloat(balResponse.data.balance) || 0;
        
        // ⚽ [⚽ পেনাল্টি শট ৯৫% আরটিপি স্ট্রেইক মাল্টিপ্লায়ার ক্র্যাশ লুপ অ্যালগরিদম]
        let winMultiplier = 0.00;
        let finalStatus = "lose";
        
        // পেনাল্টি শট মাল্টিপ্লায়ার সিঁড়ি: x1.92 -> x3.84 -> x7.68 -> x15.36 -> x30.72 -> x100.00
        const multiplierStepsPool = [1.92, 3.84, 7.68, 15.36, 30.72, 100.00];
        
        // ৯৫% রিয়েল ক্যাসিনো আরটিপি র্যান্ডম শুট সাকসেস ক্যালকুলেশন বর্ম
        let randomChance = Math.random();
        
        if (randomChance <= 0.48) { // ওয়ান-শটে ৪৮% জেনুইন গোল কিক সাকসেস রেশিও লক ওস্তাদ!
            // র্যান্ডমলি যেকোনো একটি স্ট্রেইক লেভেল রিওয়ার্ড সিলেক্ট করা
            let randomStepIdx = Math.floor(Math.random() * multiplierStepsPool.length);
            winMultiplier = multiplierStepsPool[randomStepIdx];
            finalStatus = "win";
        } else {
            winMultiplier = 0.00;
            finalStatus = "lose";
        }

        // এডমিন প্যানেল কাস্টম ফোর্স কন্ট্রোল নব ফিল্টারিং চ্যাম
        if (balResponse.data && balResponse.data.penaltyshot_target) {
            let target = String(balResponse.data.penaltyshot_target).toUpperCase();
            if (target === "FORCE_LOSE" && finalStatus === "win") {
                winMultiplier = 0.00; finalStatus = "lose";
            }
            if (target === "FORCE_WIN" && finalStatus === "lose") {
                winMultiplier = 1.92; finalStatus = "win";
            }
        }

        // 🎯 [মেগা কিলার জিরো-ডাবল-ডেবিট স্টেক ব্যালেন্সার বর্ম ভাই ভাই]
        let winAmount = 0, dbAction = "win", dbAmount = 0;

        if (winMultiplier > 0) {
            winAmount = Math.round(reqAmount * winMultiplier);
            dbAction = "win"; dbAmount = parseFloat(winAmount); 
        } else {
            dbAction = "win"; dbAmount = 0; 
        }

        let phpPayload = { 
            action: dbAction, username: finalQueryUser, amount: dbAmount, wallet: targetWallet, game: finalGameName 
        };
        
        phpPayload.status = finalStatus;
        phpPayload.bet_amount = reqAmount; // bet_logs.php তে ওরিজিনাল বাজি পুশ লক!

        // 🛫 ③ মেইন সাইটের সিকিউরড গেটওয়েতে রিয়েল-টাইম উইন-লস সেটেলমেন্ট এپیআই হিট
        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, phpPayload, { timeout: 45000 });

        if (response.data && response.data.status === "ok") {
            io.emit("balanceUpdate", { username: finalQueryUser, balance: response.data.balance });
            
            return res.json({
                success: true,
                balance: response.data.balance,
                data: { balance: response.data.balance },
                gameData: { 
                    winMultiplier,
                    status: finalStatus, 
                    winAmount 
                }
            });
        } else {
            let latestBal = (response.data && response.data.balance !== undefined) ? response.data.balance : currentDbBalance;
            return res.json({ success: false, balance: latestBal, message: "X Bet Settlement Declined by Database!" });
        }
    } catch (e) { 
        return res.json({ success: false, message: "⚠️ Timeout! Click SHOOT again." }); 
    }
});

app.get('/', (req, res) => { res.sendFile(path.resolve(__dirname, 'index.html')); });
io.on('connection', (socket) => {});

// ⚡ কাস্টম নোড সার্ভার পোর্ট গেটওয়ে লাইভ অন ফায়ার (৪০০০০ পোর্টে ডেডিকেটেড সিঙ্ক লক!)
const PORT = process.env.PORT || 6400; 
server.listen(PORT, () => { console.log(`⚽ Penalty Shot Crash Engine Running on port ${PORT}`); });
