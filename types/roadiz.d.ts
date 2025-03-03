/**
 * Roadiz CMS entities and DTO
 *
 * @see https://docs.roadiz.io/en/latest/developer/nodes-system/intro.html#what-is-a-node-type
 */
import { JsonLdObject } from './jsonld'
import { HydraCollection } from './hydra'

export interface RoadizNode extends JsonLdObject {
    attributeValues?: Array<Omit<RoadizAttributeValue, 'node'>>
    childrenOrder?: 'position' | 'nodeName' | 'createdAt' | 'updatedAt' | 'ns.publishedAt'
    childrenOrderDirection?: 'ASC' | 'DESC'
    home?: boolean
    nodeName?: string
    nodeTypeName?: string
    position?: number
    status?: number
    tags?: Array<RoadizTag>
    visible?: boolean
}

export interface RoadizTranslation extends JsonLdObject {
    available?: boolean
    defaultTranslation?: boolean
    locale?: string // ISO 2-letter language code (fr, en, de).
    name?: string
}

export interface RoadizSecureRealm extends JsonLdObject {
    // Defines how frontend should pass credentials to API:
    // - PasswordQuery: pass `?password=xxxxx` in query-string
    // - Bearer: use standard `Authentication: Bearer xxxxxx` HTTP header
    authenticationScheme?: 'PasswordQuery' | 'Bearer'
    behaviour?: 'none' | 'deny' | 'hide_blocks'
    name?: string
    type?: 'plain_password' | 'bearer_role' | 'bearer_user'
}

export interface RoadizNodesSources extends JsonLdObject {
    listingSortOptions?: {
        [key: string]: 'ASC' | 'DESC'
    }
    metaDescription?: string
    metaTitle?: string
    noIndex?: boolean
    node?: Omit<RoadizNode, 'home' | 'nodeTypeName' | 'status' | 'position'>
    publishedAt?: string // ISO publication DateTime
    slug?: string // First urlAlias OR node.nodeName
    title?: string
    translation?: RoadizTranslation
    url?: string // Reachable nodes-sources URL
    urlAliases?: Array<RoadizUrlAlias>
}

export interface RoadizSearchHighlighting {
    // eslint-disable-next-line camelcase
    collection_txt?: string[]
    // eslint-disable-next-line camelcase
    collection_txt_fr?: string[]
    // eslint-disable-next-line camelcase
    collection_txt_en?: string[]
}

export interface RoadizSearchResultItem {
    highlighting?: RoadizSearchHighlighting
    nodeSource?: RoadizNodesSources
}

export interface RoadizArchivesYear {
    [key: string]: string
}

export interface RoadizUrlAlias {
    alias?: string
}

export interface RoadizTag extends JsonLdObject {
    color?: string
    documents?: Array<RoadizDocument>
    name?: string
    parent?: RoadizTag
    slug?: string
    visible?: boolean
}

export interface RoadizAttributeValue extends JsonLdObject {
    code?: string
    color?: string | null
    documents?: Array<RoadizDocument>
    label?: string
    node?: string
    position?: number
    type?: number
    value?: string | number | boolean | null
}

export interface RoadizAttribute {
    attributeTranslations: Array<RoadizAttributeTranslation>
    code?: string
    documents?: Array<RoadizDocument>
}

export interface RoadizAttributeTranslation {
    label?: string
    translation: RoadizTranslation
}

export interface RoadizWalker extends Omit<JsonLdObject, '@id'> {
    children?: Array<RoadizWalker>
    item?: RoadizNodesSources
}

export interface RoadizDocument extends JsonLdObject {
    alt?: string
    altSources?: Array<RoadizDocument> // Only for native video and audio documents
    copyright?: string
    description?: string
    embedId?: string // Only for external documents (Youtube, Vimeo, …)
    embedPlatform?: string // Only for external documents (Youtube, Vimeo, …)
    externalUrl?: string
    filename?: string
    filesize?: string
    folders?: Array<RoadizFolder>
    imageAverageColor?: string // Only for processable documents, i.e. images
    imageCropAlignment?:
        | 'top-left'
        | 'top'
        | 'top-right'
        | 'left'
        | 'center'
        | 'right'
        | 'bottom-left'
        | 'bottom'
        | 'bottom-right' // Only for processable documents, i.e. images
    imageHeight?: number // Only for processable documents, i.e. images
    imageWidth?: number // Only for processable documents, i.e. images
    mediaDuration?: number
    mimeType?: string
    name?: string
    private?: boolean
    processable?: boolean // True if document can be processed by an image optimizer
    publicUrl?: string // Only for none processable documents, i.e. PDFs, SVG
    rawRelativePath?: string // Only available if document has a raw file and `document_raw_relative_path` serialization group is used
    relativePath?: string
    thumbnail?: RoadizDocument // Only for none displayable documents, i.e. PDFs
    type?: string // mimeType short version
}

export interface RoadizFolder extends JsonLdObject {
    name?: string
    slug?: string
    visible?: boolean
}

export interface RoadizAlternateLink {
    locale?: string
    title?: string
    url?: string
}

export interface RoadizWebResponse extends JsonLdObject {
    blocks?: RoadizWebResponseBlocks
    breadcrumbs?: RoadizBreadcrumbs
    head?: RoadizWebResponseHead
    hidingBlocks?: boolean
    item?: RoadizWebResponseItem
    maxAge?: number // TTL in seconds
    realms?: Array<RoadizSecureRealm>
}

// depends on HTTP response format (application/json or application/ld+json)
export type RoadizWebResponseBlocks = HydraCollection<RoadizWalker> | Array<Omit<RoadizWalker, keyof JsonLdObject>>

export interface RoadizNodesSourcesHead extends Omit<JsonLdObject, '@id'> {
    facebookUrl?: string | null
    googleAnalytics?: string | null
    googleTagManager?: string | null
    homePageUrl?: string | null
    instagramUrl?: string | null
    linkedinUrl?: string | null
    mainColor?: string | null
    matomoSiteId?: string | null
    matomoTagManager?: string | null
    matomoUrl?: string | null
    metaDescription?: string | null
    metaTitle?: string | null
    noIndex?: boolean
    policyUrl?: string | null
    shareImage?: RoadizDocument | null
    siteName?: string | null
    twitterUrl?: string | null
    youtubeUrl?: string | null
}

// TODO: add generic for Events API to augment this interface?
export type RoadizWebResponseHead = RoadizNodesSourcesHead

export interface RoadizWebResponseItem extends JsonLdObject {
    url?: string
}

export interface RoadizBreadcrumbs extends Omit<JsonLdObject, '@id'> {
    items?: HydraCollection<JsonLdObject> | Array<unknown> // depends on HTTP response format (application/json or application/ld+json)
}

/**
 * A Roadiz entity archive exposes available months when entities were published at.
 * I.e /api/blog_posts/archives
 * @see RoadizApi.getArchivesForType()
 */
export interface RoadizEntityArchive extends JsonLdObject {
    months?: Record<string, string>
    year?: number
}

/*
 * User DTOs exposed by roadiz/user-bundle.
 * Extend this interface in your project when additional data is exposed.
 */

/*
 * Public user information to complete JWT with up-to-date data.
 * ALWAYS take authorization decisions based on RoadizUserOutput instead of
 * JWT scopes.
 */
export interface RoadizUserOutput extends JsonLdObject {
    birthday?: string | null
    company?: string | null
    emailValidated?: boolean
    firstName?: string | null
    identifier: string // email or username: identifier used for login
    job?: string | null
    lastName?: string | null
    phone?: string | null
    roles?: string[]
}

/*
 * Public user creation workflow:
 * - Create a user with email and plainPassword
 * This operation MUST be secured with HTTPS as payload holds a
 * plain password.
 */
export interface RoadizUserInput {
    birthday?: string | null
    company?: string | null
    email: string
    firstName?: string | null
    job?: string | null
    lastName?: string | null
    metadata?: unknown
    phone?: string | null
    plainPassword: string
}

/*
 * User password recovery workflow:
 * - user password request
 * - Email sent with temporary token (if account exists)
 * - user reset its password with token
 */
export interface RoadizUserPasswordRequest {
    identifier: string
}
export interface RoadizUserPasswordReset {
    plainPassword: string
    token: string
}

/*
 * User account validation workflow:
 * - validation request
 * - Email sent with temporary token
 * - account validation with received token
 */
export interface RoadizUserValidationRequest {
    identifier: string
}
export interface RoadizUserValidation {
    token: string
}
