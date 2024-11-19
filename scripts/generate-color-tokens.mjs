import fs from 'fs/promises'
import path from 'path'

// How to use:
//
// 1. Go to this frame: https://www.figma.com/design/kThyEyFD5loSo2JrlWEQx4/MTMH---Shadcn%2FUI-Design-System-2024-With-Variables-(Community)?node-id=2115-1736&t=W2vzvgu9JyjySzoD-4.
// 2. Right click, then select "Copy".
// 3. Paste it into `scripts/resources/color-tokens.txt`.
//
// The expected content is like the following:
//
// Color System
// Primary
// DarkPrimary - 90
// DarkPrimary - 80
// DarkPrimary - 70
// DarkPrimary - 60
// Primary
// LightPrimary - 40
// LightPrimary - 30
// LightPrimary - 20
// LightPrimary - 10
// #2E0407
// #370607
// #450E0A
// #52180F
// #602515
// #9F5C42
// #CF916E
// #EFC4A4
// #F7E4D0
// ...

const INPUT_PATH = path.join('scripts/resources/color-tokens.txt')
const OUTPUT_PATH = path.join('tailwind/colors.ts')
const NAME_OVERRIDES = {
  'neutral-0': 'neutral-white'
}
const NUMBER_OF_ACCENT_COLORS = 4

let txt

try {
  txt = await fs.readFile(INPUT_PATH, 'utf-8')
  txt.trim()
} catch (err) {
  console.error(err)
  process.exit(1)
}

const mtmhColors = {}
// Start from index 1, because the first line is a boundary like "Primary Color", "Secondary Color".
let lines = txt.trim().split('\n').slice(1)
let numberOfAccentColorsTraversed = 0
let isAccentColor = false

while (true) {
  const currentColorHexStartIndex = lines.findIndex((line) =>
    line.startsWith('#')
  )
  if (currentColorHexStartIndex === -1) break

  for (let i = 0; i < currentColorHexStartIndex; i++) {
    const name = lines[i].toLowerCase().replace(/-/g, '').replace(/\s+/g, '-')
    const hex = lines[i + currentColorHexStartIndex]

    const effectiveName = NAME_OVERRIDES[name] ?? name
    const [colorCategory, colorIntensity] = effectiveName.split('-')

    if (!mtmhColors[colorCategory]) {
      mtmhColors[colorCategory] = {}
    }

    // Example: this can be either primary-60 or primary-primary or primary-.
    mtmhColors[colorCategory][colorIntensity || colorCategory] = hex
  }

  // Similarly, also +1 to ignore the "boundary".
  lines = lines.slice(currentColorHexStartIndex * 2)

  // For "Accent Color" category, it's a bit tricky. It contains 4 subcategories and these are without subcategory title.
  // So, we have to "count" how many accent color subcategories we have traversed.
  //
  // If we're currently traversing accent color, then we do not need to `.slice(1)` because there is no subcategory title.
  if (lines[0] === 'Accent Color') {
    isAccentColor = true
    lines = lines.slice(1)
  } else if (
    isAccentColor &&
    numberOfAccentColorsTraversed + 1 < NUMBER_OF_ACCENT_COLORS
  ) {
    numberOfAccentColorsTraversed++
  } else {
    isAccentColor = false
    lines = lines.slice(1)
  }
}

const colorPluginContent = `export const mtmhColors = ${JSON.stringify(mtmhColors, null, 2)}`

await fs.writeFile(OUTPUT_PATH, colorPluginContent, 'utf-8')

console.log(
  `✨ Successfully generated color tokens! Don't forget to format the output in ${OUTPUT_PATH} for consistency purposes.`
)
