# MAIRA Frontend

A modern React frontend for the MAIRA Real Estate Assistant, built with Vite, React, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see main README)

### Development Setup

1. **Clone and navigate to frontend directory:**
   ```bash
   cd frontend-new
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration.

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | Yes | `http://localhost:3000` | Backend API base URL |
| `VITE_AUTH_ENABLED` | No | `false` | Enable authentication |
| `VITE_API_KEY` | No | - | API key for backend |
| `VITE_ENABLE_CHAT` | No | `true` | Enable chat functionality |
| `VITE_ENABLE_VOICE_AGENT` | No | `true` | Enable voice agent |
| `VITE_ENABLE_ANALYTICS` | No | `false` | Enable analytics |
| `VITE_DEBUG_MODE` | No | `false` | Enable debug logging |
| `VITE_SENTRY_DSN` | No | - | Sentry error tracking |
| `VITE_POSTHOG_KEY` | No | - | PostHog analytics |

### Example Configuration

**Development (.env.local):**
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_AUTH_ENABLED=false
VITE_DEBUG_MODE=true
```

**Production (Vercel Environment Variables):**
```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_AUTH_ENABLED=true
VITE_ENABLE_ANALYTICS=true
VITE_SENTRY_DSN=your-sentry-dsn
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components (ErrorBoundary, Loading)
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   ├── billing/        # Billing-specific components
│   ├── chat/           # Chat interface components
│   ├── clients/        # Client management components
│   └── dashboard/      # Dashboard components
├── config/             # Configuration files
│   └── env.js         # Environment configuration
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication state management
├── lib/               # Utilities and services
│   └── api/           # API client and services
├── pages/             # Page components
├── styles/            # Global styles and Tailwind config
└── main.jsx          # Application entry point
```

## 🔌 API Integration

The frontend uses a centralized API client located in `src/lib/api/`:

### API Client Features

- **Unified error handling** with custom error types
- **Token management** for authentication
- **Request/response interceptors**
- **Automatic token refresh**
- **Network timeout handling**
- **Development fallbacks**

### Usage Example

```javascript
import { api } from '@/lib/api';

// Get all clients
const clients = await api.clients.getAll();

// Create new client
const newClient = await api.clients.create({
  full_name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890'
});

// Handle errors
try {
  await api.auth.login(email, password);
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Handle auth error
  }
}
```

## 🔐 Authentication

Authentication is handled through React Context and can be enabled/disabled via environment variables.

### Auth Flow

1. **Login:** User provides credentials
2. **Token Storage:** JWT stored in localStorage
3. **Auto-refresh:** Tokens refreshed automatically
4. **Logout:** Tokens cleared from storage

### Usage

```javascript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }
  
  return <div>Welcome, {user.name}!</div>;
}
```

## 🎨 UI Components

Built with Tailwind CSS and custom components:

### Available Components

- **Button** - Various styles and sizes
- **Input** - Form inputs with validation
- **Alert** - Success/error/warning messages
- **Badge** - Status indicators
- **LoadingSpinner** - Loading states
- **ErrorBoundary** - Error handling

### Usage

```javascript
import { Button, Input, Alert } from '@/components/ui';

<Button variant="primary" size="lg">
  Save Changes
</Button>

<Input 
  placeholder="Enter email"
  type="email"
  required
/>

<Alert variant="success">
  Changes saved successfully!
</Alert>
```

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # TypeScript type checking (if added)
```

### Code Quality

- **ESLint** for code linting
- **Prettier** for code formatting
- **React hooks** rules enforcement
- **Import/export** validation

### Development Features

- **Hot Module Replacement (HMR)**
- **Source maps** for debugging
- **Development-only error messages**
- **Console logging** for API calls
- **Mock data fallbacks**

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository:**
   - Connect your GitHub repo to Vercel
   - Set root directory to `frontend-new`

2. **Environment Variables:**
   Set the following in Vercel dashboard:
   ```
   VITE_API_BASE_URL=https://your-api-domain.com
   VITE_AUTH_ENABLED=true
   VITE_ENABLE_ANALYTICS=true
   VITE_SENTRY_DSN=your-sentry-dsn
   ```

3. **Deploy:**
   - Push to main branch
   - Vercel will auto-deploy

### Manual Deployment

```bash
# Build for production
npm run build

# Upload dist/ folder to your hosting provider
```

### Deployment Checklist

- [ ] Environment variables configured
- [ ] API endpoints accessible
- [ ] CORS configured on backend
- [ ] Error monitoring setup (Sentry)
- [ ] Analytics configured (PostHog)
- [ ] Performance monitoring enabled

## 🔧 Configuration

### Build Configuration

The project uses Vite with the following plugins:
- **@vitejs/plugin-react** - React support
- **Tailwind CSS** - Utility-first styling
- **PostCSS** - CSS processing

### Path Aliases

```javascript
// Configured in vite.config.js
import Component from '@/components/Component';
import { api } from '@/lib/api';
import config from '@/config/env';
```

## 🔍 Troubleshooting

### Common Issues

**Build Fails:**
- Check Node.js version (18+)
- Clear node_modules and reinstall
- Verify environment variables

**API Calls Fail:**
- Check VITE_API_BASE_URL
- Verify backend is running
- Check CORS configuration

**Authentication Issues:**
- Verify AUTH_ENABLED setting
- Check token storage
- Validate API_KEY if required

**Styling Issues:**
- Rebuild Tailwind cache
- Check class names
- Verify PostCSS config

### Debug Mode

Enable debug mode for detailed logging:

```env
VITE_DEBUG_MODE=true
```

This will log:
- API calls and responses
- Authentication state changes
- Configuration values
- Error details

## 📝 Contributing

1. **Follow code style** (ESLint + Prettier)
2. **Test changes** in development
3. **Update documentation** for new features
4. **Test deployment** on staging

## 🔗 Related Documentation

- [Main Project README](../README.md)
- [Backend API Documentation](../orchestration/README.md)
- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)
- [Architecture Overview](../CLAUDE.md)

## 🚀 Production Deployment Status

**✅ Ready for Vercel Deployment**

This frontend is production-ready and configured for Vercel deployment with:

- ✅ Optimized build configuration
- ✅ Proper environment variable handling
- ✅ API client integration with orchestration service
- ✅ Error boundaries and loading states
- ✅ Responsive design for mobile and desktop
- ✅ CORS-ready for production domains

### Quick Deploy to Vercel

1. **Prerequisites**: Ensure your MAIRA orchestration service is deployed
2. **Import**: Import this repository to Vercel (set root directory to `frontend-new`)
3. **Configure**: Set environment variables (see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md))
4. **Deploy**: Push to main branch for automatic deployment

### API Integration Status

The frontend is integrated with the following backend services:
- 🟢 Health checks (`/health`)
- 🟢 Tool execution (`/api/tools/execute`)
- 🟢 Client management (via MCP tools)
- 🟢 Calendar management (via MCP tools)
- 🟢 Google OAuth integration
- 🟡 Voice agent integration (development fallbacks)
- 🟡 Real-time chat (development fallbacks)

Legend: 🟢 Production ready | 🟡 Development fallbacks | 🔴 Not implemented

## 📞 Support

For issues and support:
- Create GitHub issue
- Check troubleshooting section
- Review console logs in debug mode