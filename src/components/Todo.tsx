import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { FaAngleUp } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";
import { PiArrowBendDownLeftFill } from "react-icons/pi";
import { SlCalender } from "react-icons/sl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BiDotsHorizontalRounded } from "react-icons/bi";
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

interface Task {
  taskTitle: string;
  selectedDate: Date | null;
  status: string;
  category: string;
}

const Todo: React.FC = () => {
  const [showStatus, setShowStatus] = useState<boolean>(false);
  const [showCategory, setShowCategory] = useState<boolean>(false);
  const [showDatePick, setShowDatePick] = useState<boolean>(false);
  const [showEditDelete, setShowEditDelete] = useState<number | null>(null);
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [taskList, setTaskList] = useState<Task[]>([]);

  const openAddTask = () => {
    const addTask = document.querySelector(".addtask");
    if (addTask) {
      addTask.classList.toggle("hidden");
    }
  };

  const handleAddTask = () => {
    if (!taskTitle.trim()) {
      alert("Task Title cannot be empty");
      return;
    }

    const newTask: Task = {
      taskTitle,
      selectedDate,
      status: status || "todo",
      category: category || "general",
    };

    setTaskList((prevTasks) => {
      const updatedTasks = [...prevTasks, newTask];
      return updatedTasks;
    });

    // Log the taskList after it has been updated
    console.log([...taskList, newTask]); // Log the current taskList with the newly added task

    resetTaskInputs();
    openAddTask();
  };

  const handleDeleteTask = (index: number) => {
    const newTaskList = taskList.filter((task, i) => i !== index);
    setTaskList(newTaskList);
  };
  const resetTaskInputs = () => {
    setTaskTitle("");
    setSelectedDate(null);
    setStatus("");
    setCategory("");
  };

  return (
    <div className="w-full bg-[#f1f1f1] rounded-lg">
      <div className="w-full bg-[#FAC3FF] py-5 px-5 flex items-center justify-between rounded-t-xl">
        <p className="text-[#000] font-semibold text-base">
          Todo ({taskList.length})
        </p>
        <FaAngleUp className="fill-[#3E0344]" />
      </div>
      <div
        className="w-full py-6 px-10 flex flex-row justify-start items-center gap-2 cursor-pointer"
        onClick={openAddTask}
      >
        <GoPlus className="fill-[#7B1984]" />
        <p className="text-[#000000CC] font-mulish font-sm font-semibold uppercase">
          Add Task
        </p>
      </div>
      <div className="flex flex-col hidden addtask">
        <div className="flex flex-row justify-center items-center py-5 border-t-[2px] border-[#0000001A]">
          <div className="w-[30%] flex flex-col gap-5 items-center justify-start">
            <input
              type="text"
              placeholder="Task Title"
              className="py-3 px-2 bg-transparent border-none border rounded-lg"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <div className="flex flex-row justify-center items-center gap-5">
              <Button
                className="add-task-btn text-[#fff] px-2 py-2 rounded-md flex items-center"
                onClick={handleAddTask}
              >
                Add
                <PiArrowBendDownLeftFill />
              </Button>
              <Button
                className="bg-[#fff] text-[#000] px-10 py-2 rounded-md flex items-center hover:bg-[#7B1984] hover:text-[#fff]"
                onClick={() => {
                  console.log(taskList);
                  // resetTaskInputs();
                  openAddTask();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
          <div className="w-[20%] flex flex-col items-center justify-start gap-[5px]">
            <Button
              className="heading-bar-para bg-[#fff] rounded-full hover:bg-[#7B1984] hover:text-[#fff] border"
              onClick={() => setShowDatePick(!showDatePick)}
            >
              <SlCalender />
              {selectedDate === null
                ? "Add Date"
                : selectedDate?.toDateString()}
            </Button>
            {showDatePick && (
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date) => {
                  setSelectedDate(date);
                  setShowDatePick(!showDatePick);
                }}
                inline
              />
            )}
          </div>
          <div className="w-[20%] flex items-center justify-start relative">
            <Button
              className="heading-bar-para bg-transparent border rounded-full hover:bg-[#7B1984] hover:text-[#fff] border"
              onClick={() => setShowStatus(!showStatus)}
            >
              {status === "" ? <GoPlus className="fill-[#00000066]" /> : status}
            </Button>
            {showStatus && (
              <div className="absolute top-12 left-0 w-[150px] bg-white border rounded shadow-md z-10">
                <ul className="flex flex-col">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setStatus("todo");
                      setShowStatus(!showStatus);
                    }}
                  >
                    Todo
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setStatus("In Progress");
                      setShowStatus(!showStatus);
                    }}
                  >
                    In-progress
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setStatus("Completed");
                      setShowStatus(!showStatus);
                    }}
                  >
                    Completed
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="w-[20%] flex items-center justify-start relative">
            <Button
              className="heading-bar-para bg-transparent border rounded-full hover:bg-[#7B1984] hover:text-[#fff] border"
              onClick={() => setShowCategory(!showCategory)}
            >
              {category === "" ? (
                <GoPlus className="fill-[#00000066]" />
              ) : (
                category
              )}
            </Button>
            {showCategory && (
              <div className="absolute top-12 left-0 w-[150px] bg-white border rounded shadow-md z-10">
                <ul className="flex flex-col">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setCategory("work");
                      setShowCategory(!showCategory);
                    }}
                  >
                    Work
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setCategory("personal");
                      setShowCategory(!showCategory);
                    }}
                  >
                    Personal
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="w-[10%] flex items-center justify-start relative"></div>
        </div>
      </div>
      {taskList.map((task, index) => {
        return (
          <div key={index}>
            <div className="flex flex-row justify-center items-center py-5 border-t-[2px] border-[#0000001A]">
              <div className="w-[30%] flex flex-col gap-5 items-center justify-start">
                <p>{task.taskTitle}</p>
              </div>
              <div className="w-[20%] flex flex-col items-start justify-start gap-[5px]">
                <p>
                  {task.selectedDate?.toDateString() ===
                  new Date().toDateString()
                    ? "Today"
                    : ` ${task.selectedDate?.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}${" "}, ${task.selectedDate?.getFullYear()}`}
                </p>
              </div>
              <div className="w-[20%] flex items-start justify-start relative">
                <p>{task.status}</p>
              </div>
              <div className="w-[20%] flex items-start justify-start relative">
                <p>{task.category}</p>
              </div>

              <div className="w-[10%] flex items-start justify-start relative">
                <BiDotsHorizontalRounded
                  onClick={() =>
                    setShowEditDelete(showEditDelete === index ? null : index)
                  }
                />
                {showEditDelete === index && (
                  <div className="absolute top-4 left-0 w-[150px] bg-white border rounded shadow-md z-10">
                    <ul className="flex flex-col">
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
                              <DialogDescription>
                                Modify the task details below.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="taskTitle"
                                  className="text-right"
                                >
                                  Task Title
                                </Label>
                                <Input
                                  id="taskTitle"
                                  value={
                                    taskList[showEditDelete!]?.taskTitle || ""
                                  }
                                  onChange={(e) => {
                                    const updatedTaskList = [...taskList];
                                    updatedTaskList[showEditDelete!] = {
                                      ...updatedTaskList[showEditDelete!],
                                      taskTitle: e.target.value,
                                    };
                                    setTaskList(updatedTaskList);
                                  }}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="category"
                                  className="text-right"
                                >
                                  Category
                                </Label>
                                <Input
                                  id="category"
                                  value={
                                    taskList[showEditDelete!]?.category || ""
                                  }
                                  onChange={(e) => {
                                    const updatedTaskList = [...taskList];
                                    updatedTaskList[showEditDelete!] = {
                                      ...updatedTaskList[showEditDelete!],
                                      category: e.target.value,
                                    };
                                    setTaskList(updatedTaskList);
                                  }}
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </li>

                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          handleDeleteTask(index);
                        }}
                      >
                        Delete
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Todo;
