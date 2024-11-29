const http = require("http");
const https = require("https");
const url = require("url");
const fs = require("fs");
const path = require("path");

function setCorsHeaders(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

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
                setCorsHeaders(res);
                res.writeHead(proxyRes.statusCode, proxyRes.headers);
                res.end(buffer);
            });
        })
        .on("error", (err) => {
            console.error("Error fetching content:", err);
            if (!res.headersSent) {
                setCorsHeaders(res);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error fetching content");
            }
        });
}

function returnFavicon(req, res) {
    const faviconPath = path.join(__dirname, "../assets", "favicon.ico");
    fs.readFile(faviconPath, (err, data) => {
        if (err) {
            if (!res.headersSent) {
                setCorsHeaders(res);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error loading favicon");
            }
            return;
        }
        setCorsHeaders(res);
        res.writeHead(200, { "Content-Type": "image/x-icon" });
        res.end(data);
    });
}

http.createServer((req, res) => {
    const queryObject = url.parse(req.url, true).query;

    if (req.url === "/favicon.ico") {
        return returnFavicon(req, res);
    }

    setCorsHeaders(res);

    console.log("Received request with query:", queryObject);

    if (queryObject.type === "icon") {
        const targetUrl = `https://cdn.discordapp.com/icons/${queryObject.id}/${queryObject.hash}?size=${queryObject.size}`;
        console.log("Fetching icon:", targetUrl);
        return fetchContent(targetUrl, res);
    }

    if (queryObject.type === "channel-icon") {
        const targetUrl = `https://cdn.discordapp.com/channel-icons/${queryObject.id}/${queryObject.hash}?size=${queryObject.size}`;
        console.log("Fetching channel icon:", targetUrl);
        return fetchContent(targetUrl, res);
    }

    if (queryObject.type === "avatar") {
        const targetUrl = `https://cdn.discordapp.com/avatars/${queryObject.id}/${queryObject.hash}?size=${queryObject.size}`;
        console.log("Fetching avatar:", targetUrl);
        return fetchContent(targetUrl, res);
    }

    if (queryObject.type === "avatar-decoration") {
        const targetUrl = `https://cdn.discordapp.com/avatar-decoration-presets/${queryObject.id}?size=${queryObject.size}&passthrough=${queryObject.passthrough}`;
        console.log("Fetching avatar decoration:", targetUrl);
        return fetchContent(targetUrl, res);
    }

    if (queryObject.type === "emoji") {
        const targetUrl = `https://cdn.discordapp.com/emojis/${queryObject.id}?size=${queryObject.size}&animated=${queryObject.animated}`;
        console.log("Fetching emoji:", targetUrl);
        return fetchContent(targetUrl, res);
    }

    if (!queryObject.conversation || !queryObject.message || !queryObject.ex || !queryObject.is || !queryObject.token) {
        if (!res.headersSent) {
            setCorsHeaders(res);
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.end("Missing required query parameters.");
        }
        return;
    }

    const targetUrl = `https://cdn.discordapp.com/attachments/${queryObject.conversation}/${queryObject.message}/${queryObject.file}?ex=${queryObject.ex}&is=${queryObject.is}&hm=${queryObject.token}`;
    console.log("Fetching attachment:", targetUrl);

    fetchContent(targetUrl, res);
}).listen(80, () => {
    console.log("Proxy server started on port 80");
});