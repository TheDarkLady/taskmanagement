import React, { useEffect, useState } from "react";
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
  componentStatus: string;
  filteredTasks: Task[];
  setFilteredTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  taskList: Task[];
  setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
  categoryFilter: string;
  dateFilter: Date | null;
  isListView: boolean;
  checkedTasks: { [key: string]: boolean };
  handleChecked: (e: React.ChangeEvent<HTMLInputElement>, taskId: string) => void;
}

const Todo: React.FC<Props> = ({
  componentStatus,
  filteredTasks,
  setFilteredTasks,
  taskList,
  setTaskList,
  categoryFilter,
  dateFilter,
  isListView,
  checkedTasks,
  handleChecked,
}) => {
  const [showStatus, setShowStatus] = useState<boolean>(false);
  const [showCategory, setShowCategory] = useState<boolean>(false);
  const [showDatePick, setShowDatePick] = useState<boolean>(false);
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    taskId: string
  ) => {
    event.dataTransfer.setData("text/plain", taskId);
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    newStatus: string
  ) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/plain");
    setTaskList((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    setFilteredTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
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

    const updatedTasks = [...taskList, newTask];

    setTaskList(updatedTasks);
    setFilteredTasks(updatedTasks);

    resetTaskInputs();
    openAddTask();
  };

  const handleDeleteTask = (id: string) => {
    const newTaskList = taskList.filter((task) => task.id !== id);
    setTaskList(newTaskList);
    setFilteredTasks(newTaskList);
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

  return (
    <div 
      className="w-full bg-[#f1f1f1] rounded-lg mb-10"
      onDragOver={handleDragOver}
      onDrop={(event) => handleDrop(event, componentStatus)}
    >
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
          {dateFilter
            ? taskList.filter(
                (task) =>
                  task.selectedDate &&
                  new Date(task.selectedDate).getDate() ===
                    dateFilter.getDate() &&
                  new Date(task.selectedDate).getMonth() ===
                    dateFilter.getMonth() &&
                  new Date(task.selectedDate).getFullYear() ===
                    dateFilter.getFullYear() &&
                  task.status === componentStatus &&
                  (categoryFilter === "all" || task.category === categoryFilter)
              ).length
            : taskList.filter(
                (task) =>
                  task.status === componentStatus &&
                  (categoryFilter === "all" || task.category === categoryFilter)
              ).length}
          )
        </p>
        <FaAngleUp className="fill-[#3E0344]" />
      </div>
      {componentStatus == "todo" && (
        <div
          className="hidden md:flex w-full py-6 px-10  flex-row justify-start items-center gap-2 cursor-pointer"
          onClick={openAddTask}
        >
          <GoPlus className="fill-[#7B1984]" />
          <p className="text-[#000000CC] font-mulish font-sm font-semibold uppercase ">
            Add Task
          </p>
        </div>
      )}
      <div className=" flex-col hidden addtask">
        <div
          className={`${
            isListView ? "flex-col md:flex-row" : "flex-col gap-5"
          } flex  justify-center items-center py-5 border-t-[2px] border-[#0000001A] gap-2 md:gap-5`}
        >
          <div className="w-[30%] flex flex-col gap-5 items-center justify-start">
            <input
              type="text"
              placeholder="Task Title"
              className="py-3 px-2 bg-transparent border-none border rounded-lg text-[#000]"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <div
              className={`hidden md:${
                isListView ? "flex" : "hidden"
              }   flex-row justify-center items-center gap-5`}
            >
              <Button
                className="add-task-btn text-[#fff] px-2 py-2 rounded-md flex items-center"
                onClick={handleAddTask}
              >
                Add
                <PiArrowBendDownLeftFill />
              </Button>
              <Button
                className="bg-[#fff] text-[#000] px-10 py-2 rounded-[20px] flex items-center hover:bg-[#7B1984] hover:text-[#fff]"
                onClick={() => {
                  // console.log(taskList);
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
                onChange={(date: Date | null) => {
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
          <div
            className={`flex ${
              isListView ? "md:hidden" : "md:flex"
            } flex-row justify-center items-center gap-5 `}
          >
            <Button
              className="add-task-btn text-[#fff] px-2 py-2 rounded-md flex items-center"
              onClick={handleAddTask}
            >
              Add
              <PiArrowBendDownLeftFill />
            </Button>
            <Button
              className="bg-[#fff] text-[#000] px-10 py-2  flex items-center hover:bg-[#7B1984] hover:text-[#fff] rounded-[20px]"
              onClick={() => {
                // console.log(taskList);
                // resetTaskInputs();
                openAddTask();
              }}
            >
              Cancel
            </Button>
          </div>
          <div className="w-[10%] flex items-center justify-start relative"></div>
        </div>
      </div>

      {filteredTasks
        .filter((allTask) => {
          // console.log("Date filter :", dateFilter);
          // console.log("Task selected Date :", allTask.selectedDate);

          if (allTask.status !== componentStatus) return false;

          if (categoryFilter !== "all" && allTask.category !== categoryFilter) {
            return false;
          }

          if (
            dateFilter &&
            allTask.selectedDate &&
            dateFilter.getDate() === new Date(allTask.selectedDate).getDate() &&
            dateFilter.getMonth() ===
              new Date(allTask.selectedDate).getMonth() &&
            dateFilter.getFullYear() ===
              new Date(allTask.selectedDate).getFullYear()
          ) {
            return true;
          }
          return dateFilter === null;
        })
        .map((task) => {
          return (
            <div
              key={task.id}
              draggable
              onDragStart={(event) => handleDragStart(event, task.id)}
            >
              <div
                className={`${
                  isListView
                    ? "flex flex-row justify-between items-center"
                    : "grid grid-cols-2 grid-rows-2 gap-5 justify-items-center"
                } px-5  py-5 border-t-[2px] border-[#0000001A]`}
              >
                <div
                  className={`w-auto ${
                    isListView ? "md:w-[30%]" : "md:w-[50%]"
                  } flex flex-row gap-5 items-center justify-start`}
                >
                  <input 
                  type="checkbox" 
                  checked={checkedTasks[task.id] || false}  
                  className="m-0"
                  onChange={(e) => handleChecked(e, task.id)}
                  />
                  <p
                    className={`${
                      isListView ? "font-normal" : "font-bold"
                    } text-[#000] ${
                      task.status === "completed" ? "line-through" : "none"
                    }`}
                  >
                    {task.taskTitle}
                  </p>
                </div>
                <div
                  className={`w-auto ${
                    isListView ? "md:w-[20%]" : "md:w-[50%]"
                  } hidden md:flex flex-col items-start justify-start gap-[5px]`}
                >
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
                <div
                  className={`${
                    isListView
                      ? "hidden w-auto md:w-[20%] md:flex items-start justify-start relative"
                      : "hidden"
                  } `}
                >
                  <p className="text-[#000]">{task.status}</p>
                </div>
                <div
                  className={`w-auto ${
                    isListView
                      ? "md:w-[20%] items-start justify-start"
                      : "md:w-[50%] items-center justify-start"
                  } hidden md:flex relative`}
                >
                  <p className="text-[#000]">{task.category}</p>
                </div>

                <div
                  className={`${
                    isListView
                      ? "items-start justify-start"
                      : "items-center justify-center"
                  } w-auto md:w-[10%] flex relative`}
                >
                  <BiDotsHorizontalRounded
                    className="fill-[#000]"
                    onClick={() => {
                      openEditPopup(task);
                      // e.stopPropagation();
                      setDropDownOpen(!dropDownOpen);
                    }}
                  />

                  {selectedTask && selectedTask === task && (
                    <EditPopUp
                      task={selectedTask}
                      setFilteredTasks={setFilteredTasks}
                      setTaskList={setTaskList}
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
