import express, { Request, Response } from "express";
import {
  ValidateFields,
  GET_PORTFOLIO_SUMMARY_REQUIRED_FIELDS,
  ConvertTimePeriodToDates,
  SQLDB_GET_SNAPSHOT_URL,
  TimePeriod,
} from "./utils";
import axios from "axios";
import { time } from "console";

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
    console.log(
      `GetPortfolioSummary request received with fields: ${JSON.stringify(
        request.query
      )}`
    );
    const { portfolioId, timePeriod } = request.query;
    const fieldError: string = ValidateFields(
      { portfolioId, timePeriod },
      GET_PORTFOLIO_SUMMARY_REQUIRED_FIELDS
    );
    if (fieldError.length !== 0) {
      throw new Error(fieldError);
    }
    // const portfolioId = data["portfolio_id"];
    // const timePeriod = data["time_period"];
    const validateTimePeriod: TimePeriod = timePeriod as TimePeriod;
    const { startDate, endDate } = ConvertTimePeriodToDates(validateTimePeriod);
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
        portfolioLabels: [portfolioId as string],
        portfolioData: [],
      };
      const rows: any[] = sqldbResponse.data?.rows || [];
      for (const row of rows) {
        const date = row.snapshot_date;
        const value = [row.portfolio_value];
        responseData.portfolioData.push({ date, value });
      }
      console.log("Success fetching portfolio summary.");
      return response.status(200).json({ data: responseData });
    } else {
      throw new Error(
        `Failed to fetch data from SQL database with error: ${sqldbResponse.status}`
      );
    }
  } catch (error: any) {
    console.error(
      "Error fetching getPortfolioSummary data for request: ",
      error
    );
    return response
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
});
