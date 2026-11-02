import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-slate-900 border border-slate-700/60 shadow-2xl shadow-black/40",
            headerTitle: "text-white",
            headerSubtitle: "text-slate-400",
            socialButtonsBlockButton:
              "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700",
            dividerLine: "bg-slate-700",
            dividerText: "text-slate-500",
            formFieldLabel: "text-slate-300",
            formFieldInput:
              "bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20",
            formButtonPrimary:
              "bg-blue-600 hover:bg-blue-500 text-white font-semibold",
            footerActionLink: "text-blue-400 hover:text-blue-300",
            identityPreviewText: "text-slate-300",
            identityPreviewEditButtonIcon: "text-blue-400",
          },
        }}
        redirectUrl="/dashboard"
        signUpUrl="/sign-up"
      />
    </div>
  );
}
