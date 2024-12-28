type Member = {
  name: string
  email: string
}

type Owner = {
  name: string
  email: string
}

export type Cicle = {
  name: string
  label: string
  location: string
  grade: string
  owner: Owner
  members: Member[]
}
