// import {object, string, TypeOf, enum as zodEnum} from 'zod'
import { z, TypeOf, string } from "zod";

const enumPhoneNumberType = [
  "landline",
  "tollfree",
  "mobile",
  "business",
] as const;

const phoneSchema =  z.object({
      DDD: z.string().max(2),
      number: z.string().min(8),
      phoneNumberType: z.string()
    })

type phoneElement = z.infer<typeof phoneSchema>


export const createUserSchema = z.object({
  body: z
    .object({
      fullName: z.string({
        required_error: "You need to provide your name",
      }),
      password: z
        .string({
          required_error: "Password is required",
        })
        .min(6, "You need to provide a password with at least 6 characters")
        .nonempty("Password cannot be blank"),
      passwordConfirmation: z
        .string({
          required_error: "Password and confirmation password does not match.",
        })
        .min(6, "Password confirmation needs to be the same as your password"),
      email: z
        .string({
          required_error: "Email address is required",
          invalid_type_error: "",
        })
        .email("Invalid email address"),
      // phones: z.array(phoneSchema).refine((elements))

      // phones: 
      //   z.object({
      //     DDD: z.string().max(2),
      //     number: z.string().min(8),
      //     phoneNumberType: z.string()
      //   }),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Passwords needs to be the same",
      path: ["passwordConfirmation"],
    }),
});

export const verifyUserSchema = z.object({
  params: z.object({
    id: string(),
    verificationCode: string(),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: string({
      required_error: "Email address is required",
    }).email("Invalid email address"),
  }),
});

export const resetPasswordschema = z.object({
  params: z.object({
    id: string(),
    passwordResetCode: string(),
  }),
  body: z
    .object({
      password: z
        .string({
          required_error: "Password is required",
        })
        .min(
          6,
          "Password lenght is too short, it is required to be 6 or more characters"
        ),
      passwordConfirmation: z
        .string({
          required_error: "Password confirmation is required",
        })
        .min(
          6,
          "Password confirmation lenght is too short, it is required to be 6 or more characters"
        ),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Passwords does not match",
      path: ["passwordConfirmation"],
    }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];
export type VerifyUserInput = TypeOf<typeof verifyUserSchema>["params"];
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>["body"];
export type ResetPasswordInput = TypeOf<typeof resetPasswordschema>;
