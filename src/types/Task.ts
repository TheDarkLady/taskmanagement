import { Timestamp } from "firebase/firestore";

export interface Task {
    id:string;
    taskTitle: string;
    description?: string;
    selectedDate: Date | null;
    status: string;
    category: string;
    attachment?:string;
    createdAt: Timestamp;
    lastUpdatedField?: string;
    lastUpdatedAt?: Timestamp;
    updatedFields?: string[];
}

export interface User {
    name: string;
    email: string;
    photo: string;
}
