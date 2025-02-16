'use client'
import { useState } from "react";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { ValidationError } from "next/dist/compiled/amphtml-validator";

export default function App() {
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<ValidationError>({});

    // Real-time password validation
    const getPasswordError = (value: string) => {
        const valueLenght = value.length
        if (valueLenght === 0) return null;

        if (valueLenght < 4) {
            return "Password must be 4 characters or more";
        }
        if ((value.match(/[A-Z]/g) || []).length < 1) {
            return "Password needs at least 1 uppercase letter";
        }
        if ((value.match(/[^a-z]/gi) || []).length < 1) {
            return "Password needs at least 1 symbol";
        }

        return null;
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));

        // Custom validation checks
        const newErrors: ValidationError = {};

        // Password validation
        const passwordError = getPasswordError(data.password as string);

        if (passwordError) {
            newErrors.password = passwordError;
        }

        // Username validation
        if (data.name === "admin") {
            newErrors.name = "Nice try! Choose a different username";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);

            return;
        }

        setErrors({});
    };

    return (
        <section className="w-full">
            <h1 className="text-2xl font-bold text-center left-0 py-8">Login</h1>
            <Form
                className="w-full justify-center items-center space-y-4"
                validationBehavior="native"
                validationErrors={errors}
                onSubmit={(e) => onSubmit(e)}
            >
                <div className="w-full px-8 flex flex-col gap-4 max-w-md">
                    <Input
                        isRequired
                        errorMessage={({ validationDetails }) => {
                            if (validationDetails.valueMissing) {
                                return "Please enter your name";
                            }

                            return errors.name;
                        }}
                        label="Name"
                        labelPlacement="outside"
                        name="name"
                        placeholder="Enter your name"
                    />

                    <Input
                        isRequired
                        errorMessage={({ validationDetails }) => {
                            if (validationDetails.valueMissing) {
                                return "Please enter your email";
                            }
                            if (validationDetails.typeMismatch) {
                                return "Please enter a valid email address";
                            }
                        }}
                        label="Email"
                        labelPlacement="outside"
                        name="email"
                        placeholder="Enter your email"
                        type="email"
                    />

                    <Input
                        isRequired
                        errorMessage={getPasswordError(password)}
                        isInvalid={getPasswordError(password) !== null}
                        label="Password"
                        labelPlacement="outside"
                        name="password"
                        placeholder="Enter your password"
                        type="password"
                        value={password}
                        onValueChange={setPassword}
                    />
                    <div className="flex gap-4">
                        <Button className="w-full" color="primary" type="submit">
                            Submit
                        </Button>
                        <Button type="reset" variant="bordered">
                            Reset
                        </Button>
                    </div>
                </div>
            </Form>
        </section>
    );
}

