export function calculateMarkup(baseCost: number, category: string) {
  const percent = category === "game" ? 0.04 : 0.06;
  const minMarkup = 1000;
  const maxMarkup = 15000;
  const raw = Math.round(baseCost * percent);
  return Math.min(Math.max(raw, minMarkup), maxMarkup);
}

export function calculateProfit(args: { sellPrice: number; baseCost: number; paymentFee: number }) {
  return {
    grossProfit: args.sellPrice - args.baseCost,
    netProfit: args.sellPrice - args.baseCost - args.paymentFee,
  };
}
