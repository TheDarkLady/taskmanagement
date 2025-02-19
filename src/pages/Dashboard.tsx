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
import {auth, db} from "../firebase/firebase.js"
import { useNavigate } from "react-router-dom";
import { BsList } from "react-icons/bs";
import { BsGrid } from "react-icons/bs";
import { SlCalender } from "react-icons/sl";
import DatePicker from "react-datepicker";

function Dashboard() {

  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [showDateFilterPick, setShowDateFilterPick] = useState<boolean>(false);
  const [isListView, setIsListView] = useState<boolean>(true)
  const [taskList, setTaskList] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
    const navigate = useNavigate();
    async function handleLogout() {
      try {
        await auth.signOut();
        navigate("/")
        
        
      } catch (error) {
        console.log("Error Logging out : ", error.message);
      }
    }
    useEffect(()=>{
    },[taskList])

    
    const statusOfTasks = ["todo", "In Progress", "completed"];

    const openAddTask = () => {
      const addTask = document.querySelector(".addtask");
      if (addTask) {
        addTask.classList.toggle("hidden");
      }
    };

    function handleView(){
      setIsListView(!isListView)
    }
  return (
    <div className="mx-5 md:mx-10">
      <Navbar />
      <div className="hidden md:flex items-center justify-between py-4 px-5">
        <div>
          <div className="flex items-center gap-2">
            <Button className="list-btn bg-[#fff] text-[#000] hover:bg-[#7b1984] hover:text-[#fff]  pb-1 dark:bg-[#7b1984] dark:text-[#fff] flex items-center" onClick={handleView}>
              <BsList className="list-icon"/>
              List
            </Button>
            <Button className="bg-[#fff] text-[#000] hover:bg-[#7b1984] hover:text-[#fff]  pb-1 dark:bg-[#7b1984] dark:text-[#fff] flex items-center" onClick={handleView}>
            <BsGrid />
              Board
            </Button>
          </div>
        </div>
        <div>
          <Button className="logout-btn bg-transparent text-[#000] px-5 py-1 hover:bg-[#7b1984] hover:text-[#fff]  dark:bg-[#7b1984] dark:text-[#fff] flex items-center" onClick={handleLogout}>
            <RiLogoutBoxLine className="w-6 h-6 mr-2" />
            Logout
          </Button>
        </div>
      </div>
      <div className="flex flex-col-reverse md:flex-row gap-3 items-center justify-between py-4 px-5">
        <div className="flex items-center gap-3">
          <p className="text-[#00000090] dark:text-[#fff]">Filter by:</p>
          {/* Add filter options here if needed */}
          <select
            id="categories"
            name="categories"
            className="border border-gray-300 rounded-3xl px-4 py-2 dark:bg-[#333] dark:text-[#fff] dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#000] p-5"
            onChange={(e) => {
              setCategoryFilter(e.target.value)
            }}
          >
            <option value="all" defaultChecked>
              Categories
            </option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
          </select>
          <div className="flex flex-col justify-center items-center gap-2">
          <Button 
            className="heading-bar-para bg-[#fff] rounded-full hover:bg-[#7B1984] hover:text-[#fff] border" 
            onClick={() => {
              if(dateFilter){
                setDateFilter(null)
              }
              else{
                setShowDateFilterPick(!showDateFilterPick)
              }
            }}>
            <SlCalender />
            {dateFilter === null ? "Due Date" : dateFilter?.toDateString()}
          </Button>
          {showDateFilterPick && (
            <DatePicker
              selected={dateFilter}
              onChange={(date: Date) => {
              setDateFilter(date);
              setShowDateFilterPick(!showDateFilterPick);
              console.log("Date :", dateFilter)
              }}
              inline
            />
          )}
          </div>
        </div>
        <div className="w-[100%] md:w-auto flex justify-end md:justify-between items-end md:items-center gap-4">
          {/* <div className="hidden md:block relative">
            <input
              type="text"
              placeholder="Search"
              className="search-input border border-gray-300 rounded-3xl px-4 py-2 pl-10 dark:bg-[#333] dark:text-[#fff] dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7b1984]"
            />
            <CiSearch className="absolute left-3 top-3 text-gray-500 dark:text-gray-300" />
          </div> */}
          <Button className="add-task-btn bg-[#7b1984] text-[#fff] px-5 py-2 rounded-md flex items-center" onClick={openAddTask}>
            Add task
          </Button>
        </div>
      </div>
      <div className="flex flex-col mt-10">
        <div className={`${isListView ? "flex" : "hidden"} flex-row justify-center items-center py-5 border-t-[2px] border-[#0000001A] dark:border-[#f1ecec1a]`}>
          <div className="w-[100%] md:w-[30%] flex items-center justify-start">
            <p  className="heading-bar-para dark:text-[#fff]">Task name</p>
          </div>
          <div className="w-[20%] hidden  md:flex items-center justify-start gap-[5px]">
            <p className="heading-bar-para pb-[1px] dark:text-[#fff]">Due on</p>
            <FaSort  className="fill-[#00000066] w-3 h-3  dark:filter dark:invert"/>
          </div>
          <div className="w-[20%] hidden md:flex items-center justify-start">
            <p className="heading-bar-para dark:text-[#fff]">Task Status</p>
          </div>
          <div className="w-[20%] hidden md:flex items-center justify-start">
            <p className="heading-bar-para dark:text-[#fff]">Task Category</p>
          </div>
          <div className="w-[10%] hidden md:flex items-center justify-start relative">E/D</div>
        </div>
        <div className={isListView ? "flex flex-col" : "grid grid-cols-1 lg:grid-cols-3 gap-2"}>
        {
          statusOfTasks.map((status, index) => {
            return (
                <Todo key={index} componentStatus={status}  taskList={taskList} setTaskList={setTaskList}  categoryFilter={categoryFilter} dateFilter={dateFilter} isListView={isListView}/>
              )
            }
          )}
        </div>
        
      </div>
    </div>
  );
}

export default Dashboard;
