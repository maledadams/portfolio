import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);

// Makes Cloudflare bindings (the D1 guestbook) available during `next dev`.
initOpenNextCloudflareForDev();
