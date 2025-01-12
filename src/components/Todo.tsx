import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { FaAngleUp } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";
import { PiArrowBendDownLeftFill } from "react-icons/pi";
import { SlCalender } from "react-icons/sl";

function Todo() {
  const [status, setStatus] = useState(false);
  const [category, setCategory] = useState(false)

  function openAddTask() {
    const addTask = document.querySelector(".addtask");
    addTask.classList.toggle("hidden");
  }

  function handleStatus() {
    setStatus(!status);
  }

  function handleCategory(){
    setCategory(!category)
  }
  return (
    <>
      <div className="w-full bg-[#f1f1f1] rounded-lg">
        <div className="w-full bg-[#FAC3FF] py-5 px-5 flex items-center justify-between rounded-t-xl">
          <p className="text-[#000] font-semibold text-base">Todo (3)</p>
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
          <div className="flex flex-row justify-center items-center py-5 border-t-[2px] border-[#0000001A] dark:border-[#f1ecec1a]">
            <div className="w-[30%] flex flex-col gap-5 items-center justify-start">
              <input
                type="text"
                placeholder="Add Task"
                className="py px-2 border rounded"
              />
              <div className="flex flex-row justify-center items-center gap-5">
                <Button className="add-task-btn text-[#fff] px-2 py-2 rounded-md flex items-center">
                  Add
                  <PiArrowBendDownLeftFill />
                </Button>
                <Button className="bg-[#fff] text-[#000] px-2 py-2 rounded-md flex items-center">
                  Cancel
                </Button>
              </div>
            </div>
            <div className="w-[20%] flex items-center justify-start gap-[5px]">
              <Button className="heading-bar-para bg-[#fff] rounded-full hover:bg-[#fff] dark:text-[#fff]">
                <SlCalender />
                Add Date
              </Button>
            </div>
            <div className="w-[20%] flex items-center justify-start relative">
              <Button
                className="heading-bar-para bg-transparent border rounded-full hover:bg-[#fff] dark:text-[#fff]"
                onClick={handleStatus}
              >
                <GoPlus className="fill-[#00000066] w-3 h-3 dark:filter dark:invert" />
              </Button>
              {status && (
                <div className="absolute top-12 left-0 w-[150px] bg-white border rounded shadow-md z-10">
                  <ul className="flex flex-col">
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => console.log("Todo")}
                    >
                      Todo
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => console.log("In-progress")}
                    >
                      In-progress
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => console.log("Completed")}
                    >
                      Completed
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="w-[20%] flex items-center justify-start relative">
              <Button
                className="heading-bar-para bg-transparent border rounded-full hover:bg-[#fff] dark:text-[#fff]"
                onClick={handleCategory}
              >
                <GoPlus className="fill-[#00000066] w-3 h-3 dark:filter dark:invert" />
              </Button>
              {category && (
                <div className="absolute top-12 left-0 w-[150px] bg-white border rounded shadow-md z-10">
                  <ul className="flex flex-col">
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => console.log("work")}
                    >
                      Work
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => console.log("personal")}
                    >
                      Personal
                    </li>
                    
                  </ul>
                </div>
              )}
            </div>
              
            </div>
          </div>
        </div>
    </>
  );
}

export default Todo;
