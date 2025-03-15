import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "../services/api";
import { User } from "../types/user";
import { Product } from "../types/product";

interface MyProductsProps {
  user: User;
}

const MyProducts: React.FC<MyProductsProps> = ({ user }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data: Product[] = await getProducts();
        const userProducts = data.filter(
          (product) => product.sellerId === user.id
        );
        setProducts(userProducts);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user.id]);

  const handleDeleteClick = (productId: string) => {
    setDeleteConfirm(productId);
  };

  const confirmDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
      setDeleteConfirm(null);
    } catch (err) {
      setError("Failed to delete product. Please try again.");
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Link
          to="/add-product"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add New Product
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}

      {products.length === 0 ? (
        <div className="bg-gray-100 text-gray-700 p-4 rounded">
          You haven't listed any products yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Price</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="p-4">
                    <img
                      src={product.imageUrl || "https://via.placeholder.com/80"}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </td>
                  <td className="p-4">
                    <Link
                      to={`/products/${product.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {product.name}
                    </Link>
                  </td>
                  <td className="p-4">${product.price.toFixed(2)}</td>
                  <td className="p-4 flex space-x-2">
                    <Link
                      to={`/edit-product/${product.id}`}
                      className="bg-slate-600 text-white px-3 py-1 rounded-lg hover:bg-slate-700"
                    >
                      Edit
                    </Link>

                    {deleteConfirm === product.id ? (
                      <>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                          onClick={() =>
                            confirmDelete(product.id ? product.id : "")
                          }
                        >
                          Confirm
                        </button>
                        <button
                          className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600"
                          onClick={cancelDelete}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg "
                        onClick={() =>
                          handleDeleteClick(product.id ? product.id : "")
                        }
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
