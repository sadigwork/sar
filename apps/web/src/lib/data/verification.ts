import { executeQuery } from "../db"
import { v4 as uuidv4 } from "uuid"

export type VerificationItem = {
  id: string
  applicationId: string
  isVerified: boolean
  verifiedBy: string | null
  verificationDate: Date | null
  verificationNotes: string | null
}

export type Education = VerificationItem & {
  degree: string
  institution: string
  field: string
  graduationYear: string
  certificateUrl: string | null
}

export type Experience = VerificationItem & {
  title: string
  company: string
  startDate: Date
  endDate: Date | null
  isCurrent: boolean
  description: string | null
  documentUrl: string | null
}

export type Training = VerificationItem & {
  title: string
  provider: string
  startDate: Date
  endDate: Date
  hours: number | null
  certificateUrl: string | null
}

export type Document = VerificationItem & {
  type: string
  name: string
  fileUrl: string
}

export async function getEducationByApplicationId(applicationId: string): Promise<Education[]> {
  const query = `
    SELECT * FROM education
    WHERE application_id = $1
    ORDER BY graduation_year DESC
  `

  const result = await executeQuery<any[]>(query, [applicationId])
  return result.map(mapEducationFromDb)
}

export async function getExperienceByApplicationId(applicationId: string): Promise<Experience[]> {
  const query = `
    SELECT * FROM experience
    WHERE application_id = $1
    ORDER BY start_date DESC
  `

  const result = await executeQuery<any[]>(query, [applicationId])
  return result.map(mapExperienceFromDb)
}

export async function getTrainingByApplicationId(applicationId: string): Promise<Training[]> {
  const query = `
    SELECT * FROM training
    WHERE application_id = $1
    ORDER BY start_date DESC
  `

  const result = await executeQuery<any[]>(query, [applicationId])
  return result.map(mapTrainingFromDb)
}

export async function getDocumentsByApplicationId(applicationId: string): Promise<Document[]> {
  const query = `
    SELECT * FROM documents
    WHERE application_id = $1
    ORDER BY type
  `

  const result = await executeQuery<any[]>(query, [applicationId])
  return result.map(mapDocumentFromDb)
}

export async function verifyItem(
  itemType: "education" | "experience" | "training" | "document",
  itemId: string,
  userId: string,
  notes?: string,
): Promise<boolean> {
  const now = new Date()

  let tableName = ""
  switch (itemType) {
    case "education":
      tableName = "education"
      break
    case "experience":
      tableName = "experience"
      break
    case "training":
      tableName = "training"
      break
    case "document":
      tableName = "documents"
      break
    default:
      throw new Error(`Invalid item type: ${itemType}`)
  }

  const query = `
    UPDATE ${tableName}
    SET is_verified = true, verified_by = $2, verification_date = $3, verification_notes = $4, updated_at = $3
    WHERE id = $1
    RETURNING id, application_id
  `

  const result = await executeQuery<{ id: string; application_id: string }[]>(query, [
    itemId,
    userId,
    now,
    notes || null,
  ])

  if (result.length > 0) {
    // Add to verification history
    await addVerificationHistory(result[0].application_id, userId, "verify", itemType, itemId, notes)
    return true
  }

  return false
}

export async function addVerificationHistory(
  applicationId: string,
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  notes?: string,
): Promise<string> {
  const id = uuidv4()
  const now = new Date()

  const query = `
    INSERT INTO verification_history (
      id, application_id, user_id, action, entity_type, entity_id, notes, created_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id
  `

  const params = [id, applicationId, userId, action, entityType, entityId, notes || null, now]

  const result = await executeQuery<{ id: string }[]>(query, params)
  return result[0].id
}

export async function getVerificationHistory(applicationId: string): Promise<any[]> {
  const query = `
    SELECT vh.*, u.name as user_name
    FROM verification_history vh
    JOIN users u ON vh.user_id = u.id
    WHERE vh.application_id = $1
    ORDER BY vh.created_at DESC
  `

  const result = await executeQuery<any[]>(query, [applicationId])
  return result.map((item) => ({
    id: item.id,
    applicationId: item.application_id,
    userId: item.user_id,
    userName: item.user_name,
    action: item.action,
    entityType: item.entity_type,
    entityId: item.entity_id,
    notes: item.notes,
    createdAt: item.created_at,
  }))
}

// Helper functions to map database column names to camelCase
function mapEducationFromDb(edu: any): Education {
  return {
    id: edu.id,
    applicationId: edu.application_id,
    degree: edu.degree,
    institution: edu.institution,
    field: edu.field,
    graduationYear: edu.graduation_year,
    certificateUrl: edu.certificate_url,
    isVerified: edu.is_verified,
    verifiedBy: edu.verified_by,
    verificationDate: edu.verification_date,
    verificationNotes: edu.verification_notes,
  }
}

function mapExperienceFromDb(exp: any): Experience {
  return {
    id: exp.id,
    applicationId: exp.application_id,
    title: exp.title,
    company: exp.company,
    startDate: exp.start_date,
    endDate: exp.end_date,
    isCurrent: exp.is_current,
    description: exp.description,
    documentUrl: exp.document_url,
    isVerified: exp.is_verified,
    verifiedBy: exp.verified_by,
    verificationDate: exp.verification_date,
    verificationNotes: exp.verification_notes,
  }
}

function mapTrainingFromDb(training: any): Training {
  return {
    id: training.id,
    applicationId: training.application_id,
    title: training.title,
    provider: training.provider,
    startDate: training.start_date,
    endDate: training.end_date,
    hours: training.hours,
    certificateUrl: training.certificate_url,
    isVerified: training.is_verified,
    verifiedBy: training.verified_by,
    verificationDate: training.verification_date,
    verificationNotes: training.verification_notes,
  }
}

function mapDocumentFromDb(doc: any): Document {
  return {
    id: doc.id,
    applicationId: doc.application_id,
    type: doc.type,
    name: doc.name,
    fileUrl: doc.file_url,
    isVerified: doc.is_verified,
    verifiedBy: doc.verified_by,
    verificationDate: doc.verification_date,
    verificationNotes: doc.verification_notes,
  }
}
