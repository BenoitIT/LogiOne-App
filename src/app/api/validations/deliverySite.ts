import { z } from "zod";

const deliveryValidationSchema = z.object({
  country: z.string().min(2),
  locationName: z.string().min(2),
  siteCode: z.string().min(2),
  agent: z.number(),
});

export default deliveryValidationSchema;
