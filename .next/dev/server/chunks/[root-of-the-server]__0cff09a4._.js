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
"[project]/pages/api/patients/index.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
const dataPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'data', 'patients.json');
function readPatients() {
    try {
        const raw = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(dataPath, 'utf8');
        return JSON.parse(raw);
    } catch (e) {
        return [];
    }
}
function writePatients(list) {
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
    if (req.method === 'GET') {
        const list = readPatients();
        return res.status(200).json(list);
    }
    if (req.method === 'POST') {
        const { id, name } = req.body || {};
        if (!name) return res.status(400).json({
            error: 'name required'
        });
        const patients = readPatients();
        // if id provided, check exists
        let existing = null;
        if (id) existing = patients.find((p)=>p.id === id);
        if (existing) {
            // update name if different
            existing.name = name;
            writePatients(patients);
            return res.status(200).json(existing);
        }
        // create new id if not provided
        const newId = id || `p${Math.floor(Math.random() * 9000) + 100}`;
        const newPatient = {
            id: newId,
            name
        };
        patients.push(newPatient);
        const ok = writePatients(patients);
        if (!ok) return res.status(500).json({
            error: 'failed to write'
        });
        return res.status(201).json(newPatient);
    }
    res.setHeader('Allow', [
        'GET',
        'POST'
    ]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0cff09a4._.js.map