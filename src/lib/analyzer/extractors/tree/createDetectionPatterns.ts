import { DetectionPatterns, TechSignal } from "../types";

export function createDetectionPatterns(): DetectionPatterns {
  const configFiles = new Map<string, TechSignal>([
    // JavaScript / TypeScript
    [
      "package.json",
      {
        language: { value: "JavaScript", confidence: "inferred" },
      },
    ],
    [
      "tsconfig.json",
      {
        language: { value: "TypeScript", confidence: "explicit" },
      },
    ],
    [
      "next.config.js",
      {
        framework: { value: "Next.js", confidence: "explicit" },
      },
    ],
    [
      "next.config.ts",
      {
        framework: { value: "Next.js", confidence: "explicit" },
      },
    ],
    [
      "vite.config.ts",
      {
        framework: { value: "Vite", confidence: "explicit" },
      },
    ],
    [
      "angular.json",
      {
        framework: { value: "Angular", confidence: "explicit" },
      },
    ],

    // Python
    [
      "pyproject.toml",
      {
        language: { value: "Python", confidence: "explicit" },
      },
    ],
    [
      "requirements.txt",
      {
        language: { value: "Python", confidence: "inferred" },
      },
    ],
    [
      "manage.py",
      {
        framework: { value: "Django", confidence: "explicit" },
      },
    ],

    // Go
    [
      "go.mod",
      {
        language: { value: "Go", confidence: "explicit" },
      },
    ],

    // Rust
    [
      "cargo.toml",
      {
        language: { value: "Rust", confidence: "explicit" },
      },
    ],

    // Java
    [
      "pom.xml",
      {
        language: { value: "Java", confidence: "explicit" },
        framework: { value: "Maven", confidence: "explicit" },
      },
    ],
    [
      "build.gradle",
      {
        framework: { value: "Gradle", confidence: "explicit" },
      },
    ],

    // Ruby
    [
      "gemfile",
      {
        language: { value: "Ruby", confidence: "explicit" },
      },
    ],

    // PHP
    [
      "composer.json",
      {
        language: { value: "PHP", confidence: "explicit" },
      },
    ],

    // .NET
    [
      ".csproj",
      {
        language: { value: "C#", confidence: "explicit" },
      },
    ],

    // Elixir
    [
      "mix.exs",
      {
        language: { value: "Elixir", confidence: "explicit" },
      },
    ],
  ]);

  const testPatterns = [
    /\/__tests__\//,
    /\/tests?\//,
    /\/spec\//,
    /\.test\.[jt]sx?$/,
    /\.spec\.[jt]sx?$/,
    /_test\.py$/,
    /test_.*\.py$/,
    /_spec\.rb$/,
    /_test\.go$/,
    /\.test\.tsx?$/,
  ];

  const ciPatterns = [
    /^\.github\/workflows\//,
    /^\.gitlab-ci\.yml$/,
    /^\.circleci\//,
    /^\.travis\.yml$/,
    /^jenkinsfile$/,
    /^\.drone\.yml$/,
    /^azure-pipelines\.yml$/,
    /^bitbucket-pipelines\.yml$/,
  ];

  const dockerPatterns = [
    /^dockerfile$/,
    /^dockerfile\./,
    /^docker-compose\.ya?ml$/,
    /^\.dockerignore$/,
  ];

  const entryPointPatterns: RegExp[] = [
    // Common
    /(^|\/)index\.(js|ts)$/i,
    /(^|\/)main\.(js|ts|py|go|rs)$/i,
    /(^|\/)app\.(js|ts|py|rb)$/i,
    /(^|\/)server\.(js|ts)$/i,

    // Framework / ecosystem hints
    /(^|\/)src\/index\.(js|ts)$/i,
    /(^|\/)__main__\.py$/i,
    /(^|\/)manage\.py$/i,
    /(^|\/)wsgi\.py$/i,
    /(^|\/)cmd\/.*\/main\.go$/i,
    /(^|\/)main\.rs$/i,
    /(^|\/)config\.ru$/i,
  ];

  // const entryPoints = new Map([
  //   [
  //     "JavaScript",
  //     [
  //       "index.js",
  //       "main.js",
  //       "app.js",
  //       "server.js",
  //       "src/index.js",
  //       "src/main.js",
  //     ],
  //   ],
  //   [
  //     "TypeScript",
  //     [
  //       "index.ts",
  //       "main.ts",
  //       "app.ts",
  //       "server.ts",
  //       "src/index.ts",
  //       "src/main.ts",
  //     ],
  //   ],
  //   [
  //     "Python",
  //     ["main.py", "app.py", "__main__.py", "run.py", "manage.py", "wsgi.py"],
  //   ],
  //   ["Go", ["main.go", "cmd/main.go"]],
  //   ["Rust", ["src/main.rs", "main.rs"]],
  //   ["Ruby", ["main.rb", "app.rb", "config.ru"]],
  //   ["Java", ["Main.java", "Application.java", "App.java"]],
  // ]);

  return {
    configFiles,
    testPatterns,
    ciPatterns,
    dockerPatterns,
    entryPointPatterns,
  };
}
