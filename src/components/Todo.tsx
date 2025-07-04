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
import { useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase"; // adjust path if needed
import { useAuth } from "../firebase/AuthContext";

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
  handleChecked: (
    e: React.ChangeEvent<HTMLInputElement>,
    taskId: string
  ) => void;
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
  const datePickerRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  const showToast = (
    type: "success" | "error" | "info" | "warn",
    message: string
  ) => {
    toast[type](message, {
      position: "top-center",
      autoClose: 3000, // Close after 3 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // useEffect(() => {
  //   const storedTasks = localStorage.getItem("tasks");
  //   if (storedTasks) {
  //     setTaskList(JSON.parse(storedTasks));
  //   }
  // }, []);

  // Save tasks to local storage whenever taskList changes
  // useEffect(() => {
  //   localStorage.setItem("tasks", JSON.stringify(taskList));
  // }, [taskList]);

  // storing tasks in firestore

  useEffect(() => {
    if (!currentUser?.uid) return;

    const q = collection(db, "Users", currentUser.uid, "tasks");

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userTasks = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          ...(data as Task),
          selectedDate: data.selectedDate?.toDate?.() || null, // 🔥 key fix
          id: doc.id,
        };
      });

      setTaskList(userTasks);
      setFilteredTasks(userTasks);
    });

    return () => unsubscribe();
  }, [setTaskList, setFilteredTasks, currentUser]);

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

  // removing datepicker on clicking outsite

  useEffect(() => {
    const handleClickOutsideDatePicker = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePick(false); // Close the date picker
      }
    };

    if (showDatePick) {
      document.addEventListener("mousedown", handleClickOutsideDatePicker);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDatePicker);
    };
  }, [showDatePick]);

  // removing status dropdown on clicking outside

  useEffect(() => {
    const handleClickOutsideStatusDropdown = (event: MouseEvent) => {
      if (
        statusRef.current &&
        !statusRef.current.contains(event.target as Node)
      ) {
        setShowStatus(false);
      }

      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setShowCategory(false);
      }
    };

    if (showStatus || showCategory || dropDownOpen) {
      document.addEventListener("mousedown", handleClickOutsideStatusDropdown);
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutsideStatusDropdown
      );
    };
  }, [showStatus, showCategory, dropDownOpen]);

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    taskId: string
  ) => {
    event.dataTransfer.setData("text/plain", taskId);
  };

  const handleDrop = async (
    event: React.DragEvent<HTMLDivElement>,
    newStatus: string
  ) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/plain");
    // setTaskList((prevTasks) =>
    //   prevTasks.map((task) =>
    //     task.id === taskId ? { ...task, status: newStatus } : task
    //   )
    // );
    // setFilteredTasks((prevTasks) =>
    //   prevTasks.map((task) =>
    //     task.id === taskId ? { ...task, status: newStatus } : task
    //   )
    // );

    if (!taskId || !currentUser?.uid) return;

    try {
      const taskRef = doc(db, "Users", currentUser.uid, "tasks", taskId);
      await updateDoc(taskRef, { status: newStatus });
      showToast("info", "Task status updated");
    } catch (error) {
      console.error("Failed to update status:", error);
      showToast("error", "Could not update status.");
    }
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

  const handleAddTask = async () => {
    if (!taskTitle.trim()) {
      alert("Task Title cannot be empty");
      return;
    }

    if (!currentUser || !currentUser.uid) {
      showToast("error", "User not logged in.");
      return;
    }

    const newTask = {
      taskTitle,
      selectedDate,
      status: status || "todo",
      category: category || "general",
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, "Users", currentUser.uid, "tasks"), newTask);
      showToast("success", "Task added successfully!");
      resetTaskInputs();
      openAddTask();
    } catch (error) {
      showToast("error", "Failed to add task");
      console.error("Firestore Error:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!currentUser || !currentUser.uid) {
      showToast("error", "User not logged in.");
      return;
    }

    try {
      console.log(
        "Deleting path: ",
        `Users/${currentUser.uid}/tasks/${taskId}`
      );
      await deleteDoc(doc(db, "Users", currentUser.uid, "tasks", taskId));
      showToast("error", "Task deleted");
    } catch (error) {
      console.error("Delete error:", error);
      showToast("error", "Failed to delete task.");
    }
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
    <>
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
                    (categoryFilter === "all" ||
                      task.category === categoryFilter)
                ).length
              : taskList.filter(
                  (task) =>
                    task.status === componentStatus &&
                    (categoryFilter === "all" ||
                      task.category === categoryFilter)
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
              isListView ? "flex-col lg:flex-row" : "flex-col gap-5"
            } flex  justify-center items-center py-5 border-t-[2px] border-[#0000001A] gap-2 md:gap-5`}
          >
            <div className="w-full lg:w-[30%] flex flex-col gap-5 items-center justify-start px-5">
              <input
                type="text"
                placeholder="Task Title"
                className="w-full py-3 px-2 bg-transparent border border-[#0000001A] rounded-lg text-[#000]"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
              <div
                className={`hidden lg:${
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
            <div className="w-auto lg:w-[20%] flex flex-col lg:flex-row items-center justify-start gap-[5px]">
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
                <div
                  className="relative lg:absolute z-100 "
                  ref={datePickerRef}
                >
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => {
                      setSelectedDate(date);
                      setShowDatePick(!showDatePick);
                    }}
                    inline
                  />
                </div>
              )}
            </div>
            <div className="w-auto lg:w-[20%] flex flex-col lg:flex-row items-center justify-start relative">
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
                <div
                  className="relative lg:absolute top-1 lg:top-12 left-0 w-[150px] bg-white border rounded shadow-md z-10"
                  ref={statusRef}
                >
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
            <div className="w-auto lg:w-[20%] flex flex-col lg:flex-row items-center justify-start relative">
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
                <div
                  className="relative lg:absolute top-1 lg:top-12 left-0 w-[150px] bg-white border rounded shadow-md z-10"
                  ref={categoryRef}
                >
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
                isListView ? "lg:hidden" : "lg:flex"
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
            {/* <div className="w-[10%] flex items-center justify-start relative"></div> */}
          </div>
        </div>

        {filteredTasks
          .filter((allTask) => {
            // console.log("Date filter :", dateFilter);
            // console.log("Task selected Date :", allTask.selectedDate);

            if (allTask.status !== componentStatus) return false;

            if (
              categoryFilter !== "all" &&
              allTask.category !== categoryFilter
            ) {
              return false;
            }

            if (
              dateFilter &&
              allTask.selectedDate &&
              dateFilter.getDate() ===
                new Date(allTask.selectedDate).getDate() &&
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
                      isListView
                        ? "md:w-[30%] items-center justify-start"
                        : "md:w-[100%] items-center justify-center"
                    } flex flex-row gap-5 `}
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
                      isListView
                        ? "md:w-[20%] items-start justify-start"
                        : "md:w-[100%] items-center justify-center"
                    } hidden md:flex flex-col  gap-[5px]`}
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
                        : "hidden "
                    } `}
                  >
                    <p className="text-[#000]">{task.status}</p>
                  </div>
                  <div
                    className={`w-auto ${
                      isListView
                        ? "md:w-[20%] items-start justify-start"
                        : "md:w-[100%] items-center justify-center"
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
    </>
  );
};

export default Todo;
