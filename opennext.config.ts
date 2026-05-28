import type { OpenNextConfig } from "@opennextjs/aws/types/open-next.js";

const config = {
  default: {
    override: {
      wrapper: "cloudflare-node",
    },
  },
} satisfies OpenNextConfig;

export default config;
