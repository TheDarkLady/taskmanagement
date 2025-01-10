import React from "react";
import { ModeToggle } from '../components/mode-toggle';
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between w-full px-5 py-5">
      <div>
        <div className="flex items-center justify-center gap-2">
          <AssignmentOutlinedIcon />
          <h2>TASK BUDDY</h2>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <ModeToggle />
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h2>Arvind</h2>
      </div>
    </div>
  );
}
