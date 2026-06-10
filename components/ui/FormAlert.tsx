interface FormAlertProps {
  message: string;
}

export function FormAlert({ message }: FormAlertProps) {
  return (
    <div className="rounded-md bg-[#fdf4f4] border border-[#f5c2c7] text-[#b91c1c] text-sm px-4 py-3">
      {message}
    </div>
  );
}
