<div align="center">
  <img src="public/logo.png" alt="SafarAI Logo" width="120" />
  <h1>SafarAI</h1>
  <p><strong>Your Intelligent Travel Companion</strong></p>
</div>

SafarAI is a modern, AI-powered travel assistant web application designed to centralize and simplify trip planning. From discovering your next destination to generating a contextual packing list, SafarAI ensures your travel experience is effortless, inspiring, and tailored to your preferences.

## ✨ Features

- **Destination Discovery**: Browse trending global destinations with AI-recommended top picks based on your travel profile.
- **Smart Trip Planning**: Build a timeline-based itinerary with intuitive drag-and-drop activity planning.
- **Smart Backpack Adapter (AI Packing)**: Automatically generate customized packing checklists tailored to your destination's weather, trip duration, and planned activities. Features quantity adjusters, essential/optional tags, and automatic weight estimation.
- **Live Weather Context**: Contextual weather widgets seamlessly integrated into the dashboard, packing list, and destination details.
- **Multi-Step Preference Setup**: Easily refine travel recommendations by inputting preferred climate, budget, duration, and favorite activities.

## 🎨 UI/UX Design

SafarAI is built with a premium **Glassmorphism** aesthetic, emphasizing clarity, accessibility, and a delightful user experience.
- **Color Palette**: A soothing mix of Teal Green (`#5B9E8F`), Sky Blue (`#7BAFD4`), Sandy Orange (`#D9A860`), and Coral (`#D98A7B`), reflecting earth, ocean, and sunset tones.
- **Components**: Rounded cards, soft shadows, and subtle micro-animations breathe life into the interface.
- **Responsive**: Fully adaptable layouts that gracefully degrade from desktop masonry grids to a clean, mobile-first sticky bottom navigation.

## 🛠 Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) via [Vite](https://vitejs.dev/)
- **Routing**: [React Router](https://reactrouter.com/) for seamless single-page application navigation
- **Styling**: Pure **Vanilla CSS** leveraging native CSS Variables and flexbox/grid for robust, dependency-free design token management.
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- `npm` or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AbderrazakMorro/safarai.git
   cd safarai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173/` to explore the SafarAI landing page.

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components (Navbar, Sidebar, Card, Widgets, etc.)
├── pages/            # Main application views (Dashboard, TripPlanner, SmartBackpack, etc.)
├── App.jsx           # Application entry point and router configuration
├── index.css         # Global design tokens, variables, and typography
└── main.jsx          # React DOM mounting
```

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a Pull Request if you'd like to add new features or suggest improvements.
