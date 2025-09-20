interface DemoUser {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    emergencyContacts: {
        name: string;
        phone: string;
        relationship: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
interface DemoConversation {
    id: string;
    message: string;
    response: string;
    sentimentScore?: number;
    timestamp: Date;
    userId: string;
}
interface DemoEmotion {
    id: string;
    emotion: string;
    confidence: number;
    timestamp: Date;
    userId: string;
}
interface DemoMoodEntry {
    id: string;
    moodScore: number;
    text: string;
    textAnalysis: number | null;
    timestamp: Date;
    userId: string;
}
interface DemoCrisisAlert {
    id: string;
    riskLevel: 'low' | 'medium' | 'high';
    triggerData: any;
    resolved: boolean;
    timestamp: Date;
    userId: string;
}
declare class DemoStorage {
    private users;
    private conversations;
    private emotions;
    private moodEntries;
    private crisisAlerts;
    createUser(userData: {
        email: string;
        password: string;
        name: string;
        emergencyContacts?: any[];
    }): Promise<DemoUser>;
    findUserByEmail(email: string): Promise<DemoUser | null>;
    findUserById(id: string): Promise<DemoUser | null>;
    saveConversation(conversationData: {
        message: string;
        response: string;
        sentimentScore?: number;
        userId: string;
    }): Promise<DemoConversation>;
    getConversationsByUserId(userId: string): Promise<DemoConversation[]>;
    saveEmotion(emotionData: {
        emotion: string;
        confidence: number;
        userId: string;
    }): Promise<DemoEmotion>;
    getEmotionsByUserId(userId: string): Promise<DemoEmotion[]>;
    saveMoodEntry(moodData: {
        moodScore: number;
        text: string;
        textAnalysis: number | null;
        userId: string;
    }): Promise<DemoMoodEntry>;
    getMoodEntriesByUserId(userId: string): Promise<DemoMoodEntry[]>;
    saveCrisisAlert(crisisData: {
        riskLevel: 'low' | 'medium' | 'high';
        triggerData: any;
        userId: string;
    }): Promise<DemoCrisisAlert>;
    getCrisisAlertsByUserId(userId: string): Promise<DemoCrisisAlert[]>;
    getConversationHistory(userId: string, limit?: number): Promise<Array<{
        message: string;
        response: string;
    }>>;
    initializeDemo(): Promise<DemoUser>;
}
export declare const demoStorage: DemoStorage;
export {};
//# sourceMappingURL=demoStorage.d.ts.map