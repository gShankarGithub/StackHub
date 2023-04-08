
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import SendIcon from '@mui/icons-material/Send';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Swal from 'sweetalert2'




import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import './post.scss'
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from '../comments/Comments';
import { useContext, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";

import moment from 'moment'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


function Post({ post }) {
    const [data, setData] = useState({ username: "", profilePicture: "" })
    useEffect(() => {
        makeRequest.get(`/users/${post.userId}`).then((res) => {
            setData(res.data)
        })
    }, [])
    const { currentUser } = useContext(AuthContext);

    const queryClient = useQueryClient()

    const handleLike = () => {
        makeRequest.put(`/posts/${post._id}/like`, { userId: currentUser._id }).then(() => {
            queryClient.invalidateQueries(["posts"]);
        }).catch((err) => {
            console.log(err);
        })
    }
    const [commentOpen, setCommentOpen] = useState(false)
    ///temp
    const liked = true

    // Delete Post
    const handleDeletePost = () => {
        console.log(currentUser._id);
        makeRequest.delete('/posts/' + post._id, { data: { userId: currentUser._id } }).then(() => {
            queryClient.invalidateQueries(["posts"]);
        })
    }

    // Dropdown in post 
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseDropDown = () => {
        setAnchorEl(null);
    };

    // End

    //Delete confirmation
    const [alertOpen, setAlertOpen] = React.useState(false);

    const handleClickOpenDelete = () => {
        setAlertOpen(true);
    };

    const handleClose = () => {
        setAlertOpen(false);
        setAnchorEl(null);
    };

    //Edit

    const [openEdit, setOpenEdit] = React.useState(false);
    const [desc, setDesc] = React.useState('');

    const handleClickOpenEdit = () => {
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
        setAnchorEl(null);

    };


    const handlePostUpdate = () => {
        makeRequest.put('/posts/' + post._id, { userId: currentUser._id, desc: desc }).then(() => {
            queryClient.invalidateQueries(["posts"]);
            setDesc('')
            handleCloseEdit()
        })
    }
    //RReport

    const [openReport, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleReportClose = () => {
        setOpen(false);
        setAnchorEl(null);

    }

    const [report, setReport] = useState('other')
    const [err, setErr] = useState(null)


    const handleReport = () => {
        // e.preventDefault()
        if (report == "other" && desc.trim().length !== 0 && desc != null) {
            console.log("Entry test");
            makeRequest.put(`posts/${post._id}/report`, { reason: desc }).then((res) => {
                console.log(res);
                Swal.fire({
                    title: 'Reported!',
                    text: 'Thanks for reporting',
                    icon: 'success',
                    confirmButtonText: 'ok'
                })
                handleReportClose()
                setDesc("")
                setAnchorEl(null);
                setErr(null)
            }).catch((err) => {
                setErr(err.response.data)
            })
        } else if (report !== "other") {
            makeRequest.put(`posts/${post._id}/report`, { reason: report }).then((res) => {
                Swal.fire({
                    title: 'Reported!',
                    text: 'Thanks for reporting',
                    icon: 'success',
                    confirmButtonText: 'ok'
                })
                handleReportClose() 
                setDesc("")
                setAnchorEl(null);
                setErr(false)
            }).catch((err) => {
                setErr(err.response.data)
            })
        }
        else {
            setErr("Please specify reason")
        }
    }


    return (

        <div className='post'>
            <div className="container">
                <div className="user">
                    <div className="userInfo">
                        {data.profilePicture ? <img src={data.profilePicture} alt="" /> : <img src='https://img.freepik.com/free-vector/donald-trump-portrait-with-flat-design_23-2147940891.jpg?w=740&t=st=1679462810~exp=1679463410~hmac=77150068e6adc1badc2d3d53ae1d584ace700334f8903806141045e2a33b3ac7'></img>}
                        <div className="details">
                            <Link to={`/profile/${post.userId}`} style={{ textDecoration: "none", color: "inherit" }}>
                                <span>{data.username}</span>
                            </Link>
                            <span className='date'>{moment(post.createdAt).fromNow()}</span>
                        </div>
                    </div>

                    <div>
                        <MoreHorizIcon
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        />
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleCloseDropDown}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            {/* EDIT */}
                            {currentUser._id === data._id && <MenuItem onClick={handleClickOpenEdit}>Edit</MenuItem>}
                            <Dialog open={openEdit} onClose={handleCloseEdit}>
                                <DialogTitle>Edit Description</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        value={desc}
                                        onChange={(e) => { setDesc(e.target.value) }}
                                        type="text"
                                        fullWidth
                                        variant="standard"
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseEdit}>Cancel</Button>
                                    <Button onClick={handlePostUpdate}>Edit Post</Button>
                                </DialogActions>
                            </Dialog>

                            {/* DELETE */}
                            {currentUser._id === data._id && <MenuItem onClick={handleClickOpenDelete}>Delete</MenuItem>}
                            <Dialog
                                open={alertOpen}
                                onClose={handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">
                                    {"Do You Really Want To Delete This Post?"}
                                </DialogTitle>
                                <DialogActions>
                                    <Button onClick={handleClose}>Cancel</Button>
                                    <Button onClick={handleDeletePost} autoFocus>
                                        Delete
                                    </Button>
                                </DialogActions>
                            </Dialog>

                            {currentUser._id !== data._id && <MenuItem onClick={handleOpen}>Report</MenuItem>}
                        </Menu>

                        {/* //Report */}
                        <Modal
                            open={openReport}
                            onClose={handleReportClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                                <FormControl>
                                    <FormLabel id="demo-radio-buttons-group-label">Please specify reason</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="other"
                                        name="radio-buttons-group"
                                    >
                                        <FormControlLabel value="spam" control={<Radio />} label="spam" onChange={e => { setReport(e.target.value) }} />
                                        <FormControlLabel value="fraud" control={<Radio />} label="fraud" onChange={e => setReport(e.target.value)} />
                                        <FormControlLabel value="false information" control={<Radio />} label="false information" onClick={e => setReport(e.target.value)} />
                                        <FormControlLabel value="other" control={<Radio />} label="other" onClick={e => setReport(e.target.value)} />
                                    </RadioGroup>
                                    {report === "other" && <TextField id="standard-basic" label="please say more about it" variant="standard" onChange={e => setDesc(e.target.value)} />}
                                    {err && <span style={{ top: "2rem", color: "red" }} className="err">{err}</span>}
                                    <Button variant="contained" endIcon={<SendIcon />} className="sendButton" onClick={handleReport}>Send</Button>
                                </FormControl>




                            </Box>
                        </Modal>
                    </div>
                </div>
                <div className="content">
                    <p>{post.desc}</p>
                    <img src={post.img} alt="" />
                </div>
                <div className="info">
                    <div className="item">
                        {post.likes.includes(currentUser._id) ? <FavoriteOutlinedIcon style={{ color: "red" }} onClick={handleLike} /> : <FavoriteBorderOutlinedIcon onClick={handleLike} />}

                        {post.likes.length} Likes
                    </div>
                    <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
                        <TextsmsOutlinedIcon />
                        {post.comments.length} Comments
                    </div>

                </div>
                {commentOpen && <Comments post={post} />}
            </div>

        </div>
    )
}

export default Post