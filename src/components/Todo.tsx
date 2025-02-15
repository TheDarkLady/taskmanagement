import React, { useEffect, useMemo, useState, useRef } from "react";
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

interface Props {
  componentStatus: string;
  taskList: Task[];
  setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
}

const Todo: React.FC<Props> = ({ componentStatus, taskList, setTaskList }) => {
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
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

  return (
    <div className="w-full bg-[#f1f1f1] rounded-lg mb-10" onDragOver={handleDragOver} onDrop={(event) => handleDrop(event, componentStatus)}>
      <div className={`w-full py-5 px-5 flex items-center justify-between rounded-t-xl ${
          componentStatus === "In Progress"
            ? "bg-[#85D9F1]"
            : componentStatus === "completed"
            ? "bg-[#CEFFCC]"
            : "bg-[#FAC3FF]"
        }`}
      >
        <p className="text-[#000] font-semibold text-base">
          {componentStatus} ({taskList.filter((task) => task.status === componentStatus).length})
        </p>
        <FaAngleUp className="fill-[#3E0344]" />
      </div>
      {taskList
        .filter((task) => task.status === componentStatus)
        .map((task) => (
          <div key={task.id} draggable onDragStart={(event) => handleDragStart(event, task.id)} className="border-t-[2px] border-[#0000001A] py-5 flex justify-between">
            <p className="text-[#000]">{task.taskTitle}</p>
            <p className="text-[#000]">{task.selectedDate ? new Date(task.selectedDate).toDateString() : "No Date"}</p>
            <p className="text-[#000]">{task.category}</p>
            <BiDotsHorizontalRounded className="fill-[#000] cursor-pointer" onClick={() => setSelectedTask(task)} />
            {selectedTask && selectedTask.id === task.id && (
              <EditPopUp task={selectedTask} setTaskList={setTaskList} handleClose={() => setSelectedTask(null)} />
            )}
          </div>
        ))}
    </div>
  );
};

export default Todo;
