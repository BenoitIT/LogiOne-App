import { z } from "zod";

const deliveriesValidationSchema = z.object({
  country: z.string().min(2),
  deliveryName: z.string().min(2),
});

export default deliveriesValidationSchema;
