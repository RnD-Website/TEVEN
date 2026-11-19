/**
 * Sanity Studio for TEVEN content.
 * Run: cd studio && npm install && npm run dev
 * Set SANITY_STUDIO_PROJECT_ID / SANITY_STUDIO_DATASET in studio/.env
 */
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from '../sanity/schemas'

export default defineConfig({
  name: 'teven',
  title: 'TEVEN',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes }
})
