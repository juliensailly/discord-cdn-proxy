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

    if (req.url == "/favicon.ico") {
        return returnFavicon(req, res);
    }

    if (queryObject.url == null || queryObject.url == "") {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Please enter a valid URL using the param ?url=");
        return;
    }

    const targetUrl = queryObject.url;

    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("URL not valid. Only HTTP and HTTPS protocols are supported.");
        return;
    }

    if (!targetUrl.includes("cdn") || !targetUrl.includes("discord")) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("URL not valid. Only requests to Discord CDN are allowed.");
        return;
    }

    fetchContent(targetUrl, res);
}).listen(80, () => {
    console.log("Proxy server started on port 80");
});
