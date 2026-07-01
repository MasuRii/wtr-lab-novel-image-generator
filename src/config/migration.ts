// src/config/migration.ts
// Schema-versioned config migration for existing users.
//
// When DEFAULTS change in ways that existing stored values should be updated
// (e.g. new Zen enhancement defaults), a migration step runs on config load to
// upgrade stale/empty settings while preserving truly custom user values.

import { DEFAULTS, CONFIG_SCHEMA_VERSION } from "./defaults";

const ZEN_DEFAULT_URL = DEFAULTS.enhancementBaseUrl;
const ZEN_DEFAULT_MODEL = DEFAULTS.enhancementModel;

function isNonEmptyString(value: any): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function isZenEndpoint(baseUrl: any): boolean {
  return typeof baseUrl === "string" && baseUrl.includes("opencode.ai/zen");
}

/**
 * Determines whether a stored enhancement model is a stale legacy value that
 * should be replaced with the Zen default.
 * Stale = empty, non-string, or provider-prefixed (e.g. "models/...").
 */
function isStaleModel(model: any): boolean {
  if (!isNonEmptyString(model)) {
    return true;
  }
  return model.startsWith("models/");
}

/**
 * Migrates a config object to the current schema version.
 *
 * - Skips entirely when configSchemaVersion is already current.
 * - For schema v1 → v2: upgrades empty/stale enhancement settings to Zen
 *   defaults (https://opencode.ai/zen/v1, big-pickle, dropdown mode) while
 *   preserving non-empty custom endpoints and models.
 * - Bumps configSchemaVersion to CONFIG_SCHEMA_VERSION after migration.
 *
 * @param config - The raw config object loaded from storage
 * @returns The migrated config object (same reference if no migration needed)
 */
export function migrateConfig(config: any): any {
  const version =
    typeof config?.configSchemaVersion === "number"
      ? config.configSchemaVersion
      : 1;

  if (version >= CONFIG_SCHEMA_VERSION) {
    return config;
  }

  const migrated = { ...config };

  // --- v1 → v2: Zen enhancement defaults migration ---
  if (version < 2) {
    const hasCustomEndpoint = isNonEmptyString(migrated.enhancementBaseUrl);
    const hasCustomModel = !isStaleModel(migrated.enhancementModel);

    if (!hasCustomEndpoint) {
      migrated.enhancementBaseUrl = ZEN_DEFAULT_URL;
    }
    if (!hasCustomModel) {
      migrated.enhancementModel = ZEN_DEFAULT_MODEL;
    }

    // When any enhancement setting was migrated to Zen, ensure dropdown mode
    // so the user sees the free-model list rather than a blank manual input.
    if ((!hasCustomEndpoint || !hasCustomModel) && isZenEndpoint(migrated.enhancementBaseUrl)) {
      migrated.enhancementModelManualInput = false;
    }
  }

  migrated.configSchemaVersion = CONFIG_SCHEMA_VERSION;
  return migrated;
}
