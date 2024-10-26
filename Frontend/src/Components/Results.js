import React, { useEffect, useState } from 'react'
import Logo from '../Assests/Logo.png';
import { FaSearch} from "react-icons/fa";
import { Link} from 'react-router-dom';
import Loader from './Loader.gif';
import Result from './Result';


const Results = () => {
   const [results,setresults]=useState([]);
   const [query,setquery]=useState("");
   const [entered_query,set_entered_query]=useState("");
   const [loader,setloader]=useState(false);
   const [relavance_obj,setrelavance_obj]=useState({});
   const [relavancelength,setrelavancelength]=useState(0);
   const [relavancechange,setrelavancechange]=useState(false);

   const setrelavance=(obj)=>{
      setrelavance_obj(obj);
      setrelavancelength(Object.keys(relavance_obj).length);
      setrelavancechange(!relavancechange);
   }

  useEffect(()=>{
     const display_results=async ()=>{
      const res = await fetch(
        "http://127.0.0.1:5000/results",
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          }
        })

      const response = await res.json(); 
      
 
      const res1=response['query'];
      setquery(res1);

      const res2=response['details'];
      
       let results_arr=[];
       

      for(let i=1;i<=10;i++)
      {
         results_arr.push(res2[i]);
      }

      setresults(results_arr);
     
     }

     display_results();
  },[]);


  const sendrelavancetobackend=async ()=>{
   await fetch(
      "http://127.0.0.1:5000/relavance",
      {
        method: "post",
        body: JSON.stringify({ relavance_obj:relavance_obj }),
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

  }

  useEffect(()=>{
    if(relavancelength===10)
    {
      sendrelavancetobackend();
    }
    
  },[relavancelength,relavancechange])


  const onChangeHandler=(e)=>{
    set_entered_query(e.target.value);
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
         body: JSON.stringify({ query:entered_query }),
         headers: {
           "Content-Type": "application/json",
         }
       }
     );

     let response = await res.json();
     if(response['k']===1)
     {
       set_entered_query("");
       window.location.reload();
       setloader(false);
     }


   } catch (error) 
   {
     console.error('Error sending request to the backend:', error);
   }
 };
  

  
  return (
    <>
    <div className='flex'>  
       <Link to="/">
         <img src={Logo} alt='' className='mt-[1rem] w-[12rem] h-[8rem]'/>
       </Link>
     
      <div className='flex justify-center mt-[3.5rem] ml-[12rem]'>
        <div className="flex">
            <input type="text" value={entered_query} onKeyDown={handleKeyPress} onChange={onChangeHandler} className="bg-[#221f1f] text-white rounded-full w-[40rem] h-[3.3rem] text-[1.1rem] py-3 px-5 pl-10 focus:outline-none focus:shadow-outline placeholder:text-[1.2rem] placeholder:pl-2" placeholder="Search..."/>
            <div className=' absolute'>
               <FaSearch className='text-[#00EFFE] text-[1.2rem] mt-[1rem] ml-[0.8rem]'/>
            </div>
        </div>
      </div>


      <div className='flex justify-center ml-[15rem] mt-[4rem]'>
         <Link to="/">
            <button className='text-[white] font-semibold bg-[green] w-[4rem] h-[2.2rem] rounded-full hover:bg-[orange]'>Home</button>
         </Link>


         {relavancelength===10? 
          <Link to="/evaluation">
            <button className='text-[white] font-semibold bg-[green] w-[6rem] h-[2.2rem] rounded-full hover:bg-[orange] ml-[2.5rem]'>P-R Curve</button>
          </Link> 
          : 
          <button className='text-[white] font-semibold bg-[red] w-[6rem] h-[2.2rem] rounded-full ml-[2.5rem]' disabled>P-R Curve</button>
        }
      </div>
    </div>

    <div className=''>
      <p className='text-white text-[1.15rem] ml-[24rem] italic'>Top 10 Results for <span className='text-[orange]'>{query}</span></p>
    </div>


    <div className='flex justify-center mb-[5rem]'>
        <div className='h-screen'>

         {results.map((result,index)=>{
            return (
              <Result result={result} key={index+1} index={index+1} setrelavance={setrelavance} relavance_obj={relavance_obj}/>
            )       
         })}
        
        </div>
        
        
       
    </div>



     {loader && 
        <div className='bg-black/75 absolute top-0 pt-[15rem] h-[60rem] w-[90rem]'>

           <div className='flex justify-center mt-[6rem]'>
              <img src={Loader} alt='' className='w-[7rem]'/>  
           </div>

          <div className='flex justify-center mt-[1rem]'>
             <p className='text-white italic'>Diligent Search, Built For You</p>
          </div>

       </div>
       }

       
    
    
    
    </>
  )
}

export default Results