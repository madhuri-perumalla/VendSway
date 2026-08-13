# VendSway Frontend

**Agentic AI-Powered Regional Commerce Intelligence Platform with Domain-Specific LLM**

Frontend application for VendSway - an enterprise-grade SaaS platform that transforms regional demand into marketplace growth through agentic AI and domain-specific LLM.

---

## Overview

VendSway helps e-commerce marketplaces:
- **Identify regional demand patterns** through AI-powered analytics
- **Discover high-potential sellers** with intelligent matching algorithms
- **Detect catalog gaps** using predictive market intelligence
- **Deliver localized shopping experiences** with regional storefronts
- **Optimize seller growth** through data-driven recommendations
- **Execute autonomous marketplace actions** through agentic AI

---

## Architecture

### Technology Stack

**Frontend**
- React 18 with TypeScript
- Vite for fast development and optimized builds
- TailwindCSS for utility-first styling
- Framer Motion for smooth animations
- React Router 6 for navigation
- TanStack Query for server state management
- Zustand for client state management
- Recharts for data visualization
- React Leaflet / Leaflet for interactive maps

**Backend Integration**
- Node.js with Express
- PostgreSQL with Prisma ORM
- RESTful API architecture
- JWT authentication
- Self-hosted domain-specific LLM (Qwen2.5-0.5B-Instruct based)

**AI/ML**
- Domain-specific LLM for regional fashion-commerce intelligence
- Agentic AI with ORPDAL agent cycle
- Deterministic commerce intelligence
- RAG for knowledge retrieval
- Festival intelligence for seasonal demand prediction
- Community trend analysis for regional insights
- Demand heatmap generation for market intelligence

---

## Features

### Agentic Commerce Command Center (Admin)
- Agent execution monitoring and control
- ORPDAL agent cycle visualization
- Human-in-the-loop approval workflow
- Agent execution history
- LLM status monitoring
- Decision and action tracking
- Learning feedback review

### Commerce Intelligence Console
- Regional demand analytics with interactive heatmaps
- Catalog gap identification and recommendations
- Seller discovery pipeline with AI-powered matching
- Demand forecasting and trend analysis

### Seller Growth Hub
- Streamlined seller onboarding workflow
- Growth recommendations (LLM-enhanced when available)
- Product management with catalog optimization
- Performance analytics and insights
- Opportunity viewing and acceptance

### Regional Marketplace
- Personalized regional storefronts
- Festival-specific collections
- GI-tagged authentic products
- Local artisan discovery

---

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL 14+

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/fashion-tapestry.git
cd fashion-tapestry

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Set up environment variables
cd frontend
cp .env.example .env
# Configure your environment variables

cd ../backend
cp .env.example .env
# Configure your environment variables

# Set up database
npx prisma migrate dev

# Start development servers
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev

# Terminal 3 - AI Service (optional, for LLM enhancement)
cd ai
python inference/server.py
```

---

## Project Structure

```
fashion-tapestry/
├── frontend/
│   ├── src/
│   │   ├── components/       # Shared UI components
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Agentic Commerce Command Center
│   │   │   │   └── AICommandCenter.tsx
│   │   │   ├── seller/      # Seller Growth Hub
│   │   │   └── dashboard/   # Seller dashboard
│   │   ├── services/        # API services
│   │   ├── store/           # State management
│   │   ├── types/           # TypeScript definitions
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── services/        # Business logic
│   │   │   ├── aiEngine/     # Agentic AI agents
│   │   │   ├── LLMService.ts
│   │   │   └── LLMIntegrationService.ts
│   │   ├── routes/          # API routes
│   │   └── utils/           # Utilities
│   ├── prisma/              # Database schema
│   └── package.json
├── ai/                     # AI/LLM layer
│   ├── dataset/            # Training data
│   ├── training/           # Model training
│   ├── inference/          # Model serving
│   ├── rag/                # RAG system
│   └── tools/              # Tool registry
└── README.md
```

---

## Environment Variables

### Frontend (.env)
```env
VITE_APP_TITLE=VendSway
VITE_API_URL=http://localhost:3000/api
VITE_MAP_DEFAULT_CENTER=20.5937,78.9629
VITE_MAP_DEFAULT_ZOOM=5
VITE_APP_VERSION=2.0.0
```

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/fashion_tapestry
PORT=3000
AI_SERVICE_URL=http://localhost:8000
AI_MODEL_PATH=./ai/models/vendsway-llm
AI_DEVICE=auto
AI_MAX_TOKENS=2048
AI_TEMPERATURE=0.7
RAG_DATABASE_URL=postgresql://user:password@localhost:5432/fashion_tapestry?schema=public
NODE_ENV=development
```

---

## Development

### Available Scripts

**Frontend**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

**Backend**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm test             # Run tests
```

---

## AI Integration

VendSway uses a **self-hosted, domain-specific LLM** for:

- **Seller Growth Recommendations** - Personalized growth strategies
- **Reasoning and Explanation** - Explainable agent decisions
- **Tool Selection** - Dynamic tool selection for agents
- **Planning** - Agent planning and workflow generation
- **Festival Intelligence** - Seasonal demand prediction
- **Community Trends** - Regional market analysis
- **Demand Heatmaps** - Visual market intelligence

**Architecture**:
- Base model: Qwen2.5-0.5B-Instruct (open-source, Apache 2.0 license)
- Fine-tuning: LoRA/QLoRA parameter-efficient fine-tuning
- Inference: Local FastAPI service (no external API dependencies)
- RAG: Local sentence-transformers embeddings (no external API dependencies)

**Current Status**:
- Training pipeline: ✅ IMPLEMENTED
- Training execution: ❌ NOT YET EXECUTED (requires GPU resources)
- Inference server: ✅ IMPLEMENTED / READY
- RAG system: ✅ IMPLEMENTED / READY

---

## Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting provider
```

### Backend Deployment
```bash
cd backend
npm run build
npm start
# Or use PM2 for process management
pm2 start dist/server.js
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.