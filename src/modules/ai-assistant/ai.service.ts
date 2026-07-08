import promptsConfig from './prompts.config.json';

export interface AIQueryContext {
  tenant_id: string;
  user_id: string;
  role: 'super_admin' | 'cashier';
}

export const AIService = {
  generateResponse: async (query: string, context: AIQueryContext) => {
    if (!context.tenant_id || !context.user_id) {
      throw new Error("Strict Mode: tenant_id and user_id are mandatory for any AI query.");
    }

    const roleConfig = promptsConfig[context.role];
    if (!roleConfig) {
      throw new Error("Invalid role specified.");
    }

    const systemPrompt = roleConfig.system_prompt;
    
    // In actual implementation, this will send the request to Gemini API
    // using the specific system prompt and tenant-isolated context.
    console.log(`[AI Service] Executing query for tenant: ${context.tenant_id}, user: ${context.user_id}, role: ${context.role}`);
    console.log(`[System Prompt] ${systemPrompt}`);
    
    return {
      success: true,
      role: context.role,
      message: "AI response simulation complete based on strict isolated context."
    };
  }
};
