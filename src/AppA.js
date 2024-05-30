import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Chart from './components/TradingChart/TradingChart';
import OrderBook from './components/OrderBook/OrderBook';
import OrderForm from './components/OrderForm/OrderForm';
import OrderHistory from './components/OrderHistory/OrderHistory';

const socket = io('http://localhost:4000');

function App() {
  const [pair, setPair] = useState('BTCUSDT');
  const [balance, setBalance] = useState(10000);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    socket.on('orderUpdate', (order) => {
      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.map((o) =>
          o.id === order.id ? order : o
        );
        return updatedOrders;
      });
    });

    socket.on('newOrder', (order) => {
      setOrders((prevOrders) => [...prevOrders, order]);
    });

    return () => {
      socket.off('orderUpdate');
      socket.off('newOrder');
    };
  }, []);

  const handleNewOrder = (order) => {
    socket.emit('newOrder', order);
  };

  return (
    <div>
      <h1>Crypto Trading Simulator</h1>
      <div>
        <label>Select Pair: </label>
        <select value={pair} onChange={(e) => setPair(e.target.value)}>
          <option value='BTCUSDT'>BTC/USDT</option>
          <option value='ETHBTC'>ETH/BTC</option>
          <option value='LTCUSDT'>LTC/USDT</option>
          <option value='XRPUSDT'>XRP/USDT</option>
        </select>
      </div>
      <Chart pair={pair} />
      {/* <OrderBook pair={pair} />
      <OrderForm pair={pair} balance={balance} onNewOrder={handleNewOrder} />
      <OrderHistory orders={orders} /> */}
    </div>
  );
}

export default App;
