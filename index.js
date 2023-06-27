const express = require("express");
const mongoose = require("mongoose");
const product = require('./products');
const cors = require('cors');
const app = express();
const uri = "mongodb+srv://admin:kywagle547@cluster0.rrqqlus.mongodb.net/?retryWrites=true&w=majority";
app.use(express.json());
app.use(cors());

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(8000, () => {
      console.log("Server listening on port 8000");
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

app.get("/", (req, res) => {
  res.send('<h1>Hello</h1>');
});

app.get("/api/products", async (req, res) => {
  try {
    const productList = await product.find({});
    // console.log('Products:', productList);
    res.send(productList);
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).send('Error retrieving products');
  }
});

app.delete("/api/products/:id",(req, res) => {
  const productId = req.params.id;
  product.deleteOne({ id: productId })
  .then(() => {
    console.log(`Product with ID ${productId} has been deleted`);
    // Handle success, perform any necessary actions
  })
  .catch((error) => {
    console.error('Error deleting product:', error);
    // Handle error, display error message or perform any necessary actions
  });
  res.json({ message: `Product with ID ${productId} has been deleted` });
});

// PUT request to update a product
app.put('/api/products/:productId', async (req, res) => {
  const productId = req.params.productId;
  const updatedProductData = req.body;

  try {
    // Find the product by a known key-value pair (e.g., "_id")
    const Product = await product.findOne({ id: productId });

    if (!Product) {
      // If the product with the provided ID is not found
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the product values based on the updatedProductData
    Object.assign(Product, updatedProductData);

    // Save the updated product
    const updatedProduct = await Product.save();

    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    // Handle any errors that occur during the update
    res.status(500).json({ message: 'Error updating product', error });
  }
});




app.post("/api/products/newproduct", async (req, res) => {
  try {
    const productData = req.body;
    const createdProduct = await product.create(productData);
    console.log('Product created:');
    res.status(201);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Error creating product' });
  }
});

