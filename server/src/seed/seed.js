require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Store = require('../models/Store');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const Delivery = require('../models/Delivery');
const Report = require('../models/Report');

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const money = (min, max) => Number((Math.random() * (max - min) + min).toFixed(2));

const categories = ['Fresh Produce', 'Dairy', 'Bakery', 'Beverages', 'Pantry', 'Frozen', 'Household', 'Personal Care'];
const suppliers = ['Cotswold Fresh Farms', 'London Wholesale Market', 'Daily Harvest UK', 'Urban Pantry Ltd.', 'Pure Orchard Foods', 'Northern Goods Depot'];
const productNames = [
  'Organic Apples', 'Wholemeal Bread', 'Almond Milk', 'Arborio Rice', 'Olive Oil', 'Greek Yogurt', 'Orange Juice', 'Pasta',
  'Tomato Sauce', 'Brown Eggs', 'Frozen Peas', 'Dish Wash Liquid', 'Hand Soap', 'Bananas', 'Cheddar Cheese', 'Breakfast Cereal',
  'Green Tea', 'Coffee Beans', 'Lentils', 'Potato Chips'
];
const firstNames = ['Oliver', 'Amelia', 'George', 'Isla', 'Harry', 'Sophie', 'Thomas', 'Emily', 'Jack', 'Charlotte', 'James', 'Freya'];
const lastNames = ['Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Davies', 'Evans', 'Thomas', 'Roberts', 'Walker', 'Wright'];
const storeLocations = [
  'Camden, London',
  'Shoreditch, London',
  'Kensington, London',
  'Clifton, Bristol',
  'Northern Quarter, Manchester',
  'Jewellery Quarter, Birmingham',
  'Leith, Edinburgh',
  'Merchant City, Glasgow',
  'Cardiff Bay, Cardiff',
  'The Lanes, Brighton',
  'Headingley, Leeds',
  'Jesmond, Newcastle',
  'Oxford City Centre, Oxford',
  'Cambridge Market Square, Cambridge'
];
const streets = ['High Street', 'Baker Street', 'King Street', 'Victoria Road', 'Church Lane', 'Queen Street', 'Station Road', 'Market Street'];
const postcodes = ['NW1 7AA', 'E1 6AN', 'SW7 4RB', 'BS8 2QY', 'M4 1HQ', 'B18 6LE', 'EH6 6JJ', 'G1 1DN', 'CF10 5BZ', 'BN1 1HD'];

const seed = async () => {
  await connectDB();
  await Promise.all([
    User.deleteMany(),
    Store.deleteMany(),
    Product.deleteMany(),
    Customer.deleteMany(),
    Order.deleteMany(),
    Inventory.deleteMany(),
    Delivery.deleteMany(),
    Report.deleteMany()
  ]);

  const stores = await Store.insertMany(
    Array.from({ length: 14 }, (_, i) => ({
      storeName: `Green Basket ${storeLocations[i].split(',')[0]} ${i + 1}`,
      storeCode: `GBS-${String(i + 1).padStart(3, '0')}`,
      manager: `${pick(firstNames)} ${pick(lastNames)}`,
      location: storeLocations[i],
      inventory: 0,
      sales: 0
    }))
  );

  const admin = await User.create({
    name: 'System Administrator',
    email: 'admin@greenbasket.local',
    password: 'Admin@12345',
    role: 'admin',
    phone: '+44 7700 900001'
  });

  await Promise.all(
    stores.map((store, index) =>
      User.create({
        name: store.manager,
        email: `manager${index + 1}@greenbasket.local`,
        password: 'Manager@12345',
        role: 'manager',
        phone: `+44 7700 900${String(index + 2).padStart(3, '0')}`,
        store: store._id
      })
    )
  );

  const products = await Product.insertMany(
    Array.from({ length: 100 }, (_, i) => {
      const quantity = Math.floor(Math.random() * 180) + 2;
      return {
        productName: `${pick(productNames)} ${i + 1}`,
        category: pick(categories),
        sku: `GB-${String(i + 1).padStart(5, '0')}`,
        price: money(25, 1500),
        quantity,
        supplier: pick(suppliers),
        store: pick(stores)._id,
        status: quantity <= 10 ? 'Low Stock' : 'Active'
      };
    })
  );

  const customers = await Customer.insertMany(
    Array.from({ length: 100 }, (_, i) => {
      const name = `${pick(firstNames)} ${pick(lastNames)}`;
      return {
        name,
        phone: `+44 20 7946 ${String(1000 + i)}`,
        email: `customer${i + 1}@example.com`,
        address: `${12 + i} ${pick(streets)}, ${pick(storeLocations)}, ${pick(postcodes)}`,
        loyaltyPoints: Math.floor(Math.random() * 1200)
      };
    })
  );

  const orderStatuses = ['Pending', 'Packed', 'Dispatched', 'Delivered', 'Cancelled'];
  const orders = [];
  for (let i = 0; i < 50; i += 1) {
    const customer = pick(customers);
    const store = pick(stores);
    const items = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => {
      const product = pick(products);
      const quantity = Math.floor(Math.random() * 4) + 1;
      return { product: product._id, productName: product.productName, quantity, price: product.price };
    });
    const amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    orders.push({
      orderNumber: `GB-SEED-${String(i + 1).padStart(4, '0')}`,
      customer: customer._id,
      customerName: customer.name,
      products: items,
      amount: Number(amount.toFixed(2)),
      orderStatus: pick(orderStatuses),
      store: store._id,
      createdAt: new Date(Date.now() - i * 86400000)
    });
  }
  const savedOrders = await Order.insertMany(orders);

  await Delivery.insertMany(
    savedOrders.slice(0, 20).map((order, i) => ({
      order: order._id,
      deliveryPerson: `${pick(firstNames)} ${pick(lastNames)}`,
      deliveryAddress: customers.find((customer) => customer._id.equals(order.customer))?.address || 'London, UK',
      status: pick(['Pending', 'Out for Delivery', 'Completed']),
      estimatedDeliveryDate: new Date(Date.now() + (i + 1) * 86400000),
      completedAt: i % 4 === 0 ? new Date() : undefined
    }))
  );

  await Inventory.insertMany(
    products.slice(0, 60).map((product) => ({
      product: product._id,
      store: product.store,
      type: pick(['Stock In', 'Stock Out', 'Adjustment']),
      quantity: Math.floor(Math.random() * 25) + 1,
      previousQuantity: product.quantity + 5,
      currentQuantity: product.quantity,
      note: 'Seeded opening stock transaction',
      performedBy: admin._id
    }))
  );

  for (const store of stores) {
    const storeProducts = products.filter((product) => product.store.equals(store._id));
    const storeOrders = savedOrders.filter((order) => order.store.equals(store._id));
    store.inventory = storeProducts.reduce((sum, product) => sum + product.quantity, 0);
    store.sales = Number(storeOrders.reduce((sum, order) => sum + order.amount, 0).toFixed(2));
    await store.save();
  }

  await Report.create({
    type: 'Monthly',
    title: 'Current Month Local Operations Report',
    totalSales: savedOrders.reduce((sum, order) => sum + order.amount, 0),
    totalOrders: savedOrders.length,
    topSellingProducts: products.slice(0, 5).map((product) => ({ name: product.productName, quantity: Math.floor(Math.random() * 80) + 10 })),
    generatedBy: admin._id,
    periodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    periodEnd: new Date()
  });

  console.log('Seed complete');
  console.log('Admin: admin@greenbasket.local / Admin@12345');
  console.log('Manager: manager1@greenbasket.local / Manager@12345');
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
