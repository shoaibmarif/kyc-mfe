/**
 * SkyWalking Tracer — re-exported from the host shell via Module Federation.
 * The host (custom-main-shell) initialises the SkyWalking agent before any MFE
 * loads. This module gives each MFE a typed handle to the shared Tracer utility
 * without triggering a second agent registration.
 */
export { Tracer } from 'customMain/observability';
