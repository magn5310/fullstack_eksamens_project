"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamic = void 0;
exports.GET = GET;
const server_1 = require("next/server");
exports.dynamic = "force-dynamic";
class SentryExampleAPIError extends Error {
    constructor(message) {
        super(message);
        this.name = "SentryExampleAPIError";
    }
}
// A faulty API route to test Sentry's error monitoring
function GET() {
    throw new SentryExampleAPIError("This error is raised on the backend called by the example page.");
    return server_1.NextResponse.json({ data: "Testing Sentry Error..." });
}
//# sourceMappingURL=route.js.map