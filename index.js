export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const BOT_TOKEN = env.BOT_TOKEN; // خواندن توکن از متغیرهای محیطی ورکر

    async function getHistory() {
      try {
        if (env.CLIPBOARD_KV) {
          const rawData = await env.CLIPBOARD_KV.get("message_history");
          if (rawData) {
            return JSON.parse(rawData);
          }
        }
      } catch (e) {
        console.error("KV Read Error:", e);
      }
      return [];
    }

    async function saveHistory(history) {
      try {
        if (env.CLIPBOARD_KV) {
          await env.CLIPBOARD_KV.put("message_history", JSON.stringify(history));
        }
      } catch (e) {
        console.error("KV Write Error:", e);
      }
    }

    let messageHistory = await getHistory();
    const now = Date.now();
    messageHistory = messageHistory.filter(item => (now - item.timestamp) < 24 * 60 * 60 * 1000);

    if (url.pathname === "/api/history" && request.method === "GET") {
      return new Response(JSON.stringify(messageHistory), {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (url.pathname === "/api/send" && request.method === "POST") {
      try {
        const body = await request.json();
        const text = body.content ? body.content.trim() : "";
        
        if (text) {
          const isUrl = /^https?:\/\/[^\s]+$/i.test(text);
          const persianTime = new Date().toLocaleString('fa-IR', { timeZone: 'Asia/Tehran' });

          messageHistory = await getHistory();
          const newItem = {
            id: Math.random().toString(36).substring(2, 9),
            content: text,
            type: isUrl ? 'link' : 'text',
            timeStr: persianTime,
            timestamp: Date.now()
          };

          messageHistory.unshift(newItem);
          await saveHistory(messageHistory);
        }
        return new Response(JSON.stringify({ success: true, history: messageHistory }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 400 });
      }
    }

    if (url.pathname === "/webhook" && request.method === "POST") {
      try {
        const update = await request.json();
        if (update.message && update.message.text) {
          const chatId = update.message.chat.id;
          const text = update.message.text.trim();
          const persianTime = new Date().toLocaleString('fa-IR', { timeZone: 'Asia/Tehran' });
          const isUrl = /^https?:\/\/[^\s]+$/i.test(text);

          messageHistory = await getHistory();
          const newItem = {
            id: Math.random().toString(36).substring(2, 9),
            content: text,
            type: isUrl ? 'link' : 'text',
            timeStr: persianTime,
            timestamp: Date.now()
          };

          messageHistory.unshift(newItem);
          await saveHistory(messageHistory);

          const webUrl = `${url.origin}`;
          const messageText = isUrl 
            ? `⚡ لینک با موفقیت دریافت و ذخیره شد!\n\n🔗 نوع: لینک وب\n⏱ زمان: ${persianTime}\n\n🌐 [مشاهده در کلیپ‌بورد ابری](${webUrl})`
            : `⚡ متن با موفقیت ذخیره شد!\n\n📝 نوع: متن ساده\n⏱ زمان: ${persianTime}\n\n🌐 [مشاهده در کلیپ‌بورد ابری](${webUrl})`;

          await sendTelegramMessage(BOT_TOKEN, chatId, messageText);
        }
      } catch (e) {
        console.error("Webhook Error:", e);
      }
      return new Response("OK");
    }

    if (url.pathname === "/") {
      const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>کلیپ‌بورد ابری هوشمند</title>
    <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #0b0f19;
            --card-bg: rgba(20, 27, 45, 0.85);
            --border-color: rgba(255, 255, 255, 0.08);
            --primary: #38bdf8;
            --text-main: #f1f5f9;
            --text-muted: #94a3b8;
            --success: #10b981;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Vazirmatn', sans-serif; }
        body {
            background-color: var(--bg-color);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            padding: 2rem 1rem;
        }
        .container { width: 100%; max-width: 680px; }
        .header {
            display: flex; justify-content: space-between; align-items: center;
            margin-bottom: 1.5rem; background: var(--card-bg); padding: 1.25rem 1.5rem;
            border-radius: 20px; border: 1px solid var(--border-color);
        }
        h1 { font-size: 1.2rem; font-weight: 700; }
        .badge {
            font-size: 0.75rem; background: rgba(56, 189, 248, 0.1); color: var(--primary);
            border: 1px solid rgba(56, 189, 248, 0.2); padding: 4px 10px; border-radius: 20px;
        }
        .input-card {
            background: var(--card-bg); border: 1px solid var(--border-color);
            border-radius: 20px; padding: 1.25rem; margin-bottom: 1.5rem;
        }
        .input-card textarea {
            width: 100%; height: 90px; background: rgba(11, 15, 25, 0.6);
            border: 1px solid var(--border-color); border-radius: 12px; padding: 10px;
            color: #f1f5f9; font-size: 0.95rem; resize: vertical; outline: none;
            direction: ltr; text-align: left; margin-bottom: 10px;
        }
        .send-btn {
            background: var(--primary); color: #0b0f19; border: none; padding: 10px 20px;
            font-weight: 700; border-radius: 10px; cursor: pointer; width: 100%; font-size: 0.95rem;
        }
        .history-list { display: flex; flex-direction: column; gap: 15px; }
        .item-card {
            background: var(--card-bg); border: 1px solid var(--border-color);
            border-radius: 20px; padding: 1.25rem;
        }
        .item-header {
            display: flex; justify-content: space-between; align-items: center;
            font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;
        }
        .item-content {
            background: rgba(11, 15, 25, 0.6); border: 1px solid var(--border-color);
            border-radius: 12px; padding: 12px; color: #38bdf8; font-size: 0.9rem;
            word-break: break-all; white-space: pre-wrap; direction: ltr; text-align: left;
            margin-bottom: 12px; max-height: 250px; overflow-y: auto;
        }
        .item-actions { display: flex; gap: 10px; }
        .btn {
            display: inline-flex; align-items: center; justify-content: center;
            padding: 8px 14px; font-size: 0.85rem; font-weight: 600; border-radius: 10px;
            border: none; cursor: pointer; text-decoration: none;
        }
        .btn-primary { background: rgba(56, 189, 248, 0.15); color: var(--primary); border: 1px solid rgba(56, 189, 248, 0.3); }
        .btn-link { background: rgba(255, 255, 255, 0.05); color: var(--text-main); border: 1px solid var(--border-color); }
        .empty-state { text-align: center; color: var(--text-muted); padding: 3rem 0; }
        .toast {
            position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(100px);
            background: var(--success); color: #0b0f19; padding: 8px 20px; border-radius: 30px;
            font-weight: 700; font-size: 0.85rem; opacity: 0; transition: all 0.3s ease; pointer-events: none; z-index: 1000;
        }
        .toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>کلیپ‌بورد ابری هوشمند</h1>
            <span class="badge">حذف خودکار ۲۴ ساعته</span>
        </div>
        <div class="input-card">
            <textarea id="webInput" placeholder="متن یا لینک یا کد خود را اینجا بنویسید..."></textarea>
            <button class="send-btn" onclick="sendFromWeb()">ارسال به کلیپ‌بورد</button>
        </div>
        <div id="historyContainer" class="history-list">
            <div class="empty-state">در حال بارگذاری...</div>
        </div>
    </div>
    <div id="toast" class="toast">✓ با موفقیت کپی شد</div>
    <script>
        async function loadHistory() {
            try {
                const res = await fetch('/api/history');
                const historyData = await res.json();
                renderHistory(historyData);
            } catch (e) {
                document.getElementById('historyContainer').innerHTML = '<div class="empty-state">خطا در بارگذاری اطلاعات</div>';
            }
        }

        function renderHistory(historyData) {
            const container = document.getElementById('historyContainer');
            if (!historyData || historyData.length === 0) {
                container.innerHTML = '<div class="empty-state">هنوز هیچ متن یا لینکی ثبت نشده است.</div>';
                return;
            }
            container.innerHTML = historyData.map(item => \`
                <div class="item-card">
                    <div class="item-header">
                        <span>\${item.type === 'link' ? '🔗 لینک وب' : '📝 متن / کد'}</span>
                        <span>زمان: \${item.timeStr}</span>
                    </div>
                    <div class="item-content" id="text-\${item.id}">\${escapeHtml(item.content)}</div>
                    <div class="item-actions">
                        <button class="btn btn-primary" onclick="copyText('\${item.id}')">کپی متن</button>
                        \${item.type === 'link' ? \`<a href="\${escapeHtml(item.content)}" target="_blank" rel="noopener noreferrer" class="btn btn-link">باز کردن لینک</a>\` : ''}
                    </div>
                </div>
            \`).join('');
        }

        async function sendFromWeb_func() {
            const input = document.getElementById('webInput');
            const val = input.value.trim();
            if (!val) return;
            try {
                const res = await fetch('/api/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: val })
                });
                const data = await res.json();
                if (data.success) {
                    input.value = '';
                    renderHistory(data.history);
                    showToast('با موفقیت ارسال شد');
                }
            } catch (e) {
                alert('خطا در ارسال اطلاعات');
            }
        }
        window.sendFromWeb = sendFromWeb_func;

        function copyText(id) {
            const el = document.getElementById('text-' + id);
            navigator.clipboard.writeText(el.innerText).then(() => showToast('✓ با موفقیت کپی شد'));
        }

        function showToast(msg) {
            const toast = document.getElementById('toast');
            toast.innerText = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2200);
        }

        function escapeHtml(str) {
            return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(gt_replace => ">", "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
        }

        loadHistory();
    </script>
</body>
</html>`;

      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=UTF-8" },
      });
    }

    return new Response("Not Found", { status: 404 });
  }
};

async function sendTelegramMessage(token, chatId, text) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      chat_id: chatId, 
      text: text, 
      parse_mode: "Markdown",
      disable_web_page_preview: true
    })
  });
}
