import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="w-full md:w-[50vw] lg:w-[25vw] p-4 ">
      <div className="bg-white border border-slate-300  rounded-lg shadow-2xl h-full overflow-hidden">
        <img
          src={product.imageUrl || "https://via.placeholder.com/300"}
          className="w-full h-48 object-contain"
          alt={product.name}
        />
        <div className="p-4 flex flex-col h-full">
          <h5 className="text-lg font-bold mb-2">{product.name}</h5>
          <p className="text-gray-600 line-clamp-2 h-[7vh]">
            {product.description}
          </p>
          <p className="text-lg font-semibold mt-2 text-gray-800">
            ${product.price.toFixed(2)}
          </p>
          <Link
            to={`/products/${product.id}`}
            className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md text-center hover:bg-blue-700 transition duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
