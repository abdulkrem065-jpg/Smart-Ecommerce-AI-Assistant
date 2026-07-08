import { ref, push, serverTimestamp, set } from "firebase/database";
import { db } from "../../firebase";

export interface AuditLogEntry {
  tenant_id: string;
  user_id: string;
  action: string;
  resource: string;
  details: any;
  timestamp: any;
}

export const AuditService = {
  logAction: async (tenant_id: string, user_id: string, action: string, resource: string, details: any) => {
    try {
      const logRef = push(ref(db, `activity_logs/${tenant_id}`));
      const logEntry: AuditLogEntry = {
        tenant_id,
        user_id,
        action,
        resource,
        details,
        timestamp: serverTimestamp()
      };
      await set(logRef, logEntry);
      return logEntry;
    } catch (error) {
      console.error("Failed to write audit log:", error);
      throw error;
    }
  },
  
  getLogs: async (tenant_id: string) => {
    // Implement retrieval logic based on tenant
  }
};
