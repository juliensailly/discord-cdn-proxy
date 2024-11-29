const fs = require("fs");
require("dotenv").config({ path: __dirname + "/./../.env" });

const resourceTypes = [
    "main_frame",
    "sub_frame",
    "stylesheet",
    "script",
    "image",
    "font",
    "object",
    "xmlhttprequest",
    "ping",
    "csp_report",
    "media",
    "websocket",
    "other",
];

const rules = [
    {
        id: 1,
        priority: 1,
        action: {
            type: "redirect",
            redirect: {
                regexSubstitution:
                    "http://" +
                    process.env.PROXY_SERVER +
                    "/?conversation=\\1&message=\\2&file=\\3&ex=\\4&is=\\5&token=\\6&proxy_token=" +
                    process.env.PROXY_TOKEN,
            },
        },
        condition: {
            regexFilter:
                "^https://cdn.discordapp.com/attachments/([^/]+)/([^/]+)/([^?]+)\\?ex=([^&]*)&is=([^&]*)&hm=([^&]*)",
            resourceTypes: resourceTypes,
        },
    },
    {
        id: 2,
        priority: 1,
        action: {
            type: "redirect",
            redirect: {
                regexSubstitution:
                    "http://" +
                    process.env.PROXY_SERVER +
                    "/?type=icon&id=\\1&hash=\\2&size=\\3&proxy_token=" +
                    process.env.PROXY_TOKEN,
            },
        },
        condition: {
            regexFilter:
                "^https://cdn.discordapp.com/icons/([^/]+)/([^?]+)\\?size=([^&]*)",
            resourceTypes: resourceTypes,
        },
    },
    {
        id: 3,
        priority: 1,
        action: {
            type: "redirect",
            redirect: {
                regexSubstitution:
                    "http://" +
                    process.env.PROXY_SERVER +
                    "/?type=channel-icon&id=\\1&hash=\\2&size=\\3&proxy_token=" +
                    process.env.PROXY_TOKEN,
            },
        },
        condition: {
            regexFilter:
                "^https://cdn.discordapp.com/channel-icons/([^/]+)/([^?]+)\\?size=([^&]*)",
            resourceTypes: resourceTypes,
        },
    },
    {
        id: 4,
        priority: 1,
        action: {
            type: "redirect",
            redirect: {
                regexSubstitution:
                    "http://" +
                    process.env.PROXY_SERVER +
                    "/?type=avatar&id=\\1&hash=\\2&size=\\3&proxy_token=" +
                    process.env.PROXY_TOKEN,
            },
        },
        condition: {
            regexFilter:
                "^https://cdn.discordapp.com/avatars/([^/]+)/([^?]+)\\?size=([^&]*)",
            resourceTypes: resourceTypes,
        },
    },
    {
        id: 5,
        priority: 1,
        action: {
            type: "redirect",
            redirect: {
                regexSubstitution:
                    "http://" +
                    process.env.PROXY_SERVER +
                    "/?type=avatar-decoration&id=\\1&size=\\2&passthrough=\\3&proxy_token=" +
                    process.env.PROXY_TOKEN,
            },
        },
        condition: {
            regexFilter:
                "^https://cdn.discordapp.com/avatar-decoration-presets/([^?]+)\\?size=([^&]*)&passthrough=([^&]*)",
            resourceTypes: resourceTypes,
        },
    },
    {
        id: 6,
        priority: 1,
        action: {
            type: "redirect",
            redirect: {
                regexSubstitution:
                    "http://" +
                    process.env.PROXY_SERVER +
                    "/?type=emoji&id=\\1&size=\\2&proxy_token=" +
                    process.env.PROXY_TOKEN,
            },
        },
        condition: {
            regexFilter:
                "^https://cdn.discordapp.com/emojis/([^?]+)\\?size=([^&]*)",
            resourceTypes: resourceTypes,
        },
    },
    {
        id: 7,
        priority: 1,
        action: {
            type: "redirect",
            redirect: {
                regexSubstitution:
                    "http://" +
                    process.env.PROXY_SERVER +
                    "/?type=badge-icons&id=\\1&proxy_token=" +
                    process.env.PROXY_TOKEN,
            },
        },
        condition: {
            regexFilter:
                "^https://cdn.discordapp.com/badge-icons/([^?]+)",
            resourceTypes: resourceTypes,
        },
    },
];

fs.writeFileSync(
    "chrome-redirection-extension/generated_rules.json",
    JSON.stringify(rules, null, 4)
);
