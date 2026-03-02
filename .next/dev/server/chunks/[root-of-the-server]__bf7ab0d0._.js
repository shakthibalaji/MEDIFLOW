module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/pages/api/requests/[id].js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
const dataPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'data', 'requests.json');
function readRequests() {
    try {
        const raw = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(dataPath, 'utf8');
        return JSON.parse(raw);
    } catch (e) {
        return [];
    }
}
function writeRequests(list) {
    try {
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].dirname(dataPath), {
            recursive: true
        });
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(dataPath, JSON.stringify(list, null, 2), 'utf8');
        return true;
    } catch (e) {
        return false;
    }
}
function handler(req, res) {
    const { id } = req.query;
    if (req.method === 'GET') {
        const list = readRequests();
        const r = list.find((x)=>x.id === id);
        if (!r) return res.status(404).json({
            error: 'not found'
        });
        return res.status(200).json(r);
    }
    if (req.method === 'PATCH') {
        const body = req.body || {};
        const list = readRequests();
        const idx = list.findIndex((x)=>x.id === id);
        if (idx === -1) return res.status(404).json({
            error: 'not found'
        });
        const r = list[idx];
        if (body.status) r.status = body.status;
        if (body.currentDept) r.currentDept = body.currentDept;
        if (body.note) r.timeline = r.timeline || [];
        if (body.note) r.timeline.push({
            status: r.status,
            dept: r.currentDept,
            at: Date.now(),
            note: body.note
        });
        list[idx] = r;
        const ok = writeRequests(list);
        if (!ok) return res.status(500).json({
            error: 'failed to write'
        });
        return res.status(200).json(r);
    }
    res.setHeader('Allow', [
        'GET',
        'PATCH'
    ]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__bf7ab0d0._.js.map