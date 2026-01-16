import { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in | Car Dealership",
};

export default function LoginPage() {
  return <LoginForm />;
}
