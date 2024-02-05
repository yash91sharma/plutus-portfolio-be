export interface FieldsWithType {
  name: string;
  type: string | TimePeriod;
}

type TimePeriod =
  | "Week"
  | "Month"
  | "Quarter"
  | "Year"
  | "Year Till Date"
  | "5 Year"
  | "All Time";

export const GET_PORTFOLIO_SUMMARY_REQUIRED_FIELDS: FieldsWithType[] = [
  { name: "portfolio_id", type: "string" },
  { name: "time_period", type: "TimePeriod" },
];

export function ValidateFields(data: any, fields: FieldsWithType[]): string {
  for (const field of fields) {
    const { name, type } = field;
    if (!data[name]) {
      return `Field "${name}" is required.`;
    } else if (type !== "TimePeriod" && typeof data[name] !== type) {
      return `Field "${name}" must be of type "${type}".`;
    } else if (type === "TimePeriod" && !isTimePeriod(data[name])) {
      return `Field "${name}" must be of type "TimePeriod" defined in the back-end.`;
    }
  }
  return "";
}

function isTimePeriod(value: string): value is TimePeriod {
  return [
    "Week",
    "Month",
    "Quarter",
    "Year",
    "Year Till Date",
    "5 Year",
    "All Time",
  ].includes(value);
}

export function ConvertTimePeriodToDates(timePeriod: TimePeriod): {
  startDate: string;
  endDate: string;
} {
  const endDate = new Date();
  const timeZoneOffset = 480; // Pacific Time Zone offset is UTC-8 hours (in minutes)
  endDate.setMinutes(endDate.getMinutes() - timeZoneOffset);
  // Sets time part to midnight (00:00:00) for both startDate and endDate
  endDate.setHours(0, 0, 0, 0);

  let startDate: Date;
  switch (timePeriod) {
    case "Week":
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 7);
      break;

    case "Month":
      startDate = new Date(
        endDate.getFullYear(),
        endDate.getMonth() - 1,
        endDate.getDate()
      );
      break;

    case "Quarter":
      startDate = new Date(
        endDate.getFullYear(),
        endDate.getMonth() - 3,
        endDate.getDate()
      );
      break;

    case "Year":
      startDate = new Date(
        endDate.getFullYear() - 1,
        endDate.getMonth(),
        endDate.getDate()
      );
      break;

    case "Year Till Date":
      startDate = new Date(endDate.getFullYear(), 0, 1);
      break;

    case "5 Year":
      startDate = new Date(
        endDate.getFullYear() - 5,
        endDate.getMonth(),
        endDate.getDate()
      );
      break;

    case "All Time":
      // Choose a reasonable start date for "All Time," e.g., project inception date
      startDate = new Date(2021, 10, 23);
      break;

    default:
      throw new Error("Invalid TimePeriod");
  }

  return {
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  };
}
