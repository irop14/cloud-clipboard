# 📋 کلیپ‌بورد ابری هوشمند | Smart Cloud Clipboard

یک ابزار سبک، سریع و امن مبتنی بر **Cloudflare Workers** و **Telegram Bot** برای انتقال آسان متن، لینک و کد بین تمامی دیوایس‌ها (کامپیوتر، موبایل و...).


 ✨ امکانات پروژه
* **چندسکویی (Multi-Device):** دسترسی به متن‌ها و لینک‌ها هم از طریق وب‌پیج و هم ربات تلگرام.
* **سرعت بالا:** اجرا روی لبه شبکه کلودفلر (Cloudflare Edge Network).
* **حذف خودکار:** پاکسازی خودکار اطلاعات پس از ۲۴ ساعت برای حفظ حریم خصوصی.
* **رابط کاربری زیبا:** طراحی مدرن و واکنش‌گرا با پشتیبانی کامل از زبان فارسی و حالت تاریک (Dark Mode).



 🛠️ آموزش گام‌به‌گام نصب و راه‌اندازی

 گام اول: ساخت ربات تلگرام
۱. در تلگرام به سراغ ربات رسمی **[@BotFather](https://t.me/BotFather)** بروید.
۲. دستور `/newbot` را ارسال کنید.
۳. یک نام برای بات خود انتخاب کنید و سپس یک یوزرنیم (که حتماً باید به `bot` ختم شود) بگیرید.
۴. پس از ساخت، BotFather یک **توکن (Token)** به شما می‌دهد آن را جایی یادداشت کنید (برای مراحل بعد نیازش دارید).

#### گام دوم: ساخت پروژه در Cloudflare Workers
۱. وارد حساب کاربری خود در [سایت کلودفلر](https://www.cloudflare.com/) شوید (اگر ندارید یک اکانت رایگان بسازید).
۲. از منوی سمت چپ، وارد بخش **Workers & Pages** شوید.
۳. روی گزینه **Create application** و سپس **Create Worker** کلیک کنید.
۴. یک نام دلخواه برای ورکر خود بگذارید (مثلاً `cloud-clipboard`) و روی **Deploy** کلیک کنید.
۵. پس از ساخته شدن، روی گزینه **Edit code** کلیک کنید. کدهای فایل `index.js` این پروژه را آنجا کپی کنید و روی دکمه **Save and deploy** در بالا سمت راست بزنید.

#### گام سوم: ساخت پایگاه داده (KV Namespace)
برای اینکه تاریخچه متن‌ها و لینک‌ها ذخیره شوند، به یک KV نیاز داریم:
۱. در پنل کلودفلر از منوی سمت چپ به بخش **Storage & Databases** و سپس **KV** بروید.
۲. روی **Create namespace** کلیک کنید و نامی مثل `CLIPBOARD_KV` به آن بدهید.
۳. حالا به بخش **Workers & Pages** بروید، روی ورکری که ساختید کلیک کنید، به تب **Settings** و سپس بخش **Variables** بروید.
۴. در قسمت **KV Namespace Bindings**، روی **Add binding** کلیک کنید:
   * نام متغیر (Variable name): دقیقاً بنویسید `CLIPBOARD_KV`
   * انتخاب KV: همان KV که تازه ساختید را انتخاب کنید و تغییرات را ذخیره کنید.

#### گام چهارم: ست کردن توکن ربات تلگرام
۱. در همان صفحه تنظیمات ورکر (بخش **Variables**)، به قسمت **Environment Variables** بروید.
۲. روی **Add variable** کلیک کنید:
   * نام: `BOT_TOKEN`
   * مقدار (Value): توکنی که از BotFather در گام اول گرفتید را اینجا وارد کنید.
   * تیک گزینه **Encrypt** را بزنید تا امن بماند و روی **Save** کلیک کنید.

#### گام پنجم: اتصال ربات تلگرام (Webhook)
برای اینکه پیام‌های تلگرام به ورکر شما برسند، باید وب‌هوک را ست کنید. آدرس زیر را در مرورگر خود باز کنید (به جای `<BOT_TOKEN>` توکن ربات و به جای `<WORKER_URL>` آدرس 
اینترنتی ورکر خودتان را قرار دهید


(https://api.telegram.org/bot)<BOT_TOKENتوکن ربات تلگرام >/setWebhook?url=<ادرس ورکر >/webhook







​✨ Features
​Multi-Device: Access your texts, links, and code snippets seamlessly via web interface and Telegram bot.
​High Performance: Powered by Cloudflare Edge Network.
​Auto-Deletion: Automatic data cleanup after 24 hours for privacy.
​Modern UI: Responsive design with dark mode support.
​🛠️ Step-by-Step Installation Guide
​Step 1: Create a Telegram Bot
​Open Telegram and search for @BotFather.
​Send the /newbot command.
​Choose a name and a username for your bot (must end in bot).
​Copy the provided Bot Token for later use.
​Step 2: Create a Cloudflare Worker
​Log in to your Cloudflare Dashboard.
​Navigate to Workers & Pages from the left sidebar.
​Click Create application -> Create Worker.
​Give it a name (e.g., cloud-clipboard) and click Deploy.
​Click Edit code, paste the contents of index.js, and click Save and deploy.
​Step 3: Create KV Namespace
​In the Cloudflare dashboard, go to Storage & Databases -> KV.
​Click Create namespace and name it CLIPBOARD_KV.
​Go back to your Worker -> Settings -> Variables.
​Under KV Namespace Bindings, click Add binding:
​Variable name: CLIPBOARD_KV
​KV namespace: Select the one you just created. Save changes.
​Step 4: Add Telegram Bot Token as Secret
​In your Worker settings -> Variables -> Environment Variables, click Add variable.
​Variable name: BOT_TOKEN
​Value: Paste your Telegram Bot Token.
​Check Encrypt and click Save.
​Step 5: Set Telegram Webhook
​Open the following URL in your browser (replace <BOT_TOKEN> with your actual token and <WORKER_URL> with your Cloudflare Worker URL):

```text
[https://api.telegram.org/bot](https://api.telegram.org/bot)<BOT_TOKEN>/setWebhook?url=<WORKER_URL>/webhook
