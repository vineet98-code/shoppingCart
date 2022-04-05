import { Button } from '@material-ui/core'
import { db, storage} from './firebase'
import firebase from 'firebase';
import React, { useState } from 'react'
import './ImageUpload.css'

const ImageUpload = ({username}) => {

    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const handleChange = (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }
    const handleUpload = (e) => {
         const uploadTask  = storage.ref(`images/${image.name}`).put(image);
         uploadTask.on(
           "state_changed",
           (snapshot) => {
            //  progress function
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            )
            setProgress(progress)
          }, 
          (error) => {
            console.error(error)
            alert(error.message);
          },
          () => {
            storage
             .ref("images")
             .child(image.name)
             .getDownloadURL()
             .then(url => {
              //  product image inside a db
              db.collection("products").add({
                timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                title: title,
                description: description,
                imageUrl: url

              });
              setProgress(0);
              setTitle("");
              setDescription("");
              setImage(null)

             })
          }

         )
    }

  return (
    <div className="imageupload">
        <progress className="imageupload__progress" value={progress} max="100" />
        <input type="text" placeholder="Enter a title" onChange={event => setTitle(event.target.value)} value={title}/>
        <input type="text" placeholder="Enter a description" onChange={event => setDescription(event.target.value)} value={description}/>
        <input type="file" onChange={handleChange}/>
        <Button onClick={handleUpload}>Upload</Button>

    </div>
  )
}

export default ImageUpload