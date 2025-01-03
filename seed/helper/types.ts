type Member = {
  name: string
  email: string
}

type Owner = {
  name: string
  email: string
}

export type Circle = {
  name: string
  label: string
  location: string
  grade: number
  owner: Owner
  members: Member[]
}
