import { useEffect, useState } from 'react';
import api from '../api';
import {
  Line
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

function Home() {
  const [stocks, setStocks] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stockRes = await api.get('/api/characters');
        setStocks(stockRes.data);
  
        const trendingRes = await api.get('/api/characters/trending');
        setTrending(trendingRes.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
  
    fetchData(); // initial call
  
    const interval = setInterval(fetchData, 10000); // every 10 sec
  
    return () => clearInterval(interval); // cleanup on unmount
  }, []);
  

  // Sample time-based price data simulation (for demo)
  const labels = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM'];
  const datasets = stocks.map((char) => ({
    label: char.name,
    data: char.history?.map(p => p.price) || Array(5).fill(char.price),
    borderColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    tension: 0.3
  }));
 //smooth updating of graph
  const options = {
    responsive: true,
    animation: {
      duration: 1000,
    },
    plugins: {
      legend: { position: 'top' },
    },
  };
  

  const chartData = {
    labels,
    datasets
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ padding: '20px' }}>
        <h2>📈 Stock Dashboard </h2>
        <h3>With AI enabled stock prediction</h3>
        <p>Live price trends of anime character stocks.</p>
      </header>

      <main style={{ display: 'flex', flex: 1, padding: '20px' }}>
        {/* Left - Graph */}
        <div style={{ flex: 3 }}>
          <Line data={chartData} />
        </div>

        {/* Right - Trending */}
        <div style={{ flex: 1, marginLeft: '30px' }}>
          <h3>🔥 Trending Characters</h3>
          {trending.map((char, idx) => (
            <div key={char._id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
              <strong>#{idx + 1}</strong> {char.name}
              <p>Price: {char.price} berries</p>
            </div>
          ))}
        </div>
      </main>

      <footer style={{
        background: '#222',
        color: '#fff',
        padding: '20px',
        textAlign: 'center',
        marginTop: 'auto'
      }}>
        <p>&copy; 2025 Grand Line Exchange</p>
        <div style={{ marginTop: '10px', color: '#fff', textAlign: 'center' }}>
  Developed by 
  <a
    href="https://github.com/shivamcy"
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: '#00bfff', margin: '0 5px', textDecoration: 'none', fontWeight: 'bold' }}
  >
    shivamcy
  </a>
  , wearing the Straw Hat ☠️ 
</div>

      </footer>
    </div>
  );
}

export default Home;
