# Development

Use Node 24.14.1 or newer and pnpm 10.33.0. `.nvmrc` selects the Node version used by CI, and `package.json` pins pnpm.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## Verification

```sh
pnpm lint
pnpm build
```

`build` runs TypeScript checking before creating the production bundle and service worker. There is no automated test suite yet.

## Biome

Biome replaces ESLint and handles linting, formatting and import organization. Install the recommended Biome VS Code extension to use the repository's format-on-save and code actions.

- `pnpm lint` checks for lint errors without changing files.
- `pnpm lint:fix` applies safe lint fixes.
- `pnpm format` formats files with two-space indentation, double quotes and semicolons.

Formatting isn't a CI gate, so the migration doesn't require reformatting the entire repository. Biome respects `.gitignore` and excludes build output. Tailwind CSS directives are enabled in the CSS parser.

The recommended lint rules are enabled. Hook dependencies remain warnings, as they were with ESLint. Existing accessibility and array-index-key findings are warnings too, so they stay visible without blocking unrelated changes. The vendored components in `src/components/ui` retain their previous lint exclusion, but can still be formatted.
