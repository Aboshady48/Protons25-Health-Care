import AddTask from "../components/dailyPlanner/AddTask"
import GetAllTasks from "../components/dailyPlanner/GetAllTasks"


export const Home = () => {
  return (
    <div>
        <AddTask/>
        <GetAllTasks/>
    </div>
  )
}