import { Conversation } from './Conversation';
import { Emotion } from './Emotion';
import { MoodEntry } from './MoodEntry';
import { CrisisAlert } from './CrisisAlert';
export declare class User {
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
    conversations: Conversation[];
    emotions: Emotion[];
    moodEntries: MoodEntry[];
    crisisAlerts: CrisisAlert[];
}
//# sourceMappingURL=User.d.ts.map