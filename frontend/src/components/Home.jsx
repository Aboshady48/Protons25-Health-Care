import {useState} from 'react'
import AddTask from "../components/dailyPlanner/AddTask"
import GetAllTasks from "../components/dailyPlanner/GetAllTasks"


export const Home = () => {
  const [count,setCount] = useState(0)


  return (
    <div>
        <AddTask/>
        <GetAllTasks/>
    </div>
  )
}
