export interface UpdatePasswordProps {
  action: (
    _prevState: unknown,
    formData: FormData
  ) => Promise<{ message: string } | undefined>
}
