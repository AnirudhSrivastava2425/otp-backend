require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const connectDB = require('./config/db')

const otp = require('./models/userModal')

const app = express();

connectDB()

// Middlewares
app.use(cors());
app.use(express.json());



app.get('/:id', async (req, res) => {
    const user = await otp.findById(req.params.id)
    res.json(user)
})


// otp creation and mailing route
app.post('/', async (req, res) => {
    let dummyOTP = Math.floor(Math.random() * 10000)
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
    try {
        const info = await transporter.sendMail({
            from: '"Test Sender" <test@example.com>',
            to: req.body.email,
            subject: "Test Email",
            text: "This is a test email sent via Ethereal!",
            html: `<p>Please share the otp <b>${dummyOTP}</b> sent via Ethereal!</p>`,
        });
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log("Preview URL: %s", previewUrl);
        try {
            const user = await otp.create({email:req.body.email, otp:dummyOTP});
            res.status(200).json({ status: 'send',userID:user._id })
        } catch (error) {
            console.log(error)
            res.status(400).json({ status:'database failed',message: error.message });
        }
        
    } catch (error) {
        res.status(500).json({ status: 'Mail SMTP failed', err: error })
    }
})


// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
