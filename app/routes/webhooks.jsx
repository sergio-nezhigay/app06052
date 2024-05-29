import { authenticate } from "../shopify.server";
import db from "../db.server";
import { json } from "@remix-run/node";

export const action = async ({ request }) => {
  console.log("🚀 ~webhooks action:");
  const { topic, shop, session, admin } = await authenticate.webhook(request);

  if (!admin) {
    throw new Response();
  }

  switch (topic) {
    case "APP_UNINSTALLED":
      console.log(" case APP_UNINSTALLED");
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }
      break;
    case "PRODUCTS_UPDATE":
      console.log(" case PRODUCTS_UPDATE");
      break;

    default:
      console.log("Unhandled Webhook Topic:", topic);
      break;
  }

  return json({ success: true });
};
