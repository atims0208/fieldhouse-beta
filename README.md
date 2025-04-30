# Fieldhouse - Live Streaming Platform

Fieldhouse is a modern live streaming platform built with Next.js and Node.js, featuring real-time chat, donations, and virtual gifts.

## Features

- Live streaming with RTMP support
- Real-time chat
- User authentication
- Channel profiles
- Donation system
- Virtual gift system
- Follow/Subscribe functionality

## Tech Stack

- **Frontend:**
  - Next.js 13+ with App Router
  - React
  - TypeScript
  - Tailwind CSS
  - Socket.IO Client

- **Backend:**
  - Node.js
  - Express
  - TypeORM
  - PostgreSQL
  - Socket.IO
  - TypeScript

## Getting Started

### Prerequisites

- Node.js 16+
- PostgreSQL
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
   ```bash
   git clone [your-repo-url]
   cd fieldhouse
   ```

2. Install dependencies:
   ```bash
   # Install frontend dependencies
   pnpm install

   # Install backend dependencies
   cd api
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local` in the root directory
   - Copy `api/.env.example` to `api/.env`
   - Update the environment variables with your values

4. Start the development servers:
   ```bash
   # Start backend (in api directory)
   npm run dev

   # Start frontend (in root directory)
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

- Frontend runs on port 3000
- Backend API runs on port 4000
- Make sure both PostgreSQL and Redis are running

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
