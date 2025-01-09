import React from 'react';
import { ModeToggle } from '../components/mode-toggle';
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";

function Login() {
  return (
    <div className='w-screen h-full bg-color-[#FFF9F9] '>
      
      <div className='flex flex-row justify-end px-10 py-5'>
        <ModeToggle />
      </div>
      <div className='flex flex-row gap-24 w-screen h-[80vh]'>
        <div className='w-[40%] flex flex-col justify-center items-center'>
        <div className="flex items-center justify-center gap-2">
          <AssignmentOutlinedIcon  className='logo-icon'/>
          <h2 className='login-page-heading'>TASK BUDDY</h2>
        </div>

        </div>
        <div className='w-[60%]'>

        </div>
      </div>
    </div>
  )
}

export default Login
