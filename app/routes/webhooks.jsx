import { authenticate, verifyHMACSignature } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { topic, shop, session, admin } = await authenticate.webhook(request);

  // Verify HMAC signature
  const isValidSignature = await verifyHMACSignature(request);
  if (!isValidSignature) {
    throw new Response("Invalid HMAC signature", { status: 403 });
  }

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }
      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  // Return status 200 if everything is processed successfully
  return new Response("Webhook processed successfully", { status: 200 });
};
