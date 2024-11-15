import fs from "fs/promises";
import path from "path";

// How to use:
//
// 1. Go to this frame: https://www.figma.com/design/kThyEyFD5loSo2JrlWEQx4/MTMH---Shadcn%2FUI-Design-System-2024-With-Variables-(Community)?node-id=2115-2732&t=W2vzvgu9JyjySzoD-4.
// 2. Right click, then select "Copy".
// 3. Paste it into `scripts/resources/typography-tokens.txt`.
//
// The expected content is like the following:
//
// Text Type
// Font Size
// Weight
// Line-Height
// Line-Spacing
// Display - Large
// 36px
// Bold
// 44px
// 0%
// Display - Medium
// 32px
// Bold
// 40px
// 0%
// ...

const INPUT_PATH = path.join("scripts/resources/typography-tokens.txt");
const OUTPUT_PATH = path.join("tailwind/plugins/typography.ts");
const FONT_WEIGHT_MAPPING = {
  Bold: "700",
  "Semi-Bold": "600",
  Medium: "500",
  Regular: "400",
};

let txt;

try {
  txt = await fs.readFile(INPUT_PATH, "utf-8");
  txt.trim();
} catch (err) {
  console.error(err);
  process.exit(1);
}

const lines = txt.trim().split("\n");
const classes = {};

// Start from index 5, because the first 5 elements are table headers.
for (let i = 5; i < lines.length; i = i + 5) {
  // Dev's note: line spacing (5th element) is ignored because we don't use it (yet).
  const [type, fontSize, fontWeight, lineHeight] = lines.slice(i, i + 5);

  const className = `.text-mtmh-${type.toLowerCase().replace(/-/g, "").replace(/\s+/g, "-")}`;

  classes[className] = {
    "font-size": fontSize,
    "font-weight": FONT_WEIGHT_MAPPING[fontWeight],
    "line-height": lineHeight,
    "text-align": "left",
    "text-underline-position": "from-font",
    "text-decoration-skip-ink": "none",
  };
}

const typographyPluginContent = `
import plugin from 'tailwindcss/plugin'

export const typographyPlugin = plugin(function ({ addUtilities }) {
  addUtilities(${JSON.stringify(classes, null, 2)})
})
`.trimStart();

await fs.writeFile(OUTPUT_PATH, typographyPluginContent, "utf-8");

console.log(
  `✨ Successfully generated typography tokens! Don't forget to format the output in ${OUTPUT_PATH} for consistency purposes.`
);
