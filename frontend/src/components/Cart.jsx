import React from "react";
import axios from "axios";
import { X, Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Cart = ({ isOpen, onClose }) => {
  const { cart, restaurantId, updateQty, removeItem, clearCart } = useCart();
  const { token } = useAuth();

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    if (!cart.length) return;

    try {
      await axios.post(
        "http://localhost:3000/order/create",
        {
          restaurantId,
          items: cart,
          totalAmount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      clearCart();
      onClose();
      alert("Order placed successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    }
  };

  // Render nothing if cart is closed
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 hover:cursor-pointer transition-opacity duration-300"
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ right: 0 }} // stick to right edge
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Your Cart</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer active:scale-95 transition"
          >
            <X />
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
              className="bg-gray-50 rounded-xl p-4 flex justify-between items-center shadow-sm"
            >
              {/* Info */}
              <div>
                <h4 className="font-medium text-gray-800">{item.name}</h4>
                <p className="text-sm text-gray-500">₹{item.price}</p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      updateQty(item.menuItem, Math.max(1, item.quantity - 1))
                    }
                    className="px-2 py-1 hover:bg-gray-200 hover:cursor-pointer transition"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="px-3 text-sm font-medium">{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQty(item.menuItem, item.quantity + 1)
                    }
                    className="px-2 py-1 hover:bg-gray-200 hover:cursor-pointer transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.menuItem)}
                  className="text-red-500 hover:text-red-600 text-sm hover:cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-4 border-t bg-white sticky bottom-0">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Total</span>
              <span className="text-xl font-semibold text-gray-800">₹{totalAmount}</span>
            </div>

            <button
              onClick={placeOrder}
              className="w-full bg-amber-500 text-white py-3 rounded-xl font-medium hover:bg-amber-600 hover:cursor-pointer active:scale-95 transition"
            >
              Place Order
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
