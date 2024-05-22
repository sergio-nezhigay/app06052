import { RemixServer } from "remix";
import { renderToString } from "react-dom/server";
import { verifyHMACSignature } from "./shopify.server";

async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
) {
  const isValid = await verifyHMACSignature(request);
  if (!isValid) {
    return new Response("Invalid HMAC", { status: 403 });
  }

  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />,
  );
  responseHeaders.set("Content-Type", "text/html");

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}

export default handleRequest;
