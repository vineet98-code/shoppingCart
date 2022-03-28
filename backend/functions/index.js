const functions = require("firebase-functions");
const admin = require("firebase-admin");

const serviceAccount = require("./permission.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://shoppingcart-ba7a6-default-rtdb.firebaseio.com",
});


const express = require("express");
const app = express();

const db = admin.firestore();

const cors = require("cors");
app.use(cors({orgin: true}));

// Route
app.get("/hello", (req, res) => {
  return res.status(200).send("Hello world");
});

// Create
// Post
app.post("/api/create", (req, res) => {
  (async () => {
    try {
      await db.collection("products").doc("/" + req.body.id + "/")
          .create({
            title: req.body.title,
            description: req.body.description,
            image: req.body.image,
          });
      return res.status(200).send("products is Added");
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// Get
app.get("/api/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("products").doc(req.params.id);
      const product = await document.get();
      const response = product.data();
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// Get all products
app.get("/api/", (req, res) => {
  (async () => {
    try {
      const query = db.collection("products");
      const response = [];

      await query.get().then((querySnapshot) => {
        const docs = querySnapshot.docs;
        for (const doc of docs) {
          const selectedItems = {
            id: doc.id,
            title: doc.data().title,
            description: doc.data().description,
            image: doc.data().image,
          };
          response.push(selectedItems);
        }
        return response;
      });
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// Update Products
app.put("/api/update/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("products").doc(req.params.id);
      await document.update({
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
      });
      return res.status(200).send("products is Updated");
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});
// Delete Products
app.delete("/api/delete/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("products").doc(req.params.id);
      await document.delete();
      return res.status(200).send("products is Deleted");
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// Export the api to firebase CLoud Function
exports.app = functions.https.onRequest(app);
