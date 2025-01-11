import React from "react";
import { FaAngleUp } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";

function Todo() {
  function openAddTask() {
    const addTask = document.querySelector(".addtask");
    addTask.classList.toggle("hidden");
  }
  return (
    <>
      <div className="w-full bg-[#f1f1f1] rounded-lg">
        <div className="w-full bg-[#FAC3FF] py-5 px-5 flex items-center justify-between rounded-t-xl">
          <p className="text-[#000] font-semibold text-base">Todo (3)</p>
          <FaAngleUp className="fill-[#3E0344]" />
        </div>
        <div className="w-full py-6 px-10 flex flex-row justify-start items-center gap-2 cursor-pointer " onClick={openAddTask}>
          <GoPlus className="fill-[#7B1984]" />
          <p className="text-[#000000CC] font-mulish font-sm font-semibold uppercase">
            Add Task
          </p>
        </div>
        <div className="flex flex-col addtask hidden">
          <div className="flex flex-row justify-center items-center py-5 border-t-[2px] border-[#0000001A] dark:border-[#f1ecec1a]">
            <div className="w-[30%] flex items-center justify-start">
              <p className="heading-bar-para dark:text-[#fff]">Task name</p>
            </div>
            <div className="w-[20%] flex items-center justify-start gap-[5px]">
              <p className="heading-bar-para pb-[1px] dark:text-[#fff]">
                Due on
              </p>
              <GoPlus className="fill-[#00000066] w-3 h-3  dark:filter dark:invert" />
            </div>
            <div className="w-[20%] flex items-center justify-start">
              <p className="heading-bar-para dark:text-[#fff]">Task Status</p>
            </div>
            <div className="w-[20%] flex items-center justify-start">
              <p className="heading-bar-para dark:text-[#fff]">Task Category</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Todo;
