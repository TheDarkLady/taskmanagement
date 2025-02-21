import React from "react";
import { IoClose } from "react-icons/io5";
import { Task } from "../types/Task";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

interface Props {
  checkedTasks?: { [key: string]: boolean };
  setCheckedTasks: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
  taskList: Task[];
  setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
  filteredTasks: Task[];
  setFilteredTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const OverlayStatusbar: React.FC<Props> = ({
  checkedTasks = {},
  setCheckedTasks,
  setIsChecked,
  taskList,
  setTaskList,
  filteredTasks,
  setFilteredTasks,
}) => {
  const checkedTasksCount = Object.keys(checkedTasks).length;

  const clearCheckedTasks = () => {
    setCheckedTasks({});
    setIsChecked(false);
  };
  const handleDeleteTask = () => {
    const checkedTaskIds = Object.keys(checkedTasks);
    console.log("checkedTaskIds", checkedTaskIds);

    const newTaskList = taskList.filter(
      (task) => !checkedTaskIds.includes(task.id)
    );
    setTaskList(newTaskList);
    console.log("newTaskList", newTaskList);

    const newFilteredTaskList = filteredTasks.filter(
      (task) => !checkedTaskIds.includes(task.id)
    );
    setFilteredTasks(newFilteredTaskList);
    console.log("newFilteredTaskList", newFilteredTaskList);
    setCheckedTasks({});
    setIsChecked(false);
  };

  const handleChange = (key: keyof Task, value: any) => {
    setTaskList((prev) =>
      prev.map((task) =>
        checkedTasks[task.id] ? { ...task, [key]: value } : task
      )
    );

    setFilteredTasks((prev) =>
      prev.map((task) =>
        checkedTasks[task.id] ? { ...task, [key]: value } : task
      )
    );
    setCheckedTasks({});
    setIsChecked(false);
  };

  return (
    <div className="fixed flex flex-row nowrap justify-between bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-[#1a1c20] border border-[#1a1c20] dark:border-[#fff] rounded-3xl gap-5">
      <div>
        <button className="flex flex-row justify-center items-center !text-[#fff] !text-[12px] md:!text-[16px] whitespace-nowrap gap-2 border border-[#fff] px-2 py-2 rounded-3xl">
          <p>
            {checkedTasksCount === 1
              ? `${checkedTasksCount} Task selected`
              : `${checkedTasksCount} Tasks Selected`}
          </p>
          {/* ✅ Moving onClick to just the close icon */}
          <span
            className="text-[15px] cursor-pointer"
            onClick={clearCheckedTasks}
          >
            <IoClose />
          </span>
        </button>
      </div>
      <div className="flex flex-row justify-center flex-nowrap gap-2">
        <Select onValueChange={(value) => handleChange("status", value)}>
          <SelectTrigger className="bg-[#1a1c20] text-[#fff] text-[12px] md:text-[16px] px-4 py-2 rounded-3xl gap-2 border border-[#fff]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1c20] text-[#fff] text-[12px] md:text-[16px]">
            <SelectItem value="todo">Todo</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <button onClick={handleDeleteTask}>
          <p className="!text-[#E13838] !text-[12px] md:!text-[16px] whitespace-nowrap gap-2 bg-[#e1383824] border border-[#E13838] px-4 py-2 rounded-3xl">
            Delete
          </p>
        </button>
      </div>
    </div>
  );
};

export default OverlayStatusbar;
