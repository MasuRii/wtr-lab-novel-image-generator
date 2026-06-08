# Contributing

Thanks for helping improve WTR Lab Novel Image Generator.

## Ground rules

- Keep the runtime userscript lightweight.
- Preserve generated install artifacts under `dist/`; do not hand-edit bundled output.
- Make runtime source changes in TypeScript under `src/`; do not add runtime JavaScript files under `src/`.
- Do not add tracking, analytics, or remote telemetry.
- Keep changes focused on WTR Lab userscript behavior and avoid unrelated tooling churn.

## Local checks

Before opening a pull request, run:

```bash
npm ci
npm run validate
```

When behavior changes, also install the generated userscript locally in a supported userscript manager and verify it on the affected WTR Lab page.

Suggested manual check: Select text on a WTR Lab chapter and confirm the image generation action appears.

## Pull requests

1. Describe the problem and the behavior change.
2. Include manual test notes for affected WTR Lab pages and userscript managers.
3. Keep changes focused on one issue or feature.
4. Update `CHANGELOG.md` when user-facing behavior changes.

## Issue reports

Please include:

- Browser and userscript manager versions
- WTR Lab page URL pattern where the issue appears
- Steps to reproduce
- Expected behavior
- Actual behavior
