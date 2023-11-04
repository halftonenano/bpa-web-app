/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import { type RecordService } from 'pocketbase'

export enum Collections {
	Courses = "courses",
	Enrollments = "enrollments",
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

export type CoursesRecord = {
	description: string
	name: string
	public?: boolean
}

export type EnrollmentsRecord = {
	course: RecordIdString
	user: RecordIdString
}

export type UsersRecord = {
	avatar?: string
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type CoursesResponse<Texpand = unknown> = Required<CoursesRecord> & BaseSystemFields<Texpand>
export type EnrollmentsResponse<Texpand = unknown> = Required<EnrollmentsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	courses: CoursesRecord
	enrollments: EnrollmentsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	courses: CoursesResponse
	enrollments: EnrollmentsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'courses'): RecordService<CoursesResponse>
	collection(idOrName: 'enrollments'): RecordService<EnrollmentsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
