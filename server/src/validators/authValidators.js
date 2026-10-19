import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name cannot exceed 60 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Please provide a valid email address")
    .toLowerCase(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
  role: z
    .enum(["buyer", "seller", "broker"], {
      errorMap: () => ({ message: "Role must be buyer, seller, or broker" }),
    })
    .optional()
    .default("buyer"),
  company: z.string().trim().max(100).optional(),
  bio: z.string().trim().max(300).optional(),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Please provide a valid email address")
    .toLowerCase(),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60).optional(),
  company: z.string().trim().max(100).optional(),
  bio: z.string().trim().max(300).optional(),
});

export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed;
    next();
  } catch (error) {
    if (error?.name === "ZodError" || error instanceof z.ZodError || Array.isArray(error?.issues)) {
      const issues = error.issues || error.errors || [];
      const formattedErrors = issues.map((err) => ({
        field: Array.isArray(err.path) ? err.path.join(".") : String(err.path || "general"),
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        message: formattedErrors[0]?.message || "Validation failed",
        errors: formattedErrors,
      });
    }
    next(error);
  }
};
