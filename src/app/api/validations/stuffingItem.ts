import { z } from "zod";

const stuffingItemSchema = z.object({
  consignee: z.number(),
  noOfPkgs: z.number(),
  weight: z.number(),
  line: z.number(),
  cbm: z.number(),
  description: z.string(),
  freight: z.number(),
  blFee: z.number(),
});
export default stuffingItemSchema;
