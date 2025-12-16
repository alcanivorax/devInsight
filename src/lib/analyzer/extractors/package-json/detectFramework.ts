import { FrameworkSignature } from "../types";

export function detectFramework(dependencies: string[]): string | null {
  const frameworks: FrameworkSignature[] = [
    // React-based
    { deps: ["next"], framework: "Next.js", runtime: "Node.js" },
    { deps: ["gatsby"], framework: "Gatsby", runtime: "Node.js" },
    {
      deps: ["react-scripts", "react"],
      framework: "Create React App",
      runtime: "Browser",
    },
    { deps: ["@remix-run/react"], framework: "Remix", runtime: "Node.js" },
    { deps: ["react"], framework: "React", runtime: "Browser" },

    // Vue-based
    { deps: ["nuxt"], framework: "Nuxt", runtime: "Node.js" },
    { deps: ["@quasar/app"], framework: "Quasar", runtime: "Node.js" },
    { deps: ["vue"], framework: "Vue", runtime: "Browser" },

    // Angular
    { deps: ["@angular/core"], framework: "Angular", runtime: "Browser" },

    // Svelte
    { deps: ["@sveltejs/kit"], framework: "SvelteKit", runtime: "Node.js" },
    { deps: ["svelte"], framework: "Svelte", runtime: "Browser" },

    // Backend frameworks
    { deps: ["express"], framework: "Express", runtime: "Node.js" },
    { deps: ["fastify"], framework: "Fastify", runtime: "Node.js" },
    { deps: ["@nestjs/core"], framework: "NestJS", runtime: "Node.js" },
    { deps: ["koa"], framework: "Koa", runtime: "Node.js" },
    { deps: ["hapi", "@hapi/hapi"], framework: "Hapi", runtime: "Node.js" },
    { deps: ["@trpc/server"], framework: "tRPC", runtime: "Node.js" },
    { deps: ["elysia"], framework: "Elysia", runtime: "Bun" },
    { deps: ["hono"], framework: "Hono", runtime: "Node.js" },

    // Full-stack
    { deps: ["@redwoodjs/core"], framework: "RedwoodJS", runtime: "Node.js" },
    { deps: ["@blitzjs/next"], framework: "Blitz", runtime: "Node.js" },
    { deps: ["@solidjs/start"], framework: "SolidStart", runtime: "Node.js" },

    // Static site generators
    { deps: ["@11ty/eleventy"], framework: "11ty", runtime: "Node.js" },
    { deps: ["astro"], framework: "Astro", runtime: "Node.js" },
    { deps: ["vuepress"], framework: "VuePress", runtime: "Node.js" },
    {
      deps: ["docusaurus", "@docusaurus/core"],
      framework: "Docusaurus",
      runtime: "Node.js",
    },

    // Build tools (lower priority)
    { deps: ["vite"], framework: "Vite", runtime: "Node.js" },
    { deps: ["webpack"], framework: "Webpack", runtime: "Node.js" },
    { deps: ["parcel"], framework: "Parcel", runtime: "Node.js" },
  ];

  // Check in order of specificity (more specific frameworks first)
  for (const { deps, framework } of frameworks) {
    if (deps.some((dep) => dependencies.includes(dep))) {
      return framework;
    }
  }

  return null;
}
