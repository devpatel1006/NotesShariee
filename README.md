# ShareNotes - AI-Powered Note Taking Application

A comprehensive note-taking application built with React, featuring AI-powered assistance, encryption, and modern design.

## Features

### Core Functionality
- **Custom Rich Text Editor**: Built from scratch with formatting tools (bold, italic, underline, alignment, font size)
- **Note Management**: Create, edit, delete, pin, and search notes
- **Offline Support**: Local storage fallback when offline
- **Responsive Design**: Works seamlessly on all devices

### AI-Powered Features
- **AI Summarization**: Generate concise summaries of your notes
- **Smart Tag Suggestions**: Get AI-powered tag recommendations
- **Glossary Highlighting**: Key terms highlighted with hover definitions
- **Grammar Assistance**: Writing help and grammar checking

### Security & Privacy
- **Note Encryption**: Password-protect sensitive notes using AES encryption
- **Local Storage**: Data persists locally with optional cloud sync
- **Secure Authentication**: JWT-based authentication system

### Modern UI/UX
- **Premium Design**: Apple-level aesthetics with attention to detail
- **Glassmorphism Effects**: Modern visual design with subtle animations
- **Dark/Light Themes**: Adaptive color schemes
- **Micro-interactions**: Smooth transitions and hover effects

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL) with localStorage fallback
- **Encryption**: crypto-js for AES encryption
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd sharenotes
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Copy the example env file
cp .env.example .env

# Add your Supabase credentials (optional - works with localStorage)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

### Demo Login
- Email: `demo@sharenotes.com`
- Password: `demo123`

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # App header with user menu
│   ├── LoginForm.tsx   # Authentication form
│   ├── NoteCard.tsx    # Individual note card
│   ├── NoteEditor.tsx  # Rich text editor with AI features
│   ├── NotesList.tsx   # Notes grid with search
│   └── RichTextEditor.tsx # Custom text editor
├── hooks/              # Custom React hooks
│   └── useNotes.ts     # Notes management logic
├── lib/                # Utility libraries
│   ├── ai-service.ts   # AI features simulation
│   ├── encryption.ts   # AES encryption service
│   ├── local-storage.ts # Local storage utilities
│   └── supabase.ts     # Database client
├── types/              # TypeScript definitions
│   └── index.ts        # Main type definitions
└── App.tsx            # Main application component
```

## Key Features

### Rich Text Editor
- Custom implementation without third-party dependencies
- Toolbar with formatting options
- Support for lists, alignment, and font sizing
- Real-time content synchronization

### AI Integration
- **Summarization**: Generates concise note summaries
- **Tag Suggestions**: Smart tagging based on content analysis
- **Glossary Terms**: Automatic highlighting of key terms
- **Grammar Check**: Writing assistance and corrections

### Note Management
- **Pinning**: Keep important notes at the top
- **Search**: Full-text search across titles and content
- **Tags**: Categorize and organize notes
- **Encryption**: Secure sensitive notes with password protection

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized layouts
- Touch-friendly interactions
- Keyboard shortcuts support

## Deployment

### Frontend (Netlify/Vercel)
1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider

### Backend (Optional - for full MERN setup)
For production deployment with a full Node.js backend:

1. Set up MongoDB Atlas database
2. Deploy Express server to Heroku/Railway/Render
3. Configure environment variables
4. Update API endpoints in the frontend

## Environment Variables

```env
# Supabase Configuration (optional)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# AI Service Configuration (for production)
VITE_OPENAI_API_KEY=your-openai-key
VITE_AI_SERVICE_URL=your-ai-service-url
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@sharenotes.com or open an issue in the repository.