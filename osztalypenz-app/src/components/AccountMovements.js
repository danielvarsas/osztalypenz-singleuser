import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; // Import the new CSS file

const AccountMovements = () => {
  const [movements, setMovements] = useState([]);
  const [balance, setBalance] = useState(0); // State to store the balance

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/account-movements');
        setMovements(response.data);

        // Calculate the balance
        const calculatedBalance = response.data.reduce((acc, movement) => {
          // Ensure the amount is treated as a number
          const amount = parseFloat(movement.amount) || 0;
          return movement.type === 'add' ? acc + amount : acc - amount;
        }, 0);

        setBalance(calculatedBalance); // Update the balance state
      } catch (error) {
        console.error('Error fetching account movements:', error);
      }
    };

    fetchMovements();
  }, []);

  // Function to determine the row background color
  const getRowStyle = (reason) => {
    return reason === 'Befizetés' ? { backgroundColor: '#4297a0' } : { backgroundColor: '#e57f84' };
  };

  // Function to format the amount without decimals
  const formatAmount = (amount) => {
    return `${Math.round(amount)} Ft`; // Rounds to the nearest integer and adds "Ft"
  };

  return (
    <section>
      <h1>Pénzmozgások</h1>
      {/* Display the balance */}
      <h2 style={{ textAlign: 'center', color: 'black', margin: '20px 0' }}>Egyenleg: {formatAmount(balance)}</h2>
      <div className="tbl-header">
        <table>
          <thead>
            <tr>
              <th>Gyermek neve</th>
              <th>Befizetés / Kivét</th>
              <th>Összeg</th>
              <th>Ok</th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="tbl-content">
        <table>
          <tbody>
            {movements.map((movement, index) => (
              <tr key={index} style={getRowStyle(movement.reason || 'Befizetés')}>
                <td>{movement.child_name}</td>
                <td>{movement.type === 'add' ? 'Befizetés' : 'Kivét'}</td>
                <td>{formatAmount(movement.amount)}</td>
                <td>{movement.reason || 'Befizetés'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AccountMovements;
