import { createPortal } from "react-dom";
import { X, Minus, Plus, Trash2, ShoppingBasket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cart, restaurantId, updateQty, removeItem } = useCart();

  if (!isOpen) return null;

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = () => {
    if (!cart.length) return;
    onClose();
    navigate("/confirmation", {
      state: { restaurantId, items: cart, totalAmount },
    });
  };

  const cartContent = (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-9998 transition-opacity cursor-pointer"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-9999 shadow-2xl
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-800">Your Cart</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors hover:cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <ShoppingBasket size={48} className="mb-2 opacity-20" />
              <p className="text-lg font-bold text-slate-800">Cart is empty</p>
              <p className="text-sm">Add some items to start!</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.menuItem} className="flex gap-4 items-center bg-slate-50 rounded-2xl p-3 border border-slate-100">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 shadow-sm">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200 text-xs">No Image</div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800 truncate capitalize mr-2">
                      {item.name}
                    </h4>
                    {/* --- REMOVE BUTTON --- */}
                    <button 
                      onClick={() => removeItem(item.menuItem)}
                      className="text-slate-500 hover:cursor-pointer hover:text-red-500 transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center bg-white rounded-lg border border-slate-200 p-1">
                      <button 
                        onClick={() => updateQty(item.menuItem, Math.max(1, item.quantity - 1))} 
                        className="p-1 hover:text-amber-500"
                      >
                        <Minus size={12}/>
                      </button>
                      <span className="px-2 text-xs font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQty(item.menuItem, item.quantity + 1)} 
                        className="p-1 hover:text-amber-500"
                      >
                        <Plus size={12}/>
                      </button>
                    </div>
                    <p className="text-sm font-black text-slate-900">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-6 border-t bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Total Amount</span>
              <span className="text-xl font-black text-slate-900">₹{totalAmount}</span>
            </div>
            <button
              onClick={placeOrder}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm active:scale-95 transition-all hover:cursor-pointer"
            >
              Checkout Now
            </button>
          </div>
        )}
      </div>
    </>
  );

  return createPortal(cartContent, document.body);
};

export default Cart;