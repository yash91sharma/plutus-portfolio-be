import express, { Request, Response } from "express";
import {
  ValidateFields,
  GET_PORTFOLIO_SUMMARY_REQUIRED_FIELDS,
  ConvertTimePeriodToDates,
  SQLDB_GET_SNAPSHOT_URL,
} from "./utils";
import axios from "axios";

export const getPortfolioSummary = express.Router();

export interface PortfolioData {
  date: string;
  value: number[];
}

export interface getPortfolioSummaryResponse {
  portfolioLabels: string[];
  portfolioData: PortfolioData[];
}

const sampleResponse: getPortfolioSummaryResponse = {
  portfolioLabels: ["Portfolio 1", "QQQ", "S&P500"],
  portfolioData: [
    { date: "1 Jan 2023", value: [100, 200, 300] },
    { date: "2 Jan 2023", value: [105, 205, 305] },
    { date: "3 Jan 2023", value: [90, 200, 350] },
  ],
};

getPortfolioSummary.get("/", async (request: Request, response: Response) => {
  try {
    const data = request.body;
    const fieldError: string = ValidateFields(
      data,
      GET_PORTFOLIO_SUMMARY_REQUIRED_FIELDS
    );
    if (fieldError.length !== 0) {
      return response.status(400).json({ error: fieldError });
    }
    const portfolioId = data["portfolio_id"];
    const timePeriod = data["time_period"];
    const { startDate, endDate } = ConvertTimePeriodToDates(timePeriod);
    const sqldbRequest = {
      portfolio_id: portfolioId,
      start_date: startDate,
      end_date: endDate,
    };
    const sqldbResponse = await axios.get(SQLDB_GET_SNAPSHOT_URL, {
      data: sqldbRequest,
      headers: { "Content-Type": "application/json" },
    });

    if (sqldbResponse.status === 200) {
      const responseData: getPortfolioSummaryResponse = {
        portfolioLabels: [portfolioId],
        portfolioData: [],
      };
      const rows: any[] = sqldbResponse.data?.rows || [];
      for (const row of rows) {
        // console.log("row: ", row);
        const date = row.snapshot_date;
        const value = row.portfolio_value;
        responseData.portfolioData.push({ date, value });
      }
      return response.status(200).json({ data: responseData });
    } else {
      throw new Error(
        `Failed to fetch data from SQL database with error: ${sqldbResponse.status}`
      );
    }
  } catch (error: any) {
    console.error(
      `Error fetching getPortfolioSummary data for request ${request}:`,
      error
    );
    return response
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
});
