import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProduct, deleteProduct } from "../services/api";
import { Product } from "../types/product";

interface EditProductProps {
  user: { id: string };
}

const EditProduct: React.FC<EditProductProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product: Product = await getProductById(id!);
        if (product.sellerId !== user.id) {
          setError("You do not have permission to edit this product.");
          setLoading(false);
          return;
        }
        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price.toString() || "",
          imageUrl: product.imageUrl || "",
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch product details. Please try again later.");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, user.id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (isNaN(parseFloat(formData.price))) {
        throw new Error("Price must be a valid number");
      }
      await updateProduct(id!, {
        ...formData,
        price: parseFloat(formData.price),
      });
      navigate("/my-products");
    } catch (err) {
      setError(
        (err as Error).message || "Failed to update product. Please try again."
      );
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await deleteProduct(id!);
      navigate("/my-products");
    } catch (err) {
      setError("Failed to delete product. Please try again.");
      setSubmitting(false);
      setConfirmDelete(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-xl">Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-2xl font-semibold text-center mb-4">Edit Product</h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price ($)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="0.01"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? "Updating..." : "Update Product"}
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded ${
              confirmDelete
                ? "bg-red-600 text-white"
                : "bg-red-200 text-red-700"
            }`}
            onClick={handleDelete}
            disabled={submitting}
          >
            {confirmDelete ? "Confirm Delete" : "Delete Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
