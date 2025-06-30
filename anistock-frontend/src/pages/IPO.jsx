import React, { useEffect, useState } from 'react';
import api from '../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function IPO() {
  const [ipos, setIpos] = useState([]);

  useEffect(() => {
    fetchIpos();
  }, []);

  const fetchIpos = async () => {
    try {
      const res = await api.get('/api/ipo');
      setIpos(res.data);
    } catch (err) {
      toast.error('❌ Failed to fetch IPOs');
    }
  };

  const handleApply = async (ipoId) => {
    try {
      const res = await api.post(`/api/ipo/apply/${ipoId}`);
      toast.success(res.data.message);
      fetchIpos();
    } catch (err) {
      toast.error(err.response?.data?.error || '❌ Failed to apply for IPO');
    }
  };

  const isDeadlinePassed = (deadline) => new Date(deadline) < new Date();

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-amber-400 to-pink-500 text-transparent bg-clip-text mb-8">
          🚀 Available IPOs
        </h2>

        {ipos.length === 0 ? (
          <p className="text-center text-gray-400">No IPOs currently available.</p>
        ) : (
          <div className="space-y-6">
            {ipos.map((ipo) => (
              <div
                key={ipo._id}
                className="bg-slate-800/30 border border-white/10 rounded-xl p-6 shadow-xl hover:shadow-pink-400/10 transition"
              >
                <h3 className="text-xl font-bold text-white mb-2">
                  {ipo.character?.name || 'Unnamed Character'}
                </h3>
                <div className="text-gray-300 text-sm mb-2">
                  <p><strong>Price per Share:</strong> ₹{ipo.price}</p>
                  <p><strong>Total Shares:</strong> {ipo.totalShares}</p>
                  <p><strong>Deadline:</strong> {new Date(ipo.deadline).toLocaleString()}</p>
                  <p><strong>Applicants:</strong> {ipo.appliedUsers?.length || 0}</p>
                </div>

                {isDeadlinePassed(ipo.deadline) ? (
                  <p className="text-sm text-gray-500 mt-2">⏱ IPO Closed</p>
                ) : ipo.alreadyApplied ? (
                  <p className="text-green-400 font-semibold mt-2">✅ Already Applied</p>
                ) : (
                  <button
                    onClick={() => handleApply(ipo._id)}
                    className="mt-4 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-all"
                  >
                    Apply
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Toast container */}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          theme="dark"
          pauseOnHover
        />
      </div>
    </div>
  );
}

export default IPO;
