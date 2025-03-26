const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import Models
const User = require('./models/User');
const Asset = require('./models/Asset');
const Supplier = require('./models/Supplier');
const Location = require('./models/Location');
const Category = require('./models/Category');
const Request = require('./models/Request');
const Report = require('./models/Report');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected for seeding'))
    .catch((err) => console.log(err));

// Seed Data
const seedDatabase = async () => {
    try {
        // Clear existing data (optional, comment out if you don’t want to clear)
        await User.deleteMany({});
        await Asset.deleteMany({});
        await Supplier.deleteMany({});
        await Location.deleteMany({});
        await Category.deleteMany({});
        await Request.deleteMany({});
        await Report.deleteMany({});
        console.log('Existing data cleared');

        // 1. Seed Users
        const users = [
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: await bcrypt.hash('password123', 10),
                role: 'Admin',
            },
            {
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: await bcrypt.hash('password123', 10),
                role: 'User',
            },
            {
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                password: await bcrypt.hash('password123', 10),
                role: 'User',
            },
        ];
        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0];
        const employee1 = createdUsers[1];
        const employee2 = createdUsers[2];
        console.log('Users seeded');

        // 2. Seed Suppliers
        const suppliers = [
            { supplierName: 'TechCorp', contactPerson: 'Alice Brown', email: 'alice@techcorp.com', phone: '123-456-7890', address: '123 Tech St' },
            { supplierName: 'OfficeSupply Co', contactPerson: 'Bob White', email: 'bob@officesupply.com', phone: '098-765-4321', address: '456 Office Ave' },
        ];
        const createdSuppliers = await Supplier.insertMany(suppliers);
        console.log('Suppliers seeded');

        // 3. Seed Locations
        const locations = [
            { locationName: 'IT Department' },
            { locationName: 'HR Department' },
            { locationName: 'Warehouse' },
        ];
        const createdLocations = await Location.insertMany(locations);
        console.log('Locations seeded');

        // 4. Seed Categories
        const categories = [
            { categoryName: 'Laptop' },
            { categoryName: 'Printer' },
            { categoryName: 'Furniture' },
        ];
        const createdCategories = await Category.insertMany(categories);
        console.log('Categories seeded');

        // 5. Seed Assets
        const assets = [
            {
                name: 'Dell Laptop',
                description: 'High-performance laptop',
                purchaseDate: new Date('2023-01-15'),
                warrantyDate: new Date('2025-01-15'),
                locationID: createdLocations[0]._id, // IT Department
                categoryID: createdCategories[0]._id, // Laptop
                supplierID: createdSuppliers[0]._id, // TechCorp
                status: 'Available',
                addedDate: new Date('2023-02-01'),
            },
            {
                name: 'HP Printer',
                description: 'Color laser printer',
                purchaseDate: new Date('2023-03-10'),
                warrantyDate: new Date('2025-03-10'),
                locationID: createdLocations[1]._id, // HR Department
                categoryID: createdCategories[1]._id, // Printer
                supplierID: createdSuppliers[1]._id, // OfficeSupply Co
                status: 'Assigned',
                addedDate: new Date('2023-04-01'),
            },
            {
                name: 'Office Chair',
                description: 'Ergonomic chair',
                purchaseDate: new Date('2022-12-01'),
                warrantyDate: new Date('2024-12-01'),
                locationID: createdLocations[2]._id, // Warehouse
                categoryID: createdCategories[2]._id, // Furniture
                supplierID: createdSuppliers[1]._id, // OfficeSupply Co
                status: 'Available',
                addedDate: new Date('2023-01-01'),
            },
        ];
        const createdAssets = await Asset.insertMany(assets);
        console.log('Assets seeded');

        // 6. Seed Requests
        const requests = [
            {
                userID: employee1._id, // John Doe
                assetID: createdAssets[0]._id, // Dell Laptop
                requestDate: new Date('2025-03-20'),
                status: 'Pending',
            },
            {
                userID: employee2._id, // Jane Smith
                assetID: createdAssets[1]._id, // HP Printer
                requestDate: new Date('2025-03-21'),
                status: 'Approved',
            },
        ];
        const createdRequests = await Request.insertMany(requests);
        console.log('Requests seeded');

        // 7. Seed Reports
        const reports = [
            {
                generatedBy: adminUser._id,
                generatedDate: new Date('2025-03-22'),
                content: JSON.stringify({
                    totalAssets: 3,
                    available: 2,
                    assigned: 1,
                    underMaintenance: 0,
                }),
            },
        ];
        await Report.insertMany(reports);
        console.log('Reports seeded');

        console.log('Database seeding completed successfully!');
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        mongoose.connection.close();
    }
};

// Run the seed function
seedDatabase();