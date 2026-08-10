import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No incremental cache override: every page here is either static or rendered
// per request, so there is nothing worth persisting to R2 yet.
export default defineCloudflareConfig();
