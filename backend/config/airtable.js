const Airtable = require("airtable");
const dotenv = require("dotenv");

dotenv.config();

Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
const productsTable = base("Products");
const ordersTable = base("Orders");

module.exports = {
  productsTable,
  ordersTable,
};
