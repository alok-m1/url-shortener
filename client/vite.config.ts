import { defineConfig, loadEnv } from "vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const proxy = {
    "/api": {
      target: env.API_PROXY_TARGET || "http://localhost:3000",
      changeOrigin: true,
    },
  }

  return {
    resolve: { tsconfigPaths: true },
    plugins: [tailwindcss(), tanstackStart(), viteReact()],
    server: {
      port: 3001,
      proxy,
    },
    preview: {
      port: 3001,
      proxy,
    },
  }
})
