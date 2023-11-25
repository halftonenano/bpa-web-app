/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import { type RecordService } from 'pocketbase'

export enum Collections {
	Completions = "completions",
	Courses = "courses",
	Enrollments = "enrollments",
	Pages = "pages",
	Quizzes = "quizzes",
	Secrets = "secrets",
	Teachers = "teachers",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type CompletionsRecord = {
	page: RecordIdString
	user: RecordIdString
}

export type CoursesRecord = {
	color?: string
	cover?: string
	description: string
	name: string
	public?: boolean
}

export type EnrollmentsRecord = {
	course: RecordIdString
	user: RecordIdString
}

export type PagesRecord = {
	content?: string
	course: RecordIdString
	title: string
	video?: string
}

export type QuizzesRecord<Tquestions = unknown> = {
	description?: string
	questions: null | Tquestions
	title: string
}

export type SecretsRecord = {
	value: string
}

export type TeachersRecord = {
	course: RecordIdString
	user: RecordIdString
}

export type UsersRecord = {
	avatar?: string
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type CompletionsResponse<Texpand = unknown> = Required<CompletionsRecord> & BaseSystemFields<Texpand>
export type CoursesResponse<Texpand = unknown> = Required<CoursesRecord> & BaseSystemFields<Texpand>
export type EnrollmentsResponse<Texpand = unknown> = Required<EnrollmentsRecord> & BaseSystemFields<Texpand>
export type PagesResponse<Texpand = unknown> = Required<PagesRecord> & BaseSystemFields<Texpand>
export type QuizzesResponse<Tquestions = unknown, Texpand = unknown> = Required<QuizzesRecord<Tquestions>> & BaseSystemFields<Texpand>
export type SecretsResponse<Texpand = unknown> = Required<SecretsRecord> & BaseSystemFields<Texpand>
export type TeachersResponse<Texpand = unknown> = Required<TeachersRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	completions: CompletionsRecord
	courses: CoursesRecord
	enrollments: EnrollmentsRecord
	pages: PagesRecord
	quizzes: QuizzesRecord
	secrets: SecretsRecord
	teachers: TeachersRecord
	users: UsersRecord
}

export type CollectionResponses = {
	completions: CompletionsResponse
	courses: CoursesResponse
	enrollments: EnrollmentsResponse
	pages: PagesResponse
	quizzes: QuizzesResponse
	secrets: SecretsResponse
	teachers: TeachersResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'completions'): RecordService<CompletionsResponse>
	collection(idOrName: 'courses'): RecordService<CoursesResponse>
	collection(idOrName: 'enrollments'): RecordService<EnrollmentsResponse>
	collection(idOrName: 'pages'): RecordService<PagesResponse>
	collection(idOrName: 'quizzes'): RecordService<QuizzesResponse>
	collection(idOrName: 'secrets'): RecordService<SecretsResponse>
	collection(idOrName: 'teachers'): RecordService<TeachersResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
