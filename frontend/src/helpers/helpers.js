export const getPriceQueryParams = (searchParams, key, value) => {
	const hasValueInParam = searchParams.has(key);
	if (value && hasValueInParam) {
		searchParams.set(key, value);
	} else if (value) {
		searchParams.append(key, value);
	} else if (hasValueInParam) {
		searchParams.delete(key);
	}

	return searchParams;
};

export const calculateOrderCost = (cartItems) => {
	const itemsPrice = Number(
		cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
	).toFixed(2);

	const shippingPrice = itemsPrice >= 200 ? 0 : 25;

	const taxPrice = Number(0.15 * itemsPrice).toFixed(2);

	const totalPrice = (
		Number(itemsPrice) +
		Number(shippingPrice) +
		Number(taxPrice)
	).toFixed(2);

	return {
		itemsPrice,
		shippingPrice,
		taxPrice,
		totalPrice,
	};
};
