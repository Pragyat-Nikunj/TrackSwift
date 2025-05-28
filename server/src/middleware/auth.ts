import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any; // Consider defining a more specific type for 'user' based on your JWT payload
}

export const authMiddleware = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
  
    const authHeader = req.headers.authorization;
   
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
     
      return res.status(401).json({ message: "No token provided or malformed header" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any; // Cast to 'any' or a specific interface for your decoded token
    

      if (!roles.includes(decoded.role)) {
        
        return res.status(403).json({ message: "Unauthorized" });
      }

      req.user = decoded;

      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

