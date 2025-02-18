import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
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
import { Task } from "../types/Task";

interface EditPopUpProps {
  task: Task;
  setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
  handleClose: () => void;
  handleDeleteTask: (task: Task) => void;
  dropDownOpen :boolean;
  setDropDownOpen : React.Dispatch<React.SetStateAction<boolean>>
}

const EditPopUp: React.FC<EditPopUpProps> = ({
  task,
  setTaskList,
  handleClose,
  handleDeleteTask,
  dropDownOpen,
  setDropDownOpen
}) => {
  const [open, setOpen] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>(task);
  console.log("EditTask", editedTask);
  // Handle local state updates
  const handleChange = (key: keyof Task, value: any) => {
    setEditedTask((prev) => ({ ...prev, [key]: value }));
  };

  // Save changes and update task list
  const handleSave = () => {
    setTaskList((prevTasks) =>
      prevTasks.map((t) => (t.id === task.id ? editedTask : t))
    );
    setOpen(false);
    setDropDownOpen(false)
  };

  return (
   <div className="relative">
    {dropDownOpen && (
       <div className="absolute top-4 -right-0 md:left-0 w-[150px] bg-white border rounded shadow-md z-10">
       <ul className="flex flex-col">
         {/* Edit Task */}
         <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
           <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if(!isOpen) setDropDownOpen(false)
           }}>
             <DialogTrigger asChild>
               <span
                 className="text-[#000] w-[100%] h-[100%] block"
                 onClick={() => {
                   setOpen(true);
                   
                 }}
               >
                 Edit
               </span>
             </DialogTrigger>
             <DialogContent>
               <DialogHeader>
                 <DialogTitle>Edit Task</DialogTitle>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                 <div className="grid grid-cols-1 gap-4">
                   <Label htmlFor="taskTitle">Task Title</Label>
                   <Input
                     id="taskTitle"
                     value={editedTask.taskTitle}
                     onChange={(e) =>
                       handleChange("taskTitle", e.target.value)
                     }
                   />
                 </div>
   
                 <div className="grid grid-cols-1 gap-4">
                   <Label htmlFor="description">Description</Label>
                   <textarea
                     id="description"
                     className="border bg-transparent text-[#000] dark:bg-[#0a0a0a] rounded p-2"
                     placeholder="Add a description"
                     value={editedTask.description}
                     onChange={(e) =>
                       handleChange("description", e.target.value)
                     }
                   />
                 </div>
   
                 <div className="grid grid-cols-2 gap-4">
                   {/* Task Category */}
                   <div className="flex flex-col">
                     <p className="mb-2">Task Category</p>
                     <div className="flex gap-2">
                       <button
                         onClick={() => handleChange("category", "work")}
                         className={`${
                           editedTask.category === "work"
                             ? "bg-[#7B1984] text-white"
                             : "bg-transparent border border-[#7B1984]  text-[#7B1984] hover:bg-[#7B1984] hover:text-[#fff]"
                         } px-2 py-2 rounded-2xl border`}
                       >
                         Work
                       </button>
                       <button
                         onClick={() => handleChange("category", "personal")}
                         className={`${
                           editedTask.category === "personal"
                             ? "bg-[#7B1984] text-white"
                             : "bg-transparent border border-[#7B1984]  text-[#7B1984] hover:bg-[#7B1984] hover:text-[#fff]"
                         } px-2 py-2 rounded-2xl border`}
                       >
                         Personal
                       </button>
                     </div>
                   </div>
   
                   {/* Due Date */}
                   <div className="flex flex-col">
                     <p >Due On</p>
                     <DatePicker
                       selected={editedTask.selectedDate || null}
                       onChange={(date) =>
                         handleChange("selectedDate", date)
                       }
                       dateFormat="dd/MM/yyyy"
                       placeholderText="Select a date"
                       className="py-2 px-4 border border-gray-300 rounded-md w-full bg-transparent hover:bg-[#0a0a0a]"
                     />
                   </div>
   
                   {/* Status */}
                   <div className="flex flex-col">
                     <p className="mb-2">Status</p>
                     <Select
                       value={editedTask.status}
                       onValueChange={(value) =>
                         handleChange("status", value)
                       }
                     >
                       <SelectTrigger className="w-[180px]">
                         <SelectValue placeholder="Select Status" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="todo">Todo</SelectItem>
                         <SelectItem value="In Progress">
                           In Progress
                         </SelectItem>
                         <SelectItem value="completed">Completed</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                 </div>
   
                 {/* File Attachment */}
                 <div className="grid grid-cols-1 gap-4">
                   <Label htmlFor="taskFile">Attachment</Label>
                   <input
                     id="taskFile"
                     type="file"
                     onChange={(e) =>
                       handleChange(
                         "attachment",
                         e.target.files?.[0] || null
                       )
                     }
                     className="border border-gray-300 rounded-md p-2"
                   />
                   {editedTask.attachment && (
                     <p className="text-sm text-gray-500">
                       Attached: {editedTask.attachment.name}
                     </p>
                   )}
                 </div>
   
                 {/* Actions */}
                 <div className="bg-[#fff] dark:bg-[#0a0a0a] w-full flex justify-end gap-4 p-2">
                   <button
                     onClick={() => {
                      setOpen(false);
                      setDropDownOpen(false)
                     }}
                     className="bg-transparent text-[#7B1984] px-4 py-2 rounded-lg border border-[#7B1984] hover:bg-[#7B1984] hover:text-[#fff]"
                   >
                     Cancel
                   </button>
                   <button
                     onClick={handleSave}
                     className="bg-[#7B1984] text-white px-4 py-2 rounded-lg "
                   >
                     Save
                   </button>
                 </div>
               </div>
             </DialogContent>
           </Dialog>
         </li>
   
         {/* Delete Task */}
         <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#fff]">
           <span
             className="text-[#000] w-full h-full block"
             onClick={() => handleDeleteTask(editedTask.id)}
           >
             Delete
           </span>
         </li>
       </ul>
     </div>
    )

    }

   </div>
   
  );
};

export default EditPopUp;
