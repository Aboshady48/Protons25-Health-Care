import eira from "../../../assets/eira_logo.jpeg"

export default function Navbar(){
    return (
    <nav className="nav">
        <img src={eira} alt="Eira Logo" style={{width:"120px",height:"170",objectFit:"contain",display:"block"}}/>
        <ul>
            <li>
                <a href="/About">About</a> 
            </li> 
            <li>    
                <a href="/Community">Community</a>
            </li> 
            <li>   
                <a href="/Streak">Streak</a>
            </li>
            <li>    
                <a href="/Blog">Blog</a>
            </li>
            <li>
                <a href="/Bot">Bot</a>             
            </li>  
        </ul>
    </nav>
    )
}
