import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, createOrder } from "../services/api";
import { Product } from "../types/product";
import { User } from "../types/user";

interface ProductDetailProps {
  user: User;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [shippingAddress, setShippingAddress] = useState<string>("");
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isOrdering, setIsOrdering] = useState<boolean>(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data: Product = await getProductById(id!);
        setProduct(data);
      } catch (err) {
        setError("Failed to fetch product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) {
      setOrderError("Product not found.");
      return;
    }

    if (!shippingAddress.trim()) {
      setOrderError("Please enter a shipping address.");
      return;
    }

    setIsOrdering(true);
    setOrderError(null);

    try {
      await createOrder({
        productId: product.id ? product.id : "",
        buyerId: user.id,
        quantity,
        shippingAddress,
        status: "pending",
      });

      setOrderSuccess(true);
      setIsOrdering(false);
      setQuantity(1);
      setShippingAddress("");

      setTimeout(() => navigate("/orders"), 3000);
    } catch (err) {
      setOrderError("Failed to place order. Please try again.");
      setIsOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md text-center">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-700 rounded-md text-center">
        Product not found.
      </div>
    );
  }

  const isOwnProduct = product.sellerId === user.id;
  const totalPrice = quantity * product.price;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img
            src={product.imageUrl || "https://via.placeholder.com/500"}
            alt={product.name}
            className="w-full object-cover rounded-lg"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-xl text-gray-600">${product.price.toFixed(2)}</p>
          <hr className="my-4" />
          <p className="text-gray-700">{product.description}</p>

          {orderSuccess && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
              Order placed successfully! Redirecting to your orders...
            </div>
          )}

          {!isOwnProduct && !orderSuccess && (
            <div className="mt-6 p-4 border rounded-md bg-gray-100">
              <h5 className="text-lg font-semibold">Order this item</h5>
              <form onSubmit={handleOrder} className="mt-3">
                <div className="mb-3">
                  <label htmlFor="quantity" className="block font-medium">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    className="w-full p-2 border rounded-md"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="shippingAddress"
                    className="block font-medium"
                  >
                    Shipping Address
                  </label>
                  <textarea
                    id="shippingAddress"
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="mb-3 font-semibold">
                  Total: ${totalPrice.toFixed(2)}
                </div>

                {orderError && (
                  <div className="p-3 bg-red-100 text-red-700 rounded-md">
                    {orderError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-2 rounded-md mt-2 hover:bg-blue-700 transition disabled:bg-gray-400"
                  disabled={isOrdering}
                >
                  {isOrdering ? "Placing Order..." : "Place Order"}
                </button>
              </form>
            </div>
          )}

          {isOwnProduct && (
            <div className="mt-4 p-3 bg-blue-100 text-blue-700 rounded-md">
              This is your product. You can{" "}
              <a href={`/edit-product/${product.id}`} className="underline">
                edit
              </a>{" "}
              or manage it from your{" "}
              <a href="/my-products" className="underline">
                products page
              </a>
              .
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
