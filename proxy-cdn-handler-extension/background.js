// Fonction pour encoder l'URL
function encodeUrl(url) {
    return encodeURIComponent(url);
}

// Intercepter les requêtes et rediriger
browser.webRequest.onBeforeRequest.addListener(
    (details) => {
        const originalUrl = details.url;
        const encodedUrl = encodeUrl(originalUrl);

        // Nouvelle URL avec le proxy
        const proxyUrl = `http://discord-cdn-proxy.juliensailly.com?url=${encodedUrl}`;

        return { redirectUrl: proxyUrl };
    },
    { urls: ["*://cdn.discordapp.com/*"] },
    ["blocking"]
);
