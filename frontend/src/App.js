import React, { useState, useEffect } from 'react';
import './App.css';
import Product from './Product';
import ImageUpload from './ImageUpload';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { db, auth } from './firebase'
import { Button, Input } from '@material-ui/core';
// import Search from './Search';


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
  const [modalStyle] = useState(getModalStyle)

  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged  in
        // console.log(authUser)
        setUser(authUser);
      } else {
        // user logged out
        setUser(null)
      }
    })

    return () => {
      // perform some cleanup action
      unsubscribe();
    }
  }, [user, username])



  //  it run a pices of code based on a specific condition
  // onSnapshot do eevry single time the change happened in firebase, fire this code
  useEffect(() => {
    db.collection('products').onSnapshot(snapshot => {
      setProducts(snapshot.docs.map(doc => doc.data()))
    })

  }, [])

  const signUp = (e) => {
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email, password).then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
      .catch((err) => alert(err.message))
    setOpen(false);
  }

  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message))
    setOpenSignIn(false);

  }
  const getProduct = () => {
    console.warn(searchQuery)
    if (searchQuery.length > 2) {

      return products.filter((product) => {
        const productName = product.title.toLowerCase();
        return productName.includes(searchQuery)
      })

    }
    return products;
  }


  return (
    <div className="App">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center className="app__header">
              <img
                className="app__headerImage"
                src="https://www.amazon.in/ref=nav_logo" alt=" "
              />
            </center>
            <Input placeholder="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input placeholder="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="password" type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type='submit' onClick={signUp}>Sign Up</Button>
          </form>

        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center className="app__header">
              <img
                className="app__headerImage"
                src="https://images-na.ssl-images-amazon.com/images/I/31%2BDgxPWXtL.jpg" alt=" "
              />
            </center>
            <Input placeholder="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="password" type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type='submit' onClick={signIn}>Sign In</Button>
          </form>

        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://images-na.ssl-images-amazon.com/images/I/31%2BDgxPWXtL.jpg" alt=" "
        />

        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}

      </div>
      <div className="search-box">

        <input
          className="search__input"
          type="search"
          placeholder="Search bar"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value.trim())}
        />
      </div>
      <div className="app__product">
        {
          products.filter(elm => {
            if (searchQuery === '') {
              return elm;
            } else if (elm.title.toLowerCase().includes(searchQuery.toLowerCase())) {
              return elm;
            }

          }).map((product) => {
            return <Product postId={product.id}  {...product} onChange={(e) => { getProduct() }} />
          })
        
        }
      </div>


      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>sorry you need to login </h3>
      )}

    </div>
  )
}

export default App;
