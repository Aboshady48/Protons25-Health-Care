import axios from 'axios';
import {useState , useEffect} from 'react'
import { useParams } from 'react-router-dom'

export const GetTaskById = () => {
    //http://localhost:5000/api/tasks/
    const {id}=useParams();
    const {title ,setTitle}=useState("");
    const {description,setDescription}=useState("");

    useEffect(()=>{
        const fetchData = async()=>{
            try {
            const response = await axios.get(`http://localhost:5000/api/tasks/${id}`,{withCredentials:true})
            setDescription(response.data.title)
            setTitle(response.data.description)
            } catch (error) {
                console.log(error)
                
            }
        }
        fetchData()
    })
    

  return (
    <div> 
          <h1>{title}</h1>
      <p>{description}</p>
    </div>
  )
}
