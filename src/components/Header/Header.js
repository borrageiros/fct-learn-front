import './Header.css';
import { useNavigate } from "react-router-dom";

function Header({user, setUser, children}) {
    const navigate = useNavigate();

    const logOut = async (event) => {
        event.preventDefault();
        try {
            await fetch('http://localhost:3000/users/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "_id": user._id,
                    "auth_token": user.auth_token
                  })
            });
        } catch (error) {
            console.log(error);
        }
        setUser("");
        navigate("/login");
    }

    // RENDER USER OT NOT-USER
    if (user){
        return (
            <>
            <div className='Header'>
                <h1 className='title'>Learn</h1>
                <nav>
                    <ul>
                        <li><a href="/profile">{user.username}</a></li>
                        <li><button onClick={logOut}>LogOut</button></li>
                    </ul>
                </nav>
            </div>
            {children}
            </>
        );
    }else{
        return (
            <>
            <div className='Header'>
                <h1 className='title'>Learn</h1>
            </div>
            {children}
            </>
        );
    }

}

export default Header;