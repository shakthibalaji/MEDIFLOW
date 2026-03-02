module.exports = [
"[project]/lib/realtime.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "realtime",
    ()=>realtime
]);
// Simple in-memory pub/sub to simulate real-time updates.
class Realtime {
    constructor(){
        this.subs = new Map();
    }
    on(channel, cb) {
        if (!this.subs.has(channel)) this.subs.set(channel, new Set());
        this.subs.get(channel).add(cb);
        return ()=>this.subs.get(channel).delete(cb);
    }
    emit(channel, data) {
        const s = this.subs.get(channel);
        if (!s) return;
        for (const cb of s)cb(data);
    }
}
const realtime = new Realtime();
}),
"[project]/lib/api.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createRequest",
    ()=>createRequest,
    "fetchRequest",
    ()=>fetchRequest,
    "fetchRequests",
    ()=>fetchRequests,
    "searchRequests",
    ()=>searchRequests,
    "updateStatus",
    ()=>updateStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$realtime$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/realtime.js [ssr] (ecmascript)");
;
const delay = (ms = 200)=>new Promise((r)=>setTimeout(r, ms));
async function apiFetch(path, opts) {
    const res = await fetch(path, opts);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json();
}
async function fetchRequests() {
    await delay();
    return apiFetch('/api/requests');
}
async function fetchRequest(id) {
    await delay();
    return apiFetch(`/api/requests/${id}`);
}
async function createRequest(payload) {
    const created = await apiFetch('/api/requests', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    // emit local realtime event so other tabs/components update
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$realtime$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["realtime"].emit('requests', {
        type: 'created',
        request: created
    });
    return created;
}
async function updateStatus(id, { status, dept, note }) {
    const body = {};
    if (status) body.status = status;
    if (dept) body.currentDept = dept;
    if (note) body.note = note;
    const updated = await apiFetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$realtime$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["realtime"].emit('requests', {
        type: 'updated',
        request: updated
    });
    return updated;
}
async function searchRequests(q = '') {
    const all = await fetchRequests();
    if (!q) return all;
    return all.filter((r)=>r.id.includes(q) || (r.patientName || '').toLowerCase().includes(q.toLowerCase()));
}
}),
"[project]/store/useStore.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "useStore",
    ()=>useStore
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$zustand__$5b$external$5d$__$28$zustand$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zustand$29$__ = __turbopack_context__.i("[externals]/zustand [external] (zustand, esm_import, [project]/node_modules/zustand)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$realtime$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/realtime.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$zustand__$5b$external$5d$__$28$zustand$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zustand$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$zustand__$5b$external$5d$__$28$zustand$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zustand$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const useStore = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$zustand__$5b$external$5d$__$28$zustand$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zustand$29$__["default"])((set, get)=>({
        // start with no one logged in by default so staff must authenticate
        user: {
            id: '',
            name: '',
            role: ''
        },
        requests: [],
        notifications: [],
        _subscribed: false,
        sidebarOpen: false,
        toggleSidebar: ()=>set((state)=>({
                    sidebarOpen: !state.sidebarOpen
                })),
        init: async ()=>{
            // prevent double subscription (React Strict Mode/dev)
            if (get()._subscribed) return;
            set({
                _subscribed: true
            });
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["fetchRequests"])();
            set({
                requests: data
            });
            // subscribe to realtime updates
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$realtime$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["realtime"].on('requests', (ev)=>{
                const { type, request } = ev;
                const user = get().user;
                // if a patient is logged in, only accept realtime updates for that patient
                if (user && user.role === 'patient') {
                    if (request.patientId !== user.id) return;
                }
                if (type === 'created') set((state)=>({
                        requests: [
                            request,
                            ...state.requests
                        ],
                        notifications: [
                            {
                                id: Date.now(),
                                text: `New request ${request.id}`
                            },
                            ...state.notifications
                        ]
                    }));
                if (type === 'updated') set((state)=>({
                        requests: state.requests.map((r)=>r.id === request.id ? request : r),
                        notifications: [
                            {
                                id: Date.now(),
                                text: `Updated ${request.id}: ${request.status}`
                            },
                            ...state.notifications
                        ]
                    }));
            });
        },
        createRequest: async (payload)=>{
            // call API; rely on realtime subscription to update store to avoid duplicate inserts
            const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["createRequest"])(payload);
            return r;
        },
        updateStatus: async (id, payload)=>{
            const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["updateStatus"])(id, payload);
            return r;
        },
        setUser: async (user)=>{
            // clear current requests immediately
            set({
                user,
                requests: []
            });
            // fetch only relevant requests for this user
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["fetchRequests"])();
                if (user && user.role === 'patient') {
                    const my = (data || []).filter((r)=>r.patientId === user.id);
                    set({
                        requests: my
                    });
                } else {
                    set({
                        requests: data
                    });
                }
            } catch (e) {
            // ignore fetch errors, keep empty requests
            }
        },
        logout: ()=>set({
                user: {
                    id: '',
                    name: '',
                    role: ''
                }
            }),
        addNotification: (n)=>set((state)=>({
                    notifications: [
                        n,
                        ...state.notifications
                    ]
                })),
        clearNotifications: ()=>set({
                notifications: []
            })
    }));
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/_app.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>MyApp
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$useStore$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/useStore.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$useStore$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$store$2f$useStore$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
function MyApp({ Component, pageProps }) {
    const init = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$useStore$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useStore"])((s)=>s.init);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        init();
    }, [
        init
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "font-inter bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 min-h-screen",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Component, {
            ...pageProps
        }, void 0, false, {
            fileName: "[project]/pages/_app.js",
            lineNumber: 13,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/pages/_app.js",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/zustand [external] (zustand, esm_import, [project]/node_modules/zustand)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("zustand-a9fdd9ffafd252b3");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c431a0c6._.js.map