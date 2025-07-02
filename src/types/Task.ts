export interface Task {
    id:string;
    taskTitle: string;
    description?: string;
    selectedDate: Date | null;
    status: string;
    category: string;
    attachment?:string;
}

export interface User {
    name: string;
    email: string;
    photo: string;
}
