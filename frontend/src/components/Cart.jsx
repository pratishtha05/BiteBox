import React from "react";
import axios from "axios";
import { X, Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Cart = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cart, restaurantId, updateQty, removeItem } = useCart();
  const { token } = useAuth();

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = () => {
  if (!cart.length) return;

  onClose();

  navigate("/confirmation", {
    state: {
      restaurantId,
      items: cart,
      totalAmount,
    },
  });
};


  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 cursor-pointer transition-opacity duration-300"
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="px-6 py-4 space-y-4 overflow-y-auto h-[calc(100%-190px)]">
          {cart.length === 0 && (
            <div className="flex flex-col items-center justify-center text-gray-400 h-full">
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm mt-1">Add items to get started</p>
            </div>
          )}

          {cart.map((item) => (
            <div
              key={item.menuItem}
              className="flex gap-4 items-center bg-gray-50 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
            >
              {/* Optional Image */}
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                {item.image ? (
                  <img
                    src={`http://localhost:3000${item.image}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </div>

              {/* Item Info */}
              <div className="flex-1 flex flex-col justify-between h-full">
                <div>
                  <h4 className="font-medium text-gray-800 capitalize">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">₹{item.price}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        updateQty(item.menuItem, Math.max(1, item.quantity - 1))
                      }
                      className="px-2 py-1 hover:bg-gray-200 active:scale-95 transition"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.menuItem, item.quantity + 1)}
                      className="px-2 py-1 hover:bg-gray-200 active:scale-95 transition"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.menuItem)}
                    className="text-red-500 hover:text-red-600 text-sm active:scale-95 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Item Total Price */}
              <div className="font-semibold text-gray-800">
                ₹{item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-4 border-t bg-white sticky bottom-0">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium">Total</span>
              <span className="text-xl font-bold text-gray-800">₹{totalAmount}</span>
            </div>

            <button
              onClick={placeOrder}
              className="w-full bg-amber-500 text-white py-3 rounded-xl font-medium hover:bg-amber-600 active:scale-95 transition"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
