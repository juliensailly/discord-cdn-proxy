const http = require("http");
const https = require("https");
const url = require("url");

function fetchContent(targetUrl, res) {
    const parsedUrl = url.parse(targetUrl);

    const protocol = parsedUrl.protocol === "https:" ? https : http;

    protocol
        .get(targetUrl, (proxyRes) => {
            let data = "";

            proxyRes.on("data", (chunk) => {
                data += chunk;
                data = data.replace('="/', '="/?url=/');
                console.log(data);
            });

            proxyRes.on("end", () => {
                res.writeHead(proxyRes.statusCode, proxyRes.headers);
                res.end(data);
            });
        })
        .on("error", (err) => {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error fetching content");
        });
}

http.createServer((req, res) => {
    const queryObject = url.parse(req.url, true).query;

    if (queryObject.url) {
        const targetUrl = queryObject.url;

        if (
            targetUrl.startsWith("http://") ||
            targetUrl.startsWith("https://")
        ) {
            fetchContent(targetUrl, res);
        } else {
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.end(
                "URL not valid. Only HTTP and HTTPS protocols are supported."
            );
        }
    } else {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Please enter a valid URL using the param ?url=");
    }
}).listen(80, () => {
    console.log("Proxy server started on port 80");
});
