import React, { useState } from 'react';
import { FaThumbsUp,FaThumbsDown } from 'react-icons/fa';

const Result = ({result,index,setrelavance,relavance_obj}) => {
  
    const [showicons,setshowicons]=useState(false);
    const [upicon,setupicon]=useState(false);
    const [downicon,setdownicon]=useState(false);

    const handleLinkClick = (url) => {
        window.open(url, '_blank');
        setshowicons(true);
      };
     
    const onupiconclick=()=>{
        setupicon(true);
        if(downicon)
        {
            setdownicon(false);
        }

        relavance_obj[index]={
            docId : result.docId,
            relavance : 1,     
        }

        const obj=relavance_obj;
        setrelavance(obj);
        setTimeout(()=>{
          setshowicons(false);
        },1000);  
    }
    
    
    const ondowniconclick=()=>{
        setdownicon(true);
        if(upicon)
        {
            setupicon(false);
        }

        relavance_obj[index]={
            docId : result.docId,
            relavance : 0,     
        }
        
        const obj=relavance_obj;
        setrelavance(obj);

        setTimeout(()=>{
          setshowicons(false);
        },1000);  
    }  
  
   
    return (
    <div className='mt-[1.5rem] flex ml-[12rem]' key={result.docId}>
    <div className='flex'>
     {showicons && 
       <>
        {!upicon && <FaThumbsUp onClick={onupiconclick} className='text-[white] mt-2'/>}
        {upicon && <FaThumbsUp onClick={onupiconclick}  className='text-[#7cfc00] mt-2'/>}    

        {!downicon && <FaThumbsDown onClick={ondowniconclick} className='text-[white] ml-3 mr-1 mt-3'/>}
        {downicon && <FaThumbsDown onClick={ondowniconclick} className='text-[indianred] ml-3 mr-1 mt-3'/>}
        </>
     }
    </div>
    
     <div className='ml-[0.5rem]'>
       <p onClick={()=>{handleLinkClick(result.URL)}} className='text-[#00EFFE] text-[1.2rem] underline'>{result.Title}</p> 
       <p className='text-[#7ED957] text-[0.8rem] w-[80%]'>{result.First_20_Words}......</p>
    </div>

    
  </div>
  )
}

export default Result