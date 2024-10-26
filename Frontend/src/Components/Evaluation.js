import React, { useState } from 'react'
import Logo from '../Assests/Logo.png';
import { Link} from 'react-router-dom';
import Table from './Table';
import PRCurve from './PRCurve';
import { useEffect } from 'react';
// import Loader from './Loader.gif';

const Evaluation = () => {
   const [evalaution_results,set_evalaution_results]=useState([]);
    useEffect(()=>{
        const display_results=async ()=>{
         const res = await fetch(
           "http://127.0.0.1:5000/evaluation",
           {
             method: "get",
             headers: {
               "Content-Type": "application/json",
             }
           })
   
         const response = await res.json(); 
         
        set_evalaution_results(response);
         
        
        }
   
        display_results();
     },[]);
  
  
  return (<>
    <div className='flex justify-between'>  
    <Link to="/">
      <img src={Logo} alt='' className='mt-[1rem] w-[12rem] h-[8rem]'/>
    </Link>
  
    <div className='flex justify-center ml-[15rem] mt-[3.5rem] mr-[5rem]'>
         <Link to="/">
            <button className='text-[white] font-semibold bg-[green] w-[4rem] h-[2.2rem] rounded-full hover:bg-[orange]'>Home</button>
         </Link>


         <Link to="/evaluation">
            <button className='text-[white] font-semibold bg-[green] w-[6rem] h-[2.2rem] rounded-full hover:bg-[orange] ml-[2.5rem]'>P-R Curve</button>
         </Link>
      </div>
   </div>


   <div className='flex justify-between'>
      <div>
        <Table data={evalaution_results}/>
      </div>


      <div className='mr-[2rem]'>
        <PRCurve data={evalaution_results}/>
      </div>
   </div>
   </>
  )
}

export default Evaluation