# AI-Powered Assistant with Tool Calling

An AI-powered chat assistant built with Next.js that integrates with real-world APIs to provide weather information, Formula 1 race schedules, and stock prices.

## Features

- **OAuth Authentication**: Sign in with Google or GitHub
- **AI Chat Interface**: Interactive chat powered by OpenAI with streaming responses
- **Tool Calling**: AI can invoke tools to fetch real-time data:
  - Weather information (OpenWeatherMap API)
  - Next F1 race details (Ergast API)
  - Stock prices (Alpha Vantage API)
- **Chat History**: Persistent conversation storage in PostgreSQL
- **Protected Routes**: Middleware-based authentication
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, React 19
- **Database**: Drizzle ORM with Neon PostgreSQL
- **UI**: shadcn/ui components, Tailwind CSS
- **Authentication**: NextAuth.js (Google & GitHub OAuth)
- **AI Integration**: Vercel AI SDK with OpenAI
- **Deployment**: Vercel

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Neon (or Supabase) database account
- Google OAuth credentials
- GitHub OAuth credentials
- OpenAI API key
- OpenWeatherMap API key
- Alpha Vantage API key

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd f1-assistant
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Fill in the following environment variables:

#### Database
- Sign up at [Neon](https://neon.tech) or [Supabase](https://supabase.com)
- Create a new PostgreSQL database
- Copy the connection string to `DATABASE_URL`

#### NextAuth
- Generate a secret: `openssl rand -base64 32`
- Set `NEXTAUTH_SECRET` to the generated value
- Set `NEXTAUTH_URL` to `http://localhost:3000` (or your production URL)

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a New OAuth App
3. Set Homepage URL: `http://localhost:3000`
4. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
5. Copy Client ID and Client Secret

#### OpenAI
- Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

#### OpenWeatherMap
- Sign up at [OpenWeatherMap](https://openweathermap.org/api)
- Get your free API key

#### Alpha Vantage
- Sign up at [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
- Get your free API key

### 4. Set Up the Database

Generate and push the database schema:

```bash
npm run db:push
```

This will create the necessary tables in your database.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
f1-assistant/
├── app/
│   ├── actions/          # Server Actions for database operations
│   ├── api/
│   │   ├── auth/         # NextAuth API routes
│   │   └── chat/         # Chat API with tool calling
│   ├── chat/             # Protected chat interface
│   ├── login/            # Authentication page
│   └── page.tsx          # Home page with redirect logic
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── tool-cards/       # Tool result display cards
│   └── chat-interface.tsx # Main chat UI component
├── db/
│   ├── schema.ts         # Database schema definitions
│   └── index.ts          # Database connection
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── tools/            # AI tool definitions
│   └── utils.ts          # Utility functions
└── types/
    └── next-auth.d.ts    # TypeScript type extensions
```

## Database Schema

### Users Table
- `id`: UUID (Primary Key)
- `email`: Text (Unique)
- `name`: Text
- `image`: Text
- `provider`: Text (oauth provider)
- `createdAt`: Timestamp

### Conversations Table
- `id`: UUID (Primary Key)
- `userId`: UUID (Foreign Key → users.id)
- `title`: Text
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Messages Table
- `id`: UUID (Primary Key)
- `conversationId`: UUID (Foreign Key → conversations.id)
- `role`: Text (user or assistant)
- `content`: Text
- `toolInvocations`: JSON
- `createdAt`: Timestamp

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Drizzle Studio

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit: AI assistant implementation"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables (same as `.env.local`)
4. Update OAuth callback URLs to use your Vercel domain
5. Deploy

### 3. Update Environment Variables

After deployment, update your OAuth providers:

- **Google OAuth**: Add `https://your-domain.vercel.app/api/auth/callback/google`
- **GitHub OAuth**: Add `https://your-domain.vercel.app/api/auth/callback/github`
- **NextAuth URL**: Set to `https://your-domain.vercel.app`

## Features Demo

### Weather Tool
Ask: "What's the weather in London?"

The AI will call the `getWeather` tool and display a card with:
- Current temperature
- Feels like temperature
- Humidity
- Wind speed
- Weather description and icon

### F1 Race Tool
Ask: "When is the next F1 race?"

The AI will call the `getF1Matches` tool and display a card with:
- Race name
- Circuit name
- Location
- Date and time
- Round number
- Link to race details

### Stock Price Tool
Ask: "What's the price of AAPL?"

The AI will call the `getStockPrice` tool and display a card with:
- Current price
- Price change and percentage
- Day high and low
- Trading volume
- Last trading day

## Architecture Highlights

### SSR + CSR Mix
- **SSR**: Authentication checks, initial page loads
- **CSR**: Chat interface with real-time streaming responses

### Server Actions
- Database operations use Next.js Server Actions
- Type-safe database queries with Drizzle ORM

### Tool Calling
- AI automatically determines when to use tools
- Streaming responses with tool invocations
- Structured tool results displayed as UI cards

### Authentication Flow
1. User visits site → redirects to login
2. OAuth authentication via Google or GitHub
3. User data stored in database
4. Session managed by NextAuth
5. Protected routes accessible only to authenticated users

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure database is accessible from your location
- Check Neon/Supabase dashboard for connection issues

### OAuth Errors
- Verify callback URLs match exactly (including http/https)
- Check OAuth credentials are correct
- Ensure OAuth apps are not in development mode (if applicable)

### API Rate Limits
- OpenWeatherMap: 60 calls/minute (free tier)
- Alpha Vantage: 25 calls/day (free tier)
- Consider upgrading plans for production use

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run build`

## Contributing

This project was built as an assessment task. Feel free to fork and modify for your own use.

## License

MIT
