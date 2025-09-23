import AddTask from "../components/dailyPlanner/AddTask"
import GetAllTasks from "../components/dailyPlanner/GetAllTasks"
import { AddYourMood } from "./moodTracker/AddYourMood"
import { ShowYourMoods } from "./moodTracker/ShowYourMoods"

export const Home = () => {
  return (
    <div>
        <AddTask/>
        <GetAllTasks/>
        <AddYourMood/>
        <ShowYourMoods/>
    </div>
  )
}