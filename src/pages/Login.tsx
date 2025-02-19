import { ModeToggle } from "../components/mode-toggle";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { Button } from "../components/ui/button";
import googleIcon from "../assets/google.svg";
import taskListView from "../assets/Task-list-view3.png"
import { useNavigate } from "react-router-dom";
import { auth , db} from '../firebase/firebase.ts';
import {setDoc, doc} from 'firebase/firestore';
import {GoogleAuthProvider, signInWithPopup} from 'firebase/auth';

function Login() {
  const navigate = useNavigate();
  const handleLogin =  () => {
    
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(async(result) => {
      console.log(result);
      const user = result.user
      if(result.user){
        await setDoc(doc(db, "Users", user.uid),{
          name: user.displayName,
          email: user.email,
          photo: user.photoURL
        })
        navigate('/dashboard')
      }
    })
  };
  return (
   <>
   {/* {userLoggedIn && (<Navigate to={"/dashboard"} replace={true}/>)} */}
   <div className="w-screen h-full bg-color-[#FFF9F9] ">
      <div className="flex flex-row justify-end px-10 py-5">
        <ModeToggle />
      </div>
      <div className="flex flex-row gap-24 w-screen h-[90vh] login-page-desktop-container">
        <div className="w-[40%] flex flex-col justify-center items-center p-24 gap-5">
          <div>
            <div className="flex items-start justify-start gap-2 w-full">
              <AssignmentOutlinedIcon className="logo-icon" />
              <h2 className="login-page-heading">TASK BUDDY</h2>
            </div>
            <div>
              <p className="login-para dark:text-white">
                Streamline your workflow and track progress effortlessly with
                our all-in-one task management app.
              </p>
            </div>
          </div>
          <Button className="w-full bg-[#000] text-white dark:bg-[#7b1984] dark:text-white" onClick={handleLogin}>
            <img src={googleIcon} alt="Google Icon" className="w-6 h-6 mr-2" />
            Sign in with Google
          </Button>
        </div>
        <div className="login-second-part w-[60%] ">
          <img src={taskListView} alt="Task List View" className="w-[80%] h-full " />
        </div>
      </div>
      <div className="flex flex-col h-[90vh] justify-center items-center login-page-mobile-container">

        {/* Mobile Version */}
      <div className="w-full flex flex-col justify-center items-center p-10 gap-5">
          <div>
            <div className="flex items-start justify-start gap-2 w-full">
              <AssignmentOutlinedIcon className="logo-icon" />
              <h2 className="login-page-heading">TASK BUDDY</h2>
            </div>
            <div>
              <p className="login-para dark:text-white">
                Streamline your workflow and track progress effortlessly with
                our all-in-one task management app.
              </p>
            </div>
          </div>
          <Button className="w-full bg-[#000] text-white dark:bg-[#7b1984] dark:text-white" onClick={handleLogin}>
            <img src={googleIcon} alt="Google Icon" className="w-6 h-6 mr-2" />
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
   </>
  );
}

export default Login;
