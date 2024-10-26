import React, {useState} from 'react';
import Logo from '../Assests/Logo.png';
import { FaSearch} from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import Loader from './Loader.gif';


export const Main = () => {
  const navigate = useNavigate();
  const [query,setquery]=useState("");
  const [loader,setloader]=useState(false);

  const onChangeHandler=(e)=>{
     setquery(e.target.value);
  }
  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
       sendRequestToBackend();
       setloader(true);
    }
  };

  const sendRequestToBackend = async () => {
    try {
      let res = await fetch(
        "http://127.0.0.1:5000/",
        {
          method: "post",
          body: JSON.stringify({ query:query }),
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      let response = await res.json();
      if(response['k']===1)
      {
        setquery("");
        setloader(false);
        navigate('/results');
      }

    } catch (error) 
    {
      console.error('Error sending request to the backend:', error);
    }
  };


  


  

  
  return (
    <div className=''>
      <div className='flex justify-center'>
        <Link to="/">
          <img src={Logo} alt='' className='mt-[4rem]'/>
        </Link>
      </div>

      <div className='flex justify-center mt-[1rem]'>
        <div className="flex">
            <input type="text" value={query} onKeyDown={handleKeyPress} onChange={onChangeHandler} className="bg-[#1b1d1d] text-white rounded-full w-[40rem] h-[3.5rem] text-[1.3rem] py-3 px-5 pl-10 focus:outline-none focus:shadow-outline placeholder:text-[1.3rem] placeholder:pl-2" placeholder="Search..."/>
            <div className='absolute'>
               <FaSearch className='text-[#00EFFE] text-[1.2rem] mt-[1.1rem] ml-[0.8rem]'/>
            </div>
        </div>
    </div>


    
    {loader && 
    <>
       <div className='flex justify-center mt-[6rem]'>
          <img src={Loader} alt='' className='w-[7rem]'/>  
       </div>

       <div className='flex justify-center mt-[1rem]'>
         <p className='text-white italic'>Diligent Search, Built For You</p>
       </div>
    </>}
    



    </div>
  )
}
