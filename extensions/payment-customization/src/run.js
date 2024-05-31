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
  const supplier = input.cart.lines.reduce((acc, current) => {
    // @ts-ignore
    const subtitle = current.merchandise?.product?.metafield?.value ?? "";
    return subtitle ? subtitle : acc;
  }, "");
  console.log("Supplier name:", supplier);
  if (!supplier) {
    return NO_CHANGES;
  }

  const hidePaymentMethods = input.paymentMethods.filter(
    (method) => !method.name.includes(supplier),
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
