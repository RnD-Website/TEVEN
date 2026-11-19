/**
 * Product photography.
 * `productPhotos`: styled scene photos (tin on stone with loose leaf) in
 * public/images/products/<slug>.webp + .jpg. Products listed here show the
 * photo; the rest fall back to the drawn pack until their photo is added.
 *
 * `mockups`: transparent cut-out packs in public/images/pouches/<slug>.png
 * (used where a pack floats without a background, e.g. the origins ring).
 */
export const productPhotos: string[] = ['sreemangal-estate', 'english-breakfast', 'earl-grey', 'japanese-sencha', 'white-peony', 'moroccan-mint', 'chamomile-blend', 'himalayan-green', 'signature-herbal', 'organic-collection']

export const mockups: string[] = [...productPhotos]

export const hasProductPhoto = (slug: string) => productPhotos.includes(slug)
