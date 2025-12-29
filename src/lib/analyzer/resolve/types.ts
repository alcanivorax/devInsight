type ResolvedEntryPoint =
  | { kind: "runtime"; value: string }
  | { kind: "cli"; value: string }
  | { kind: "library"; value: string };

export type { ResolvedEntryPoint };
