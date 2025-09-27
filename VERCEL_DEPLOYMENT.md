# Vercel Deployment Guide for MAIRA Frontend

## Prerequisites

1. **Backend Service**: Ensure your MAIRA orchestration service is deployed and accessible
2. **Environment Variables**: Set the required environment variables in Vercel dashboard
3. **Domain Configuration**: Configure CORS on your backend to allow your Vercel domain

## Deployment Steps

### 1. Connect Repository to Vercel

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Set the **Root Directory** to `frontend-new`
5. Vercel will automatically detect it's a Vite project

### 2. Configure Environment Variables

In the Vercel dashboard, go to Project Settings > Environment Variables and add:

```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_AUTH_ENABLED=false
VITE_ENABLE_CHAT=true
VITE_ENABLE_VOICE_AGENT=true
VITE_ENABLE_ANALYTICS=true
VITE_DEBUG_MODE=false
VITE_SENTRY_DSN=your-sentry-dsn-if-needed
VITE_POSTHOG_KEY=your-posthog-key-if-needed
VITE_APP_NAME=MAIRA
VITE_APP_VERSION=1.0.0
VITE_SUPPORT_EMAIL=support@maira.ai
```

### 3. Deploy

Push to your main branch and Vercel will automatically deploy.

## Backend Configuration Required

Ensure your orchestration service (backend) is configured with:

1. **CORS Settings**: Allow your Vercel domain in `ALLOWED_ORIGINS`
2. **Health Endpoints**: Ensure `/health` endpoint is accessible
3. **API Endpoints**: Ensure all `/api/*` endpoints are working

Example CORS configuration in your backend `.env`:
```env
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app,http://localhost:3000
```

## Testing Deployment

After deployment, test these endpoints:
- `https://your-app.vercel.app` - Frontend loads
- `https://your-api-domain.com/health` - Backend health check
- Frontend connects to backend API successfully

## Troubleshooting

### Common Issues

1. **API Calls Fail**: Check `VITE_API_BASE_URL` points to your backend
2. **CORS Errors**: Ensure backend allows your Vercel domain
3. **Build Failures**: Check environment variables are set correctly
4. **404 on Refresh**: Vercel should handle this with the `vercel.json` rewrite rules

### Debug Steps

1. Check Vercel build logs for errors
2. Test API endpoints directly in browser
3. Check browser developer console for CORS/network errors
4. Verify environment variables in Vercel dashboard

## Production Checklist

- [ ] Backend orchestration service deployed and accessible
- [ ] All environment variables configured in Vercel
- [ ] CORS configured on backend for Vercel domain
- [ ] Frontend builds successfully
- [ ] API connectivity tested
- [ ] All major user flows tested
- [ ] Error monitoring configured (Sentry)
- [ ] Analytics configured (PostHog)

## Automatic Deployment

The repository is configured for automatic deployment:
- Push to main branch triggers deployment
- Changes only in `frontend-new/` folder trigger frontend deployment
- Build command: `npm run build`
- Output directory: `dist`