import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
import { Product } from "../types/product";
import { Order } from "../types/order";

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await axios.get<Product>(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

export const createProduct = async (productData: Product): Promise<Product> => {
  try {
    const response = await axios.post<Product>(
      `${API_URL}/products`,
      productData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  productData: Partial<Product>
): Promise<Product> => {
  try {
    const response = await axios.put<Product>(
      `${API_URL}/products/${id}`,
      productData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/products/${id}`);
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw error;
  }
};

export const getOrders = async (userId: string): Promise<Order[]> => {
  try {
    const response = await axios.get<Order[]>(`${API_URL}/orders`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderById = async (id: string): Promise<Order> => {
  try {
    const response = await axios.get<Order>(`${API_URL}/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order with id ${id}:`, error);
    throw error;
  }
};

export const createOrder = async (orderData: Order): Promise<Order> => {
  try {
    const response = await axios.post<Order>(`${API_URL}/orders`, orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const updateOrderStatus = async (
  id: string,
  status: string
): Promise<Order> => {
  try {
    const response = await axios.put<Order>(`${API_URL}/orders/${id}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error updating order status for order with id ${id}:`,
      error
    );
    throw error;
  }
};
