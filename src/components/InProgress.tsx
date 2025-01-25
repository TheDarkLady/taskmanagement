import React from 'react'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@mui/material";
import DatePicker from "react-datepicker";
import {Task} from "../types/Task";

interface InprogressProps {
  taskList: Task[];
  setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
  showEditDelete: number | null;
  handleDeleteTask: (index: number) => void;
}

const InProgress: React.FC<InprogressProps> = ({
  taskList,
  setTaskList,
  showEditDelete,
  handleDeleteTask,
 
}) => {
  console.log(taskList)
  return (
    <div>
      <h1>In Progress</h1>
    </div>
  )
}

export default InProgress
