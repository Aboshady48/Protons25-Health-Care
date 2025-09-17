import {useState} from 'react'

export const Home = () => {
  const [count,setCount] = useState(0)


  return (
    <div>
        <h1>Home</h1>
        <p>This is the home page</p>
        <button onClick={()=>setCount(count+1)}>count +</button>
        
        but
        <h1>{count}</h1>
    </div>
  )
}
