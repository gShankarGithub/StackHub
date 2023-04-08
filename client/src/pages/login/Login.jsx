import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/authContext';
import './login.scss'

function Login() {

    const [inputs, setInputs] = useState({
        email: "",
        password: ""
      })
      const [err, setErr] = useState(null)

const navigate = useNavigate()

      const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))
      }

    const { login } = useContext(AuthContext);
    const handleLogin = async(e)=>{
        e.preventDefault()
        try {
           await login(inputs);
           navigate("/")
        } catch (err) {
            setErr(err.response.data)
        }
        
    }

    return (
        <div className='login' >
            <div className='card'>
                <div className="left">
                    <h1>Hello World</h1>
                    <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting</p>
                    <span>Do'nt you have an account?</span>
                    <Link to="/register">
                        <button>Register</button>
                    </Link>
                </div>
                <div className="right">
                    <h1>Login</h1>
                    <form>
                        <input placeholder='Email' type="email" name='email' onChange={handleChange}/>
                        <input placeholder='Password' type="password" name='password' onChange={handleChange}/>

                        {err && err}
                        <button onClick={handleLogin}>Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login