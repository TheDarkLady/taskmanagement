import React, { useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import DatePicker from "react-datepicker";
import { Task } from "../types/Task";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../firebase/AuthContext";

interface EditPopUpProps {
  task: Task;
  setFilteredTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
  handleDeleteTask: (id: string) => void;
  dropDownOpen: boolean;
  setDropDownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditPopUp: React.FC<EditPopUpProps> = ({
  task,
  setFilteredTasks,
  setTaskList,
  handleDeleteTask,
  dropDownOpen,
  setDropDownOpen,
}) => {
  const [open, setOpen] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>(task);
  const { currentUser } = useAuth();

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

  const handleChange = (key: keyof Task, value: any) => {
    if (key === "attachment" && value instanceof File) {
      const file = value;
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string; // full data URI
        setEditedTask((prev) => ({
          ...prev,
          [key]: result,
        }));
      };
      reader.readAsDataURL(file); // returns: data:<mime>;base64,...
    } else {
      setEditedTask((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSave = async () => {
    const user = currentUser;

    if (!user?.uid) {
      showToast("error", "User not logged in.");
      return;
    }

    try {
      // Update Firestore
      await updateDoc(doc(db, "Users", user.uid, "tasks", editedTask.id), {
        ...editedTask,
      });

      // Update local state
      setTaskList((prev) =>
        prev.map((t) => (t.id === editedTask.id ? editedTask : t))
      );
      setFilteredTasks((prev) =>
        prev.map((t) => (t.id === editedTask.id ? editedTask : t))
      );

      setOpen(false);
      setDropDownOpen(false);
      showToast("info", "Task updated successfully!");
    } catch (error) {
      console.error("Error updating task in Firestore:", error);
      showToast("error", "Failed to update task in Firestore.");
    }
  };

  return (
    <div className="relative">
      {dropDownOpen && (
        <div className="absolute top-4 -right-0 md:left-0 w-[150px] bg-white border rounded shadow-md z-10">
          <ul className="flex flex-col">
            {/* Edit Task */}
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Dialog
                open={open}
                onOpenChange={(isOpen) => {
                  setOpen(isOpen);
                  if (!isOpen) setDropDownOpen(false);
                }}
              >
                <DialogTrigger asChild>
                  <span
                    className="text-[#000] w-[100%] h-[100%] block"
                    onClick={() => setOpen(true)}
                  >
                    Edit
                  </span>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {/* Title */}
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

                    {/* Description */}
                    <div className="grid grid-cols-1 gap-4">
                      <Label htmlFor="description">Description</Label>
                      <textarea
                        id="description"
                        className="border bg-transparent text-[#000] dark:bg-[#0a0a0a] dark:text-[#fff] rounded p-2 h-[100px]"
                        placeholder="Add a description"
                        value={editedTask.description}
                        onChange={(e) =>
                          handleChange("description", e.target.value)
                        }
                      />
                    </div>

                    {/* Category + Due Date */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Category */}
                      <div className="flex flex-col">
                        <p className="mb-2">Task Category</p>
                        <div className="flex gap-2">
                          {["work", "personal"].map((cat) => (
                            <button
                              key={cat}
                              onClick={() => handleChange("category", cat)}
                              className={`${
                                editedTask.category === cat
                                  ? "bg-[#7B1984] text-white"
                                  : "bg-transparent border border-[#7B1984] text-[#7B1984] hover:bg-[#7B1984] hover:text-[#fff]"
                              } px-2 py-2 rounded-2xl border`}
                            >
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Due Date */}
                      <div className="flex flex-col">
                        <p>Due On</p>
                        <DatePicker
                          selected={editedTask.selectedDate || null}
                          onChange={(date) =>
                            handleChange("selectedDate", date)
                          }
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Select a date"
                          className="py-2 px-4 border border-gray-300 rounded-md w-full bg-transparent hover:bg-[#7B1984] hover:text-[#fff]"
                        />
                      </div>

                      {/* Status */}
                      <div className="flex flex-col col-span-2">
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
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="taskFile">Attachment</Label>
                      <input
                        id="taskFile"
                        type="file"
                        accept="*/*"
                        onChange={(e) =>
                          handleChange(
                            "attachment",
                            e.target.files?.[0] || null
                          )
                        }
                        className="border border-gray-300 rounded-md p-2"
                      />

                      {editedTask.attachment && (
                        <div>
                          <p className="text-sm text-gray-500">
                            Current Attachment:
                          </p>
                          <a
                            href={editedTask.attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            View File
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="bg-[#fff] dark:bg-[#0a0a0a] w-full flex justify-end gap-4 p-2">
                      <button
                        onClick={() => {
                          setOpen(false);
                          setDropDownOpen(false);
                        }}
                        className="bg-transparent text-[#7B1984] px-4 py-2 rounded-lg border border-[#7B1984] hover:bg-[#7B1984] hover:text-[#fff]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="bg-[#7B1984] text-white px-4 py-2 rounded-lg"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </li>

            {/* Delete Task */}
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <span
                className="text-[#000] w-full h-full block"
                onClick={() => {
                  // console.log("Clicked Delete on task:", task.id);
                  handleDeleteTask(editedTask.id);
                }}
              >
                Delete
              </span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default EditPopUp;
