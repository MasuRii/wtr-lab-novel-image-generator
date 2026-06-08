# Repository Guidelines

## Project Structure
- `src/`: TypeScript source for the userscript runtime.
- `src/index.ts`: Main userscript entrypoint when present; inspect imports before changing behavior.
- `dist/`: Generated userscript and metadata artifacts produced by the build; install artifacts belong here only.
- `package.json`: Project metadata and npm validation commands.
- `README.md`: Product scope, installation guidance, and user-facing behavior notes.
- `GreasyForkREADME.md`: Greasy Fork-facing project description.

## Development Commands
- `npm install`: Install local dependencies for development.
- `npm ci`: Install dependencies exactly from `package-lock.json`; used by GitHub Actions.
- `npm run build`: Bundle TypeScript source into userscript artifacts under `dist/`.
- `npm run typecheck`: Run TypeScript checking without emitting files.
- `npm run lint`: Run ESLint against userscript source.
- `npm run validate`: Run the repository's required validation gate.
- Test command: Present; check `package.json` for the configured command.
- Development server command: Use `npm run dev` only when present in `package.json`.

## Coding Conventions
- Use TypeScript under `src/` for behavior changes; do not add runtime JavaScript files under `src/`.
- Rebuild generated userscript output instead of hand-editing bundled logic.
- Preserve userscript metadata, install URLs, update URLs, and public `dist` artifact filenames.
- Keep the runtime lightweight and avoid tracking, analytics, or remote telemetry.
- Follow `.editorconfig`: LF endings, final newline, UTF-8, 4-space indentation, trim trailing whitespace except Markdown.

## Testing & Verification
- Run `npm run validate` before reporting completion for code or metadata changes.
- Use `npm run typecheck` for a faster TypeScript-only check while iterating.
- Use `npm run build` after changing `src/`, metadata, or Webpack configuration.
- Suggested manual check: Select text on a WTR Lab chapter and confirm the image generation action appears.
- Do not claim browser, userscript manager, or iOS behavior is verified unless it was actually checked.

## Safety & Change Management
- Preserve unrelated user changes; check `git status --short` before editing.
- Use strict Conventional Commits 1.0.0 with no emojis when commits are requested.
- Do not edit `package-lock.json` unless dependency changes require it.
- Do not edit generated `dist` files by hand; change source or metadata and run the build.
- Do not add dependencies, tests, formatters, hooks, CI workflows, or extra documentation beyond the requested scope.

## Agent Notes
- Read `README.md` first for product scope, supported userscript managers, install links, and compatibility notes.
- Read `CONTRIBUTING.md` before pull-request-style work; it defines local checks and contribution expectations.
- GitHub Actions runs `npm ci` then `npm run validate` on `main` pushes and pull requests.
- Keep WTR Lab compatibility in mind when changing metadata, browser APIs, or page selectors.
