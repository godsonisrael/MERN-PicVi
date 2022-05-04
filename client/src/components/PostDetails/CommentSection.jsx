import React, {  useState, useRef } from "react";
import { Typography, TextField, Button } from "@material-ui/core"
import { useDispatch } from 'react-redux'
import useStyles from './styles'
import { commentPost } from '../../actions/posts'

const CommentSection = ({ post }) => {
    const [comments, setComments] = useState([post?.comments])
    const [comment, setComment] = useState('')
    const classes = useStyles()
    const dispatch = useDispatch()
    const commentsRef = useRef()
    const userInfo = JSON.parse(localStorage.getItem('profile'))

    const handleClick = async () => {
        const finalComment = `${userInfo.profileInfo.name}: ${comment}`
        const newComment = await dispatch(commentPost(finalComment, post._id))
        setComments(newComment)
        setComment('')
        
        commentsRef.current.scrollIntoView({  behavior: 'smooth' })
    }

    return (
        <div>
            <div className={classes.commentsOuterContainer}>
                <div className={classes.commentsInnerContainer}>
                    <Typography gutterBottom variant="h6">Comments </Typography>
                    {comments.map((c, index) => (
                        <Typography key={index} gutterBottom variant='subtitle1'>
                            <strong>{ c.toString().split(': ')[0] }</strong>{ c.toString().split(':')[1] }
                        </Typography>
                    ))}
                    <div ref={commentsRef} />
                </div>
                {userInfo?.profileInfo?.name && (
                    <div style={{ width: '70%'}}>
                        <Typography gutterBottom variant="h6">Write a comment</Typography>
                        <TextField
                            fullWidth
                            minRows={4}
                            multiline
                            variant='outlined'
                            label="Comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Button style={{ marginTop: '10px' }} fullWidth disabled={!comment} color='primary' variant='contained' onClick={handleClick}>
                            Comment
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CommentSection