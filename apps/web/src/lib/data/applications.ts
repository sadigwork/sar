import { executeQuery } from "../db"
import { v4 as uuidv4 } from "uuid"

export type Application = {
  id: string
  userId: string
  specializationId: string | null
  certificationLevelId: string | null
  status: string
  submissionDate: Date
  approvalDate: Date | null
  rejectionDate: Date | null
  rejectionReason: string | null
  reviewerId: string | null
  registrarId: string | null
  createdAt: Date
  updatedAt: Date
}

export type ApplicationWithDetails = Application & {
  userName: string
  userEmail: string
  specializationName?: string
  certificationLevelName?: string
  reviewerName?: string
  registrarName?: string
}

export async function getApplicationById(id: string): Promise<ApplicationWithDetails | null> {
  const query = `
    SELECT 
      a.*,
      u.name as user_name,
      u.email as user_email,
      s.name as specialization_name,
      cl.name as certification_level_name,
      r.name as reviewer_name,
      reg.name as registrar_name
    FROM applications a
    LEFT JOIN users u ON a.user_id = u.id
    LEFT JOIN specializations s ON a.specialization_id = s.id
    LEFT JOIN certification_levels cl ON a.certification_level_id = cl.id
    LEFT JOIN users r ON a.reviewer_id = r.id
    LEFT JOIN users reg ON a.registrar_id = reg.id
    WHERE a.id = $1
  `

  const result = await executeQuery<ApplicationWithDetails[]>(query, [id])
  return result.length > 0 ? mapApplicationFromDb(result[0]) : null
}

export async function getApplicationsByUserId(userId: string): Promise<Application[]> {
  const query = `
    SELECT * FROM applications
    WHERE user_id = $1
    ORDER BY submission_date DESC
  `

  const result = await executeQuery<Application[]>(query, [userId])
  return result.map(mapApplicationFromDb)
}

export async function getAllApplications(status?: string, limit = 10, offset = 0): Promise<ApplicationWithDetails[]> {
  let query = `
    SELECT 
      a.*,
      u.name as user_name,
      u.email as user_email,
      s.name as specialization_name,
      cl.name as certification_level_name,
      r.name as reviewer_name,
      reg.name as registrar_name
    FROM applications a
    LEFT JOIN users u ON a.user_id = u.id
    LEFT JOIN specializations s ON a.specialization_id = s.id
    LEFT JOIN certification_levels cl ON a.certification_level_id = cl.id
    LEFT JOIN users r ON a.reviewer_id = r.id
    LEFT JOIN users reg ON a.registrar_id = reg.id
  `

  const params: any[] = []

  if (status) {
    query += " WHERE a.status = $1"
    params.push(status)
  }

  query += " ORDER BY a.submission_date DESC LIMIT $" + (params.length + 1) + " OFFSET $" + (params.length + 2)
  params.push(limit, offset)

  const result = await executeQuery<ApplicationWithDetails[]>(query, params)
  return result.map(mapApplicationFromDb)
}

export async function updateApplicationStatus(
  id: string,
  status: string,
  userId: string,
  reason?: string,
): Promise<boolean> {
  const now = new Date()
  let query = ""
  const params: any[] = [id, status, now]

  if (status === "approved") {
    query = `
      UPDATE applications
      SET status = $2, approval_date = $3, reviewer_id = $4, updated_at = $3
      WHERE id = $1
      RETURNING id
    `
    params.push(userId)
  } else if (status === "rejected") {
    query = `
      UPDATE applications
      SET status = $2, rejection_date = $3, rejection_reason = $4, reviewer_id = $5, updated_at = $3
      WHERE id = $1
      RETURNING id
    `
    params.push(reason || null, userId)
  } else if (status === "registered") {
    query = `
      UPDATE applications
      SET status = $2, registrar_id = $4, updated_at = $3
      WHERE id = $1
      RETURNING id
    `
    params.push(userId)
  } else {
    query = `
      UPDATE applications
      SET status = $2, updated_at = $3
      WHERE id = $1
      RETURNING id
    `
  }

  const result = await executeQuery<{ id: string }[]>(query, params)
  return result.length > 0
}

export async function createApplication(
  userId: string,
  specializationId: string | null,
  certificationLevelId: string | null,
): Promise<string> {
  const id = uuidv4()
  const now = new Date()

  const query = `
    INSERT INTO applications (
      id, user_id, specialization_id, certification_level_id, 
      status, submission_date, created_at, updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id
  `

  const params = [id, userId, specializationId, certificationLevelId, "new", now, now, now]

  const result = await executeQuery<{ id: string }[]>(query, params)
  return result[0].id
}

// Helper function to map database column names to camelCase
function mapApplicationFromDb(app: any): ApplicationWithDetails {
  return {
    id: app.id,
    userId: app.user_id,
    specializationId: app.specialization_id,
    certificationLevelId: app.certification_level_id,
    status: app.status,
    submissionDate: app.submission_date,
    approvalDate: app.approval_date,
    rejectionDate: app.rejection_date,
    rejectionReason: app.rejection_reason,
    reviewerId: app.reviewer_id,
    registrarId: app.registrar_id,
    createdAt: app.created_at,
    updatedAt: app.updated_at,
    userName: app.user_name,
    userEmail: app.user_email,
    specializationName: app.specialization_name,
    certificationLevelName: app.certification_level_name,
    reviewerName: app.reviewer_name,
    registrarName: app.registrar_name,
  }
}
