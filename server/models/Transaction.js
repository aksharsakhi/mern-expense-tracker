const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Please specify an amount'],
      min: [0.01, 'Amount must be greater than zero']
    },
    type: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: {
        values: ['income', 'expense'],
        message: 'Type must be either income or expense'
      },
      lowercase: true,
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: [50, 'Category cannot exceed 50 characters']
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: {
        values: ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Other'],
        message: '{VALUE} is not a supported payment method'
      },
      default: 'UPI'
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Note cannot exceed 500 characters'],
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for performance when filtering by date, type, and category
TransactionSchema.index({ date: -1 });
TransactionSchema.index({ type: 1, date: -1 });
TransactionSchema.index({ category: 1 });

module.exports = mongoose.model('Transaction', TransactionSchema);
