import React from "react";
import { useState, useEffect } from "react";
import { ModeToggle } from '../components/mode-toggle';
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { auth , db} from '../firebase/firebase.js';
import {doc , getDoc} from 'firebase/firestore';

export default function Navbar() {

  const [userDetails, setUserDetails] = useState(null);
      const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) =>{
          console.log("User :", user);
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if(docSnap.exists()){
            setUserDetails(docSnap.data())
            console.log("docSanp Data :", docSnap.data())
          }
          else{
            console.log("User is not logged in ")
          }
        })
      }

      useEffect(()=>{
        fetchUserData()
      }, [])
  return (
    <div className="flex items-center justify-between w-full px-5 py-5">
      <div>
        <div className="flex items-center justify-center gap-2">
          <AssignmentOutlinedIcon />
          <h2>TASK BUDDY</h2>
        </div>
      </div>
      {userDetails ? (
        <div className="flex items-center justify-center gap-2">
        <ModeToggle />
        <Avatar>
        <AvatarImage src={userDetails.photo} />
        <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h2>{userDetails.name}</h2>
      </div>

      ):(
        <div className="flex items-center justify-center gap-2">
        <ModeToggle />
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h2>No Users</h2>
      </div>
      )

      }
      {/* <div className="flex items-center justify-center gap-2">
        <ModeToggle />
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h2>Arvind</h2>
      </div> */}
    </div>
  );
}
