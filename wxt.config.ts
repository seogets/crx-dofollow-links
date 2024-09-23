import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "Website Page Counter for SEO",
    permissions: ["contextMenus", "activeTab"],
  },
});
