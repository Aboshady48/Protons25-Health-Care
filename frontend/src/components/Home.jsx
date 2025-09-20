import {useState} from 'react'
import AddTask from "../components/dailyPlanner/AddTask"
import GetAllTasks from "../components/dailyPlanner/GetAllTasks"
import EditTask from "../components/dailyPlanner/EditTask"

export const Home = () => {
  const [count,setCount] = useState(0)


  return (
    <div>
        <AddTask/>
        <GetAllTasks/>
    </div>
  )
}
