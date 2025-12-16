import { DetectionPatterns } from "../types";

export function createDetectionPatterns(): DetectionPatterns {
  const configFiles = new Map([
    // JavaScript/TypeScript
    ["package.json", { language: "JavaScript" }],
    ["tsconfig.json", { language: "TypeScript" }],
    ["next.config.js", { language: "TypeScript", framework: "Next.js" }],
    ["next.config.ts", { language: "TypeScript", framework: "Next.js" }],
    ["nuxt.config.js", { language: "JavaScript", framework: "Nuxt" }],
    ["nuxt.config.ts", { language: "TypeScript", framework: "Nuxt" }],
    ["vite.config.js", { language: "JavaScript", framework: "Vite" }],
    ["vite.config.ts", { language: "TypeScript", framework: "Vite" }],
    ["angular.json", { language: "TypeScript", framework: "Angular" }],
    ["svelte.config.js", { language: "JavaScript", framework: "Svelte" }],

    // Python
    ["requirements.txt", { language: "Python" }],
    ["setup.py", { language: "Python" }],
    ["pyproject.toml", { language: "Python" }],
    ["pipfile", { language: "Python" }],
    ["poetry.lock", { language: "Python" }],
    ["manage.py", { language: "Python", framework: "Django" }],

    // Ruby
    ["gemfile", { language: "Ruby" }],
    ["rakefile", { language: "Ruby" }],
    ["config.ru", { language: "Ruby", framework: "Rack" }],

    // Go
    ["go.mod", { language: "Go" }],
    ["go.sum", { language: "Go" }],

    // Rust
    ["cargo.toml", { language: "Rust" }],
    ["cargo.lock", { language: "Rust" }],

    // Java
    ["pom.xml", { language: "Java", framework: "Maven" }],
    ["build.gradle", { language: "Java", framework: "Gradle" }],
    ["build.gradle.kts", { language: "Kotlin", framework: "Gradle" }],

    // PHP
    ["composer.json", { language: "PHP" }],

    // .NET
    [".csproj", { language: "C#" }],
    [".fsproj", { language: "F#" }],
    [".vbproj", { language: "Visual Basic" }],

    // Elixir
    ["mix.exs", { language: "Elixir" }],
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

  const entryPoints = new Map([
    [
      "JavaScript",
      [
        "index.js",
        "main.js",
        "app.js",
        "server.js",
        "src/index.js",
        "src/main.js",
      ],
    ],
    [
      "TypeScript",
      [
        "index.ts",
        "main.ts",
        "app.ts",
        "server.ts",
        "src/index.ts",
        "src/main.ts",
      ],
    ],
    [
      "Python",
      ["main.py", "app.py", "__main__.py", "run.py", "manage.py", "wsgi.py"],
    ],
    ["Go", ["main.go", "cmd/main.go"]],
    ["Rust", ["src/main.rs", "main.rs"]],
    ["Ruby", ["main.rb", "app.rb", "config.ru"]],
    ["Java", ["Main.java", "Application.java", "App.java"]],
  ]);

  return { configFiles, testPatterns, ciPatterns, dockerPatterns, entryPoints };
}
