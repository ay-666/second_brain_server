import zod from "zod";

export const userSchema = zod.object({
  username: zod
    .string()
    .min(3, "username should be 3-10 letters")
    .max(10, "username should be 3-10 letters"),
  password: zod
    .string()
    .min(8, "Password should be 8 to 20 letters")
    .max(20, "Password should be 8 to 20 letters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

export type userInputType = zod.infer<typeof userSchema>;

