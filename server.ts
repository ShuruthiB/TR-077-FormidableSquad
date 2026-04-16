import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock API for Energy Forecasting
  app.get("/api/forecast", (req, res) => {
    const data = [];
    const now = new Date();
    for (let i = 0; i < 24; i++) {
      const time = new Date(now.getTime() + i * 3600000);
      const base = 50 + Math.sin(i / 4) * 20;
      data.push({
        time: time.toISOString(),
        actual: i < 1 ? base + (Math.random() - 0.5) * 5 : null,
        predicted: base + (Math.random() - 0.5) * 2,
        confidence_low: base - 5,
        confidence_high: base + 5,
      });
    }
    res.json(data);
  });

  app.get("/api/stats", (req, res) => {
    res.json({
      rmse: 2.45,
      mae: 1.82,
      current_weather: {
        temp: 24.5,
        humidity: 62,
        wind_speed: 12.4,
        irradiance: 850
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
