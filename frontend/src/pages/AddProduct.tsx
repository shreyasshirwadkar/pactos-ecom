import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/api";
import { User } from "../types/user";

interface AddProductProps {
  user: User;
}

interface ProductData {
  name: string;
  description: string;
  price: string;
  imageUrl?: string;
}

const AddProduct: React.FC<AddProductProps> = ({ user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductData>({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isNaN(parseFloat(formData.price))) {
        throw new Error("Price must be a valid number");
      }
      await createProduct({
        ...formData,
        sellerId: user.id,
        price: parseFloat(formData.price),
      });

      setLoading(false);
      navigate("/my-products");
    } catch (err) {
      setError(
        (err as Error).message || "Failed to create product. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 bg-gray-100 border border-gray-300 p-6 rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Add New Product</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium">
            Product Name
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-gray-700 font-medium"
          >
            Description
          </label>
          <textarea
            className="w-full p-2 border rounded-md"
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div>
          <label htmlFor="price" className="block text-gray-700 font-medium">
            Price ($)
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            className="w-full p-2 border rounded-md"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-gray-700 font-medium">
            Image URL
          </label>
          <input
            type="url"
            className="w-full p-2 border rounded-md"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
          <small className="text-gray-500">
            Leave blank to use a default image.
          </small>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
