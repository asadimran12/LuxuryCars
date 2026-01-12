# Environment Configuration Guide

## Development Setup

Your `.env` file is already configured for local development:

```bash
VITE_API_URL=http://localhost:3000
```

## Production Setup (Vercel)

To deploy your app to production on Vercel, you need to set environment variables:

### Steps:

1. **Go to your Vercel Dashboard**
   - Navigate to your project
   - Click on **Settings** tab
   - Go to **Environment Variables**

2. **Add the following variable:**
   ```
   Name: VITE_API_URL
   Value: https://luxurycars-6iif.onrender.com
   ```

3. **Select environments:**
   - ✅ Production
   - ✅ Preview
   - ⬜ Development (leave unchecked - uses local .env)

4. **Redeploy your app** after adding the variable

## How It Works

The `apiConfig.js` file automatically detects the environment:

- **Development Mode** (`npm run dev`):
  - Uses `http://localhost:3000`
  - Reads from `.env` file

- **Production Mode** (Vercel):
  - Uses `https://luxurycars-6iif.onrender.com`
  - Reads from Vercel environment variables

## Testing

- **Local**: Run `npm run dev` - should connect to `localhost:3000`
- **Production**: Deploy to Vercel - should connect to Render backend

## All Pages Using This Config

All 44+ pages in your app automatically use the centralized `API_URL` from `apiConfig.js`:
- ✅ All Admin pages
- ✅ All Driver pages
- ✅ All User pages
- ✅ All Components (MapComponent, FileUploader, etc.)
