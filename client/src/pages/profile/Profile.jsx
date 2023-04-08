import './profile.scss'
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import PlaceIcon from "@mui/icons-material/Place";
import EditIcon from "@mui/icons-material/Edit";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts"
import { makeRequest } from '../../axios';
import { useQuery, useQueryClient } from 'react-query';
import { useLocation } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import Modal from "react-modal";
import { AuthContext } from '../../context/authContext';
import Update from '../../components/update/Update';
import storage from "../../firebase/config";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};



function Profile() {
  const [openUpdate, setOpenUpdate] = useState(false)
  const [coverModal, setCoverModal] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [profileModalIsOpen, setProfileModalIsOpen] = useState(false);

  let subtitle;
  const [coverPic, setCoverPic] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [profilePic, setProfilePic] = useState(false);
  const [uploadingProPic, setUploadingProPic] = useState(false);


  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState(null);

  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const userId = useLocation().pathname.split("/")[2]



  const { isLoading, error, data, refetch } = useQuery(['user'], () =>
    makeRequest.get(`/users/${userId}`).then((res) => {
      return res.data
    }
    )
  )
  const queryClient = useQueryClient()
  useEffect(() => {
    refetch()
  }, [userId])

  const handleFollow = () => {
    if (data?.followers.includes(currentUser._id)) {
      makeRequest.put(`/users/${userId}/unfollow`, { userId: currentUser._id }).then(() => {
        queryClient.invalidateQueries(["user"]);
      }).catch((err) => {
        console.log(err);
      })
    } else {
      makeRequest.put(`/users/${userId}/follow`, { userId: currentUser._id }).then(() => {
        queryClient.invalidateQueries(["user"]);
      }).catch((err) => {
        console.log(err);
      })
    }
  }

  function closeModal() {
    setIsOpen(false);
    setCoverModal(false);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  // CoverPicture Change

  function handleCoverPicture(e) {
    e.preventDefault();
    if (coverPic) {
      setUploading(true);
      upload([{ file: coverPic, label: "img" }]);
    } else {
      setErr("Please Choose An Image");
    }
  }

  const upload = (items) => {
    items.forEach((item) => {
      const fileName = new Date().getTime() + item.label + item.file.name;
      const uploadTask = storage.ref(`/items/${fileName}`).put(item.file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(async (url) => {
            try {
              await makeRequest.put(`/users/${currentUser._id}`, { userId: currentUser._id, coverPicture: url })
                .then((response) => {
                  setCurrentUser((currentUser) => {
                    return { ...currentUser, coverPicture: url }
                  });
                  setCoverModal(false);
                  setCoverPic(false);
                  setUploading(false);
                  console.log("after update", currentUser);
                  queryClient.invalidateQueries(["user"]);
                })
                .catch((err) => {
                  err?.response?.data?.error
                    ? setErr(err?.response?.data?.error)
                    : setErr(err?.response?.data);
                });
            } catch (error) {
              console.log(error);
              setErr(error?.response?.data);
              console.log(error, "hello");
            }

            // axios.post('/posts',{desc:desc,img:url},config)
            // queryClient.invalidateQueries(["posts"]);

            // setPost({desc:post,img:url})
            // console.log(post);
          });
        }
      );
    });
  };
  //Change Profile Picture

  function closeProfileModal() {
    setProfileModalIsOpen(false);
    setProfileModal(false);
  }

  const handleProfilePicture = (e) => {
    e.preventDefault();
    if (profilePic) {
      setUploadingProPic(true);
      uploadProfilePic([{ file: profilePic, label: "img" }]);
    } else {
      setErr("Please Choose An Image");
    }
  };

  const uploadProfilePic = (items) => {
    items.forEach((item) => {
      const fileName = new Date().getTime() + item.label + item.file.name;
      const uploadTask = storage.ref(`/items/${fileName}`).put(item.file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(async (url) => {
            try {
                await makeRequest.put(`/users/${currentUser._id}`, { userId: currentUser._id, profilePicture: url })
                .then((response) => {
                  setCurrentUser({ ...currentUser, profilePicture: url });
                  setProfileModal(false);
                  setProfilePic(false);
                  setUploadingProPic(false);
                  console.log("after update", currentUser);
                  queryClient.invalidateQueries(["user"]);
                })
                .catch((err) => {
                  console.log(err, "hello");
                  err.response.data.error
                    ? setErr(err.response.data.error)
                    : setErr(err.response.data);
                });
            } catch (error) {
              setErr(error.response.data);
              console.log(error, "hello");
            }

            // axios.post('/posts',{desc:desc,img:url},config)
            // queryClient.invalidateQueries(["posts"]);

            // setPost({desc:post,img:url})
            // console.log(post);
          });
        }
      );
    });
  };



  return (
    <div className='profile'>
      {isLoading ? "Loading" : (<>
        <div className="images">
          {data?.coverPicture ? <img src={data?.coverPicture} alt="" className="cover" /> : <img src='https://img.freepik.com/free-photo/front-view-yellow-empty-picture-frame-standing-table-white-blue-surface-with-free-space_140725-96935.jpg?w=740&t=st=1679462539~exp=1679463139~hmac=232509eb66d89060744f1d3aff9f341798d54db3a7eb2b90f8ad596e033e1f8b' className="cover"></img>}
          {data?.profilePicture ? <img src={data?.profilePicture} alt="" className="profilePic" /> : <img src='https://img.freepik.com/free-vector/donald-trump-portrait-with-flat-design_23-2147940891.jpg?w=740&t=st=1679462810~exp=1679463410~hmac=77150068e6adc1badc2d3d53ae1d584ace700334f8903806141045e2a33b3ac7' className="profilePic"></img>}
          {currentUser?._id === data?._id && (
            <EditIcon onClick={() => setCoverModal(true)}
              className="hover:border-gray-700 border-transparent border-2 cursor-pointer z-0 absolute bottom-6 left-2 shadow bg-white rounded-full p-1 edit"
            />
          )}
          {currentUser?._id === data?._id && (
            <EditIcon onClick={() => setProfileModal(true)}
              className="hover:border-gray-700 border-transparent border-2 cursor-pointer z-0 absolute -bottom-5 left-80 right-10 shadow bg-white rounded-full p-1 edit"
            />
          )}
          {/* Change Cover Pic Modal */}
          <Modal
            isOpen={coverModal}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <h2 style={{ color: "blue", textAlign: "center" }}>
              Change Cover Picture
            </h2>
            <CloseIcon onClick={closeModal} className="close" />
            <input
              type="file"
              name="img"
              id="file"
              style={{ display: "none" }}
              accept=".png, .jpeg, .jpg"
              onChange={(e) => setCoverPic(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item" style={{ textAlign: "center" }}>
                <img
                  style={{
                    width: "9rem",
                    marginRight: "auto",
                    marginLeft: "auto",
                    marginTop: "1rem",
                    borderRadius: "50%",
                    height: "9rem",
                  }}
                  src={
                    coverPic
                      ? URL.createObjectURL(coverPic)
                      : currentUser.coverPicture
                  }
                  alt=""
                />
                <span style={{ paddingTop: "3px" }}>Add Image</span>
                <br />
                {err && (
                  <span
                    style={{
                      color: "red",
                      fontSize: ".5rem",
                      display: "block",
                    }}
                  >
                    {err}
                  </span>
                )}
                <Button
                  variant="contained"
                  style={{ backgroundColor: "blue" }}
                  className="sendButton"
                  onClick={handleCoverPicture}
                >
                  {uploading ? "uploading..." : "Change"}
                </Button>
              </div>
            </label>
          </Modal>

          {/* Change Profile Picture Modal */}
          <Modal
            isOpen={profileModal}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeProfileModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <h2 style={{ color: "blue", textAlign: "center" }}>
              Change Profile Picture
            </h2>
            <CloseIcon onClick={closeProfileModal} className="close" />
            <input
              type="file"
              name="img"
              id="file"
              style={{ display: "none" }}
              accept=".png, .jpeg, .jpg"
              onChange={(e) => setProfilePic(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item" style={{ textAlign: "center" }}>
                <img
                  style={{
                    width: "9rem",
                    marginRight: "auto",
                    marginLeft: "auto",
                    marginTop: "1rem",
                    borderRadius: "50%",
                    height: "9rem",
                  }}
                  src={
                    profilePic
                      ? URL.createObjectURL(profilePic)
                      : currentUser.profilePicture
                  }
                  alt=""
                />
                <span style={{ paddingTop: "3px" }}>Add Image</span>
                <br />
                {err && (
                  <span
                    style={{
                      color: "red",
                      fontSize: ".5rem",
                      display: "block",
                    }}
                  >
                    {err}
                  </span>
                )}
                <Button
                  variant="contained"
                  style={{ backgroundColor: "blue" }}
                  className="sendButton"
                  onClick={handleProfilePicture}
                >
                  {uploading ? "uploading..." : "Change"}
                </Button>
              </div>
            </label>
          </Modal>

        </div>
        <div className="profileContainer">
          <div className="uInfo">
            <div className="left">
              {/* <a href="http://facebook.com">
                <FacebookTwoToneIcon fontSize="medium" />
              </a>
              <a href="http://facebook.com">
                <InstagramIcon fontSize="medium" />
              </a>
              <a href="http://facebook.com">
                <TwitterIcon fontSize="medium" />
              </a>
              <a href="http://facebook.com">
                <LinkedInIcon fontSize="medium" />
              </a>
              <a href="http://facebook.com">
                <PinterestIcon fontSize="medium" />
              </a> */}
            </div>
            <div className="center ">
              <span className='capitalize '>{data?.username}</span>
              <div className="info">
                <div className="item">
                  <PlaceIcon />
                  <span>{data?.city?data.city:"India"}</span>
                </div>
                <div className="item">
                  <LanguageIcon />
                  <span>{data?.username}.dev</span>
                </div>
              </div>
              {userId === currentUser._id ? (
                <button onClick={() => setOpenUpdate(true)}>Update</button>
              ) : (
                <button onClick={handleFollow}>{data?.followers.includes(currentUser._id) ? "UnFollow" : "Follow"}</button>
              )}
            </div>
            <div className="right">
              <EmailOutlinedIcon />
              <MoreVertIcon />
            </div>
          </div>
          <Posts profile={true} userId={userId}/>
        </div></>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data}/>}
    </div>
  )
}

export default Profile