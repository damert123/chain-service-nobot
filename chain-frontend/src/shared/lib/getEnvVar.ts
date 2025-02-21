export function getEnvVar(variable: string): string {
  const value = import.meta.env[variable];

  if (typeof value === "string") {
    return value;
  } else {
    throw new Error(`Environment variable ${variable} is required`);
  }
}
