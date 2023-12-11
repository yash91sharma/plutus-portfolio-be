import express, { Request, Response } from "express";
import { getPortfolioSummary } from "./getPortfolioSummary";
import cors from "cors";

// Define a strongly typed data model
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// Sample data
const todos: Todo[] = [
  { id: 1, title: "Learn TypeScript", completed: false },
  { id: 2, title: "Build an Express server", completed: true },
];

const corsAllowedUrls = ["http://localhost:12340"];

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
app.get("/todos", (req: Request, res: Response) => {
  res.json(todos);
});

app.use("/getPortfolioSummary", getPortfolioSummary);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
