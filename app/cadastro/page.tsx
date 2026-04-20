import { AuthForm } from "@/components/auth-form";

export default function CadastroPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <AuthForm
        title="Criar conta"
        description="Cadastre um usuario para acessar o painel e comecar a gerenciar imagens."
        endpoint="/api/auth/register"
        submitLabel="Criar conta"
        successRedirect="/dashboard"
        footerText="Ja possui conta?"
        footerHref="/login"
        footerLinkLabel="Entrar"
        fields={[
          {
            label: "Nome",
            name: "name",
            placeholder: "Digite seu nome",
          },
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
            placeholder: "Crie uma senha",
          },
        ]}
      />
    </main>
  );
}
