import React, {useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Avatar, Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload'
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {
          // dont update username

        } else {
          // if we just created someone...
          return authUser.updateProfile({
            displayName: username,
            // university: university,
            // major: major
          });
        }


      } else {
        //user has logged out...
        setUser(null);

      }
    })
    return () => {
      //perform some clean up actions
      unsubscribe();
    }

  }, [user, username, university, major]);
   
  // useEffect -> runs a piece of code based on a specific condition

  useEffect(() => {
    //this is where the code runs
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // everytime a new post is added, this code fires
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  function postProfile() {
    db.collection("account").add({
        university: university,
        major: major,
        username: username
    });
  };

  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    
    .catch((error) => alert(error.message))

    postProfile();

    setOpen(false);
    
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false);

  }
  
  

  return (

    <div className="app">

       <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
         <div style={modalStyle} className={classes.paper}>
         <form className="app_signup">
            <center>
              <img
                className="app_headerImage"
                src= "https://i.redd.it/l8cczd9174y51.png"
                alt=""
              />
            </center>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />   
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              placeholder="University"
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
            />
            <Input
              placeholder="Major"
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
            />
            <Button onClick={signUp}>Sign Up</Button>
         </form>
          
         </div>  
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
         <div style={modalStyle} className={classes.paper}>
         <form className="app_signup">
            <center>
              <img
                className="app_headerImage"
                src= "https://i.redd.it/l8cczd9174y51.png"
                alt=""
              />
            </center>
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />   
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type ="submit" onClick={signIn}>Sign In</Button>
         </form>
          
         </div>  
      </Modal>
      { user ? (
      <Modal
        open={openProfile}
        onClose={() => setOpenProfile(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_profile">
            <center>
              <img
              className="app_profileHeader"
              src="https://i.redd.it/l8cczd9174y51.png"
              alt=""
              />
              <div className="profile_image">
                <div className="profile_header">
                  <h2>{user.displayName}'s Profile</h2>
                  <Avatar
                  className="profile_avatar"
                  alt={user.displayName}
                  src="/static/images/avatar/1.jpg"
                />
                <h3>Username: {user.displayName}</h3>
                <h4>University: {university}</h4>
                <h4>Major: {major}</h4>
                <h4>School Email: {user.email}</h4>
                </div>
              </div>
            </center>
          </form>
        </div>
      </Modal>
      ):(<h3></h3>)}
    
      <div className="app_header">
        <img
          className="app_headerImage"
          src= "https://i.redd.it/l8cczd9174y51.png"
          alt=""
          />
          
           {user ? (

        <div className="app_loginContainer">
        <Button onClick={() => setOpenProfile(true)}>Profile</Button>
        <Button>Student Feed</Button>
        <Button>Notifications</Button>
        <Button onClick={() => auth.signOut()}>Logout</Button>
        </div>
      ): (
        
        <div className="app_loginContainer">
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign Up</Button>
        </div>
      )}
      </div>

      <div className="app_posts">
        <div className="app_postsLeft">
         {
           posts.map(({ id, post }) => (
            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
        ))
         }
      </div>
      <div className="app_postsRight">
        <InstagramEmbed
          url='https://www.instagram.com/p/BU8oZOjFPPb/'
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onloading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
          />
        </div>

      </div>
    

      {user?.displayName ? (
          <ImageUpload username={user.displayName}/>
      ): (
          <h3>Sorry you need to login to upload</h3>
        
      )}
    </div>
  );
}

export default App;
