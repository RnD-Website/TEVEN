/**
 * Central image registry.
 * All photography is free-licensed Unsplash imagery (Unsplash License),
 * served from the Unsplash CDN with responsive sizing. To swap any image,
 * replace its photo ID here (or upload to Sanity — CMS images take priority).
 */
export const IMG = {
  // Plantations & landscapes
  plantationAerial: 'photo-1715348020419-b26effa510a3',
  sriLankaSlope: 'photo-1559038300-07cb5d6c3d27',
  plantationHills: 'photo-1714810267476-533496f19be2',
  munnarMist: 'photo-1491497895121-1334fc14d8c9',
  teaRows: 'photo-1593335663758-4da70281a917',
  japanHedges: 'photo-1702480251320-a19f6842c82b',
  japanTree: 'photo-1702480252437-b5d3232dadd7',
  japanMountain: 'photo-1562558742-ec7adb76fe11',
  plantationTruck: 'photo-1769638297957-d09cea5338fa',
  // Sreemangal, Bangladesh
  sreemangalPicker: '/images/heritage/sreemangal-picker.webp',
  sreemangalGarden: 'photo-1702898539404-14364aca16ad',
  // Harvest & communities
  harvestHillside: 'photo-1743401462369-44e568d93027',
  harvestWorker: 'photo-1743402810466-29a840f2c053',
  harvestWorker2: 'photo-1743402814792-ee8f4fcd0aa4',
  harvestWomen: 'photo-1758390285674-f1d55b9d1312',
  harvestBaskets: 'photo-1758390286367-7f645bffb090',
  womanHarvesting: 'photo-1433704334812-6c45b0b8784d',
  farmerBaskets: 'photo-1545830790-68595959c491',
  harvestJapan: 'photo-1769638297546-981049c289cd',
  // Leaves & craft
  driedLeaves: 'photo-1763617702099-d956f3fd8324',
  spoonsLooseLeaf: 'photo-1563822249366-3efb23b8e0c9',
  leafCluster: 'photo-1777188001652-6dbc3703f457',
  woodenBowlLeaves: 'photo-1641997829221-a7d363722a1b',
  gardenSpices: 'photo-1655252203834-befefb077e5d',
  // Preparation & ceremony
  pourHotWater: 'photo-1531969179221-3946e6b5a5e7',
  amberBowl: 'photo-1567922045116-2a00fae2ed03',
  floralPour: 'photo-1759530539862-5f8ce627d930',
  teaSetTray: 'photo-1531970227416-f0cddeb1f748',
  ceramicTray: 'photo-1564890369478-c89ca6d9cde9',
  kimonoCeremony: 'photo-1765035058192-edd7ee3e0df0',
  teaSetWindow: 'photo-1773394473042-0544a86abe61',
  cupsAndLeaves: 'photo-1765153743332-949b8d623d92',
  teapotWindow: 'photo-1781255650441-c75b7280050e',
  glassCeremony: 'photo-1601831753677-01f960be19eb',
  glassTeapots: 'photo-1766232574096-4c4380105cc7',
  cupGreenLeaves: 'photo-1766185387603-f03cb6d658fa',
  ceramicCups: 'photo-1560228022-f1a3298022e9',
  teapotTable: 'photo-1629440400842-9108c0ccf336',
  metalCupPour: 'photo-1761483281120-4fc47bfe3e29',
  teapotPour: 'photo-1678026557271-a178ec37f844',
  pourVintage: 'photo-1530219149-6b15097e9af3',
  antiqueCups: 'photo-1768254043707-001b33c01198',
  // Mint & herbal
  mintGlass: 'photo-1627435601361-ec25f5b1d0e5',
  mintGlasses: 'photo-1567708415681-d1d249e182eb',
  glassTeapotGarden: 'photo-1762920738963-002dbf2b4501',
  // Retail
  shopShelves: 'photo-1765809330985-a59b80931d12',
  traditionalShop: 'photo-1778493074639-2fa7a1557e0a'
} as const

export type ImageKey = keyof typeof IMG

export function imgUrl(idOrUrl: string, width = 1600, opts: { h?: number; q?: number } = {}) {
  if (!idOrUrl) return ''
  if (idOrUrl.startsWith('http') || idOrUrl.startsWith('/')) return idOrUrl
  const id = (IMG as Record<string, string>)[idOrUrl] ?? idOrUrl
  if (id.startsWith('/')) return id
  const params = new URLSearchParams({ auto: 'format', fit: 'crop', w: String(width), q: String(opts.q ?? 78) })
  if (opts.h) params.set('h', String(opts.h))
  return `https://images.unsplash.com/${id}?${params.toString()}`
}

export function imgSrcset(idOrUrl: string, widths = [480, 800, 1200, 1600, 2200]) {
  if (!idOrUrl || idOrUrl.startsWith('/')) return undefined
  if (((IMG as Record<string, string>)[idOrUrl] ?? '').startsWith('/')) return undefined
  if (idOrUrl.startsWith('http') && !idOrUrl.includes('images.unsplash.com')) return undefined
  return widths.map((w) => `${imgUrl(idOrUrl, w)} ${w}w`).join(', ')
}
