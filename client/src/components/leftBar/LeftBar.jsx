import "./leftbar.scss";
import Friends from "../../assets/1.png";
import Groups from "../../assets/2.png";
import Market from "../../assets/3.png";
import Watch from "../../assets/4.png";
import Memories from "../../assets/5.png";
import Events from "../../assets/6.png";
import Gaming from "../../assets/7.png";
import Gallery from "../../assets/8.png";
import Videos from "../../assets/9.png";
import Messages from "../../assets/10.png";
import Tutorials from "../../assets/11.png";
import Courses from "../../assets/12.png";
import Fund from "../../assets/13.png";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Link,useNavigate } from "react-router-dom";

import * as React from "react";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import { makeRequest } from "../../axios";

function LeftBar() {
  const { currentUser } = useContext(AuthContext);
  const [allUsers, setAllUsers] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  React.useEffect(() => {
    const getAllUsers = async () => {
      makeRequest.get(`users/friends/${currentUser._id}`).then((users) => {
        setAllUsers(users.data);
      }, []);
    };
    getAllUsers();
    console.log(allUsers);
  }, [open]);

  const handleFriendClick = (id) => {
    setOpen(false)
    navigate(`/profile/${id}`)
  };

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <Link to={`/profile/${currentUser._id}`}>
            <div className="user">
              {currentUser.profilePicture ? (
                <img src={currentUser.profilePicture} alt="" />
              ) : (
                <img src="https://img.freepik.com/free-vector/donald-trump-portrait-with-flat-design_23-2147940891.jpg?w=740&t=st=1679462810~exp=1679463410~hmac=77150068e6adc1badc2d3d53ae1d584ace700334f8903806141045e2a33b3ac7"></img>
              )}
              <span>{currentUser.username}</span>
            </div>
          </Link>

          <Link to="/messenger" style={{ textDecoration: "none" }}>
            <div className="item">
              <img src={Messages} alt="" />
              <span>Messages</span>
            </div>
          </Link>

          <React.Fragment>
            <div
              className="item cursor-pointer"
              variant="outlined"
              color="neutral"
              onClick={() => setOpen(true)}
            >
              <img src={Friends} alt="" />
              <span>Friends</span>
            </div>

            <Modal
              disableScrollLock
              aria-labelledby="modal-title"
              aria-describedby="modal-desc"
              open={open}
              onClose={() => setOpen(false)}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Sheet
                variant="outlined"
                sx={{
                  width: 400,
                  maxHeight: 500,
                  borderRadius: "md",
                  p: 3,
                  boxShadow: "lg",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
                <ModalClose
                  variant="outlined"
                  sx={{
                    top: "calc(-1/4 * var(--IconButton-size))",
                    right: "calc(-1/4 * var(--IconButton-size))",
                    boxShadow: "0 2px 12px 0 rgba(0 0 0 / 0.2)",
                    borderRadius: "50%",
                    bgcolor: "background.body",
                  }}
                />
                <Typography
                  component="h2"
                  id="modal-title"
                  level="h4"
                  textColor="inherit"
                  fontWeight="lg"
                  mb={1}
                >
                  Friends List
                </Typography>

                <div className="userDetails ">
                  {allUsers ? (
                    allUsers.map((user) => {
                      return (
                        <div onClick={()=>handleFriendClick(user._id)} className="userImg flex p-2.5 cursor-pointer">
                          <img
                            className="w-12 h-12 rounded-full"
                            src={user.profilePicture}
                            alt=""
                          />
                          <span className="ml-3 mt-2">{user.username}</span>
                        </div>
                      );
                    })
                  ) : (
                    <span>No Friends</span>
                  )}
                </div>
              </Sheet>
            </Modal>
          </React.Fragment>
        </div>
      </div>
    </div>
  );
}

export default LeftBar;
