import { useEffect, useState } from "react";
import Navbar from "../views/Navbar";
import { Button } from "../components/ui/button";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FaSort } from "react-icons/fa6";
import Todo from "../components/Todo";
import { Task } from "../types/Task";
import { auth } from "../firebase/firebase.ts";
import { useNavigate } from "react-router-dom";
import { BsList } from "react-icons/bs";
import { BsGrid } from "react-icons/bs";
import { SlCalender } from "react-icons/sl";
import DatePicker from "react-datepicker";
import { CiSearch } from "react-icons/ci";
import OverlayStatusbar from "../components/OverlayStatusbar.tsx";
function Dashboard() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [showDateFilterPick, setShowDateFilterPick] = useState<boolean>(false);
  const [isListView, setIsListView] = useState<boolean>(true);
  const [taskList, setTaskList] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks && storedTasks !== "undefined"
      ? JSON.parse(storedTasks)
      : [];
  });
  const [searchInput, setSearchInput] = useState<string>("");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(taskList);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [checkedTasks, setCheckedTasks] = useState<{ [key: string]: boolean }>(
    {}
  );
  const navigate = useNavigate();

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      const filtered = taskList.filter((task) =>
        task.taskTitle.toLowerCase().includes(searchInput)
      );
      setFilteredTasks(filtered);
      console.log("filtered", filtered);
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [searchInput]);

  async function handleLogout() {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error Logging out: ", error.message);
      } else {
        console.log("An unknown error occurred");
      }
    }
  }

  const statusOfTasks = ["todo", "In Progress", "completed"];

  const openAddTask = () => {
    const addTask = document.querySelector(".addtask");
    if (addTask) {
      addTask.classList.toggle("hidden");
    }
  };

  function handleView() {
    setIsListView(!isListView);
  }

  const handleSearch = (e: any) => {
    const query = e.target.value.toLowerCase();
    setSearchInput(query);
  };

  const handleChecked = (
    e: React.ChangeEvent<HTMLInputElement>,
    taskId: string
  ) => {
    setCheckedTasks((prevCheckedTasks) => {
      const newCheckedTasks = { ...prevCheckedTasks };
      if (e.target.checked) {
        newCheckedTasks[taskId] = true;
      } else {
        delete newCheckedTasks[taskId];
      }
      console.log("newCheckedTasks", newCheckedTasks);
      console.log(
        "newCheckedTasks length : ",
        Object.keys(newCheckedTasks).length
      );

      // Determine if at least one task is checked
      const anyChecked = Object.values(newCheckedTasks).some(
        (checked) => checked
      );
      setIsChecked(anyChecked); // Update visibility state
      console.log("anyChecked", anyChecked);

      return newCheckedTasks;
    });
  };

  return (
    <div className="mx-5 md:mx-10">
      <Navbar />
      <div className="hidden md:flex items-center justify-between py-4">
        <div>
          <div className="flex items-center gap-3">
            <Button
              className="list-btn bg-[#fff] text-[#000] hover:bg-[#7b1984] hover:text-[#fff]  pb-1 border border-black hover:border-[#7b1984] dark:bg-[#7b1984] dark:text-[#fff] flex items-center"
              onClick={handleView}
            >
              <BsList className="list-icon" />
              List
            </Button>
            <Button
              className="bg-[#fff] text-[#000] hover:bg-[#7b1984] hover:text-[#fff]  pb-1 border border-black hover:border-[#7b1984] dark:bg-[#7b1984] dark:text-[#fff] flex items-center"
              onClick={handleView}
            >
              <BsGrid />
              Board
            </Button>
          </div>
        </div>
        <div>
          <Button
            className="logout-btn bg-transparent text-[#000] px-5 py-1 hover:bg-[#7b1984] hover:text-[#fff]   dark:bg-[#7b1984] dark:text-[#fff] flex items-center"
            onClick={handleLogout}
          >
            <RiLogoutBoxLine className="w-6 h-6 mr-2" />
            Logout
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between py-4">
        <div className="w-[100%] flex md:hidden flex-row justify-end">
          <Button
            className="flex md:hidden add-task-btn bg-[#7b1984] text-[#fff] px-5 py-2 rounded-md  items-center"
            onClick={openAddTask}
          >
            Add task
          </Button>
        </div>
        <div className="w-[100%] md:w-[50%] flex flex-row justify-between md:justify-start items-center gap-3">
          <p className="hidden md:block text-[#00000090] dark:text-[#fff]">
            Filter by:
          </p>
          {/* Add filter options here if needed */}
          <select
            id="categories"
            name="categories"
            className="border border-gray-300 rounded-3xl px-4 py-2 dark:bg-[#333] dark:text-[#fff] dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#000] p-5"
            onChange={(e) => {
              setCategoryFilter(e.target.value);
            }}
          >
            <option value="all" defaultChecked>
              Categories
            </option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
          </select>
          <div className="relative flex flex-row justify-center items-center gap-2">
            <Button
              className="heading-bar-para bg-[#fff] rounded-full hover:bg-[#7B1984] hover:text-[#fff] border"
              onClick={() => {
                if (dateFilter) {
                  setDateFilter(null);
                } else {
                  setShowDateFilterPick(!showDateFilterPick);
                }
              }}
            >
              <SlCalender />
              {dateFilter === null ? "Due Date" : dateFilter?.toDateString()}
            </Button>
            {showDateFilterPick && (
              <DatePicker
                selected={dateFilter}
                onChange={(date: Date | null) => {
                  setDateFilter(date);
                  setShowDateFilterPick(!showDateFilterPick);
                  console.log("Date :", dateFilter);
                }}
                inline
              />
            )}
          </div>
        </div>
        <div className="w-[100%] md:w-[50%] flex justify-end md:justify-between items-end md:items-center gap-4">
          <div className=" w-[100%] block relative">
            <input
              type="text"
              placeholder="Search"
              value={searchInput}
              className="w-[100%] search-input border border-gray-300 rounded-3xl px-4 py-2 pl-10 dark:bg-[#333] dark:text-[#fff] dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7b1984]"
              onChange={handleSearch}
            />
            <CiSearch className="absolute left-3 top-3 text-gray-500 dark:text-gray-300" />
          </div>
          <Button
            className="hidden md:flex add-task-btn bg-[#7b1984] text-[#fff] px-5 py-2 rounded-md items-center"
            onClick={openAddTask}
          >
            Add task
          </Button>
        </div>
      </div>
      <div className="flex flex-col mt-5 md:mt-10">
        <div
          className={`${
            isListView ? "flex" : "hidden"
          } flex-row justify-center items-center py-5 border-t-[2px] border-[#0000001A] dark:border-[#f1ecec1a]`}
        >
          <div className="w-[100%] md:w-[30%] flex items-center justify-start">
            <p className="heading-bar-para dark:text-[#fff]">Task name</p>
          </div>
          <div className="w-[20%] hidden  md:flex items-center justify-start gap-[5px]">
            <p className="heading-bar-para pb-[1px] dark:text-[#fff]">Due on</p>
            <FaSort className="fill-[#00000066] w-3 h-3  dark:filter dark:invert" />
          </div>
          <div className="w-[20%] hidden md:flex items-center justify-start">
            <p className="heading-bar-para dark:text-[#fff]">Task Status</p>
          </div>
          <div className="w-[20%] hidden md:flex items-center justify-start">
            <p className="heading-bar-para dark:text-[#fff]">Task Category</p>
          </div>
          <div className="w-[10%] hidden md:flex items-center justify-start relative">
            E/D
          </div>
        </div>
        <div
          className={
            isListView
              ? "flex flex-col"
              : "grid grid-cols-1 lg:grid-cols-3 gap-2"
          }
        >
          {statusOfTasks.map((status, index) => {
            return (
              <>
                <Todo
                  key={index}
                  componentStatus={status}
                  filteredTasks={filteredTasks}
                  setFilteredTasks={setFilteredTasks}
                  taskList={taskList}
                  setTaskList={setTaskList}
                  categoryFilter={categoryFilter}
                  dateFilter={dateFilter}
                  isListView={isListView}
                  handleChecked={handleChecked}
                  checkedTasks={checkedTasks}
                />
                  {isChecked && (
                    <OverlayStatusbar
                      checkedTasks={checkedTasks}
                      setCheckedTasks={setCheckedTasks}
                      isChecked={isChecked}
                      setIsChecked={setIsChecked}
                      taskList={taskList}
                      setTaskList={setTaskList}
                      filteredTasks={filteredTasks}
                      setFilteredTasks={setFilteredTasks}

                    />
                  )}
          
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
