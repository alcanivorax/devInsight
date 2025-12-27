type CompositeSectionOptions = {
  headers: string[];
  mustIncludeAny?: RegExp[];
};

export function extractCompositeSection(
  readme: string,
  options: CompositeSectionOptions
): string | null {
  const lines = readme.split("\n");

  const headerRegex = new RegExp(
    `^#{1,6}\\s*(${options.headers.join("|")})`,
    "i"
  );

  const stopHeadersRegex = /^#{1,6}\s+/;

  let collecting = false;
  const collected: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Start collecting when we hit a matching header
    if (!collecting && headerRegex.test(line)) {
      collecting = true;
      continue;
    }

    // Stop if we hit a new top-level section
    if (collecting && stopHeadersRegex.test(line)) {
      break;
    }

    if (collecting) {
      collected.push(line);
    }
  }

  if (collected.length === 0) return null;

  const result = collected.join("\n").trim();

  // Validate instructional signals if required
  if (options.mustIncludeAny) {
    const hasSignal = options.mustIncludeAny.some((re) => re.test(result));

    if (!hasSignal) return null;
  }

  return result || null;
}
