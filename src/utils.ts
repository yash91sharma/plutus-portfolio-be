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
