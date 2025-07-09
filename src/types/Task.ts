import { Timestamp } from "firebase/firestore";

export interface Task {
    id: string;
    taskTitle: string;
    description?: string;
    selectedDate: Date | null;
    status: string;
    category: string;
    attachment?: string;
    createdAt: Timestamp;
    updatedFields?: string[];
    lastUpdatedAt?: Timestamp;
    history?: ChangeLog[];
}

export interface User {
    name: string;
    email: string;
    photo: string;
}

export interface ChangeLog {
    fields: string[];
    timestamp: Timestamp;
}
