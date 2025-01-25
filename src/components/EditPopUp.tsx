import React from "react";
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

interface EditPopUpProps {
  taskList: Task[];
  setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
  showEditDelete: number | null;
  handleDeleteTask: (index: number) => void;
}

const EditPopUp: React.FC<EditPopUpProps> = ({
  taskList,
  setTaskList,
  showEditDelete,
  handleDeleteTask,
}) => {
  const handleTaskUpdate = (key: keyof Task, value: any) => {
    if (showEditDelete !== null) {
      const updatedTaskList = [...taskList];
      updatedTaskList[showEditDelete] = {
        ...updatedTaskList[showEditDelete],
        [key]: value,
      };
      setTaskList(updatedTaskList);
    }
  };

  return (
    <div className="absolute top-4 left-0 w-[150px] bg-white border rounded shadow-md z-10">
      <ul className="flex flex-col">
        {/* Edit Task */}
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <Dialog>
            <DialogTrigger>
              <span>Edit</span>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-mulish font-semibold text-2xl text-[#2f2f2f]">
                  Edit Task
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 items-center gap-4">
                  <Label htmlFor="taskTitle" className="text-left">
                    Task Title
                  </Label>
                  <Input
                    id="taskTitle"
                    value={taskList[showEditDelete!]?.taskTitle || ""}
                    onChange={(e) =>
                      handleTaskUpdate("taskTitle", e.target.value)
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-1 items-center gap-4">
                  <Label htmlFor="description" className="text-left">
                    Description
                  </Label>
                  <textarea
                    id="description"
                    className="col-span-3 border rounded p-2"
                    placeholder="Add a description"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  {/* Task Category */}
                  <div className="flex flex-col justify-start items-left">
                    <p>Task Category</p>
                    <div className="flex flex-row gap-2">
                      <Button
                        onClick={() => handleTaskUpdate("category", "work")}
                        className={`${
                          taskList[showEditDelete!]?.category === "work"
                            ? "bg-blue-500 text-white"
                            : "bg-transparent text-gray-500"
                        } px-2 py-2 rounded-2xl border border-gray-300`}
                      >
                        Work
                      </Button>
                      <Button
                        onClick={() => handleTaskUpdate("category", "personal")}
                        className={`${
                          taskList[showEditDelete!]?.category === "personal"
                            ? "bg-blue-500 text-white"
                            : "bg-transparent text-gray-500"
                        } px-2 py-2 rounded-2xl border border-gray-300`}
                      >
                        Personal
                      </Button>
                    </div>
                  </div>
                  {/* Due Date */}
                  <div className="flex flex-col justify-start items-left">
                    <p>Due On</p>
                    <DatePicker
                      selected={taskList[showEditDelete!]?.selectedDate || null}
                      onChange={(date) => handleTaskUpdate("selectedDate", date)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select a date"
                      className="py-2 px-4 border border-gray-300 rounded-md w-full"
                    />
                  </div>
                  {/* Status */}
                  <div className="flex flex-col justify-start items-left">
                    <p>Status</p>
                    <Select
                      value={taskList[showEditDelete!]?.status || "todo"}
                      onValueChange={(value) => handleTaskUpdate("status", value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">Todo</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* File Attachment */}
                <div className="grid grid-cols-1 items-center gap-4">
                  <Label htmlFor="taskFile" className="text-left">
                    Attachment
                  </Label>
                  <input
                    id="taskFile"
                    type="file"
                    onChange={(e) =>
                      handleTaskUpdate(
                        "attachment",
                        e.target.files?.[0] || null
                      )
                    }
                    className="col-span-3 border border-gray-300 rounded-md p-2"
                  />
                  {taskList[showEditDelete!]?.attachment && (
                    <p className="text-sm text-gray-500">
                      Attached: {taskList[showEditDelete!]?.attachment.name}
                    </p>
                  )}
                </div>
                {/* Actions */}
                <div className="bg-[#f1f1f1] w-full flex justify-end gap-4 p-2">
                  <Button
                    onClick={() => {}}
                    className="bg-transparent text-gray-500 px-4 py-2 rounded-lg border"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {}}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </li>

        {/* Delete Task */}
        <li
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            if (showEditDelete !== null) handleDeleteTask(showEditDelete);
          }}
        >
          Delete
        </li>
      </ul>
    </div>
  );
};

export default EditPopUp;
