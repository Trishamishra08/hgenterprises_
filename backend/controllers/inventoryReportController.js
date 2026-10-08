const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getInventoryReports = async (req, res) => {
    try {
        const { startDate, endDate, period } = req.query;

        // Date Filter Logic
        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter = { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } };
        } else if (period) {
            const now = new Date();
            let start = new Date();
            if (period === 'today') start.setHours(0, 0, 0, 0);
            else if (period === 'week') start.setDate(now.getDate() - 7);
            else if (period === 'month') start.setMonth(now.getMonth() - 1);
            else if (period === 'year') start.setFullYear(now.getFullYear() - 1);

            dateFilter = { createdAt: { $gte: start } };
        }

        // 1. Fetch all products for category analysis
        const products = await Product.find({});

        const categoryMap = {};
        let totalValuation = 0;
        let totalQty = 0;
        let lowStockCount = 0;

        products.forEach(prod => {
            const cat = prod.category || 'Uncategorized';
            if (!categoryMap[cat]) {
                categoryMap[cat] = { category: cat, uniqueProducts: 0, totalQty: 0, value: 0 };
            }

            categoryMap[cat].uniqueProducts += 1;

            prod.variants.forEach(v => {
                const stock = v.stock || 0;
                const price = v.price || 0;

                categoryMap[cat].totalQty += stock;
                categoryMap[cat].value += (price * stock);

                totalQty += stock;
                totalValuation += (price * stock);

                if (stock <= (prod.lowStockThreshold || 5)) {
                    lowStockCount++;
                }
            });
        });

        const categoryData = Object.values(categoryMap).sort((a, b) => b.value - a.value);

        // 2. Fetch orders for sales velocity analysis with date filter
        const orders = await Order.find({
            status: { $ne: 'Cancelled' },
            ...dateFilter
        });

        const salesMap = {};
        let totalRevenue = 0;
        let totalUnitsSold = 0;

        orders.forEach(order => {
            order.items.forEach(item => {
                const key = `${item.name}-${item.variant || 'Default'}`;
                if (!salesMap[key]) {
                    salesMap[key] = {
                        name: item.name,
                        category: item.category || 'N/A',
                        sold: 0,
                        revenue: 0,
                        prices: []
                    };
                }

                salesMap[key].sold += item.quantity;
                const itemRevenue = item.price * item.quantity;
                salesMap[key].revenue += itemRevenue;
                salesMap[key].prices.push(item.price);

                totalRevenue += itemRevenue;
                totalUnitsSold += item.quantity;
            });
        });

        const salesData = Object.values(salesMap).map(item => {
            const avgPrice = item.prices.length > 0
                ? item.prices.reduce((a, b) => a + b, 0) / item.prices.length
                : 0;
            const { prices, ...rest } = item;
            return { ...rest, avgPrice };
        }).sort((a, b) => b.revenue - a.revenue);

        // 3. Generate Time-series data for Charts
        const timeSeriesMap = {};
        orders.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (!timeSeriesMap[date]) timeSeriesMap[date] = 0;
            timeSeriesMap[date] += (order.total || 0);
        });

        const timeSeriesData = Object.entries(timeSeriesMap).map(([name, value]) => ({ name, value }));

        res.json({
            categoryData,
            salesData: salesData.slice(0, 50),
            timeSeriesData: timeSeriesData.slice(-15), // Last 15 data points
            summary: {
                totalValuation,
                totalQty,
                totalRevenue,
                totalUnitsSold,
                lowStockCount,
                dominantSector: categoryData[0]?.category || 'N/A',
                concentration: totalValuation > 0 && categoryData[0] ? (categoryData[0].value / totalValuation * 100).toFixed(1) : 0,
                // Projections
                avgOrderValue: orders.length > 0 ? (totalRevenue / orders.length).toFixed(0) : 0,
                growthRate: '+12.5%' // Placeholder for real YoY if needed
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating inventory reports', error: error.message });
    }
};
