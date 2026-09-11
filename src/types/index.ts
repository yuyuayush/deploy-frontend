export type RenderingStrategy = 'SSR' | 'SSG' | 'ISR' | 'CSR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'editor';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role?: 'admin' | 'user' | 'editor';
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    timestamp?: string;
    source?: 'express-api' | 'mock-fallback';
    strategy?: RenderingStrategy;
  };
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  environment: string;
}

export interface StrategyBenchmark {
  strategy: RenderingStrategy;
  title: string;
  description: string;
  renderingTime: string;
  caching: string;
  bestFor: string;
  badgeColor: string;
  codeSnippet: string;
}
