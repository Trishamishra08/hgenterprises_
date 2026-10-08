const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const machines = [
    {
        name: "HG-E200 PRO Fiber Laser Engraver",
        brand: "Harshad Gauri",
        category: "Laser Machines",
        subcategory: "Fiber Laser Engravers",
        targetGroup: "Unisex",
        price: 185000,
        mrp: 225000,
        image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=800&auto=format&fit=crop",
        description: "The HG-E200 PRO is a high-speed, high-precision fiber laser engraving system specifically designed for the jewellery industry. Perfect for hallmarking, name-cutting, and intricate patterns on gold, silver, and platinum.",
        benefits: [
            "Ultra-fine marking precision (up to 0.01mm)",
            "High-speed operation for mass production",
            "Maintenance-free fiber laser source with 100,000+ hours life",
            "User-friendly EzCad software integration",
            "Low power consumption"
        ],
        specifications: [
            { label: "Laser Power", value: "20W / 30W / 50W Optional" },
            { label: "Laser Wavelength", value: "1064nm" },
            { label: "Marking Area", value: "110mm x 110mm (Adjustable)" },
            { label: "Cooling Mode", value: "Air Cooling" },
            { label: "Power Supply", value: "220V / 50Hz" }
        ],
        variants: [
            { name: "20W Standard", mrp: 225000, price: 185000, stock: 10 },
            { name: "30W Premium", mrp: 275000, price: 235000, stock: 5 },
            { name: "50W Industrial", mrp: 350000, price: 295000, stock: 3 }
        ]
    },
    {
        name: "HG-E500 Advanced Laser Marker",
        brand: "Harshad Gauri",
        category: "Laser Machines",
        subcategory: "Fiber Laser Engravers",
        targetGroup: "Unisex",
        price: 295000,
        mrp: 350000,
        image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=800&auto=format&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop",
        description: "Industrial-grade laser marking system for heavy-duty engraving. Optimized for batch processing and deep engraving on hard metals. Features automated focus and advanced cooling.",
        benefits: [
            "Deep engraving capability for hallmarking",
            "Automatic focus adjustment",
            "Supports 3D curved surface marking",
            "High-reliability industrial design",
            "Comprehensive training included"
        ],
        specifications: [
            { label: "Laser Type", value: "Q-Switched Fiber" },
            { label: "Max marking speed", value: "12,000 mm/s" },
            { label: "Min line width", value: "0.02 mm" },
            { label: "Operating System", value: "Windows 10/11 Compatible" },
            { label: "Weight", value: "85 kg" }
        ],
        variants: [
            { name: "Standard E500", mrp: 350000, price: 295000, stock: 7 }
        ]
    },
    {
        name: "HG-W150 Pulse Laser Welder",
        brand: "Harshad Gauri",
        category: "Laser Machines",
        subcategory: "Laser Welding Systems",
        targetGroup: "Unisex",
        price: 345000,
        mrp: 415000,
        image: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?q=80&w=800&auto=format&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?q=80&w=800&auto=format&fit=crop",
        description: "State-of-the-art pulse laser welding machine for professional jewellery repair and manufacturing. Ideal for ring resizing, prong retipping, and repairing delicate filigree without removing gemstones.",
        benefits: [
            "Localized heat prevents gemstone damage",
            "Microscope-assisted precision welding",
            "Ergonomic design for long working hours",
            "High stability and consistent pulse energy",
            "Touch-screen control for easy parameter adjustment"
        ],
        specifications: [
            { label: "Max Output Power", value: "150W" },
            { label: "Single Pulse Energy", value: "100J" },
            { label: "Pulse Width", value: "0.1ms - 20ms" },
            { label: "Microscope Magnification", value: "10X" },
            { label: "Shielding Gas", value: "Argon" }
        ],
        variants: [
            { name: "Standard 150W", mrp: 415000, price: 345000, stock: 4 }
        ]
    },
    {
        name: "HG-V400 Vacuum Casting Machine",
        brand: "Harshad Gauri",
        category: "Laser Machines",
        subcategory: "Induction Casting Units",
        targetGroup: "Unisex",
        price: 520000,
        mrp: 650000,
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
        description: "An advanced vacuum-pressure casting system for high-quality jewellery production. Features digital temperature control and inert gas atmosphere to prevent oxidation, resulting in porosity-free castings.",
        benefits: [
            "Digital PID temperature control",
            "Inert gas atmosphere (Argon/Nitrogen)",
            "Automatic vacuum and pressure sequence",
            "Suitable for gold, silver, and copper alloys",
            "Compact footprint for small workshops"
        ],
        specifications: [
            { label: "Crucible Capacity", value: "400g Gold" },
            { label: "Max Temperature", value: "1200°C" },
            { label: "Vacuum Pump Speed", value: "4L/s" },
            { label: "Cooling Water", value: "Required" },
            { label: "Dimensions", value: "550x550x1100mm" }
        ],
        variants: [
            { name: "Standard V400", mrp: 650000, price: 520000, stock: 2 }
        ]
    },
    {
        name: "HG-3D JewelWax Printer",
        brand: "Harshad Gauri",
        category: "Laser Machines",
        subcategory: "3D Wax Printing",
        targetGroup: "Unisex",
        price: 450000,
        mrp: 550000,
        image: "https://images.unsplash.com/photo-1581092605383-2dc844e67dc5?q=80&w=800&auto=format&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop",
        description: "High-resolution 3D wax printer for direct casting. Enables the creation of complex, detailed jewellery designs that were previously impossible to hand-carve. Optimized for burnout and clean casting.",
        benefits: [
            "Ultra-high resolution (XY: 25 microns)",
            "Fast build speeds for rapid prototyping",
            "Compatible with all standard investment powders",
            "Automatic support generation software",
            "Clean burnout for flawless metal surfaces"
        ],
        specifications: [
            { label: "Build Volume", value: "120 x 70 x 150 mm" },
            { label: "Layer Thickness", value: "10 - 100 microns" },
            { label: "Light Source", value: "405nm UV LED" },
            { label: "Material", value: "Castable Wax Resin" },
            { label: "Connectivity", value: "WiFi / USB / Ethernet" }
        ],
        variants: [
            { name: "Standard 3D Printer", mrp: 550000, price: 450000, stock: 3 }
        ]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Remove existing machine products to avoid duplicates
        await Product.deleteMany({ category: /laser machines/i });

        await Product.insertMany(machines);
        console.log("Machine products seeded successfully!");
        
        process.exit();
    } catch (err) {
        console.error("Error seeding DB:", err);
        process.exit(1);
    }
};

seedDB();
