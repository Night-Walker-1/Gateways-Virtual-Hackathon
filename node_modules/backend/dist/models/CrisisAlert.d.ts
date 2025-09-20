import { User } from './User';
export declare class CrisisAlert {
    id: string;
    riskLevel: 'low' | 'medium' | 'high';
    triggerData: {
        moodData?: any;
        emotionData?: any;
        chatData?: any;
        analysis?: string;
    };
    resolved: boolean;
    timestamp: Date;
    user: User;
    userId: string;
}
//# sourceMappingURL=CrisisAlert.d.ts.map