// serverecom.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
// const upload = multer({ dest: 'uploads/' });
const app = express();
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Setup multer cho file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage });

// setup để kết nối mysql
const db = mysql.createConnection({
    host: '127.0.0.1',  // địa chỉ localhost của mysql
    port: 3306,          // MySQL port
    user: 'root',        // username của mysql
    password: '123456789',  // password của mysql
    database: 'oncuoiky'   // database
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Endpoint hiển thị danh sách users
app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users'; // Tên bảng là `users` trong MySQL
    db.query(query, (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Lỗi máy chủ' });
        }
        res.json(result); // Trả về danh sách người dùng
    });
});

// Endpoint để thêm user
app.post('/users/add', upload.single('avatar'), (req, res) => {
    const { username, password, email, role, birthday } = req.body;
    const avatar = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null;

    if (!username || !password || !email || !role || !birthday) {
        return res.status(400).send({ error: 'Vui lòng điền đầy đủ thông tin.' });
    }

    // Kiểm tra username hoặc email đã tồn tại
    const checkQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.query(checkQuery, [username, email], (err, result) => {
        if (err) return res.status(500).send({ error: 'Lỗi máy chủ.' });
        if (result.length > 0) {
            return res.status(409).send({ error: 'Username hoặc email đã tồn tại.' });
        }

        // Lấy MAX(id) hiện tại từ bảng users
        const getMaxIdQuery = 'SELECT MAX(id) AS maxId FROM users';
        db.query(getMaxIdQuery, (err, result) => {
            if (err) return res.status(500).send({ error: 'Lỗi máy chủ khi lấy MAX(id).' });

            const maxId = result[0].maxId || 0; // Nếu bảng rỗng, maxId là 0
            const newId = maxId + 1; // Tăng ID mới

            // Thêm user mới vào database với ID tự tăng
            const query = `
                INSERT INTO users (id, username, password, email, role, birthday, avatar) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            db.query(query, [newId, username, password, email, role, birthday, avatar], (err, result) => {
                if (err) return res.status(500).send({ error: 'Lỗi máy chủ khi thêm user.' });
                res.status(201).send({ message: 'User được thêm thành công!' });
            });
        });
    });
});


// Endpoint để xóa tài khoản
app.delete('/delete-user', express.json(), (req, res) => {
    const { username } = req.body;

    // Kiểm tra xem username có tồn tại không
    const checkQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(checkQuery, [username], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi máy chủ' });
        }

        // Nếu không tìm thấy user
        if (result.length === 0) {
            return res.status(404).json({ message: 'Username không tồn tại' });
        }

        // Xóa user
        const deleteQuery = 'DELETE FROM users WHERE username = ?';
        db.query(deleteQuery, [username], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Lỗi máy chủ' });
            }
            res.json({ message: 'Xóa user thành công' });
        });
    });
});


// Endpoint to update user
app.put('/update-user', upload.single('avatar'), (req, res) => {
    const { id, username, email, password, role, birthday } = req.body;

    const avatar = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : req.body.avatar;

    const updateQuery = `
        UPDATE users
        SET username = ?, email = ?, password = ?, role = ?, birthday = ?, avatar = ?
        WHERE id = ?
    `;

    db.query(updateQuery, [username, email, password, role, birthday, avatar, id], (err, result) => {
        if (err) {
            console.error('Lỗi update user:', err);
            return res.status(500).json({ error: 'Lỗi máy chủ' });
        }

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Cập nhật user thành công' });
        } else {
            res.status(400).json({ error: 'User không tìm thấy' });
        }
    });
});

// Endpoint đăng nhập
app.post('/login', express.json(), (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi máy chủ' });
        }
        if (result.length > 0) {
            res.json({ 
                message: 'Đăng nhập thành công', 
                user: result[0], 
                role: result[0].role
            });
        } else {
            res.status(401).json({ message: 'Email hoặc password không hợp lệ' });
        }
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});