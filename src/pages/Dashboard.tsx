import React, { useEffect, useState } from "react";
import Navbar from "../views/Navbar";
import { Button } from "../components/ui/button";
import listIcon from "../assets/list-icon.svg";
import boardIcon from "../assets/board-icon.svg";
import { RiLogoutBoxLine } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { FaSort } from "react-icons/fa6";
import Todo from "../components/Todo";
import { Task } from "../types/Task";

function Dashboard() {

    const [taskList, setTaskList] = useState<Task[]>([]);

    useEffect(()=>{
    },[taskList])

    const statusOfTasks = ["todo", "In Progress", "completed"];

  return (
    <div className="mx-10">
      <Navbar />
      <div className="flex items-center justify-between py-4 px-5">
        <div>
          <div className="flex items-center gap-2">
            <Button className="bg-[#fff] text-[#000] pb-1 dark:bg-[#7b1984] dark:text-[#fff] flex items-center">
              <img
                src={listIcon}
                alt="List Icon"
                className="w-6 h-6 mr-2 dark:filter dark:invert"
              />
              List
            </Button>
            <Button className="bg-[#fff] text-[#000] pb-1 dark:bg-[#7b1984] dark:text-[#fff] flex items-center">
              <img
                src={boardIcon}
                alt="Board Icon"
                className="w-6 h-6 mr-2 dark:filter dark:invert"
              />
              Board
            </Button>
          </div>
        </div>
        <div>
          <Button className="logout-btn bg-[#fff] text-[#000] px-5 py-1 dark:bg-[#7b1984] dark:text-[#7c7474] flex items-center">
            <RiLogoutBoxLine className="w-6 h-6 mr-2" />
            Logout
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between py-4 px-5">
        <div className="flex items-center gap-3">
          <p className="text-[#00000090] dark:text-[#fff]">Filter by:</p>
          {/* Add filter options here if needed */}
          <select
            id="categories"
            name="categories"
            className="border border-gray-300 rounded-3xl px-4 py-2 dark:bg-[#333] dark:text-[#fff] dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#000] p-5"
          >
            <option value="all" defaultChecked>
              Categories
            </option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
          </select>
          <select
            id="categories"
            name="categories"
            className="border border-gray-300 rounded-3xl px-4 py-2 dark:bg-[#333] dark:text-[#fff] dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#000] p-5"
          >
            <option value="all" defaultChecked>
              Due Date
            </option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="search-input border border-gray-300 rounded-3xl px-4 py-2 pl-10 dark:bg-[#333] dark:text-[#fff] dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7b1984]"
            />
            <CiSearch className="absolute left-3 top-3 text-gray-500 dark:text-gray-300" />
          </div>
          <Button className="add-task-btn bg-[#7b1984] text-[#fff] px-5 py-2 rounded-md flex items-center">
            Add task
          </Button>
        </div>
      </div>
      <div className="flex flex-col mt-10">
        <div className="flex flex-row justify-center items-center py-5 border-t-[2px] border-[#0000001A] dark:border-[#f1ecec1a]">
          <div className="w-[30%] flex items-center justify-start">
            <p  className="heading-bar-para dark:text-[#fff]">Task name</p>
          </div>
          <div className="w-[20%] flex items-center justify-start gap-[5px]">
            <p className="heading-bar-para pb-[1px] dark:text-[#fff]">Due on</p>
            <FaSort  className="fill-[#00000066] w-3 h-3  dark:filter dark:invert"/>
          </div>
          <div className="w-[20%] flex items-center justify-start">
            <p className="heading-bar-para dark:text-[#fff]">Task Status</p>
          </div>
          <div className="w-[20%] flex items-center justify-start">
            <p className="heading-bar-para dark:text-[#fff]">Task Category</p>
          </div>
          <div className="w-[10%] flex items-center justify-start relative">E/D</div>
        </div>
        {
          statusOfTasks.map((status, index) => {
            return (
              <Todo key={index} componentStatus={status}  taskList={taskList} setTaskList={setTaskList} />
            )
          }
        )}
        
      </div>
    </div>
  );
}

export default Dashboard;
