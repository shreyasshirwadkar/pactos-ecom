import React, { useState, useEffect } from "react";
import { getOrders, updateOrderStatus } from "../services/api";
import { Order } from "../types/order";
import { User } from "../types/user";

interface OrdersProps {
  user: User;
}

const Orders: React.FC<OrdersProps> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"purchases" | "sales">(
    "purchases"
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders(user.id);
        setOrders(data);
      } catch (err) {
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user.id]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      setError("Failed to update order status. Please try again.");
    }
  };

  const filteredOrders = orders.filter((order) =>
    activeTab === "purchases"
      ? order.buyerId === user.id
      : order.sellerId === user.id
  );

  if (loading) {
    return <div className="text-center mt-5 text-gray-700">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>

      {error && (
        <div className="text-red-600 bg-red-100 p-2 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 ${
            activeTab === "purchases"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("purchases")}
        >
          My Purchases
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "sales"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("sales")}
        >
          My Sales
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-gray-600">
          You have no {activeTab === "purchases" ? "purchases" : "sales"} yet.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white shadow-md rounded-lg p-4">
              <h5 className="text-lg font-semibold">{order.productName}</h5>
              <p className="text-gray-600 text-sm">
                Order Date:{" "}
                {new Date(
                  order.orderDate ? order.orderDate : ""
                ).toLocaleDateString()}
              </p>
              <p className="text-gray-600 text-sm">
                Quantity: {order.quantity}
              </p>
              <p className="text-gray-600 text-sm">
                Total Price: $
                {parseFloat(order.totalPrice ? order.totalPrice : "").toFixed(
                  2
                )}
              </p>
              <p className="text-gray-600 text-sm">
                Shipping Address: {order.shippingAddress}
              </p>

              <span
                className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${
                  order.status === "Pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : order.status === "Shipped"
                    ? "bg-blue-100 text-blue-600"
                    : order.status === "Delivered"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {order.status}
              </span>

              {activeTab === "sales" && (
                <div className="mt-3 flex flex-col space-y-2">
                  {order.status === "Pending" && (
                    <button
                      className="bg-blue-500 text-white py-1 px-3 rounded-md"
                      onClick={() =>
                        handleStatusUpdate(order.id ? order.id : "", "Shipped")
                      }
                    >
                      Mark as Shipped
                    </button>
                  )}
                  {order.status === "Shipped" && (
                    <button
                      className="bg-green-500 text-white py-1 px-3 rounded-md"
                      onClick={() =>
                        handleStatusUpdate(
                          order.id ? order.id : "",
                          "Delivered"
                        )
                      }
                    >
                      Mark as Delivered
                    </button>
                  )}
                  {order.status === "Pending" && (
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded-md"
                      onClick={() =>
                        handleStatusUpdate(
                          order.id ? order.id : "",
                          "Cancelled"
                        )
                      }
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
