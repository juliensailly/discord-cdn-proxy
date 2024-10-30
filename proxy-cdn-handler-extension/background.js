chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        const originalUrl = encodeURIComponent(details.url);
        const proxyUrl = `http://discord-cdn-proxy.juliensailly.com/?url=${originalUrl}`;
        return { redirectUrl: proxyUrl };
    },
    { urls: ["*://cdn.discordapp.com/*"] },
    ["blocking"]
);
