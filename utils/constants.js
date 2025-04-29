export const levels = [
    {
        id: 1,
        title: "Basic Forecasting & Production",
        description: "Learn forecasting, fab capacity, and basic yields with a single customer.",
        route: '/levels/level01/',
        unlocked: true,
        icon: 'analytics-outline',
    },
    {
        id: 2,
        title: "Capacity & Lead Times",
        description: "Manage capacity expansions, cycle time, and inventory management.",
        route: '/levels/level02/',
        unlocked: true,
        icon: 'time-outline',
    },
    {
        id: 3,
        title: "Multiple Customers",
        description: "Handle different types of customers with varying demand patterns.",
        route: '/levels/level03/',
        unlocked: false,
        icon: 'people-outline',
    },
    {
        id: 4,
        title: "Supply Variability",
        description: "Deal with duplicate suppliers, random deliveries, and fab yield variability.",
        route: '/levels/level04/',
        unlocked: false,
        icon: 'git-network-outline',
    },
    {
        id: 5,
        title: "End-to-End Strategy",
        description: "Build a coherent end-to-end strategy with all previous elements.",
        route: '/levels/level05/',
        unlocked: false,
        icon: 'globe-outline',
    },
];

export const levelConfig = {
    level1: {
        name: "Basic Forecasting & Production",
        description: "Learn the basics of semiconductor manufacturing",
        totalTurns: 5,
        baseYield: 90, // 90% yield BASE_YIELD
        pricePerChip: 12, // $12 per chip BASE_PRICE_PER_CHIP
        waferCost: 8, // $8 per wafer WAFER_COST
        fixedCosts: 1000, // $1000 fixed costs per turn FIXED_COSTS_PER_TURN
        inventoryCost: 1, // $1 per chip in inventory INVENTORY_COST_PER_CHIP
        winProfitThreshold: 5000, // $5000 profit to win WIN_PROFIT_THRESHOLD
        minOTD: 80, // 80% minimum OTD to win MIN_ON_TIME_DELIVERY
        demandSettings: {
            initialDemand: 800,
            growthRate: 1.1, // 10% growth per turn
            randomFactor: 0.1, // ±5% randomness
        }
    },
    level2: {
        // Level 2 configuration
        // Will add capacity, cycle time & inventory management elements
    },
};