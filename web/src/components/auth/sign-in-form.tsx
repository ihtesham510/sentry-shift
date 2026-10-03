import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { Eye, EyeOff, Link, Loader2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
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

export const signInSchema = z.object({
	email: z.email("Enter a valid email address"),
	password: z.string().min(1, "Password is required"),
	rememberMe: z.boolean(),
});

export type SignInValues = z.infer<typeof signInSchema>;

export function SignInForm() {
	const router = useRouter();
	const [serverError, setServerError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm<SignInValues>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
	});

	const isSubmitting = form.formState.isSubmitting;

	async function onSubmit(values: SignInValues) {
		setServerError(null);

		const { error } = await authClient.signIn.email({
			email: values.email,
			password: values.password,
			rememberMe: values.rememberMe,
		});

		if (error) {
			setServerError(error.message ?? "Invalid email or password.");
			return;
		}

		router.invalidate();
	}

	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">Sign in</CardTitle>
				<CardDescription>
					Enter your email below to sign in to your account
				</CardDescription>
			</CardHeader>

			<CardContent>
				{serverError && (
					<Alert variant="destructive" className="mb-4">
						<AlertDescription>{serverError}</AlertDescription>
					</Alert>
				)}

				<form
					id="signin-form"
					onSubmit={form.handleSubmit(onSubmit)}
					noValidate
				>
					<FieldGroup>
						<Controller
							name="email"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="signin-email">Email</FieldLabel>
									<Input
										{...field}
										id="signin-email"
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
									<div className="flex items-center justify-between">
										<FieldLabel htmlFor="signin-password">Password</FieldLabel>
										<a
											href="/forgot-password"
											className="text-sm text-primary underline underline-offset-4"
										>
											Forgot password?
										</a>
									</div>
									<InputGroup>
										<InputGroupInput
											{...field}
											id="signin-password"
											type={showPassword ? "text" : "password"}
											placeholder="••••••••"
											autoComplete="current-password"
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
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Controller
							name="rememberMe"
							control={form.control}
							render={({ field }) => (
								<Field orientation="horizontal">
									<Checkbox
										id="signin-remember"
										checked={field.value}
										onCheckedChange={(checked) =>
											field.onChange(checked === true)
										}
									/>
									<FieldLabel htmlFor="signin-remember" className="font-normal">
										Remember me
									</FieldLabel>
								</Field>
							)}
						/>
					</FieldGroup>
				</form>
			</CardContent>

			<CardFooter>
				<FieldGroup className="w-full">
					<Field>
						<Button type="submit" form="signin-form" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Signing in...
								</>
							) : (
								"Sign in"
							)}
						</Button>
					</Field>
					<FieldDescription className="text-center">
						Don&apos;t have an account?{" "}
						<Link
							to="/sign-up"
							className="text-primary underline underline-offset-4"
						>
							Sign up
						</Link>
					</FieldDescription>
				</FieldGroup>
			</CardFooter>
		</Card>
	);
}
