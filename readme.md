## https://shreyas-ecom.netlify.app/

## https://pactos-ecom.onrender.com

# Marketplace Backend API

This is the backend for the Marketplace application, built with Express.js and using Airtable as a database. It provides API endpoints for managing products and orders.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
  - [Products](#products)
  - [Orders](#orders)
- [Project Structure](#project-structure)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo-url.git
   cd marketplace-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
PORT=5000
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id
```

## Running the Server

Start the server with:

```sh
npm start
```

By default, it runs on `http://localhost:5000/`.

## API Endpoints

### Products

#### Get All Products

**Endpoint:** `GET /api/products`

**Response:**

```json
[
  {
    "id": "prod_123",
    "name": "Product Name",
    "description": "Product Description",
    "price": 100,
    "imageUrl": "http://example.com/image.jpg",
    "sellerId": "user_456"
  }
]
```

#### Get Product by ID

**Endpoint:** `GET /api/products/:id`

**Response:**

```json
{
  "id": "prod_123",
  "name": "Product Name",
  "description": "Product Description",
  "price": 100,
  "imageUrl": "http://example.com/image.jpg",
  "sellerId": "user_456"
}
```

#### Create a Product

**Endpoint:** `POST /api/products`

**Request Body:**

```json
{
  "name": "New Product",
  "description": "Product details",
  "price": 50,
  "imageUrl": "http://example.com/new-image.jpg",
  "sellerId": "user_789"
}
```

**Response:**

```json
{
  "id": "prod_456",
  "name": "New Product",
  "description": "Product details",
  "price": 50,
  "imageUrl": "http://example.com/new-image.jpg",
  "sellerId": "user_789"
}
```

#### Update a Product

**Endpoint:** `PUT /api/products/:id`

**Request Body:**

```json
{
  "name": "Updated Product",
  "price": 75
}
```

**Response:**

```json
{
  "id": "prod_123",
  "name": "Updated Product",
  "description": "Product Description",
  "price": 75,
  "imageUrl": "http://example.com/image.jpg",
  "sellerId": "user_456"
}
```

#### Delete a Product

**Endpoint:** `DELETE /api/products/:id`

**Response:**

```json
{
  "message": "Product deleted successfully"
}
```

---

### Orders

#### Get All Orders

**Endpoint:** `GET /api/orders`

**Response:**

```json
[
  {
    "id": "order_123",
    "productId": "prod_456",
    "buyerId": "user_789",
    "sellerId": "user_101",
    "quantity": 2,
    "totalPrice": 100,
    "status": "Pending",
    "orderDate": "2024-03-08T10:00:00Z"
  }
]
```

#### Get Order by ID

**Endpoint:** `GET /api/orders/:id`

**Response:**

```json
{
  "id": "order_123",
  "productId": "prod_456",
  "buyerId": "user_789",
  "sellerId": "user_101",
  "quantity": 2,
  "totalPrice": 100,
  "status": "Pending",
  "orderDate": "2024-03-08T10:00:00Z"
}
```

#### Create an Order

**Endpoint:** `POST /api/orders`

**Request Body:**

```json
{
  "productId": "prod_456",
  "buyerId": "user_789",
  "quantity": 2,
  "shippingAddress": "123 Street, City"
}
```

**Response:**

```json
{
  "id": "order_123",
  "productId": "prod_456",
  "buyerId": "user_789",
  "sellerId": "user_101",
  "quantity": 2,
  "totalPrice": 100,
  "shippingAddress": "123 Street, City",
  "status": "Pending",
  "orderDate": "2024-03-08T10:00:00Z"
}
```

#### Update Order Status

**Endpoint:** `PUT /api/orders/:id/status`

**Request Body:**

```json
{
  "status": "Shipped"
}
```

**Response:**

```json
{
  "id": "order_123",
  "status": "Shipped"
}
```

## Project Structure

```
marketplace-backend/
│── controllers/
│   ├── orderController.js
│   ├── productController.js
│── routes/
│   ├── orderRoutes.js
│   ├── productRoutes.js
│── config/
│   ├── airtable.js
│── .env
│── server.js
│── package.json
│── README.md
```

## License

This project is licensed under the MIT License.
