import React, { useState } from 'react'
import useStyles from './styles'
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase } from '@material-ui/core'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt'
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined'
import DeleteIcon from '@material-ui/icons/Delete'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { deletePost, likePost } from '../../../actions/posts'
import { useHistory } from 'react-router-dom'

const Post = ({ post, setCurrentId }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const userInfo = JSON.parse(localStorage.getItem('profile'))
    const [likes, setLikes] = useState(post?.likes)

    const userId = userInfo?.profileInfo?.googleId || userInfo?.profileInfo?._id

    const hasLiked = likes.find((like) => like === userId)

    const openPost = () => {
      history.push(`/posts/${post._id}`)
    }

     const handleLike = async () => {
      dispatch(likePost(post._id))

      if(hasLiked){
        setLikes(likes.filter( (id) => id !== userId ))
      } else {
        setLikes([ ...likes, userId ])
      }
     }

    const Likes = () => {
        if (likes.length > 0) {
          return hasLiked
            ? (
              <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}` }</>
            ) : (
              <><ThumbUpAltOutlined fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
            );
        }
    
        return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
      };

    return (
       <Card className={classes.card} raised elevation={6}>
          <ButtonBase className={classes.cardAction} onClick={openPost}>
            <CardMedia className={classes.media} image={post.selectedFile} title={post.title} />
            <div className={classes.overlay}>
                <Typography variant='h6'>{post.name}</Typography>
                <Typography variant='body2'>{moment(post.createdAt).fromNow()}</Typography>
            </div>
            {(userInfo?.profileInfo?.googleId === post?.user || userInfo?.profileInfo?._id === post?.user) && (
              <div className={classes.overlay2}>
                  <Button style={{color: 'white'}} size='small' onClick={() => setCurrentId(post._id)}>
                      <MoreHorizIcon fontSize='medium' />
                  </Button>
                </div>
              )}
            <div className={classes.details}>
                <Typography variant='subtitle2'>{post.tags.map((tag) => `#${tag} `)}</Typography>
            </div>
            <Typography className={classes.title} variant='h5' gutterBottom>{post.title}</Typography>
            <CardContent className={classes.cardContent}>
                <Typography variant='body1'>{post.message}</Typography>
            </CardContent>
          </ButtonBase>
          <CardActions className={classes.cardActions}>
              <Button size='small' color='primary' disabled={!userInfo?.profileInfo} onClick={handleLike}>
                  <Likes />
              </Button>
              {(userInfo?.profileInfo?.googleId === post?.user || userInfo?.profileInfo?._id === post?.user) && (
                <Button size='small' color='primary' onClick={()=> dispatch(deletePost(post._id))}>
                  <DeleteIcon fontSize='small'/>Delete
                </Button>
              )}
          </CardActions>
       </Card>
    )
}

export default Post