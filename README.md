# Xalora Client Application

This is the frontend application for Xalora - One Stop Platform For Engineers.

## Tech Stack

- React 18
- Vite
- TailwindCSS
- Redux Toolkit
- React Router v6

## Deployment to Vercel

### Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. This repository

### Deployment Steps

1. Go to your Vercel dashboard
2. Click "New Project"
3. Import this repository or connect your Git provider
4. When configuring the project, make sure to:
   - Set the **Root Directory** to `client`
   - The build command should automatically be detected as `npm run build`
   - The output directory should be `dist`
5. Add environment variables if needed:
   - Any variables prefixed with `VITE_` will be embedded into the client bundle
6. Click "Deploy"

### Configuration

This project includes a `vercel.json` file with:
- SPA routing fallback to `index.html`
- Security headers

### Environment Variables

To configure API endpoints or other settings, you can add environment variables in Vercel:
- `VITE_API_URL` - The base URL for your API (if different from the default)

### Build Process

The build process is configured in `vite.config.js`:
- Production builds are optimized with code splitting
- Sourcemaps are generated for debugging
- Modern JavaScript targeting

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview the production build:
   ```bash
   npm run preview
   ```"# xalora-fe" 
