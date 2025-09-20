/**
 * IMPLEMENTATION GUIDE: ADVANCED MINDGUARD AI INTEGRATION
 *
 * This file shows you exactly how to integrate the advanced AI prompt system
 * with your existing MindGuard platform using OpenAI GPT-4 or similar models.
 */
interface UserAIContext {
    name?: string;
    preferredPersonality?: string;
    currentMood?: string;
    moodTrend?: string;
    frequentTopics?: string[];
    effectiveStrategies?: string[];
    triggers?: string[];
    lastSession?: string;
    riskLevel?: 'low' | 'medium' | 'high';
    conversationHistory?: ConversationMessage[];
    recentMoodData?: any[];
    recentEmotionData?: any[];
}
interface ConversationMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    metadata?: {
        mood?: string;
        emotion?: string;
        strategy?: string;
    };
}
/**
 * STEP 1: REPLACE YOUR EXISTING CHATBOT FUNCTION
 *
 * Replace your current generateCBTResponse function with this advanced version
 */
export declare const generateAdvancedAIResponse: (message: string, userId: string, userContext: UserAIContext, sentimentScore?: number) => Promise<{
    response: string;
    metadata: {
        personality: string;
        intervention: string;
        followUp: string[];
        riskLevel: "low" | "medium" | "high";
        suggestedActions: string[];
    };
}>;
/**
 * STEP 7: INTEGRATION WITH YOUR EXISTING SYSTEM
 *
 * Replace your chatController.ts logic with this:
 */
export declare const integrateWithChatController: (data: any) => Promise<{
    message: any;
    response: string;
    sentimentScore: any;
    userId: any;
    metadata: {
        personality: string;
        intervention: string;
        followUp: string[];
        riskLevel: "low" | "medium" | "high";
        suggestedActions: string[];
    };
    timestamp: Date;
}>;
declare const _default: {
    generateAdvancedAIResponse: (message: string, userId: string, userContext: UserAIContext, sentimentScore?: number) => Promise<{
        response: string;
        metadata: {
            personality: string;
            intervention: string;
            followUp: string[];
            riskLevel: "low" | "medium" | "high";
            suggestedActions: string[];
        };
    }>;
    integrateWithChatController: (data: any) => Promise<{
        message: any;
        response: string;
        sentimentScore: any;
        userId: any;
        metadata: {
            personality: string;
            intervention: string;
            followUp: string[];
            riskLevel: "low" | "medium" | "high";
            suggestedActions: string[];
        };
        timestamp: Date;
    }>;
    MINDGUARD_AI_SYSTEM_PROMPT: string;
};
export default _default;
//# sourceMappingURL=advanced-ai-implementation.d.ts.map