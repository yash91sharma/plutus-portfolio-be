import express, { Request, Response } from "express";

export const getPortfolioSummary = express.Router();

export interface getPortfolioSummaryResponse {
  comment: string;
  data: number;
}

const sampleResponse: getPortfolioSummaryResponse = {
  comment: "hello",
  data: 10009,
};

getPortfolioSummary.get(
  "/:getPortfolioSummaryRequest",
  (request: Request, response: Response) => {
    const req = request.params.getPortfolioSummaryRequest;
    console.log(req);
    response.json(sampleResponse);
  }
);
