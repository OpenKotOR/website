# OpenKotOR Website

A React TypeScript website built with Vite for the OpenKotOR community.

## Development

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Starts the Vite development server at http://localhost:3000

### Build for Production
```bash
npm run build
```
Builds the project and outputs to the `dist` folder.

### Serve Built Files
```bash
npm run serve
```
Builds the project and serves the `dist` folder using live-server at http://localhost:3000

### Type Checking
```bash
npm run type-check
```
Runs TypeScript type checking without building.

## Live Server Configuration

The project is configured to work with VS Code Live Server extension:

1. **VS Code Settings**: The `.vscode/settings.json` file configures Live Server to:
   - Use the `dist` folder as the root directory
   - Run on port 3000
   - Auto-open the browser
   - Ignore source files and development dependencies

2. **Usage**: 
   - Build the project: `npm run build`
   - Right-click on `dist/index.html` in VS Code
   - Select "Open with Live Server"

## Project Structure

```
├── dist/                 # Built files (served by Live Server)
│   ├── index.html       # Main HTML file
│   └── assets/          # CSS, JS, and other assets
├── src/                 # Source files
│   ├── App.tsx         # Main React component
│   ├── index.tsx       # React entry point
│   └── app.scss        # Styles
├── .vscode/            # VS Code configuration
│   └── settings.json   # Live Server settings
├── package.json        # Dependencies and scripts
├── vite.config.ts      # Vite configuration
└── tsconfig.json       # TypeScript configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run serve` - Build and serve with live-server
- `npm run type-check` - Type checking only
