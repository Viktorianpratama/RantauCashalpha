import express from 'express';

const roomsRoutes = (supabase) => {
    const router = express.Router();
  
    router.get('/', async (req, res) => {
      try {
        const { data: rooms, error } = await supabase
          .from('rooms')
          .select('id,room_number');
    
        if (error) {
          return res.status(500).json({ error: 'Failed to fetch rooms' });
        }
    
        res.status(200).json(rooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ error: 'Failed to fetch rooms' });
      }
    });

    // Endpoint untuk mendapatkan data kamar dengan nama pemilik
    router.get('/kamar', async (req, res) => {
      try {
        const { data, error } = await supabase
          .from('rooms')
          .select(`
            id,
            room_number,
            price,
            owner_id,
            users (name) -- Relasi tabel users dengan mengambil kolom name
          `);
    
        if (error) {
          console.error('Error fetching rooms:', error);
          return res.status(500).json({ error: 'Gagal mengambil data kamar.' });
        }
    
        res.status(200).json(data);
      } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Terjadi kesalahan di server.' });
      }
    });
    
  
    //Endpoint untuk menambahkan kamar baru
    router.post('/kamaradd', async (req, res) => {
      const { room_number, price, owner_id } = req.body;
    
      if (!room_number || !price || !owner_id) {
        return res.status(400).json({ error: 'Semua field harus diisi.' });
      }
    
      try {
        const { data, error } = await supabase
          .from('rooms')
          .insert([{ room_number, price, owner_id }])
          .select(); // Gunakan .select() untuk mengembalikan hasil
    
        // Tambahkan logging untuk debugging
        console.log('Insert result:', data, error);
    
        if (error || !data || data.length === 0) {
          console.error('Error adding room:', error || 'No data returned.');
          return res.status(500).json({ error: 'Gagal menambahkan kamar.' });
        }
    
        res.status(201).json({ message: 'Kamar berhasil ditambahkan.', room: data[0] });
      } catch (err) {
        console.error('Unexpected server error:', err);
        res.status(500).json({ error: 'Terjadi kesalahan di server.' });
      }
    });
    
    
    return router;
  };

  export default roomsRoutes;