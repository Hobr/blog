import assert from "node:assert/strict";
import test from "node:test";
import { getViteConfig } from "astro/config";

type PluginLike = {
  name?: string;
  enforce?: "pre" | "post";
  resolveId?:
    | ((...args: never[]) => unknown)
    | {
        order?: "pre" | "post" | null;
        filter?: unknown;
        handler: (...args: never[]) => unknown;
      };
  configResolved?:
    | ((config: { plugins: PluginLike[] }) => unknown)
    | {
        handler: (config: { plugins: PluginLike[] }) => unknown;
      };
  configEnvironment?:
    | ((
        name: string,
        options: { resolve?: { noExternal?: unknown } },
      ) => { resolve?: { noExternal?: unknown } } | undefined)
    | {
        handler: (
          name: string,
          options: { resolve?: { noExternal?: unknown } },
        ) => { resolve?: { noExternal?: unknown } } | undefined;
      };
};

function flattenPlugins(input: unknown): PluginLike[] {
  if (!input) {
    return [];
  }
  if (Array.isArray(input)) {
    return input.flatMap(flattenPlugins);
  }
  if (typeof input === "object") {
    return [input as PluginLike];
  }
  return [];
}

function getHookOrder(plugin: PluginLike | undefined) {
  return plugin && typeof plugin.resolveId === "object"
    ? plugin.resolveId.order
    : undefined;
}

test("astro-virtual-modules-before-filesystem protects astro:* virtual modules without breaking ?astro scripts or SSR content", async () => {
  const viteConfig = await getViteConfig(
    {},
    { logLevel: "silent" },
  )({
    mode: "development",
    command: "serve",
  });

  const plugins = flattenPlugins(viteConfig.plugins);
  const ntfsPlugin = plugins.find(
    (plugin) => plugin.name === "astro-virtual-modules-before-filesystem",
  );
  assert.ok(ntfsPlugin, "expected astro-virtual-modules-before-filesystem");

  const configResolved =
    typeof ntfsPlugin.configResolved === "object"
      ? ntfsPlugin.configResolved.handler
      : ntfsPlugin.configResolved;
  assert.ok(configResolved, "expected configResolved hook");
  await configResolved({ plugins });

  // 1. `astro:build:normal` is a `?astro` fallback after Vite's root resolver.
  // Promoting it to `pre` leaves `/src/...?astro&type=script` unresolved at `/` and breaks relative imports.
  const astroBuildNormal = plugins.find(
    (plugin) => plugin.name === "astro:build:normal",
  );
  assert.ok(astroBuildNormal, "expected astro:build:normal plugin");
  assert.notEqual(getHookOrder(astroBuildNormal), "pre");

  // 2. Normal-phase `astro:*` virtual-module plugins (regardless of plugin name prefix) must run `pre`.
  for (const pluginName of [
    "astro-manifest-plugin",
    "astro:scripts",
    "astro:scripts:before-hydration",
    "astro:assets",
    "astro:prefetch",
    "astro:transitions",
    "astro:dev-toolbar",
  ]) {
    const plugin = plugins.find((item) => item.name === pluginName);
    assert.ok(plugin, `expected ${pluginName} plugin`);
    assert.equal(
      getHookOrder(plugin),
      "pre",
      `expected ${pluginName} resolveId order to be "pre"`,
    );
  }

  // 3. SSR environments must mark `astro:*` as `noExternal` so Vite does not externalize
  // `astro:data-layer-content` to `node_modules/astro` via NTFS Alternate Data Streams.
  const configEnvironment =
    typeof ntfsPlugin.configEnvironment === "object"
      ? ntfsPlugin.configEnvironment.handler
      : ntfsPlugin.configEnvironment;
  assert.ok(configEnvironment, "expected configEnvironment hook");

  const envPatch = configEnvironment("astro", { resolve: {} });
  const noExternal = envPatch?.resolve?.noExternal;
  assert.ok(Array.isArray(noExternal), "expected resolve.noExternal array");
  const matchesSpec = (specifier: string) =>
    noExternal.some((entry) =>
      entry instanceof RegExp ? entry.test(specifier) : entry === specifier,
    );

  assert.equal(matchesSpec("astro:data-layer-content"), true);
  assert.equal(matchesSpec("astro:content"), true);
  assert.equal(matchesSpec("katex"), false);
});
