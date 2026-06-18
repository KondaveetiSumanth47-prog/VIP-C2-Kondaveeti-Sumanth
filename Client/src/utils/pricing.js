export function discountedPrice(price, discount = 0) {
  return Math.round(price - price * (discount / 100));
}

export function currency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}
