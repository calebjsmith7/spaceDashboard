# SpaceViz 🛰️

An interactive 3D satellite visualization dashboard built with Next.js, React Three Fiber, and real-time TLE (Two-Line Element) data from Space-Track.org. Go to https://spacevizbe--spaceviz-4aa96.us-central1.hosted.app/ to view hosted app!
### Satellite Orbits
<img width="1801" height="1079" alt="Screenshot 2026-05-06 at 11 24 10 AM" src="https://github.com/user-attachments/assets/ffa49d51-d56e-4c0b-b5d8-3ef777975a65" />

### View active realtime satellites
<img width="1798" height="1070" alt="Screenshot 2026-05-06 at 11 24 34 AM" src="https://github.com/user-attachments/assets/7dbd472d-a9f5-4999-915e-8fc958cdd9a2" />

### View planet orbit renderings
<img width="1795" height="1052" alt="Screenshot 2026-05-06 at 11 27 37 AM" src="https://github.com/user-attachments/assets/d9bace54-0d59-41dc-b804-7ee3e87dc88d" />

## Features

- 🌍 Real-time 3D visualization of Earth with satellites orbiting
- 🛰️ Multiple satellite categories: Space Stations, Weather, GPS, Science, and Starlink
- 📡 Live orbital data from [Space-Track.org](https://www.space-track.org)
- 🎯 Interactive satellite selection with orbital path visualization
- 🎨 Unique 3D models for different satellite types
- 📊 Satellite information panel with orbital parameters

## Tech Stack

- **Framework:** Next.js 16
- **3D Rendering:** React Three Fiber + Three.js
- **Satellite Calculations:** satellite.js
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## Prerequisites

- Node.js 18+
- A free [Space-Track.org](https://www.space-track.org/auth/createAccount) account

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/calebjsmith7/spaceDashboard.git
cd spaceviz
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory with your Space-Track.org credentials:

```env
SPACE_TRACK_USER=your_spacetrack_username
SPACE_TRACK_PASS=your_spacetrack_password
```

> **Note:** You must create a free account at [Space-Track.org](https://www.space-track.org/auth/createAccount) to obtain these credentials. The API provides real-time TLE data for satellite position calculations.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
app/
├── api/satellites/     # Space-Track API proxy
├── context/            # React context for camera and satellite state
├── dashboard/          # Main dashboard page and components
│   └── components/
│       ├── planets/    # Earth, Sun, and orbit visualizations
│       └── satellites/ # Satellite components and 3D models
├── services/           # Satellite data processing utilities
└── types/              # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [satellite.js](https://github.com/shashwatak/satellite-js)
- [Space-Track.org API](https://www.space-track.org/documentation)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Remember to add your `SPACE_TRACK_USER` and `SPACE_TRACK_PASS` environment variables in your Vercel project settings.

## License

MIT
