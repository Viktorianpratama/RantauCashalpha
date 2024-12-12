import { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Paper, Typography } from '@mui/material';
import './AddPayment.css';  // Import CSS file
import NavbarAdmin from './NavbarAdmin';

const AddPayment = () => {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    userId: '',
    roomId: '',
    amount: '',
    status: 'unpaid',
    due_date: '',
  });

  // Ambil data pengguna dan kamar saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:5000/api/users');
        const roomsResponse = await axios.get('http://localhost:5000/api/rooms');
        console.log('Users:', usersResponse.data);
        console.log('Rooms:', roomsResponse.data);
  
        setUsers(usersResponse.data);
        setRooms(roomsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/payments/add-payment', formData);
      console.log('Payment added:', response.data);
      alert('Payment successfully added!');
    } catch (error) {
      console.error('Error adding payment:', error);
      alert('Failed to add payment.');
    }
  };

  return (
    <>
    <NavbarAdmin/>
    <Paper className="add-payment-container">
      <Typography variant="h5" gutterBottom>
        Add New Payment
      </Typography>
      <form onSubmit={handleSubmit}>
        {/* Dropdown untuk memilih pengguna */}
        <TextField
          select
          label="Select User"
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </TextField>

        {/* Dropdown untuk memilih kamar */}
        <TextField
          select
          label="Select Room"
          name="roomId"
          value={formData.roomId}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {rooms.map((room) => (
            <MenuItem key={room.id} value={room.id}>
              {room.room_number}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Due Date"
          name="due_date"
          type="date"
          value={formData.due_date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Payment
        </Button>
      </form>
    </Paper>
    </>
  );
};

export default AddPayment;
