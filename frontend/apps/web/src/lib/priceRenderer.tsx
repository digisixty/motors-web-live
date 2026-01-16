function PriceRenderer({ price }: { price: number }) {
  return formatPrice(price);
}

const formatPrice = (price: number | null | undefined) => {
  if (!price) return null;
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
};

export default PriceRenderer;
export { formatPrice };
