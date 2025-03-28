
export type authenticateActionState = ({
  success: boolean;
  message: string[];
  user: FirebaseUser | null;
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

export type SessionContextType = {
  session: SessionType;
  setSession: (session: SessionType) => void;
};

export type SessionType = {
  user: FirebaseUser | null;
  authenticated: boolean;
  isLoading: boolean;
};

export type FirebaseUser = {
  uid?: string;
  email?: string;
  displayName?: string;
};
