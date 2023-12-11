import express, { Request, Response } from "express";

export const getPortfolioSummary = express.Router();

export interface LineGraphData {
  date: string;
  value: number[];
}

export interface getPortfolioSummaryResponse {
  portfolioLabels: string[];
  portfolioData: LineGraphData[];
}

const sampleResponse: getPortfolioSummaryResponse = {
  portfolioLabels: ["Portfolio 1", "QQQ", "S&P500"],
  portfolioData: [
    { date: "1 Jan 2023", value: [100, 200, 300] },
    { date: "2 Jan 2023", value: [105, 205, 305] },
    { date: "3 Jan 2023", value: [90, 200, 350] },
  ],
};

getPortfolioSummary.get("/", (request: Request, response: Response) => {
  const req = request.query;
  console.log(req);
  response.json(sampleResponse);
});
