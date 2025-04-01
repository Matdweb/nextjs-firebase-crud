'use client'
import { useEffect, useState,useActionState } from "react";
import { z } from "zod";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { signIn } from "../lib/actions";
import { Alert } from "@heroui/alert";
import { authenticateActionErrors } from "../lib/definitions";
import { startTransition } from "react";
import { Spinner } from "@heroui/spinner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";

export default function App() {
    const [serverResponse, formAction, isPending] = useActionState(
        signIn,
        undefined,
    );
    const [errors, setErrors] = useState<Record<string, string>>({});
    const router = useRouter();
    const { session, setSession } = useSession();

    const passwordSchema = z.string({
        required_error: "Password is required",
    })
        .min(6, { message: "Password must be 6 characters or more" })
        .refine((value) => (
            (value.match(/[A-Z]/g) || []).length < 1 ? false : true
        ), {
            message: "Password needs at least 1 uppercase letter"
        })
        .refine((value) => (
            (value.match(/[^a-z]/gi) || []).length < 1 ? false : true
        ), {
            message: "Password needs at least 1 symbol"
        });

    const validatePassword = (value: string) => {

        const { password, ...rest } = errors;
        if (value.length === 0 && password) {
            setErrors({
                ...rest
            });
            return;
        }

        const result = passwordSchema.safeParse(value);

        if (!result.success) {
            setErrors({
                ...errors,
                password: result.error?.issues[0].message
            });
            return;
        } else {
            setErrors({
                ...rest
            });
        }

        return null;
    }

    const formatErrors = () => {
        const errors: authenticateActionErrors = serverResponse?.errors || {};
        const formattedErrors = {};

        for (const [key, value] of Object.entries(errors)) {
            Object.assign(formattedErrors, { [key]: (value[0] || "") })
        }

        return formattedErrors;
    }

    const handleServerErrors = () => {
        if (!(serverResponse?.success)) {
            setErrors(formatErrors());
        } else {
            setErrors({});

            setSession({
                user: serverResponse?.user || null,
                authenticated: true,
                isLoading: false
            });
        }
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        startTransition(() => {
            formAction((new FormData(event.target as HTMLFormElement)))
        });
    }

    useEffect(() => {
        handleServerErrors();
    }, [serverResponse]);

    useEffect(() => {
        if (session.authenticated) {
            router.push("/");
        }
    }, [session]);

    return (
        <section className="w-full">
            <h1 className="text-2xl font-bold text-center left-0 py-8">Sign In</h1>
            <Form
                className="w-full justify-center items-center space-y-4"
                validationBehavior="native"
                validationErrors={errors}  //This way the error message an invalid fields will be handled automaticly
                action={formAction}
                onSubmit={handleSubmit}
                onReset={() => {
                    setErrors({});
                }}
            >
                <div className="w-full px-8 flex flex-col gap-4 max-w-md">
                    <Input
                        isRequired
                        errorMessage={({ validationDetails }) => {
                            if (validationDetails.valueMissing) {
                                return "Please enter your email";
                            }
                            if (validationDetails.typeMismatch) {
                                return "Please enter a valid email address";
                            }

                            return errors.email;
                        }}
                        label="Email"
                        labelPlacement="outside"
                        name="email"
                        placeholder="Enter your email"
                        type="email"
                    />
                    {/* Add eye for password */}
                    <Input
                        isRequired
                        errorMessage={({ validationDetails }) => {
                            if (validationDetails.valueMissing) {
                                return "Please enter your password";
                            }

                            return errors.password;
                        }}
                        label="Password"
                        labelPlacement="outside"
                        name="password"
                        placeholder="Enter your password"
                        type="password"
                        onValueChange={validatePassword}
                    />
                    <div className="flex gap-4">
                        <Button
                            className="w-full flex justify-center items-center"
                            color="primary"
                            type="submit"
                            aria-disabled={isPending}
                            isDisabled={isPending}
                        >
                            {
                                isPending ?
                                    <Spinner color="white" variant="dots" />
                                    :
                                    "Sign In"
                            }
                        </Button>
                        <Button
                            type="reset"
                            variant="bordered"
                        >
                            Reset
                        </Button>
                    </div>

                    {
                        serverResponse && (
                            (serverResponse?.success) ?
                                <div className="w-full flex items-center my-3">
                                    <Alert
                                        color={"success"}
                                        title={serverResponse.message[0]}
                                        description={serverResponse.message[1] || ""}
                                    />
                                </div>
                                :
                                <div className="w-full flex items-center my-3">
                                    <Alert
                                        color={"danger"}
                                        title={serverResponse?.message[0]}
                                        description={serverResponse.message[1] || ""}

                                    />
                                </div>
                        )
                    }
                </div>
            </Form>
            <section className="mt-8 text-gray-400">
                <p className="text-center">
                    Don't have an account? <Link href="/signUp" className="text-blue-500">Sign Up</Link>
                </p>
            </section>
        </section>
    );
}

