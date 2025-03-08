// /api/products
const { productsTable } = require("../config/airtable");

exports.getProducts = async (req, res) => {
  try {
    const records = await productsTable.select().all();
    const products = records.map((record) => ({
      id: record.id,
      ...record.fields,
    }));

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const record = await productsTable.find(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = {
      id: record.id,
      ...record.fields,
    };

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch product", error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, sellerId } = req.body;

    if (!name || !price || !sellerId) {
      return res
        .status(400)
        .json({ message: "Name, price, and sellerId are required" });
    }

    const newRecord = await productsTable.create({
      name,
      description,
      price: parseFloat(price),
      imageUrl,
      sellerId,
      createdAt: new Date(),
    });

    const product = {
      id: newRecord.id,
      ...newRecord.fields,
    };

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(500)
      .json({ message: "Failed to create product", error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl } = req.body;
    const productId = req.params.id;

    const updatedRecord = await productsTable.update(productId, {
      name,
      description,
      price: parseFloat(price),
      imageUrl,
      updatedAt: new Date().toISOString(),
    });

    const product = {
      id: updatedRecord.id,
      ...updatedRecord.fields,
    };

    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ message: "Failed to update product", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await productsTable.destroy(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ message: "Failed to delete product", error: error.message });
  }
};
