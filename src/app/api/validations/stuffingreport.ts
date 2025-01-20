import { z } from "zod";

const stuffingreportValidationSchema = z.object({
  origin: z.string().min(2),
});

export default stuffingreportValidationSchema;
