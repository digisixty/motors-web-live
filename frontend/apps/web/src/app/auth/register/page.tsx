import { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Sign up | Car Dealership",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
