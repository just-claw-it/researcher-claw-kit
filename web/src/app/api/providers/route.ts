import { PROVIDER_LIST_CLIENT } from "@/lib/providers";

export function GET() {
  return Response.json(PROVIDER_LIST_CLIENT);
}
