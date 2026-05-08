# Backend - Python FastAPI
FROM python:3.11-slim as backend

WORKDIR /app/backend

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend .

# Expose port
EXPOSE 8000

# Run FastAPI
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]


# Frontend - Next.js
FROM node:20-alpine as frontend-base

WORKDIR /app/frontend

# Copy frontend code
COPY frontend/package.json package.json
COPY frontend/package-lock.json package-lock.json

# Install dependencies
RUN npm ci

# Copy rest of frontend
COPY frontend .

# Build Next.js
RUN npm run build

# Production frontend
FROM node:20-alpine as frontend-prod

WORKDIR /app/frontend

COPY --from=frontend-base /app/frontend/node_modules node_modules
COPY --from=frontend-base /app/frontend/.next .next
COPY --from=frontend-base /app/frontend/public public
COPY --from=frontend-base /app/frontend/package.json package.json

EXPOSE 3000

CMD ["npm", "start"]
