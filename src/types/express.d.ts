declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "patient" | "doctor" | "admin";
        email: string;
      };
    }
  }
}

export {};
