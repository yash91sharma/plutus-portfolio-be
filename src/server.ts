import express, { Request, Response } from "express";
import { getPortfolioSummary } from "./getPortfolioSummary";

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

// Express setup
const app = express();
app.use(express.json());

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
