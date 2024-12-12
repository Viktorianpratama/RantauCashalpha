import { useState } from 'react';
import axios from 'axios';
import { Paper, TextField, Button, Typography } from '@mui/material';
import NavbarAdmin from './NavbarAdmin'

const AddRoomForm = () => {
  const [roomNumber, setRoomNumber] = useState('');
  const [price, setPrice] = useState('');
  const [ownerId, setOwnerId] = useState('');

  const handleAddRoom = async (e) => {
    e.preventDefault();

    if (!roomNumber || !price || !ownerId) {
      alert('All fields are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/rooms/kamarAdd', {
        room_number: roomNumber,
        price: parseFloat(price),
        owner_id: ownerId,
      });

      alert(response.data.message);
      setRoomNumber('');
      setPrice('');
      setOwnerId('');
    } catch (error) {
      console.error('Error adding room:', error.response?.data || error.message);
      alert('Failed to add room.');
    }
  };

  return (
    <>
    <NavbarAdmin/>
    <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
      <Typography variant="h5" gutterBottom>
        Add New Room
      </Typography>
      <form onSubmit={handleAddRoom}>
        <TextField
          label="Room Number"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Owner ID"
          value={ownerId}
          onChange={(e) => setOwnerId(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
          Add Room
        </Button>
      </form>
    </Paper>
    </>
  );
};

export default AddRoomForm;