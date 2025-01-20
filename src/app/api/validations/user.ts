import { z } from "zod";

const userValidationSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  gender: z.string().min(3),
  role:z.string()
});

export default userValidationSchema;
