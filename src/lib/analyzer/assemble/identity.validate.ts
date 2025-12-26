import { ValidationError } from "@/lib/error";

export function validateIdentityOutput(raw: unknown): { summary: string } {
  if (
    typeof raw !== "object" ||
    raw === null ||
    typeof (raw as any).summary !== "string"
  ) {
    throw new ValidationError("Invalid identity output", { raw });
  }

  return raw as { summary: string };
}
