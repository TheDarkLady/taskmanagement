import { useState, useEffect } from "react";
import { ModeToggle } from '../components/mode-toggle';
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { auth , db} from '../firebase/firebase.ts';
import {doc , DocumentData, getDoc} from 'firebase/firestore';

export default function Navbar() {

  const [userDetails, setUserDetails] = useState<DocumentData | null>(null);
      const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user:DocumentData | null) =>{
          console.log("User :", user);
          const docRef = doc(db, "Users", user?.uid);
          const docSnap = await getDoc(docRef);
          if(docSnap.exists()){
            setUserDetails(docSnap.data())
            console.log("User Details :", user)
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
        <h2 className="hidden md:block ">{userDetails.name}</h2>
      </div>

      ):(
        <div className="flex items-center justify-center gap-2">
        <ModeToggle />
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>L</AvatarFallback>
        </Avatar>
        <h2>Loading ...</h2>
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
