# Game Visual Design System

## Fonts

Two custom fonts are used throughout the game to evoke a thematic feel:
- **Robus** is used for header title, providing a sturdy and readable appearance that complements the game's tone.
- **Warrior** was employed as an alternative for Robus font in design, before dicinding to only use Robus for titles.

Additionaly, the regular font that was used for regular text was Serif

## Colors

The color palette is designed to enhance the game's visual appeal and usability:
- **Background**: The background is set to black (`#000000`), providing a dramatic backdrop that enhances the visibility of game elements.
- **Header Text**: Headers and important textual elements are in a vibrant green (`rgb(17, 141, 54)`), offering a striking contrast against the black background for clarity and emphasis.
- **Button and Accent Color**: Buttons and key interactive elements use the same green (`rgb(17, 141, 54)`) to maintain consistency and highlight interactive areas effectively.
- **Button Hover**: On hover, buttons transition to a lighter shade of green (`rgb(181, 221, 193)`), providing visual feedback to users to indicate interactivity.

## Layout and Components

### Header

The header serves as the title banner of the game:
- Positioned centrally (`text-align: center`), the **Header** (`title`) prominently displays the game's title using the **Robus** font.
- The use of the vibrant green color (`rgb(17, 141, 54)`) ensures the title stands out against the dark background, drawing immediate attention upon entering the game.

### Body

The overall body of the game interface maintains a high contrast color scheme:
- **Background**: The background is uniformly black (`#000000`), ensuring optimal contrast for all text and graphical elements displayed on the screen.
- **Text Color**: White text (`#ffffff`) is used throughout the body, ensuring readability against the black background and maintaining visual consistency.

### Two Columns Layout

The layout is structured to accommodate different game sections:
- **Two Columns**: Utilizes a flexible `flexbox` layout (`display: flex`) to organize content into two main columns.
- **Game Column**: The wider column (`width: 40%`) houses the primary gameplay area, ensuring ample space for displaying game-specific information and interactive elements.
- **Score Column**: A narrower column (`width: 300px`) is dedicated to displaying scores and related game statistics, allowing players to easily track their progress.

### Button Styles

Buttons are styled to be visually appealing and intuitive:
- **Button Design**: Buttons are styled with rounded corners (`border-radius: 4px`) and a solid background color (`background-color: rgb(17, 141, 54)`), making them prominent and easily clickable.
- **Hover Effect**: On hover (`:hover`), buttons transition to a lighter shade of green (`rgb(181, 221, 193)`) with contrasting text (`color: black`), providing visual feedback and enhancing usability.

### Dice Display

Displays saved dice during the game:
- **Saved Dice Display**: A bordered section (`border: 3px solid rgb(17, 141, 54)`) visually separates saved dice from other game elements.
- **Visual Organization**: Utilizes `flexbox` (`display: flex`) to align saved dice in a centered and structured manner, ensuring clarity and ease of reference during gameplay.

### Roll Display

Visualizes the current dice roll or dice animation:
- **Display of Rolling**: Features a bordered area (`border: 4px solid rgb(17, 141, 54)`) to contain dice rolling animations or current dice face displays.
- **Interactive Feedback**: Centered content (`justify-content: center`) and spacing (`gap: 2%`) within the display area ensure that rolling animations or current dice faces are clear and engaging.

### Dice Styling

Customizes the appearance and behavior of game dice:
- **Dice Appearance**: Dice images (`dice`) are styled with rounded corners (`border-radius: 10px`) and a smooth transition (`transition: all 0.4s linear`) to enhance visual appeal during animations.
- **Hover Effect**: On hover (`:hover`), dice faces (`face`) scale slightly (`transform: scale(1.1)`) to provide interactive feedback, emphasizing the selected dice or adding a playful touch during gameplay.

### Table Cells

Formats and organizes content within table structures:
- **Cell Styling**: Table cells (`cell`) are uniformly styled with a solid border (`border: 1px solid white`) and consistent padding (`padding: 8px`), ensuring a clean and organized presentation of tabular data.
- **Header Cell**: Special styling (`headerCell`) for table headers ensures alignment (`align-items: center`) and visual consistency within the table structure.
