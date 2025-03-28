"use server"
import { z } from 'zod';
import { auth } from '../../../firebase'
import { authenticateActionState } from '../lib/definitions';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";

const FormSchema = z.object({
  name: z.string()
    .min(1)
    .refine((value) => value != "admin", {
      message: 'Well well well, you are clever. But you are not admin.',
    }),
  email: z.string().email(),
  password: z.string().trim().min(6), //if somone creates a password with blank spaces, it trigegrs an error
});

export async function createUser(
  prevState: authenticateActionState,
  formData: FormData,
) {

  const validatedFields = FormSchema.safeParse({
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: ['Something seems odd. Failed to create User.'],
    };
  }

  const { name, email, password } = validatedFields.data;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const { user } = userCredential;

    if (user) {
      updateProfile(user, {
        displayName: name
      });
    }

    return {
      success: true,
      errors: {},
      message: ['User created successfully.'],
    }
  } catch (error: any) {
    const errorCode = error?.code || "";
    const errorMessage = error?.message || "";

    return {
      success: false,
      errors: {
        email: errorCode === 'auth/email-already-in-use' ? ['Email already in use.'] : [''],
      },
      message: ['Something went wrong. Failed to create user.', errorCode],
    }
  };
}

const signInFormSchema = FormSchema.omit({ name: true });

export async function signIn(
  prevState: authenticateActionState,
  formData: FormData,
) {

  const validatedFields = signInFormSchema.safeParse({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: ['Something seems odd. Failed to sign in.'],
      user: null,
    };
  }

  const { email, password } = validatedFields.data;
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    return {
      success: true,
      errors: {},
      message: ['User signed In succesfully'],
      user: {
        uid: user.uid || "",
        email: user.email || "",
        displayName: user.displayName || "",
      }
    }

  } catch (error: any) {
    const errorCode = error?.code || "";
    const errorMessage = error?.message || "";

    return {
      success: false,
      errors: {},
      message: ['Something went wrong. Failed to sign in.', errorCode == 'auth/invalid-credential' ? 'Invalid credentials' : errorMessage],
      user: null,
    }
  };
}