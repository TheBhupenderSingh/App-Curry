// Types
export interface GstRevenue {
  id: number;
  gstin: string;
  fy: string;
  tradeNameLegalName: string;
  sgstCashCurrentYear: number;
  igstSettlementCurrentYear: number;
  totalRevenueCurrentYear: number;
  totalRevenueLastYear: number;
  avgSgstIgstLastYear: number;
  pctDiffLastYearMonth: number;
  pctDiffLastYearAvg: number;
  division: string;
  circle: string;
  assignedTo: string;
  effectiveDtReg: string;
  status: string;
  sector: string;
  growthCategory: string;
}

// KPI computation
export function computeKPIs(data: GstRevenue[]) {
  const totalCurrent = data.reduce((sum, d) => sum + d.totalRevenueCurrentYear, 0);
  const totalLast = data.reduce((sum, d) => sum + d.totalRevenueLastYear, 0);
  const sgstIgst = data.reduce((sum, d) => sum + d.sgstCashCurrentYear + d.igstSettlementCurrentYear, 0);

  return {
    totalCurrent,
    totalLast,
    diff: totalCurrent - totalLast,
    achieved: totalLast !== 0 ? (totalCurrent / totalLast) * 100 : 0,
    yoyGrowth: totalLast !== 0 ? ((totalCurrent - totalLast) / totalLast) * 100 : 0,
    sgstIgst,
    taxLiability: totalCurrent
  };
}

// Aggregate SGST + IGST Paid by Sector
export function aggregateBySector(data: GstRevenue[]) {
  const result: Record<string, number> = {};

  data.forEach(d => {
    // true SGST + IGST paid for this record
    const val = d.sgstCashCurrentYear + d.igstSettlementCurrentYear;

    // accumulate into its sector
    result[d.sector] = (result[d.sector] || 0) + val;
  });

  // convert map to array for charts
  return Object.entries(result).map(([sector, total]) => ({
    sector,
    total
  }));
}

// Aggregate % Contribution by Division
export function aggregateByDivision(data: GstRevenue[]) {
  const result: Record<string, number> = {};
  data.forEach(d => {
    result[d.division] = (result[d.division] || 0) + d.totalRevenueCurrentYear;
  });
  return Object.entries(result).map(([division, total]) => ({ division, total }));
}

// Top Contributors (dealers by revenue)
export function getTopContributors(data: GstRevenue[], topN = 5) {
  return [...data]
    .sort((a, b) => b.totalRevenueCurrentYear - a.totalRevenueCurrentYear)
    .slice(0, topN);
}

// Sector Ranking (aggregate + sort)
export function getSectorRanking(data: GstRevenue[], topN = 5) {
  const result: Record<string, number> = {};
  data.forEach(d => {
    result[d.sector] = (result[d.sector] || 0) + d.totalRevenueCurrentYear;
  });
  return Object.entries(result)
    .map(([sector, total]) => ({ sector, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, topN);
}

// Dealer Ranking (same as contributors but explicit)
export function getDealerRanking(data: GstRevenue[], topN = 5) {
  return [...data]
    .sort((a, b) => b.totalRevenueCurrentYear - a.totalRevenueCurrentYear)
    .slice(0, topN);
}

// For PieChart - Sector
// For PieChart - Sector
export function getSectorPieData(data: GstRevenue[]) {
  return aggregateBySector(data)
    .map(d => ({
      name: d.sector,
      value: Math.abs(d.total)  // ensure positive
    }))
    .filter(d => d.value > 0);   // remove zeros
}

// For PieChart - Division
export function getDivisionPieData(data: GstRevenue[]) {
  return aggregateByDivision(data)
    .map(d => ({
      name: d.division,
      value: Math.abs(d.total)
    }))
    .filter(d => d.value > 0);
}


