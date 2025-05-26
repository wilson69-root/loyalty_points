# Loyalty Rewards App

A modern web application for managing customer loyalty points and rewards, built with React, TypeScript, and Supabase.

🌐 **Live Demo:** [https://loyalty-points.vercel.app/](https://loyalty-points.vercel.app/)

## 🚀 Features

- User authentication and authorization
- Loyalty points management
- Reward redemption system
- Real-time updates
- Responsive design with Tailwind CSS
- Modern UI with React components

## 🛠️ Tech Stack

- **Frontend Framework:** React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend/Database:** Supabase
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **UI Components:** 
  - Lucide React (Icons)
  - React Icons
  - React Hot Toast (Notifications)

## 📋 Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/loyalty_points.git
   cd loyalty_points
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── components/     # Reusable UI components
├── context/       # React context providers
├── pages/         # Page components
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── App.tsx        # Main application component
└── main.tsx       # Application entry point
```

## 🔧 Configuration

The project uses several configuration files:
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `eslint.config.js` - ESLint configuration

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- React Team
- Vite Team
- Supabase Team
- All contributors and supporters

## 📚 Documentation

### Authentication
- Users can sign up using email and password
- Secure authentication handled by Supabase
- Protected routes for authenticated users
- Session management and persistence

### Loyalty Points System
- Points are awarded for various actions:
  - Making purchases
  - Referring friends
  - Completing profile
  - Special promotions
- Points can be redeemed for rewards
- Points history tracking
- Points expiration management

### Reward Redemption
- Browse available rewards
- Filter rewards by category
- Sort by points required
- Easy redemption process
- Redemption history tracking

### User Dashboard
- View current points balance
- Track points history
- Manage profile information
- View redemption history
- Access available rewards

### Admin Features
- Manage user points
- Create and manage rewards
- View user statistics
- Handle redemption requests
- Generate reports

### Security Features
- Secure authentication
- Protected API routes
- Data encryption
- Role-based access control
- Input validation

### Performance
- Optimized loading times
- Efficient data fetching
- Caching strategies
- Responsive design
- Progressive loading 