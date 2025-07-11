import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";
import { onAuthStateChanged, User } from "firebase/auth";

interface CreatePopUpProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Task {
  taskTitle: string;
  taskDescription: string;
  dueDate: string;
  status: string;
  category: string;
  createdAt: Date;
  userId: string;
}

function CreatePopUp({ isOpen, onClose }: CreatePopUpProps) {
  const [user, setUser] = useState<User | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("work");
  const [status, setStatus] = useState("todo");

  const showToast = (
    type: "success" | "error" | "info" | "warn",
    message: string
  ) => {
    toast[type](message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const resetTaskInputs = () => {
    setTaskTitle("");
    setTaskDescription("");
    setDueDate("");
    setCategory("work");
    setStatus("todo");
  };

  useEffect(() => {
    // Check if user is already authenticated
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    }

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!user) {
        showToast("error", "Please login to create tasks");
        return;
      }

      if (!taskTitle.trim()) {
        showToast("error", "Task Title cannot be empty");
        return;
      }

      const newTask: Task = {
        taskTitle,
        taskDescription,
        dueDate,
        status,
        category,
        createdAt: new Date(),
        userId: user.uid,
      };

      await addDoc(collection(db, "Users", user.uid, "tasks"), newTask);
      showToast("success", "Task added successfully!");
      resetTaskInputs();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", `Failed to add task: ${error.message}`);
        console.error("Firestore Error:", error);
      } else {
        showToast("error", "An unknown error occurred");
        console.error("Unknown Error:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddTask} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="taskTitle">Task Title</Label>
            <Input
              id="taskTitle"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taskDescription">Description</Label>
            <Input
              id="taskDescription"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Enter task description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="work">Work</option>
              <option value="personal">Personal</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#7b1984] text-white">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePopUp;