import { z } from "zod";

export const NYCHASchema = z.object({
  borough: z.string().optional(),
  development: z.string().optional(),

  serviceConnections: z.number().default(0),
  population: z.number().default(0),

  avgWage: z.number().default(0),

  applied: z.number().default(0),
  accepted: z.number().default(0),
  placed: z.number().default(0),

  servicesPerCapita: z.coerce.number().default(0),
});

export type NYCHARecord = z.infer<typeof NYCHASchema>;
