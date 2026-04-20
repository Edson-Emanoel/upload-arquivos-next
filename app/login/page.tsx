import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <AuthForm
        title="Entrar"
        description="Acesse sua conta para visualizar, cadastrar e administrar suas imagens."
        endpoint="/api/auth/login"
        submitLabel="Entrar"
        successRedirect="/dashboard"
        footerText="Ainda nao possui conta?"
        footerHref="/cadastro"
        footerLinkLabel="Criar conta"
        fields={[
          {
            label: "Email",
            name: "email",
            type: "email",
            placeholder: "voce@exemplo.com",
          },
          {
            label: "Senha",
            name: "password",
            type: "password",
            placeholder: "Digite sua senha",
          },
        ]}
      />
    </main>
  );
}
