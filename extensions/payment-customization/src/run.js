// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const supplier = input.cart.lines.reduce(
    (acc, current) => {
      // @ts-ignore
      const name = current.merchandise?.product?.metafield?.value ?? "";
      const cost = current.cost.totalAmount.amount;
      const toChange = Boolean(name) && cost > acc.cost;
      return toChange ? { name, cost } : { ...acc };
    },
    { name: "", cost: 0 },
  );
  console.log("🚀 ~ supplier:", supplier.name);
  console.error("🚀 ~ supplier:", supplier.name);

  if (!supplier.name) {
    return NO_CHANGES;
  }

  const hidePaymentMethods = input.paymentMethods.filter(
    (method) => !method.name.includes(supplier.name),
  );

  if (hidePaymentMethods.length === 0) {
    return NO_CHANGES;
  }

  return {
    operations: hidePaymentMethods.map((method) => ({
      hide: {
        paymentMethodId: method.id,
      },
    })),
  };
}
