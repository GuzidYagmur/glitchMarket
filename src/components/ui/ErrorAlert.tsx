interface ErrorAlertProps {
  message: string
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
      <strong>Error:</strong> {message}
    </div>
  )
}
