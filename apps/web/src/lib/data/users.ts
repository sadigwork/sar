import { executeQuery } from "../db"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"

export type User = {
  id: string
  name: string
  email: string
  roleId: string | null
  roleName?: string
  avatar?: string | null
  phone?: string | null
  createdAt: Date
  updatedAt: Date
}

export type Role = {
  id: string
  name: string
  description: string | null
}

export async function getUserById(id: string): Promise<User | null> {
  const query = `
    SELECT u.*, r.name as role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.id = $1
  `

  const result = await executeQuery<any[]>(query, [id])
  return result.length > 0 ? mapUserFromDb(result[0]) : null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const query = `
    SELECT u.*, r.name as role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.email = $1
  `

  const result = await executeQuery<any[]>(query, [email])
  return result.length > 0 ? mapUserFromDb(result[0]) : null
}

export async function validateUser(email: string, password: string): Promise<User | null> {
  const query = `
    SELECT u.*, r.name as role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.email = $1
  `

  const result = await executeQuery<any[]>(query, [email])

  if (result.length === 0) {
    return null
  }

  const user = result[0]
  const isValid = await bcrypt.compare(password, user.password)

  return isValid ? mapUserFromDb(user) : null
}

export async function createUser(name: string, email: string, password: string, roleId?: string): Promise<string> {
  const id = uuidv4()
  const hashedPassword = await bcrypt.hash(password, 10)
  const now = new Date()

  const query = `
    INSERT INTO users (id, name, email, password, role_id, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id
  `

  const params = [id, name, email, hashedPassword, roleId || null, now, now]

  const result = await executeQuery<{ id: string }[]>(query, params)
  return result[0].id
}

export async function getAllRoles(): Promise<Role[]> {
  const query = `SELECT * FROM roles ORDER BY name`
  const result = await executeQuery<Role[]>(query)

  return result.map((role) => ({
    id: role.id,
    name: role.name,
    description: role.description,
  }))
}

export async function getUsersByRole(roleName: string, limit = 10, offset = 0): Promise<User[]> {
  const query = `
    SELECT u.*, r.name as role_name
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE r.name = $1
    ORDER BY u.name
    LIMIT $2 OFFSET $3
  `

  const result = await executeQuery<any[]>(query, [roleName, limit, offset])
  return result.map(mapUserFromDb)
}

export async function getApplicantDetails(userId: string): Promise<any | null> {
  const query = `
    SELECT * FROM applicant
    WHERE user_id = $1
  `

  const result = await executeQuery<any[]>(query, [userId])
  return result.length > 0 ? mapApplicantFromDb(result[0]) : null
}

export async function getPersonalDetails(userId: string): Promise<any | null> {
  const query = `
    SELECT * FROM personal
    WHERE user_id = $1
  `

  const result = await executeQuery<any[]>(query, [userId])
  return result.length > 0 ? mapPersonalFromDb(result[0]) : null
}

// Helper functions to map database column names to camelCase
function mapUserFromDb(user: any): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    roleId: user.role_id,
    roleName: user.role_name,
    avatar: user.avatar,
    phone: user.phone,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  }
}

function mapApplicantFromDb(applicant: any): any {
  return {
    id: applicant.id,
    userId: applicant.user_id,
    nationalId: applicant.national_id,
    dateOfBirth: applicant.date_of_birth,
    gender: applicant.gender,
    nationality: applicant.nationality,
    address: applicant.address,
    city: applicant.city,
    postalCode: applicant.postal_code,
    country: applicant.country,
    emergencyContactName: applicant.emergency_contact_name,
    emergencyContactPhone: applicant.emergency_contact_phone,
    createdAt: applicant.created_at,
    updatedAt: applicant.updated_at,
  }
}

function mapPersonalFromDb(personal: any): any {
  return {
    id: personal.id,
    userId: personal.user_id,
    maritalStatus: personal.marital_status,
    numberOfDependents: personal.number_of_dependents,
    languages: personal.languages,
    profileSummary: personal.profile_summary,
    createdAt: personal.created_at,
    updatedAt: personal.updated_at,
  }
}
