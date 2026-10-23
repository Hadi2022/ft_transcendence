import "express";

declare global {
  namespace Express {
    interface Request {
      session?: {
        userId: number; // inacurate
      };
    }
  }
}

export {};