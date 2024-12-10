const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage });

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/oncuoiky')
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.error('MongoDB connection error:', err));

// Define User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    birthday: { type: Date, required: true },
    avatar: { type: String }
});

const User = mongoose.model('User', userSchema);

// Endpoint to fetch all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
});

// Endpoint to add a new user
app.post('/users/add', upload.single('avatar'), async (req, res) => {
    const { username, password, email, role, birthday } = req.body;
    const avatar = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null;

    if (!username || !password || !email || !role || !birthday) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin.' });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ error: 'Username hoặc email đã tồn tại.' });
        }

        const newUser = new User({ username, password, email, role, birthday, avatar });
        await newUser.save();

        res.status(201).json({ message: 'User được thêm thành công!' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi máy chủ khi thêm user.' });
    }
});

// Endpoint to delete a user
app.delete('/delete-user', async (req, res) => {
    const { username } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'Username không tồn tại' });
        }

        await User.deleteOne({ username });
        res.json({ message: 'Xóa user thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
});

// Endpoint to update a user
app.put('/update-user', upload.single('avatar'), async (req, res) => {
    const { id, username, email, password, role, birthday } = req.body;
    const avatar = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : req.body.avatar;

    // Validate the user ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Validate that required fields are provided
    if (!username || !email || !password || !role || !birthday) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Update the user in the database
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, email, password, role, birthday, avatar },
            { new: true } // Return the updated document
        );

        // Check if the user was found and updated
        if (updatedUser) {
            res.status(200).json({ message: 'Cập nhật user thành công', user: updatedUser });
        } else {
            res.status(404).json({ error: 'User không tìm thấy' });
        }
    } catch (error) {
        console.error('Lỗi update user:', error);
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
});
// Endpoint đăng nhập
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Tìm kiếm người dùng theo email và password
        const user = await User.findOne({ email, password });

        if (user) {
            res.json({
                message: 'Đăng nhập thành công',
                user: user,
                role: user.role,
            });
        } else {
            res.status(401).json({ message: 'Email hoặc password không hợp lệ' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
});

// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
