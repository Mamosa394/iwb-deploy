import React, { useEffect, useState } from 'react';
import '../styles/salesdashboard.css'; // link to the styles

function SalesDashboard() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('https://backend-8-gn1i.onrender.com/api/sales')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch sales');
        return res.json();
      })
      .then((data) => {
        setSales(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Sales Dashboard</h2>

      {loading ? (
        <p className="info-text">Loading sales...</p>
      ) : error ? (
        <p className="error-text">Error: {error}</p>
      ) : sales.length === 0 ? (
        <p className="info-text">No sales found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="sales-table">
            <thead>
              <tr>
                <th>Sale ID</th>
                <th>Client</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale._id}>
                  <td>{sale._id}</td>
                  <td>{sale.client}</td>
                  <td>{sale.product}</td>
                  <td>${sale.amount}</td>
                  <td>{new Date(sale.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SalesDashboard;
