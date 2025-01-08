import React from 'react'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../components/ui/avatar"

export default function Navbar() {
    return (
        <div className='flex items-center justify-between w-full p-2'>
            <div>
                <div className='flex items-center justify-center gap-2'>
                    <AssignmentOutlinedIcon />
                    <h2>TASK BUDDY</h2>
                </div>
            </div>
            <div className='flex items-center justify-center gap-2'>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h2>Arvind</h2>
            </div>
        </div>
    )
}
