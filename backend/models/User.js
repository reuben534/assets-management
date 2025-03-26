const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store as hashed value
    role: { type: String, enum: ['Admin', 'User'], default: 'User' },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

// Generate password reset token
userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
        
    // Token expires in 1 hour
    this.resetPasswordExpires = Date.now() + 3600000;
    
    return resetToken;
};

module.exports = mongoose.model('User', userSchema);