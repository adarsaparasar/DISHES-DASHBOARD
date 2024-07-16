import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('https://dishes-app.onrender.com');

function App() {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    axios.get('https://dishes-app.onrender.com/api/dishes')
      .then(response => {
        setDishes(response.data);
      });

    socket.on('dishUpdated', updatedDish => {
      setDishes(prevDishes => 
        prevDishes.map(dish => 
          dish.dishId === updatedDish.dishId ? updatedDish : dish
        )
      );
    });
  }, []);

  const togglePublished = (dishId) => {
    axios.put(`https://dishes-app.onrender.com/api/dishes/${dishId}/toggle`)
      .then(response => {
        setDishes(prevDishes => 
          prevDishes.map(dish => 
            dish.dishId === response.data.dishId ? response.data : dish
          )
        );
      });
  };

  return (
    <div className="container mx-auto p-4">
  <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Dishes Dashboard</h1>
  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {dishes.map(dish => (
      <li key={dish.dishId} className="bg-white shadow-lg rounded-lg overflow-hidden">
        <img src={dish.imageUrl} alt={dish.dishName} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h2 className="text-xl md:text-2xl font-semibold mb-2">{dish.dishName}</h2>
          <p className="text-gray-600 mb-4">Published: {dish.isPublished ? 'Yes' : 'No'}</p>
          <button
            onClick={() => togglePublished(dish.dishId)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Toggle Published
          </button>
        </div>
      </li>
    ))}
  </ul>
</div>

  );
}

export default App;