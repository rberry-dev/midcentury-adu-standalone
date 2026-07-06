import { useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";

// ---------------------------------------------------------------------------
// Types (mirrors shared/schema.ts on the server)
// ---------------------------------------------------------------------------

export type ModelImageKind = "hero" | "gallery" | "floorplan";

export interface ModelImage {
  id: number;
  modelId: number;
  url: string;
  alt: string | null;
  kind: ModelImageKind;
  sortOrder: number;
  createdAt: string;
}

export interface IncludedProduct {
  id: number;
  modelId: number;
  name: string;
  url: string;
  category: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface Model {
  id: number;
  slug: string;
  name: string;
  sf: number;
  type: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  scenario: string;
  tagline: string;
  beds: string;
  baths: number;
  stories: number;
  priceCents: number;
  furnishingPriceCents: number;
  description: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  images: ModelImage[];
  products: IncludedProduct[];
}

export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  heroImageUrl: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Auth token (used only for admin write requests)
// ---------------------------------------------------------------------------

export type AuthTokenGetter = () => Promise<string | null> | string | null;
let authTokenGetter: AuthTokenGetter | null = null;

export function setAuthTokenGetter(getter: AuthTokenGetter | null): void {
  authTokenGetter = getter;
}

// ---------------------------------------------------------------------------
// Low-level fetch helper
// ---------------------------------------------------------------------------

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  if (authTokenGetter) {
    const token = await authTokenGetter();
    if (token) headers.set("authorization", `Bearer ${token}`);
  }

  const res = await fetch(`/api${path}`, { ...init, headers });

  if (!res.ok) {
    let message = `HTTP ${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // ignore body parse errors
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const getListModelsQueryKey = () => ["models"] as const;
export const getGetModelQueryKey = (id: number) => ["models", id] as const;
export const getListPostsQueryKey = (params?: { category?: string }) =>
  ["posts", params ?? {}] as const;
export const getGetPostBySlugQueryKey = (slug: string) => ["posts", "slug", slug] as const;

// ---------------------------------------------------------------------------
// Models — reads
// ---------------------------------------------------------------------------

export function useListModels(
  options?: Omit<UseQueryOptions<Model[]>, "queryKey" | "queryFn">,
) {
  return useQuery<Model[]>({
    queryKey: getListModelsQueryKey(),
    queryFn: () => apiFetch<Model[]>("/models"),
    ...options,
  });
}

export function useGetModel(
  id: number,
  options?: Omit<UseQueryOptions<Model>, "queryKey" | "queryFn">,
) {
  return useQuery<Model>({
    queryKey: getGetModelQueryKey(id),
    queryFn: () => apiFetch<Model>(`/models/${id}`),
    enabled: Number.isFinite(id),
    ...options,
  });
}

// ---------------------------------------------------------------------------
// Models — writes (admin only)
// ---------------------------------------------------------------------------

export async function updateModel(
  id: number,
  patch: Partial<
    Pick<
      Model,
      | "name"
      | "slug"
      | "type"
      | "sf"
      | "badge"
      | "badgeBg"
      | "badgeColor"
      | "scenario"
      | "tagline"
      | "beds"
      | "baths"
      | "stories"
      | "priceCents"
      | "furnishingPriceCents"
      | "description"
      | "sortOrder"
      | "isPublished"
    >
  >,
): Promise<Model> {
  return apiFetch<Model>(`/models/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function addModelImage(
  modelId: number,
  input: { url: string; kind: ModelImageKind; alt?: string; sortOrder: number },
): Promise<ModelImage> {
  return apiFetch<ModelImage>(`/models/${modelId}/images`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function deleteModelImage(imageId: number): Promise<void> {
  await apiFetch<void>(`/model-images/${imageId}`, { method: "DELETE" });
}

export async function addIncludedProduct(
  modelId: number,
  input: { name: string; url: string; category: string | null; sortOrder: number },
): Promise<IncludedProduct> {
  return apiFetch<IncludedProduct>(`/models/${modelId}/products`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function deleteIncludedProduct(productId: number): Promise<void> {
  await apiFetch<void>(`/included-products/${productId}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Posts — reads (public)
// ---------------------------------------------------------------------------

export function useListPosts(
  params?: { category?: string },
  options?: Omit<UseQueryOptions<Post[]>, "queryKey" | "queryFn">,
) {
  return useQuery<Post[]>({
    queryKey: getListPostsQueryKey(params),
    queryFn: () => {
      const search = params?.category
        ? `?category=${encodeURIComponent(params.category)}`
        : "";
      return apiFetch<Post[]>(`/posts${search}`);
    },
    ...options,
  });
}

export function useGetPostBySlug(
  slug: string,
  options?: Omit<UseQueryOptions<Post>, "queryKey" | "queryFn">,
) {
  return useQuery<Post>({
    queryKey: getGetPostBySlugQueryKey(slug),
    queryFn: () => apiFetch<Post>(`/posts/by-slug/${encodeURIComponent(slug)}`),
    enabled: Boolean(slug),
    ...options,
  });
}

// ---------------------------------------------------------------------------
// Posts — admin
// ---------------------------------------------------------------------------

export function useAdminListPosts(
  options?: Omit<UseQueryOptions<Post[]>, "queryKey" | "queryFn">,
) {
  return useQuery<Post[]>({
    queryKey: ["admin-posts"],
    queryFn: () => apiFetch<Post[]>("/admin/posts"),
    ...options,
  });
}

export function useAdminGetPost(
  id: number,
  options?: Omit<UseQueryOptions<Post>, "queryKey" | "queryFn">,
) {
  return useQuery<Post>({
    queryKey: ["admin-posts", id],
    queryFn: () => apiFetch<Post>(`/admin/posts/${id}`),
    enabled: Number.isFinite(id),
    ...options,
  });
}

export async function createPost(
  input: Partial<Post> & { slug: string; title: string; category: string },
): Promise<Post> {
  return apiFetch<Post>("/admin/posts", { method: "POST", body: JSON.stringify(input) });
}

export async function updatePost(id: number, patch: Partial<Post>): Promise<Post> {
  return apiFetch<Post>(`/admin/posts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function deletePost(id: number): Promise<void> {
  await apiFetch<void>(`/admin/posts/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

export interface Lead {
  id: number;
  source: string;
  status: string;
  name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  zip: string | null;
  modelInterest: string | null;
  intendedUse: string | null;
  processStage: string | null;
  message: string | null;
  scheduledAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function submitLead(input: Record<string, unknown>): Promise<{ id: number; ok: true }> {
  return apiFetch("/leads", { method: "POST", body: JSON.stringify(input) });
}

export function useAdminListLeads(
  params?: { source?: string; status?: string },
  options?: Omit<UseQueryOptions<Lead[]>, "queryKey" | "queryFn">,
) {
  return useQuery<Lead[]>({
    queryKey: ["leads", params ?? {}],
    queryFn: () => {
      const search = new URLSearchParams();
      if (params?.source) search.set("source", params.source);
      if (params?.status) search.set("status", params.status);
      const qs = search.toString();
      return apiFetch<Lead[]>(`/leads${qs ? `?${qs}` : ""}`);
    },
    ...options,
  });
}

export async function updateLead(
  id: number,
  patch: { status?: string; notes?: string },
): Promise<Lead> {
  return apiFetch<Lead>(`/leads/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
}

// ---------------------------------------------------------------------------
// Availability
// ---------------------------------------------------------------------------

export interface AvailabilityWindow {
  id: number;
  dayOfWeek: number;
  startMinute: number;
  endMinute: number;
  createdAt: string;
}

export interface AvailabilitySlot {
  start: string;
  date: string;
}

export function useAvailabilityWindows(
  options?: Omit<UseQueryOptions<AvailabilityWindow[]>, "queryKey" | "queryFn">,
) {
  return useQuery<AvailabilityWindow[]>({
    queryKey: ["availability-windows"],
    queryFn: () => apiFetch<AvailabilityWindow[]>("/availability/windows"),
    ...options,
  });
}

export async function addAvailabilityWindow(input: {
  dayOfWeek: number;
  startMinute: number;
  endMinute: number;
}): Promise<AvailabilityWindow> {
  return apiFetch<AvailabilityWindow>("/availability/windows", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function deleteAvailabilityWindow(id: number): Promise<void> {
  await apiFetch<void>(`/availability/windows/${id}`, { method: "DELETE" });
}

export function useAvailabilitySlots(
  days = 21,
  options?: Omit<
    UseQueryOptions<{ slotMinutes: number; bufferMinutes: number; timezone: string; slots: AvailabilitySlot[] }>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: ["availability-slots", days],
    queryFn: () =>
      apiFetch<{
        slotMinutes: number;
        bufferMinutes: number;
        timezone: string;
        slots: AvailabilitySlot[];
      }>(`/availability/slots?days=${days}`),
    ...options,
  });
}

// ---------------------------------------------------------------------------
// Storage / uploads
// ---------------------------------------------------------------------------

export async function requestUploadUrl(input: {
  name: string;
  size: number;
  contentType: string;
}): Promise<{ uploadURL: string; objectPath: string }> {
  return apiFetch("/storage/uploads/request-url", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// Re-exported for admin pages that want to invalidate queries directly.
export { useQueryClient };
