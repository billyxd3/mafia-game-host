# The Mafia Game Host

A modern, web-based implementation of the classic party game "Mafia" (also known as "Werewolf"). This application allows users to create and join game rooms, manage players, and play the game with a clean, intuitive interface.

## 🚀 Features

- 🎮 Create or join game rooms with unique IDs
- 👥 Support for multiple players in a single game session
- 🎭 Role assignment for players (Mafia, Citizens, etc.)
- ⏱️ Game timer and phase management
- 🎨 Modern, responsive UI with dark/light theme support
- 🔄 Real-time game state synchronization

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with custom theming
- **UI Components**: Radix UI Primitives with shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Routing**: Next.js App Router

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v9 or later) or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/mafia-game-host.git
   cd mafia-game-host
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   # or
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 🎮 How to Play

1. **Create a Game**:
   - Click on "Create New Game" to start a new game session
   - Share the generated game ID with your friends

2. **Join a Game**:
   - Enter an existing game ID in the input field
   - Click "Join Game" to enter the game lobby

3. **Game Setup**:
   - Wait for all players to join
   - Once everyone is ready, the game will begin
   - Follow the on-screen instructions for each game phase

## 📂 Project Structure

```
.
├── app/                  # Next.js app directory
│   ├── game/             # Game pages and components
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
├── public/               # Static assets
└── styles/               # Global CSS modules
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the classic party game Mafia/Werewolf
- Built with [Next.js](https://nextjs.org/) and [shadcn/ui](https://ui.shadcn.com/)
- Special thanks to all contributors and players!

---

Happy gaming! 🎲✨
