import { Request, Response, NextFunction } from 'express';

// For backend API route interception
export const auditMiddleware = (action: string, resource: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const tenant_id = req.headers['x-tenant-id'] as string || 'default_tenant';
    const user_id = req.headers['x-user-id'] as string || 'anonymous';
    
    // Store audit context in response locals to be committed after successful operation
    res.locals.auditContext = {
      tenant_id,
      user_id,
      action,
      resource,
      details: req.body
    };
    
    // We could either log before, or log after response finishes.
    // Logging after ensures we only log successful actions, or we can log attempts.
    next();
  };
};
