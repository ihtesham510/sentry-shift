import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { authClient } from "@/lib/auth-client";

export const signUpSchema = z
	.object({
		name: z
			.string()
			.min(2, "Name must be at least 2 characters")
			.max(64, "Name must be under 64 characters"),
		email: z.email("Enter a valid email address"),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.max(128, "Password is too long")
			.regex(/[A-Z]/, "Include at least one uppercase letter")
			.regex(/[a-z]/, "Include at least one lowercase letter")
			.regex(/[0-9]/, "Include at least one number"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
	const router = useRouter();
	const [serverError, setServerError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const form = useForm<SignUpValues>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});
	const isSubmitting = form.formState.isSubmitting;

	async function onSubmit(values: SignUpValues) {
		setServerError(null);

		const { error } = await authClient.signUp.email({
			name: values.name,
			email: values.email,
			password: values.password,
		});

		if (error) {
			setServerError(
				error.message ?? "Something went wrong. Please try again.",
			);
			return;
		}
		router.invalidate();
	}

	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">Create an account</CardTitle>
				<CardDescription>
					Enter your details below to get started
				</CardDescription>
			</CardHeader>

			<CardContent>
				{serverError && (
					<Alert variant="destructive" className="mb-4">
						<AlertDescription>{serverError}</AlertDescription>
					</Alert>
				)}

				<form
					id="signup-form"
					onSubmit={form.handleSubmit(onSubmit)}
					noValidate
				>
					<FieldGroup>
						<Controller
							name="name"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="signup-name">Name</FieldLabel>
									<Input
										{...field}
										id="signup-name"
										placeholder="Jane Doe"
										autoComplete="name"
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Controller
							name="email"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="signup-email">Email</FieldLabel>
									<Input
										{...field}
										id="signup-email"
										type="email"
										placeholder="jane@example.com"
										autoComplete="email"
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Controller
							name="password"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="signup-password">Password</FieldLabel>
									<InputGroup>
										<InputGroupInput
											{...field}
											id="signup-password"
											type={showPassword ? "text" : "password"}
											placeholder="••••••••"
											autoComplete="new-password"
											aria-invalid={fieldState.invalid}
										/>
										<InputGroupAddon align="inline-end">
											<InputGroupButton
												type="button"
												variant="ghost"
												size="icon-xs"
												aria-label={
													showPassword ? "Hide password" : "Show password"
												}
												onClick={() => setShowPassword((v) => !v)}
											>
												{showPassword ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</InputGroupButton>
										</InputGroupAddon>
									</InputGroup>
									<FieldDescription>
										At least 8 characters, with an uppercase letter, a lowercase
										letter, and a number.
									</FieldDescription>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Controller
							name="confirmPassword"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="signup-confirm-password">
										Confirm password
									</FieldLabel>
									<InputGroup>
										<InputGroupInput
											{...field}
											id="signup-confirm-password"
											type={showConfirm ? "text" : "password"}
											placeholder="••••••••"
											autoComplete="new-password"
											aria-invalid={fieldState.invalid}
										/>
										<InputGroupAddon align="inline-end">
											<InputGroupButton
												type="button"
												variant="ghost"
												size="icon-xs"
												aria-label={
													showConfirm ? "Hide password" : "Show password"
												}
												onClick={() => setShowConfirm((v) => !v)}
											>
												{showConfirm ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</InputGroupButton>
										</InputGroupAddon>
									</InputGroup>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</FieldGroup>
				</form>
			</CardContent>

			<CardFooter>
				<FieldGroup className="w-full">
					<Field>
						<Button type="submit" form="signup-form" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating account...
								</>
							) : (
								"Sign up"
							)}
						</Button>
					</Field>
					<FieldDescription className="text-center">
						Already have an account?{" "}
						<Link
							to="/sign-in"
							className="text-primary underline underline-offset-4"
						>
							Sign in
						</Link>
					</FieldDescription>
				</FieldGroup>
			</CardFooter>
		</Card>
	);
}
