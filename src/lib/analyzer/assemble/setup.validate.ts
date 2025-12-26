import { ValidationError } from "@/lib/error";

export function validateSetupOutput(raw: unknown): {
  installation: string | null;
  runCommand?: string | null;
} {
  if (typeof raw !== "object" || raw === null) {
    throw new ValidationError("Invalid setup output", { raw });
  }

  const obj = raw as any;

  // installation: string | null
  if (obj.installation !== null && typeof obj.installation !== "string") {
    throw new ValidationError("Invalid setup output", { raw });
  }

  // runCommand?: string | null
  if (
    obj.runCommand !== undefined &&
    obj.runCommand !== null &&
    typeof obj.runCommand !== "string"
  ) {
    throw new ValidationError("Invalid setup output", { raw });
  }

  return {
    installation: obj.installation ?? null,
    runCommand: obj.runCommand === undefined ? undefined : obj.runCommand,
  };
}
