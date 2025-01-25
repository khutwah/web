import * as yup from 'yup'

export const UpdatePasswordSchema = yup.object({
  old_password: yup
    .string()
    .required('Sandi saat ini wajib diisi')
    .min(6, 'Sandi saat ini harus minimal 6 karakter'),
  new_password: yup
    .string()
    .required('Sandi baru wajib diisi')
    .min(6, 'Sandi baru harus minimal 6 karakter'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('new_password')], 'Password tidak sama')
    .required('Konfirmasi sandi wajib diisi')
    .min(6, 'Konfirmasi sandi harus minimal 6 karakter')
})
