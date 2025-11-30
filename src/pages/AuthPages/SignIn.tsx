import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Login | Sammy’s Pharmaceutical Dashboard"
        description="Login to Sammy’s Pharmaceutical Store admin dashboard."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
