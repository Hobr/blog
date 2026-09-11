export type ThemeVariant = "light" | "dark";

export type SiteTheme = {
    id: string;
    label: string;
    variant: ThemeVariant;
    palette: Record<string, string>;
};

export const THEME_STORAGE_KEY = "hobr.theme";
export const defaultThemeId = "base16-rose-pine";

export const themes: SiteTheme[] = [
    {
        id: "base16-sakura",
        label: "Sakura",
        variant: "light",
        palette: {
            background: "#feedf3",
            backgroundSubtle: "#f8e2e7",
            backgroundElevated: "#e0ccd1",
            surfaceBorder: "#e0ccd1",
            surfaceBorderStrong: "#755f64",
            textMain: "#564448",
            textSoft: "#755f64",
            textStrong: "#42383a",
            accent: "#006e93",
            accentContrast: "#feedf3",
            selection: "#e0ccd1",
            codeBackground: "#f8e2e7",
            error: "#df2d52",
            warning: "#f6661e",
            success: "#2e916d",
            shadow: "rgba(86, 68, 72, 0.14)",
        },
    },
    {
        id: "base16-catppuccin-frappe",
        label: "Catppuccin Frappe",
        variant: "dark",
        palette: {
            background: "#303446",
            backgroundSubtle: "#292c3c",
            backgroundElevated: "#414559",
            surfaceBorder: "#414559",
            surfaceBorderStrong: "#626880",
            textMain: "#c6d0f5",
            textSoft: "#626880",
            textStrong: "#f2d5cf",
            accent: "#8caaee",
            accentContrast: "#303446",
            selection: "#414559",
            codeBackground: "#292c3c",
            error: "#e78284",
            warning: "#ef9f76",
            success: "#a6d189",
            shadow: "rgba(0, 0, 0, 0.34)",
        },
    },
    {
        id: "base16-catppuccin-latte",
        label: "Catppuccin Latte",
        variant: "light",
        palette: {
            background: "#eff1f5",
            backgroundSubtle: "#e6e9ef",
            backgroundElevated: "#ccd0da",
            surfaceBorder: "#ccd0da",
            surfaceBorderStrong: "#acb0be",
            textMain: "#4c4f69",
            textSoft: "#acb0be",
            textStrong: "#dc8a78",
            accent: "#1e66f5",
            accentContrast: "#eff1f5",
            selection: "#ccd0da",
            codeBackground: "#e6e9ef",
            error: "#d20f39",
            warning: "#fe640b",
            success: "#40a02b",
            shadow: "rgba(76, 79, 105, 0.14)",
        },
    },
    {
        id: "base16-catppuccin-macchiato",
        label: "Catppuccin Macchiato",
        variant: "dark",
        palette: {
            background: "#24273a",
            backgroundSubtle: "#1e2030",
            backgroundElevated: "#363a4f",
            surfaceBorder: "#363a4f",
            surfaceBorderStrong: "#5b6078",
            textMain: "#cad3f5",
            textSoft: "#5b6078",
            textStrong: "#f4dbd6",
            accent: "#8aadf4",
            accentContrast: "#24273a",
            selection: "#363a4f",
            codeBackground: "#1e2030",
            error: "#ed8796",
            warning: "#f5a97f",
            success: "#a6da95",
            shadow: "rgba(0, 0, 0, 0.34)",
        },
    },
    {
        id: "base16-catppuccin-mocha",
        label: "Catppuccin Mocha",
        variant: "dark",
        palette: {
            background: "#1e1e2e",
            backgroundSubtle: "#181825",
            backgroundElevated: "#313244",
            surfaceBorder: "#313244",
            surfaceBorderStrong: "#585b70",
            textMain: "#cdd6f4",
            textSoft: "#585b70",
            textStrong: "#f5e0dc",
            accent: "#89b4fa",
            accentContrast: "#1e1e2e",
            selection: "#313244",
            codeBackground: "#181825",
            error: "#f38ba8",
            warning: "#fab387",
            success: "#a6e3a1",
            shadow: "rgba(0, 0, 0, 0.34)",
        },
    },
    {
        id: "base16-cupcake",
        label: "Cupcake",
        variant: "light",
        palette: {
            background: "#fbf1f2",
            backgroundSubtle: "#f2f1f4",
            backgroundElevated: "#d8d5dd",
            surfaceBorder: "#d8d5dd",
            surfaceBorderStrong: "#a59daf",
            textMain: "#8b8198",
            textSoft: "#a59daf",
            textStrong: "#72677e",
            accent: "#7297b9",
            accentContrast: "#fbf1f2",
            selection: "#d8d5dd",
            codeBackground: "#f2f1f4",
            error: "#d57e85",
            warning: "#ebb790",
            success: "#a3b367",
            shadow: "rgba(139, 129, 152, 0.14)",
        },
    },
    {
        id: "base16-dracula",
        label: "Dracula",
        variant: "dark",
        palette: {
            background: "#282a36",
            backgroundSubtle: "#21222c",
            backgroundElevated: "#44475a",
            surfaceBorder: "#44475a",
            surfaceBorderStrong: "#9ea8c7",
            textMain: "#f8f8f2",
            textSoft: "#6272a4",
            textStrong: "#ffffff",
            accent: "#bd93f9",
            accentContrast: "#282a36",
            selection: "#44475a",
            codeBackground: "#21222c",
            error: "#ff5555",
            warning: "#ffb86c",
            success: "#50fa7b",
            shadow: "rgba(0, 0, 0, 0.34)",
        },
    },
    {
        id: "base16-gruvbox-light",
        label: "Gruvbox Light",
        variant: "light",
        palette: {
            background: "#fbf1c7",
            backgroundSubtle: "#ebdbb2",
            backgroundElevated: "#d5c4a1",
            surfaceBorder: "#d5c4a1",
            surfaceBorderStrong: "#7c6f64",
            textMain: "#3c3836",
            textSoft: "#7c6f64",
            textStrong: "#282828",
            accent: "#458588",
            accentContrast: "#fbf1c7",
            selection: "#d5c4a1",
            codeBackground: "#ebdbb2",
            error: "#cc241d",
            warning: "#d65d0e",
            success: "#98971a",
            shadow: "rgba(60, 56, 54, 0.14)",
        },
    },
    {
        id: "base16-material",
        label: "Material",
        variant: "dark",
        palette: {
            background: "#263238",
            backgroundSubtle: "#2e3c43",
            backgroundElevated: "#314549",
            surfaceBorder: "#314549",
            surfaceBorderStrong: "#b2ccd6",
            textMain: "#eeffff",
            textSoft: "#546e7a",
            textStrong: "#ffffff",
            accent: "#82aaff",
            accentContrast: "#263238",
            selection: "#314549",
            codeBackground: "#2e3c43",
            error: "#f07178",
            warning: "#f78c6c",
            success: "#c3e88d",
            shadow: "rgba(0, 0, 0, 0.34)",
        },
    },
    {
        id: "base16-nord",
        label: "Nord",
        variant: "dark",
        palette: {
            background: "#2e3440",
            backgroundSubtle: "#3b4252",
            backgroundElevated: "#434c5e",
            surfaceBorder: "#434c5e",
            surfaceBorderStrong: "#d8dee9",
            textMain: "#e5e9f0",
            textSoft: "#4c566a",
            textStrong: "#eceff4",
            accent: "#81a1c1",
            accentContrast: "#2e3440",
            selection: "#434c5e",
            codeBackground: "#3b4252",
            error: "#bf616a",
            warning: "#d08770",
            success: "#a3be8c",
            shadow: "rgba(0, 0, 0, 0.34)",
        },
    },
    {
        id: "base16-rose-pine",
        label: "Rose Pine",
        variant: "dark",
        palette: {
            background: "#191724",
            backgroundSubtle: "#1f1d2e",
            backgroundElevated: "#26233a",
            surfaceBorder: "#26233a",
            surfaceBorderStrong: "#908caa",
            textMain: "#e0def4",
            textSoft: "#6e6a86",
            textStrong: "#e0def4",
            accent: "#c4a7e7",
            accentContrast: "#191724",
            selection: "#26233a",
            codeBackground: "#1f1d2e",
            error: "#eb6f92",
            warning: "#f6c177",
            success: "#31748f",
            shadow: "rgba(0, 0, 0, 0.34)",
        },
    },
];

export const themeIds = themes.map((theme) => theme.id);

export function getThemeStyles() {
    const themeRules = themes
        .map((theme) => {
            const paletteVars = Object.entries(theme.palette)
                .map(([key, value]) => `    --${key}: ${value};`)
                .join("\n");

            return `:root[data-theme="${theme.id}"] {
    color-scheme: ${theme.variant};
${paletteVars}
}`;
        })
        .join("\n\n");

    return `${themeRules}

html {
    background: var(--background);
    color: var(--textMain);
}
`;
}
