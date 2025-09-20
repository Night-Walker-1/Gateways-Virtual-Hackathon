/**
 * GROQ AI SERVICE FOR MINDGUARD AI
 *
 * High-performance AI service using Groq's lightning-fast inference
 * Optimized for real-time mental health conversations
 */
interface UserContext {
    name?: string;
    preferredPersonality?: string;
    currentMood?: string;
    moodTrend?: string;
    frequentTopics?: string[];
    effectiveStrategies?: string[];
    triggers?: string[];
    conversationHistory?: any[];
    riskLevel?: 'low' | 'medium' | 'high';
}
interface GroqResponse {
    response: string;
    metadata: {
        personality: string;
        intervention: string;
        riskLevel: 'low' | 'medium' | 'high';
        followUpQuestions: string[];
        suggestedActions: string[];
        processingTime: number;
    };
}
export declare class GroqAIService {
    private groqClient;
    constructor();
    /**
     * Generate advanced AI response using Groq's high-speed inference
     */
    generateResponse(message: string, userId: string, userContext?: UserContext, sentimentScore?: number): Promise<GroqResponse>;
    /**
     * Assess risk level based on message content and sentiment
     */
    private assessRiskLevel;
    /**
     * Build comprehensive system prompt with user context
     */
    private buildSystemPrompt;
    /**
     * Build conversation history for context
     */
    private buildConversationHistory;
    /**
     * Analyze response to extract metadata
     */
    private analyzeResponse;
    /**
     * Generate relevant follow-up questions
     */
    private generateFollowUpQuestions;
    /**
     * Generate suggested actions based on intervention type
     */
    private generateSuggestedActions;
    /**
     * Fallback response if Groq API fails
     */
    private getFallbackResponse;
}
export declare const groqAI: GroqAIService;
export declare const generateGroqResponse: (message: string, userId: string, userContext?: UserContext, sentimentScore?: number) => Promise<GroqResponse>;
export {};
//# sourceMappingURL=groq-ai-service.d.ts.map