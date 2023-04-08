import './leftbar.scss'
import Friends from '../../assets/1.png'
import Groups from '../../assets/2.png'
import Market from '../../assets/3.png'
import Watch from '../../assets/4.png'
import Memories from '../../assets/5.png'
import Events from '../../assets/6.png'
import Gaming from '../../assets/7.png'
import Gallery from '../../assets/8.png'
import Videos from '../../assets/9.png'
import Messages from '../../assets/10.png'
import Tutorials from '../../assets/11.png'
import Courses from '../../assets/12.png'
import Fund from '../../assets/13.png'
import { useContext } from 'react'
import { AuthContext } from '../../context/authContext'
import { Link } from 'react-router-dom'

function LeftBar() {

  const { currentUser } = useContext(AuthContext);
  return (
    <div className='leftBar'>
      <div className="container">
        <div className="menu">
          <Link to={`/profile/${currentUser._id}`}>
            <div className="user">
              {currentUser.profilePicture ? <img src={currentUser.profilePicture} alt="" /> : <img src='https://img.freepik.com/free-vector/donald-trump-portrait-with-flat-design_23-2147940891.jpg?w=740&t=st=1679462810~exp=1679463410~hmac=77150068e6adc1badc2d3d53ae1d584ace700334f8903806141045e2a33b3ac7'></img>}
              <span>{currentUser.username}</span>
            </div>
          </Link>
          <div className="item">
            <img src={Messages} alt="" />
            <span>Messages</span>
          </div>
          <div className="item">
            <img src={Friends} alt="" />
            <span>Friends</span>
          </div>
          <div className="item">
            <img src={Groups} alt="" />
            <span>Groups</span>
          </div>
          <div className="item">
            <img src={Market} alt="" />
            <span>Marketplace</span>
          </div>
          <div className="item">
            <img src={Watch} alt="" />
            <span>Watch</span>
          </div>
          <div className="item">
            <img src={Memories} alt="" />
            <span>Memories</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeftBar