# 🎨 MediSync-AI Frontend

<div align="center">

[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.0-blue?style=for-the-badge&logo=mui)](https://mui.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-4.0-blue?style=for-the-badge&logo=vite)](https://vitejs.dev/)

**Beautiful, Responsive, and Intuitive Interface for Healthcare Professionals**

[Live Demo](https://app.medisync-ai.com) •
[API Documentation](../backend/README.md) •
[Component Library](./src/components/README.md)

</div>

---

## 🌟 Overview

The MediSync-AI frontend delivers a seamless and intuitive user experience for healthcare professionals. Built with modern web technologies and following best practices in UI/UX design, it provides a robust interface for managing medical transcriptions and documentation.

### 🎯 Design Philosophy

> Creating an interface that prioritizes efficiency, accessibility, and user experience, enabling healthcare professionals to focus on patient care rather than documentation.

## 💫 Key Features

### 🔐 Secure Authentication
- Multi-factor authentication support
- Role-based access control
- Secure session management
- Password recovery workflow
- Remember me functionality

### 📊 Interactive Dashboard
- Real-time transcription status
- Recent activity timeline
- Quick action shortcuts
- Performance metrics
- Customizable widgets

### 📝 Document Management
- Drag-and-drop file upload
- Multi-file processing
- Progress tracking
- File organization
- Search and filtering

### 👤 User Experience
- Responsive design
- Dark/Light themes
- Keyboard shortcuts
- Offline support
- Accessibility features

## 🛠️ Technology Stack

### Core Technologies
- **React 18**: Latest features including Concurrent Mode
- **TypeScript**: Type-safe development
- **Material-UI 5**: Modern UI components
- **Vite**: Next-generation frontend tooling

### State Management & Data Flow
- **Redux Toolkit**: Efficient state management
- **React Query**: Server state management
- **RTK Query**: API integration
- **WebSocket**: Real-time updates

### Testing & Quality
- **Jest**: Unit testing
- **React Testing Library**: Component testing
- **Cypress**: End-to-end testing
- **ESLint/Prettier**: Code quality

### Performance
- **Code Splitting**: Lazy loading
- **Service Workers**: Offline support
- **Compression**: Asset optimization
- **Caching**: Performance boost

## 🚀 Getting Started

### Prerequisites

```bash
node >= 14.0.0
npm >= 7.0.0
```

### Development Setup

1. **Clone and Install**
```bash
git clone https://github.com/yourusername/MediSync-AI.git
cd MediSync-AI/frontend
npm install
```

2. **Environment Configuration**
```bash
# Create .env file
cp .env.example .env

# Configure environment variables
VITE_SERVER_URL=http://localhost:8080
VITE_AWS_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=your_user_pool_id
VITE_COGNITO_CLIENT_ID=your_client_id
```

3. **Start Development Server**
```bash
npm run dev
```

4. **Build for Production**
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── common/       # Shared components
│   │   ├── layout/       # Layout components
│   │   └── features/     # Feature-specific components
│   ├── pages/            # Route components
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── context/          # React context providers
│   ├── services/         # API services
│   ├── store/            # Redux store
│   └── styles/           # Global styles
├── tests/                 # Test files
└── vite.config.ts        # Vite configuration
```

## 🎨 UI Components

### Core Components
- `Button`: Custom styled buttons
- `Card`: Content containers
- `Dialog`: Modal dialogs
- `Form`: Form components
- `Table`: Data tables

### Layout Components
- `Sidebar`: Navigation sidebar
- `Header`: App header
- `Footer`: App footer
- `Layout`: Page layouts

### Feature Components
- `TranscriptionCard`: Transcription details
- `StatusBadge`: Status indicators
- `UploadZone`: File upload
- `AudioPlayer`: Audio playback

## 🔧 Configuration

### Environment Variables

```env
# API Configuration
VITE_SERVER_URL=backend_api_url
VITE_API_VERSION=v1

# AWS Configuration
VITE_AWS_REGION=aws_region
VITE_COGNITO_USER_POOL_ID=user_pool_id
VITE_COGNITO_CLIENT_ID=client_id

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
```

## 📚 Available Scripts

```bash
# Development
npm run dev           # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report

# Linting
npm run lint         # Run ESLint
npm run format       # Format with Prettier

# Type Checking
npm run type-check   # TypeScript check
```

## 🔒 Security Best Practices

- HTTPS enforced
- XSS prevention
- CSRF protection
- Content Security Policy
- Secure cookie handling
- Input sanitization
- Secure authentication flow

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint system
- Fluid typography
- Flexible layouts
- Touch-friendly UI

## ♿ Accessibility

- WCAG 2.1 compliance
- Keyboard navigation
- Screen reader support
- Color contrast
- Focus management
- ARIA attributes

## 🚀 Performance Optimization

- Code splitting
- Tree shaking
- Asset optimization
- Lazy loading
- Caching strategies
- Bundle analysis

## 🤝 Contributing

See our [Contributing Guide](../CONTRIBUTING.md) for details.

## 📬 Support

- [Report Bug](https://github.com/yourusername/MediSync-AI/issues)
- [Request Feature](https://github.com/yourusername/MediSync-AI/discussions)
- [Get Support](https://medisync-ai.slack.com)

---

<div align="center">

**Made with ❤️ by the MediSync-AI Frontend Team**

[Documentation](../docs) • [Backend API](../backend) • [Infrastructure](../infrastructure)

</div>
