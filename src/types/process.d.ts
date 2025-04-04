// This file resolves TypeScript conflicts with the process module
declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_BREVO_API_KEY: string;
    NODE_ENV: 'development' | 'production' | 'test';
    [key: string]: string | undefined;
  }
}

// Extend the existing process interface instead of redeclaring it
interface Process {
  env: NodeJS.ProcessEnv;
} 