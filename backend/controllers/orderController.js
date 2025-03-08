// api/orders
const { ordersTable, productsTable } = require("../config/airtable");

exports.getOrders = async (req, res) => {
  try {
    const userId = req.query.userId;
    let orders;

    if (userId) {
      const buyerRecords = await ordersTable
        .select({
          filterByFormula: `{buyerId} = '${userId}'`,
        })
        .all();

      const sellerRecords = await ordersTable
        .select({
          filterByFormula: `{sellerId} = '${userId}'`,
        })
        .all();

      const combinedRecords = [...buyerRecords, ...sellerRecords];
      const uniqueRecords = [
        ...new Map(combinedRecords.map((item) => [item.id, item])).values(),
      ];

      orders = uniqueRecords.map((record) => ({
        id: record.id,
        ...record.fields,
      }));
    } else {
      const records = await ordersTable.select().all();
      orders = records.map((record) => ({
        id: record.id,
        ...record.fields,
      }));
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const record = await ordersTable.find(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = {
      id: record.id,
      ...record.fields,
    };

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch order", error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { productId, buyerId, quantity, shippingAddress } = req.body;

    if (!productId || !buyerId || !quantity) {
      return res
        .status(400)
        .json({ message: "ProductId, buyerId, and quantity are required" });
    }

    const productRecord = await productsTable.find(productId);

    if (!productRecord) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = {
      id: productRecord.id,
      ...productRecord.fields,
    };

    const sellerId = product.sellerId;
    const totalPrice = product.price * quantity;

    const newRecord = await ordersTable.create({
      productId: [productId], 
      productName: product.name,
      buyerId,
      sellerId,
      quantity: parseInt(quantity),
      totalPrice,
      shippingAddress,
      status: "Pending",
      orderDate: new Date().toISOString(),
    });

    const order = {
      id: newRecord.id,
      ...newRecord.fields,
    };

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ message: "Failed to create order", error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedRecord = await ordersTable.update(orderId, {
      status,
      updatedAt: new Date().toISOString(),
    });

    const order = {
      id: updatedRecord.id,
      ...updatedRecord.fields,
    };

    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    res
      .status(500)
      .json({ message: "Failed to update order", error: error.message });
  }
};
