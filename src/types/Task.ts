export interface Task {
    id:string;
    taskTitle: string;
    description?: string;
    selectedDate: Date | null;
    status: string;
    category: string;
    attachment?: File[];
}

export interface Task1 {
    taskTitle: string;
    selectedDate: Date | null;
    status: string;
    category: string;
}
