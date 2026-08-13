# VendSway Backend API

Backend API for VendSway - Agentic AI-Powered Regional Commerce Intelligence Platform with Domain-Specific LLM.

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express 4.18+
- **Language**: TypeScript 5.0+
- **Database**: PostgreSQL 15+ (Supabase or local)
- **ORM**: Prisma 5.0+
- **Authentication**: JWT (jsonwebtoken)
- **AI**: Self-hosted domain-specific LLM (Qwen2.5-0.5B-Instruct based)

## Architecture Overview

The backend implements a **three-layer intelligence architecture**:

1. **Agentic AI Layer**: ORPDAL agent cycle (Observe → Reason → Predict → Decide → Act → Learn)
2. **Deterministic Commerce Intelligence**: Business logic, scoring, validation
3. **Domain-Specific LLM Layer**: Reasoning, explanation, planning (local inference)

## Project Structure

```
backend/
├── src/
│   ├── config/                 # Configuration files
│   ├── controllers/            # API controllers
│   │   ├── AuthController.ts
│   │   ├── CommerceAgentController.ts
│   │   ├── IntelligenceController.ts
│   │   ├── SellerController.ts
│   │   └── AnalyticsController.ts
│   ├── routes/                 # API routes
│   │   ├── authRoutes.ts
│   │   ├── commerceAgentRoutes.ts
│   │   ├── intelligenceRoutes.ts
│   │   ├── sellerRoutes.ts
│   │   └── analyticsRoutes.ts
│   ├── services/               # Business logic services
│   │   ├── aiEngine/          # Deterministic AI engines
│   │   │   ├── AgentOrchestrator.ts
│   │   │   ├── ObserveAgent.ts
│   │   │   ├── ReasoningAgent.ts
│   │   │   ├── PredictionAgent.ts
│   │   │   ├── DecisionAgent.ts
│   │   │   ├── ActionAgent.ts
│   │   │   └── LearningAgent.ts
│   │   ├── CommerceAgentService.ts
│   │   ├── LLMService.ts
│   │   ├── LLMIntegrationService.ts
│   │   ├── DemandCalculationService.ts
│   │   ├── GapCalculationService.ts
│   │   └── SellerMatchingService.ts
│   ├── repositories/           # Data access layer
│   ├── middleware/             # Express middleware
│   │   ├── auth.ts
│   │   └── roleAuthorization.ts
│   ├── utils/                  # Utility functions
│   ├── types/                  # TypeScript type definitions
│   ├── app.ts                  # Express app setup
│   └── index.ts                # Entry point
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── package.json
├── tsconfig.json
├── .env.example
└── .gitignore
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL 15+ (Supabase or local)
- Python 3.9+ (for AI service, optional)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/fashion_tapestry"

# AI Service (optional for LLM enhancement)
AI_SERVICE_URL=http://localhost:8000
AI_MODEL_PATH=./ai/models/vendsway-llm
AI_DEVICE=auto
AI_MAX_TOKENS=2048
AI_TEMPERATURE=0.7

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Seed database (optional):
```bash
npx prisma db seed
```

## Development

### Run development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Build for production:
```bash
npm run build
```

### Run production server:
```bash
npm start
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with sample data
- `npm run prisma:studio` - Open Prisma Studio

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Agentic AI (Commerce Agent)
- `POST /api/commerce-agent/run` - Run agent cycle
- `GET /api/commerce-agent/runs` - Get agent run history
- `GET /api/commerce-agent/runs/:id` - Get specific run details
- `POST /api/commerce-agent/runs/:id/approve` - Approve pending decisions
- `GET /api/commerce-agent/opportunities` - Get seller opportunities
- `POST /api/commerce-agent/opportunities/:id/accept` - Accept opportunity
- `POST /api/commerce-agent/opportunities/:id/dismiss` - Dismiss opportunity
- `GET /api/commerce-agent/campaigns/:id/performance` - Get campaign performance
- `GET /api/commerce-agent/decisions` - Get agent decisions
- `GET /api/commerce-agent/actions` - Get agent actions
- `GET /api/commerce-agent/learning` - Get learning feedback

### Regional Intelligence
- `GET /api/intelligence/regions` - Get all regions
- `GET /api/intelligence/regions/:id` - Get region details
- `GET /api/intelligence/regions/:id/textiles` - Get regional textiles
- `GET /api/intelligence/regions/:id/festivals` - Get regional festivals
- `GET /api/intelligence/demand-signals` - Get demand signals

### Catalog Gap Detection
- `GET /api/gaps` - Get catalog gaps (Admin only)
- `GET /api/gaps/:id` - Get gap details (Admin only)
- `POST /api/gaps/calculate` - Calculate gaps (Admin only)

### Seller Management
- `GET /api/sellers` - Get all sellers (Admin only)
- `GET /api/sellers/:id` - Get seller details (Admin only)
- `GET /api/sellers/match/:gapId` - Match sellers to gap (Admin only)
- `GET /api/sellers/applications` - Get seller applications (Admin only)
- `POST /api/sellers/applications/:id/approve` - Approve seller (Admin only)
- `POST /api/sellers/applications/:id/reject` - Reject seller (Admin only)

### Seller Operations
- `POST /api/sellers/register` - Register new seller
- `GET /api/sellers/application/:id` - Get application status (Seller only)
- `POST /api/sellers/products` - Add product (Seller only)
- `GET /api/sellers/:id/products` - Get seller products (Seller only)
- `PUT /api/sellers/products/:id` - Update product (Seller only)
- `DELETE /api/sellers/products/:id` - Delete product (Seller only)
- `GET /api/sellers/opportunities` - Get seller opportunities (Seller only)

### Product Management
- `GET /api/products` - Get all products (Admin only)
- `GET /api/products/:id` - Get product details (Admin only)
- `POST /api/products/:id/approve` - Approve product (Admin only)
- `POST /api/products/:id/reject` - Reject product (Admin only)

### Potential Sellers
- `GET /api/potential-sellers` - Get potential sellers (Admin only)
- `POST /api/potential-sellers` - Add potential seller (Admin only)
- `PUT /api/potential-sellers/:id` - Update potential seller (Admin only)
- `DELETE /api/potential-sellers/:id` - Delete potential seller (Admin only)

### Analytics
- `GET /api/analytics/demand` - Get demand analytics (Admin only)
- `GET /api/analytics/gaps` - Get gap analytics (Admin only)
- `GET /api/analytics/sellers` - Get seller analytics (Admin only)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment (development/production) | development |
| DATABASE_URL | PostgreSQL connection string | - |
| CORS_ORIGIN | CORS origin URL | http://localhost:5173 |
| JWT_SECRET | JWT secret key | - |
| JWT_REFRESH_SECRET | JWT refresh secret | - |
| JWT_EXPIRES_IN | JWT expiration time | 15m |
| JWT_REFRESH_EXPIRES_IN | JWT refresh expiration time | 7d |
| AI_SERVICE_URL | AI service URL (optional) | http://localhost:8000 |
| AI_MODEL_PATH | AI model path (optional) | ./ai/models/vendsway-llm |
| AI_DEVICE | AI device (optional) | auto |
| AI_MAX_TOKENS | AI max tokens (optional) | 2048 |
| AI_TEMPERATURE | AI temperature (optional) | 0.7 |

## Database

The database uses PostgreSQL with Prisma ORM. The schema includes:

### Core Models
- User accounts and authentication
- Regional data (states, festivals, textiles, GI products)
- Demand signals and catalog gaps
- Seller information and products
- Campaigns and opportunities

### Agent Tracking Models
- AgentRun: Agent execution tracking
- AgentExecution: Individual agent execution records
- AgentDecision: Decision tracking with approval workflow
- AgentAction: Action execution records
- AgentLearningFeedback: Learning outcome tracking

### LLM Models
- LLMModel: Model version tracking
- LLMTrainingRun: Training run tracking
- LLMEvaluation: Evaluation results

### RAG Models
- KnowledgeDocument: RAG documents
- KnowledgeChunk: Text chunks with embeddings

### Memory Models
- AgentConversation: Conversation history
- AgentMemory: Persistent agent memory
- AgentToolCall: Tool invocation tracking
- AgentFeedback: Human feedback tracking

See `prisma/schema.prisma` for complete schema definition.

## Authentication & Authorization

### Authentication
- JWT access tokens
- JWT refresh tokens
- Refresh tokens stored in httpOnly cookies
- bcrypt password hashing
- Email verification
- Password reset flows

### Authorization
- Role-based authorization (ADMIN, SELLER)
- Protected API routes
- Protected frontend routes
- Middleware-based authorization

## AI Integration

The backend communicates with the local AI service for LLM enhancement:

### LLM Service
- `LLMService.ts`: HTTP client for AI service communication
- `LLMIntegrationService.ts`: Integration with deterministic services

### AI Service Endpoints
- `POST /generate` - Generate text responses
- `POST /classify` - Classify intents
- `POST /plan` - Generate agent plans
- `POST /tool-selection` - Select appropriate tools
- `POST /explain` - Generate explanations
- `GET /health` - Health check

### Graceful Degradation
- System operates with deterministic reasoning when LLM is unavailable
- No system failure when AI service is offline
- Continued operation without external AI dependencies

## Middleware

- **CORS**: Cross-origin resource sharing
- **JSON parsing**: Request body parsing
- **Authentication**: JWT token validation
- **Role Authorization**: Role-based access control
- **Request logging**: HTTP request/response logging
- **Error handling**: Centralized error handling
- **Not found**: 404 route handling

## Error Handling

All errors follow a consistent format:

```json
{
  "status": "error",
  "message": "Error description",
  "errorCode": "ERROR_CODE"
}
```

## Development Notes

- TypeScript strict mode enabled
- Hot reload with ts-node-dev
- Prisma query logging in development
- CORS configured for frontend development
- Backend TypeScript compilation successful

## Current Status

### ✅ Implemented
- Complete Agentic AI architecture (ORPDAL cycle)
- All agent components (Observe, Reason, Predict, Decide, Act, Learn)
- Human-in-the-loop controls with three autonomy levels
- JWT authentication with refresh tokens
- Role-based authorization (ADMIN, SELLER)
- LLM integration service with graceful fallback
- Agent tracking database models
- Backend TypeScript compilation successful

### ⚠️ Database Migration Pending
- Agent tracking models added to schema
- Migration SQL created
- Execution pending due to shadow database issues

## Security

- JWT access tokens
- JWT refresh tokens in httpOnly cookies
- bcrypt password hashing
- Role-based authorization
- Protected API routes
- Input validation
- Environment variables for sensitive configuration
- AI service is internal/self-hosted (localhost only)
- Never commit .env files
- Never expose secrets in code