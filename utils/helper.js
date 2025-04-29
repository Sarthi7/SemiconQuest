
// Calculate usable chips from wafers based on yield percentage
export function calculateYield(wafers, yieldPercentage) {
    return Math.floor(wafers * (yieldPercentage / 100));
}

// Calculate profit for a turn
export function calculateProfit(chipsSold, price, wafersStarted, waferCost, fixedCosts, inventory, inventoryCost) {
    const revenue = chipsSold * price;
    const productionCosts = wafersStarted * waferCost;
    const inventoryHoldingCosts = inventory * inventoryCost;
    const totalCosts = productionCosts + fixedCosts + inventoryHoldingCosts;

    return revenue - totalCosts;
}

// Calculate on-time delivery percentage
export function calculateOTD(chipsSold, demand) {
    if (demand === 0) return 100;
    return (chipsSold / demand) * 100;
}