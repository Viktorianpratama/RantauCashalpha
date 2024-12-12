import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../middleware/authMiddleware.js';

const userRoutes = (supabase) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('id, name');
  
      if (error) {
        return res.status(500).json({ error: 'Failed to fetch users' });
      }
  
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });
  

  // Login endpoint
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !data || !bcrypt.compareSync(password, data.password)) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      const token = jwt.sign(
        { id: data.id, role: data.role },
        process.env.JWT_SECRET || 'secret-key',
        { expiresIn: '1h' }
      );

      res.status(200).json({ message: 'Login successful.', token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error.' });
    }
  });

  // Register endpoint
  router.post('/register', async (req, res) => {
    const { email, password, name, role = 'penghuni' } = req.body; // Default role
  
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
  
    try {
      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
  
      if (checkError && checkError.code !== 'PGRST116') {
        return res.status(500).json({ error: 'Error checking existing user.' });
      }
  
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists.' });
      }
  
      // Hash password
      const hashedPassword = bcrypt.hashSync(password, 10);
  
      // Insert new user
      const { error: insertError } = await supabase
        .from('users')
        .insert([{ email, password: hashedPassword, name, role }]);
  
      if (insertError) {
        console.error('Database Insert Error:', insertError);
        return res.status(500).json({ error: 'Failed to register user.' });
      }
  
      res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error.' });
    }
  });
  


  // Profile endpoint
  router.get('/profile', verifyToken, async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('id', req.user.id)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'User not found.' });
      }

      res.status(200).json({ user: data });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error.' });
    }
  });

  return router;
};

export default userRoutes;
