import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/admin/NavbarAdmin';
import { List, ListItem, ListItemText, ListItemIcon, Paper, Typography } from '@mui/material';
import BedIcon from '@mui/icons-material/Bed';

const AdminPanel = () => {
  const [userData, setUserData] = useState(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      try {
        // Mengambil data profil pengguna
        const userResponse = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(userResponse.data.user);
      } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data pengguna:', error);
      }
    };

    const fetchRooms = async () => {
      try {
        // Mengambil data kamar
        const roomsResponse = await axios.get('http://localhost:5000/api/rooms/kamar');
        setRooms(roomsResponse.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchUserData();
    fetchRooms();
  }, []);

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="dashboard-header">
          <h2>Dashboard</h2>
          {userData ? (
            <div className="user-info">
              <p>Selamat datang, <strong>{userData.name}</strong></p>
              <p>Email: {userData.email}</p>
            </div>
          ) : (
            <p>Memuat data pengguna...</p>
          )}
        </div>
        
        <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
          <Typography variant="h5" gutterBottom>
            List of Rooms
          </Typography>
          <List>
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <ListItem key={room.id}>
                  <ListItemIcon>
                    <BedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Room ${room.room_number}`}
                    secondary={`Price: Rp ${room.price.toLocaleString()} | Owner: ${room.users?.name || 'Unknown'}`} // Menampilkan nama owner
                  />
                </ListItem>
              ))
            ) : (
              <Typography variant="body1" color="textSecondary">
                No rooms available.
              </Typography>
            )}
          </List>
        </Paper>
      </div>
    </>
  );
};

export default AdminPanel;