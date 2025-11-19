import { OTPForm } from '@/features/Auth/OtpForm';

const OTPPage = () => {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <OTPForm />
      </div>
    </div>
  );
};

export default OTPPage;
