export interface FieldsWithType {
  name: string;
  type: string;
}

export const GET_PORTFOLIO_SUMMARY_REQUIRED_FIELDS: FieldsWithType[] = [
  { name: "portfolio_id", type: "string" },
  { name: "time_period", type: "string" },
];

export function ValidateFields(data: any, fields: FieldsWithType[]): string {
  for (const field of fields) {
    const { name, type } = field;
    if (!data[name]) {
      return `Field "${name}" is required.`;
    } else if (typeof data[name] !== type) {
      return `Field "${name}" must be of type "${type}".`;
    }
  }
  return "";
}
