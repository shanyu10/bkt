require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Security Enhancements ---

const corsOptions = {
  origin: FRONTEND_URL,
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));

// 2. Input Validation & JSON Parsing
app.use(express.json()); // For parsing application/json

// 3. Rate Limiting: Apply to all requests to prevent brute-force attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all API routes
// app.use(apiLimiter);

// --- User Data (In a real app, this would be a database) ---
// For now, we'll keep the in-memory users array for the conceptual login/register
// but in a real app, these would interact with Supabase Auth and Database.


// --- Routes ---

// Conceptual Registration Endpoint (for demonstrating password hashing)
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  // Basic Input Validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Supabase registration error:', error);
      return res.status(400).json({ message: error.message });
    }

    // After successful signup, create a profile entry in public.users table
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert([
        { id: data.user.id, email: data.user.email, display_name: data.user.email.split('@')[0] } // Default display_name
      ]);

    if (profileError) {
      console.error('Supabase profile creation error:', profileError);
      // Optionally, handle this error more gracefully, e.g., delete the auth user
      return res.status(500).json({ message: 'Failed to create user profile.' });
    }

    res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.', user: data.user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'An error occurred during registration.' });
  }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Input Validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase login error:', error);
      return res.status(401).json({ message: error.message });
    }

    // If successful, Supabase returns a session and user object
    // We can then create our own JWT for consistency if needed, or use Supabase's session
    // For now, let's just return a success message and user info
    res.status(200).json({ message: 'Login successful!', access_token: data.session.access_token, user: data.user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login.' });
  }
});

// Resend Verification Email Endpoint
app.post('/api/resend-verification', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      console.error('Supabase resend verification error:', error);
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json({ message: 'Verification email sent. Please check your inbox.' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'An error occurred while resending verification email.' });
  }
});

// Middleware for JWT authentication
const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error('Supabase auth error:', error);
      return res.status(401).json({ message: error.message });
    }

    req.user = data.user;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Protected Profile Endpoint
app.get('/api/profile', auth, async (req, res) => {
  try {
    // In a real application, you would fetch the user's profile from the database
    // using req.user.id
    const { data, error } = await supabase
      .from('users') // Assuming a 'users' table in Supabase
      .select('id, email, display_name')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Failed to fetch profile.' });
  }
});

// Protected Wishlist Endpoints (conceptual)
app.get('/api/wishlist', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('wishlist')
      .select('product_id, products(*)') // Select product_id and all columns from the joined products table
      .eq('user_id', req.user.id);

    if (error) throw error;

    // Extract product details from the joined data
    const wishlistProducts = data.map(item => item.products);
    res.status(200).json({ items: wishlistProducts });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Failed to fetch wishlist.' });
  }
});

app.post('/api/wishlist', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    const { data, error } = await supabase
      .from('wishlist')
      .insert([{ user_id: req.user.id, product_id: productId }]);

    if (error) throw error;

    res.status(200).json({ message: `Product ${productId} added to wishlist for user ${req.user.id}` });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Failed to add to wishlist.' });
  }
});

app.delete('/api/wishlist/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', req.user.id)
      .eq('product_id', productId);

    if (error) throw error;

    res.status(200).json({ message: `Product ${productId} removed from wishlist for user ${req.user.id}` });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Failed to remove from wishlist.' });
  }
});

// Cart Endpoints
app.get('/api/cart', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cart')
      .select('product_id, quantity, products(*)') // Select product_id, quantity and all columns from joined products table
      .eq('user_id', req.user.id);

    if (error) throw error;

    const cartItems = data.map(item => ({
      id: item.products.id,
      name: item.products.name,
      price: item.products.price,
      quantity: item.quantity,
      image_url: item.products.imageUrl,
      // Add other product details as needed
    }));
    res.status(200).json({ items: cartItems });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Failed to fetch cart.' });
  }
});

app.post('/api/cart', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Check if item already exists in cart
    const { data: existingItem, error: existingError } = await supabase
      .from('cart')
      .select('id, quantity')
      .eq('user_id', req.user.id)
      .eq('product_id', productId)
      .single();

    if (existingError && existingError.code !== 'PGRST116') { // PGRST116 means no rows found
      throw existingError;
    }

    if (existingItem) {
      // Update quantity if item exists
      const { data, error } = await supabase
        .from('cart')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id);

      if (error) throw error;
      res.status(200).json({ message: `Product ${productId} quantity updated in cart.` });
    } else {
      // Insert new item if it doesn't exist
      const { data, error } = await supabase
        .from('cart')
        .insert([{ user_id: req.user.id, product_id: productId, quantity }]);

      if (error) throw error;
      res.status(201).json({ message: `Product ${productId} added to cart.` });
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Failed to add to cart.' });
  }
});

app.put('/api/cart/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive number.' });
    }

    const { data, error } = await supabase
      .from('cart')
      .update({ quantity })
      .eq('user_id', req.user.id)
      .eq('product_id', productId);

    if (error) throw error;
    res.status(200).json({ message: `Product ${productId} quantity updated to ${quantity}.` });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    res.status(500).json({ message: 'Failed to update cart item quantity.' });
  }
});

app.delete('/api/cart/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', req.user.id)
      .eq('product_id', productId);

    if (error) throw error;

    res.status(200).json({ message: `Product ${productId} removed from cart.` });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Failed to remove from cart.' });
  }
});

// Example Supabase Data Fetching Endpoint
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching products from Supabase:', error);
    res.status(500).json({ message: 'Failed to fetch products.' });
  }
});

app.put('/api/profile/password', auth, async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('Supabase password update error:', error);
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'An error occurred during password update.' });
  }
});

app.put('/api/profile/display-name', auth, async (req, res) => {
  const { display_name } = req.body;

  if (!display_name || display_name.trim() === '') {
    return res.status(400).json({ message: 'Display name cannot be empty.' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .update({ display_name })
      .eq('id', req.user.id);

    if (error) {
      console.error('Supabase display name update error:', error);
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json({ message: 'Display name updated successfully.' });
  } catch (error) {
    console.error('Error updating display name:', error);
    res.status(500).json({ message: 'An error occurred during display name update.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
