const http = require("http");
const https = require("https");
const url = require("url");
const fs = require("fs");
const path = require("path");

function fetchContent(targetUrl, res) {
    targetUrl = decodeURIComponent(targetUrl);
    const parsedUrl = url.parse(targetUrl);

    const protocol = parsedUrl.protocol === "https:" ? https : http;

    protocol
        .get(targetUrl, (proxyRes) => {
            let data = [];

            proxyRes.on("data", (chunk) => {
                data.push(chunk);
            });

            proxyRes.on("end", () => {
                const buffer = Buffer.concat(data);
                res.writeHead(proxyRes.statusCode, proxyRes.headers);
                res.end(buffer);
            });
        })
        .on("error", (_) => {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error fetching content");
        });
}

function returnFavicon(req, res) {
    const faviconPath = path.join(__dirname, "assets", "favicon.ico");
    fs.readFile(faviconPath, (err, data) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error loading favicon");
            return;
        }
        res.writeHead(200, { "Content-Type": "image/x-icon" });
        res.end(data);
    });
}

http.createServer((req, res) => {
    const queryObject = url.parse(req.url, true).query;

    if (req.url === "/favicon.ico") {
        return returnFavicon(req, res);
    }

    if (queryObject.type === "icon") {
        const targetUrl = `https://cdn.discordapp.com/icons/${queryObject.id}/${queryObject.hash}.webp?size=${queryObject.size}`;
        return fetchContent(targetUrl, res);
    }

    if (queryObject.type === "channel-icon") {
        const targetUrl = `https://cdn.discordapp.com/channel-icons/${queryObject.id}/${queryObject.hash}.webp?size=${queryObject.size}`;
        return fetchContent(targetUrl, res);
    }

    if (queryObject.type === "avatar") {
        const targetUrl = `https://cdn.discordapp.com/avatars/${queryObject.id}/${queryObject.hash}.webp?size=${queryObject.size}`;
        return fetchContent(targetUrl, res);
    }

    if (queryObject.type === "avatar-decoration") {
        const targetUrl = `https://cdn.discordapp.com/avatar-decoration-presets/${queryObject.id}.png?size=${queryObject.size}&passthrough=${queryObject.passthrough}`;
        return fetchContent(targetUrl, res);
    }

    if (queryObject.type === "emoji") {
        const targetUrl = `https://cdn.discordapp.com/emojis/${queryObject.id}.webp?size=${queryObject.size}&animated=${queryObject.animated}`;
        return fetchContent(targetUrl, res);
    }

    if (!queryObject.conversation || !queryObject.message || !queryObject.ex || !queryObject.is || !queryObject.token) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Missing required query parameters.");
        return;
    }

    const targetUrl = `https://cdn.discordapp.com/attachments/${queryObject.conversation}/${queryObject.message}/${queryObject.file}?ex=${queryObject.ex}&is=${queryObject.is}&hm=${queryObject.token}`;

    fetchContent(targetUrl, res);
}).listen(80, () => {
    console.log("Proxy server started on port 80");
});