import express from "express";
import { getPortfolioSummary } from "./getPortfolioSummary";
import cors from "cors";

const corsAllowedUrls = ["http://localhost:12341", "http://localhost:12342"];

const corsOptions: cors.CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, allowed?: boolean) => void
  ) => {
    if (!origin || corsAllowedUrls.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Express setup
const app = express();
app.use(express.json());

app.use(cors(corsOptions));

// Routes
app.use("/getPortfolioSummary", getPortfolioSummary);

// Start the server
const PORT = 12343;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
