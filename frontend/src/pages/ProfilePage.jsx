import { ProfileForm } from '@/features/Profile/ProfileForm';

export default function ProfilePage() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>

        <ProfileForm />
      </div>
    </div>
  );
}
