# Creating your own HUD

### Elements:
Type | Element selector | Description
:-- | :-- | :-- | :--
Health Text | `#health-text` | Amount of health `0-100` in number form
Health Text Color | `#health` | Color of any text within this element ( 100-50 green, 49-15 orange, 14-0 red )
Health Bar Color | `#health .level` | Color of any text within this element ( 100-50 green, 49-15 orange, 14-0 red )
Health Bar Width/Position | `#health .level` | Moves health bar to the left ( requires position absolute )
Armor Text | `#armor-text` | Amount of armor `0-100` in number form
Armor Text Color | `#armor` | Color of any text within this element ( 0 white(semi transparent), 100-15 blue, 14-0 red )
Armor Bar Color | `#armor .level` | Color of any text within this element ( 0 white(semi transparent), 100-15 blue, 14-0 red )
Armor Bar Width/Position | `#armor .level` | Moves armor bar to the left ( requires position absolute )