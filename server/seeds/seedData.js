const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Transaction = require('../models/Transaction');

dotenv.config({ path: __dirname + '/../.env' });

const sampleTransactions = [
  // --- OCTOBER 2026 (Current Evaluation Month) ---
  {
    amount: 85000,
    type: 'income',
    category: 'Salary',
    date: new Date('2026-10-01T09:00:00Z'),
    paymentMethod: 'Net Banking',
    note: 'October Senior Full-Stack Engineering Salary'
  },
  {
    amount: 18500,
    type: 'expense',
    category: 'Housing',
    date: new Date('2026-10-02T10:30:00Z'),
    paymentMethod: 'Net Banking',
    note: 'Apartment monthly rent payment'
  },
  {
    amount: 3200,
    type: 'expense',
    category: 'Groceries',
    date: new Date('2026-10-03T18:15:00Z'),
    paymentMethod: 'UPI',
    note: 'Weekly organic vegetables, milk & staples'
  },
  {
    amount: 1200,
    type: 'expense',
    category: 'Utilities',
    date: new Date('2026-10-04T11:00:00Z'),
    paymentMethod: 'UPI',
    note: 'Fiber optic broadband bill'
  },
  {
    amount: 22000,
    type: 'income',
    category: 'Freelance',
    date: new Date('2026-10-05T14:45:00Z'),
    paymentMethod: 'UPI',
    note: 'React dashboard consulting milestone'
  },
  {
    amount: 1650,
    type: 'expense',
    category: 'Food & Dining',
    date: new Date('2026-10-06T20:30:00Z'),
    paymentMethod: 'Credit Card',
    note: 'Team dinner celebration at Bistro'
  },
  {
    amount: 850,
    type: 'expense',
    category: 'Transportation',
    date: new Date('2026-10-08T09:15:00Z'),
    paymentMethod: 'UPI',
    note: 'Metro card monthly smart recharge'
  },
  {
    amount: 4500,
    type: 'expense',
    category: 'Shopping',
    date: new Date('2026-10-09T16:00:00Z'),
    paymentMethod: 'Credit Card',
    note: 'Ergonomic mechanical keyboard for coding'
  },
  {
    amount: 1500,
    type: 'expense',
    category: 'Healthcare',
    date: new Date('2026-10-10T11:20:00Z'),
    paymentMethod: 'Debit Card',
    note: 'Routine health checkup & multivitamin supplements'
  },
  {
    amount: 2100,
    type: 'expense',
    category: 'Utilities',
    date: new Date('2026-10-11T12:00:00Z'),
    paymentMethod: 'Net Banking',
    note: 'Monthly electricity bill'
  },
  {
    amount: 950,
    type: 'expense',
    category: 'Entertainment',
    date: new Date('2026-10-12T19:40:00Z'),
    paymentMethod: 'Credit Card',
    note: 'IMAX movie tickets and concessions'
  },
  {
    amount: 2800,
    type: 'expense',
    category: 'Groceries',
    date: new Date('2026-10-13T17:30:00Z'),
    paymentMethod: 'UPI',
    note: 'Mid-month supermarket replenishment'
  },
  {
    amount: 12000,
    type: 'income',
    category: 'Investment',
    date: new Date('2026-10-14T10:00:00Z'),
    paymentMethod: 'Net Banking',
    note: 'Mutual fund quarterly dividend payout'
  },
  {
    amount: 750,
    type: 'expense',
    category: 'Food & Dining',
    date: new Date('2026-10-15T13:10:00Z'),
    paymentMethod: 'UPI',
    note: 'Artisanal coffee & snacks during hackathon'
  },

  // --- SEPTEMBER 2026 (Previous Month for Trend Comparison) ---
  {
    amount: 85000,
    type: 'income',
    category: 'Salary',
    date: new Date('2026-09-01T09:00:00Z'),
    paymentMethod: 'Net Banking',
    note: 'September Engineering Salary'
  },
  {
    amount: 18500,
    type: 'expense',
    category: 'Housing',
    date: new Date('2026-09-02T10:00:00Z'),
    paymentMethod: 'Net Banking',
    note: 'September apartment rent'
  },
  {
    amount: 5400,
    type: 'expense',
    category: 'Groceries',
    date: new Date('2026-09-05T17:00:00Z'),
    paymentMethod: 'UPI',
    note: 'Groceries and home supplies'
  },
  {
    amount: 3200,
    type: 'expense',
    category: 'Utilities',
    date: new Date('2026-09-10T12:00:00Z'),
    paymentMethod: 'Net Banking',
    note: 'Electricity and water utility bills'
  },
  {
    amount: 15000,
    type: 'income',
    category: 'Freelance',
    date: new Date('2026-09-15T15:00:00Z'),
    paymentMethod: 'UPI',
    note: 'UI / UX Design consulting milestone'
  },
  {
    amount: 3800,
    type: 'expense',
    category: 'Entertainment',
    date: new Date('2026-09-20T21:00:00Z'),
    paymentMethod: 'Credit Card',
    note: 'Concert passes and weekend dining'
  },
  {
    amount: 2200,
    type: 'expense',
    category: 'Transportation',
    date: new Date('2026-09-25T14:30:00Z'),
    paymentMethod: 'UPI',
    note: 'Cab rides and airport toll'
  }
];

const seedSampleData = async () => {
  const isDirect = mongoose.connection.readyState !== 1;
  if (isDirect) {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/expense_tracker_mern';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected for seeding script.');
  }

  await Transaction.deleteMany({});
  const created = await Transaction.insertMany(sampleTransactions);
  console.log(`Successfully seeded ${created.length} sample transactions!`);

  if (isDirect) {
    await mongoose.connection.close();
  }
  return created;
};

if (require.main === module) {
  seedSampleData()
    .then(() => {
      console.log('Seeding finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding error:', err);
      process.exit(1);
    });
}

module.exports = { seedSampleData, sampleTransactions };
