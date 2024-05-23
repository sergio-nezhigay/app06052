import { json } from "@remix-run/node";
import crypto from "crypto";
import { authenticate } from "../shopify.server";
import db from "../db.server";

const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;

const verifyHMAC = (secret, payload, receivedSignature) => {
  const hmac = crypto.createHmac("sha256", secret);
  const hash = hmac.update(payload, "utf8").digest("base64");
  return hash === receivedSignature;
};

export const loader = async ({ request }) => {
  return json(
    { message: "This endpoint is only for POST requests" },
    { status: 405 },
  );
};

export const action = async ({ request }) => {
  const { topic, shop, session, admin } = await authenticate.webhook(request);
  console.log("Topic:", topic);
  console.log("Shop:", shop);
  console.log("Session:", session);
  console.log("Admin:", admin);

  const payload = await request.text();
  const receivedSignature = request.headers.get("X-Shopify-Hmac-SHA256");
  console.log("Payload:", payload);
  console.log("Received Signature:", receivedSignature);

  if (
    !receivedSignature ||
    !verifyHMAC(SHOPIFY_API_SECRET, payload, receivedSignature)
  ) {
    return json({ error: "Invalid signature" }, { status: 401 });
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
      break;
    case "CUSTOMERS_REDACT":
      break;
    case "SHOP_REDACT":
      break;
    default:
      console.log("Unhandled Webhook Topic:", topic);
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  // Return status 200 if everything is processed successfully
  return json({ success: true });
};
