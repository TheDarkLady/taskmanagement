import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { FaAngleUp } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";
import { PiArrowBendDownLeftFill } from "react-icons/pi";
import { SlCalender } from "react-icons/sl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import EditPopUp from "./EditPopUp";
import { Task } from "../types/Task";
import { v4 as uuidv4 } from "uuid";
import { useRef } from "react";

interface Props {
  componentStatus: String;
  taskList: Task[];
  setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
}

const Todo: React.FC<Props> = ({ componentStatus, taskList, setTaskList }) => {
  const [showStatus, setShowStatus] = useState<boolean>(false);
  const [showCategory, setShowCategory] = useState<boolean>(false);
  const [showDatePick, setShowDatePick] = useState<boolean>(false);
  // const [showEditDelete, setShowEditDelete] = useState<number | null>(null);
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dropDownOpen, setDropDownOpen] = useState<Boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, taskId: string) => {
    event.dataTransfer.setData("text/plain", taskId);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, newStatus: string) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/plain");
    setTaskList((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
    );
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

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
      id: uuidv4(),
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

  const handleDeleteTask = (id: string) => {
    const newTaskList = taskList.filter((task) => task.id !== id);
    setTaskList(newTaskList);
  };
  const resetTaskInputs = () => {
    setTaskTitle("");
    setSelectedDate(null);
    setStatus("");
    setCategory("");
  };

  const openEditPopup = (task: Task) => {
    setSelectedTask(task);
    setDropDownOpen(true);
  };

  const closeEditPopup = () => {
    setSelectedTask(null);
    setDropDownOpen(false);
  };

  const todoLen = useMemo<number>(
    () => taskList.filter((task: Task) => task.status === "todo").length ?? 0,
    [taskList]
  );
  const inProgresLen = useMemo<number>(
    () =>
      taskList.filter((task: Task) => task.status === "In Progress").length ??
      0,
    [taskList]
  );
  const completedLen = useMemo<number>(
    () =>
      taskList.filter((task: Task) => task.status === "completed").length ?? 0,
    [taskList]
  );

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTaskList(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to local storage whenever taskList changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(taskList));
  }, [taskList]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropDownOpen(false);
      }
    };

    if (dropDownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropDownOpen]);

  return (
    <div className="w-full bg-[#f1f1f1] rounded-lg mb-10" onDragOver={handleDragOver} onDrop={(event) => handleDrop(event, componentStatus)}>
      <div
        className={`w-full py-5 px-5 flex items-center justify-between rounded-t-xl ${
          componentStatus === "In Progress"
            ? "bg-[#85D9F1]"
            : componentStatus === "completed"
            ? "bg-[#CEFFCC]"
            : "bg-[#FAC3FF]"
        }`}
      >
        <p className="text-[#000] font-semibold text-base">
          {componentStatus} (
          {componentStatus === "todo"
            ? todoLen
            : componentStatus === "In Progress"
            ? inProgresLen
            : completedLen}
          )
        </p>
        <FaAngleUp className="fill-[#3E0344]" />
      </div>
      {componentStatus == "todo" && (
        <div
          className="w-full py-6 px-10 flex flex-row justify-start items-center gap-2 cursor-pointer"
          onClick={openAddTask}
        >
          <GoPlus className="fill-[#7B1984]" />
          <p className="text-[#000000CC] font-mulish font-sm font-semibold uppercase ">
            Add Task
          </p>
        </div>
      )}
      <div className=" flex-col hidden addtask">
        <div className="flex flex-row justify-center items-center py-5 border-t-[2px] border-[#0000001A]">
          <div className="w-[30%] flex flex-col gap-5 items-center justify-start">
            <input
              type="text"
              placeholder="Task Title"
              className="py-3 px-2 bg-transparent border-none border rounded-lg text-[#000]"
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
              className="status-btn heading-bar-para bg-transparent border rounded-full hover:bg-[#7B1984] hover:text-[#fff] hover:border-none"
              onClick={() => setShowStatus(!showStatus)}
            >
              {status === "" ? (
                <GoPlus className="fill-[#00000066] status-plus-icon" />
              ) : (
                status
              )}
            </Button>
            {showStatus && (
              <div className="absolute top-12 left-0 w-[150px] bg-white border rounded shadow-md z-10">
                <ul className="flex flex-col">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#000] hover:text-[#7B1984]"
                    onClick={() => {
                      setStatus("todo");
                      setShowStatus(!showStatus);
                    }}
                  >
                    Todo
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#000] hover:text-[#7B1984]"
                    onClick={() => {
                      setStatus("In Progress");
                      setShowStatus(!showStatus);
                    }}
                  >
                    In-progress
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#000] hover:text-[#7B1984]"
                    onClick={() => {
                      setStatus("completed");
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
              className="category-btn heading-bar-para bg-transparent border rounded-full hover:bg-[#7B1984] hover:text-[#fff] hover:border-none"
              onClick={() => setShowCategory(!showCategory)}
            >
              {category === "" ? (
                <GoPlus className="fill-[#00000066] category-plus-icon" />
              ) : (
                category
              )}
            </Button>
            {showCategory && (
              <div className="absolute top-12 left-0 w-[150px] bg-white border rounded shadow-md z-10">
                <ul className="flex flex-col">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#000] hover:text-[#7B1984]"
                    onClick={() => {
                      setCategory("work");
                      setShowCategory(!showCategory);
                    }}
                  >
                    Work
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#000] hover:text-[#7B1984]"
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

      {taskList
        .filter((allTask) => {
          return allTask.status === componentStatus;
        })
        .map((task, index) => {
          return (
            <div key={task.id} draggable onDragStart={(event) => handleDragStart(event, task.id)}>
              <div className="flex flex-row justify-center items-center py-5 border-t-[2px] border-[#0000001A]">
                <div className="w-[30%] flex flex-col gap-5 items-center justify-start">
                  <p className="text-[#000]">{task.taskTitle}</p>
                </div>
                <div className="w-[20%] flex flex-col items-start justify-start gap-[5px]">
                  <p className="text-[#000]">
                    {task.selectedDate
                      ? new Date(task.selectedDate).toDateString() ===
                        new Date().toDateString()
                        ? "Today"
                        : `${new Date(task.selectedDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                            }
                          )}, ${new Date(task.selectedDate).getFullYear()}`
                      : "No Date"}
                  </p>
                </div>
                <div className="w-[20%] flex items-start justify-start relative">
                  <p className="text-[#000]">{task.status}</p>
                </div>
                <div className="w-[20%] flex items-start justify-start relative">
                  <p className="text-[#000]">{task.category}</p>
                </div>

                <div className="w-[10%] flex items-start justify-start relative">
                  <BiDotsHorizontalRounded
                    className="fill-[#000]"
                    onClick={(e) => {
                      openEditPopup(task);
                      // e.stopPropagation();
                      setDropDownOpen(!dropDownOpen);
                    }}
                  />

                  {selectedTask && selectedTask === task && (
                    <EditPopUp
                      task={selectedTask}
                      setTaskList={setTaskList}
                      handleClose={() => setDropDownOpen(false)}
                      handleDeleteTask={handleDeleteTask}
                      dropDownOpen={dropDownOpen}
                      setDropDownOpen={setDropDownOpen}
                    />
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
