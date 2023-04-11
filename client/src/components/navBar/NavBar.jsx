import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import debounce from "lodash.debounce";

export default function NavBar() {
  const [userData, setUserData] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    makeRequest.post("/auth/logout").then(() => {
      localStorage.removeItem("user");
      navigate("/login");
    });
  };

  // Search

  useEffect(() => {
    makeRequest
      .get(`/users`)
      .then(({ data }) => setUserData(data))
      .catch((error) => console.log(error));
  }, []);

// Debouncing

  const debouncedSave = useCallback(
    debounce(async (searchWord,userData) => {
      const newFilter = await userData.filter((value) => {
        return value.username.toLowerCase().includes(searchWord.toLowerCase());
      });
      newFilter && setFilteredData(newFilter);
    },1000),
    []
  );

  const handleChange = (e) => {
    const searchWord = e.target.value;
    setSearchWord(searchWord);
    // const newFilter = await userData.filter((value) => {
    //   return value.username.toLowerCase().includes(searchWord.toLowerCase());
    // });
    // newFilter && setFilteredData(newFilter);
    debouncedSave(searchWord,userData)
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>StackHub</span>
        </Link>
        <Link to="/" style={{ textDecoration: "none" }}>
          <HomeOutlinedIcon />
        </Link>
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}

        <div className="search rounded-full ml-36">
          <SearchOutlinedIcon />
          <input
            type="text"
            id="search-navbar"
            value={searchWord}
            onChange={handleChange}
            placeholder="Find people..."
          />
          {searchWord && (
            <div className="absolute top-[-11rem] bg-gray-300 md:w-4/12  rounded-2xl mt-56">
              <ul className="relative">
                {filteredData.length > 0 ? (
                  filteredData.map((user) => (
                    <Link
                      to={`/profile/${user._id}`}
                      onClick={() => setSearchWord("")}
                      key={user._id}
                      className="flex flex-wrap gap-2 items-center p-3 hover:bg-gray-200 border-b border-gray-200"
                    >
                      <img
                        src={
                          user?.profilePicture
                            ? user.profilePicture
                            : "https://qph.cf2.quoracdn.net/main-qimg-cf89e8e6daa9dabc8174c303e4d53d3a"
                        }
                        alt={user?.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <p>{user?.username}</p>
                    </Link>
                  ))
                ) : (
                  <li className="p-3 hover:bg-gray-300 border-b rounded-b-lg border-gray-200">
                    No Results Found
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="right">
        <Link
          to={`/profile/${currentUser._id}`}
          style={{ textDecoration: "none" }}
        >
          <PersonOutlineOutlinedIcon />
        </Link>

        <Link to="/messenger" style={{ textDecoration: "none" }}>
          <EmailOutlinedIcon />
        </Link>

        {/* <div className="user">
          <img
            src={currentUser.profilePicture}
            alt=""
          />
          <span>{currentUser.username}</span>
        </div> */}
        <Button color="secondary" variant="text" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
