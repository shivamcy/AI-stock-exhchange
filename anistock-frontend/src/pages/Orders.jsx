import React, { useEffect, useState } from 'react';
import api from '../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/users/auto-orders');
      setOrders(res.data);
    } catch (err) {
      toast.error('❌ Failed to fetch orders');
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await api.delete(`/api/users/auto-orders/${orderId}`);
      toast.success('🗑 Order deleted');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.error || '❌ Failed to delete order');
    }
  };

  return (
    <div className="min-h-screen px-6 py-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-400 to-violet-500 text-transparent bg-clip-text">
          📋 Your Auto Orders
        </h2>

        {orders.length === 0 ? (
          <p className="text-center text-gray-400">You don't have any auto orders.</p>
        ) : (
          <div className="overflow-auto rounded-xl border border-white/10 shadow-md">
            <table className="min-w-full bg-slate-800/40 text-white">
              <thead>
                <tr className="bg-slate-800 text-gray-300 text-sm">
                  <th className="py-3 px-4 text-left">Character</th>
                  <th className="py-3 px-4 text-left">Anime</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Qty</th>
                  <th className="py-3 px-4 text-left">Trigger Price</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Created</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, index) => (
                  <tr key={o._id} className={index % 2 === 0 ? 'bg-slate-900' : 'bg-slate-800'}>
                    <td className="py-2 px-4">{o.characterName}</td>
                    <td className="py-2 px-4">{o.anime}</td>
                    <td className="py-2 px-4">{o.type.toUpperCase()}</td>
                    <td className="py-2 px-4">{o.quantity}</td>
                    <td className="py-2 px-4">₹{o.triggerPrice}</td>
                    <td className={`py-2 px-4 font-semibold ${o.active ? 'text-green-400' : 'text-gray-400'}`}>
                      {o.active ? 'Active' : 'Inactive'}
                    </td>
                    <td className="py-2 px-4 text-sm">{new Date(o.createdAt).toLocaleString()}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleDelete(o._id)}
                        className="text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Toast Notification */}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          theme="dark"
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
        />
      </div>
    </div>
  );
}

export default Orders;
