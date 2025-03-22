
export type authenticateActionState = ({
  success: boolean;
  message: string[];
} & authenticateActionErrors) | undefined;

export type FirebaseAuthError = {
  error: {
    code: string;
    message: string;
  }
} | undefined;

export type authenticateActionErrors = {
  name?: string[] | undefined;
  email?: string[] | undefined;
  password?: string[] | undefined;
};
