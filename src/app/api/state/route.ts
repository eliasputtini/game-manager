import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import type { Game } from '@/types';

// A single document to persist the UI state. In a real app, scope by user/team.
// We use a fixed id 'default'.
const COLLECTION = process.env.MONGODB_STATE_COLLECTION || 'app_state';
const DOC_ID = 'default';

// Types of the persisted state (IDs only)
type PersistedPackage = {
  id: string;
  name: string;
  itemIds: string[];
};

export type PersistedState = {
  _id: string; // 'default'
  sourceItemIds: string[];
  targetItemIds: string[];
  sourcePackages: PersistedPackage[];
  targetPackages: PersistedPackage[];
  quantities: Record<string, number>;
  prices: Record<string, number>;
  packageFreight: Record<string, number>;
  packageTax: Record<string, number>;
  packageCounter?: number;
  // Optional cache of items to fully restore cards (e.g., items added from external API)
  itemsMap?: Record<string, Game>;
  updatedAt: string; // ISO
};

export async function GET() {
  try {
    const db = await getDb();
    const doc = await db.collection<PersistedState>(COLLECTION).findOne({ _id: DOC_ID });
    if (!doc) {
      // Seed from games collection93267
      const collectionName = process.env.MONGODB_COLLECTION || 'items';
      type DbGameDoc = {
        _id?: unknown;
        id?: string | number;
        title?: string;
        description?: string;
        category?: string;
        imageUrl?: string;
        boxartUrl?: string;
        game_title?: string;
        release_date?: string;
        platform?: number;
        region_id?: number;
        country_id?: number;
        developers?: number[];
      };

      const docs: DbGameDoc[] = await db
        .collection<DbGameDoc>(collectionName)
        .find({})
        .limit(500)
        .toArray();

      const items: Game[] = docs.map((d) => {
        const platformVal = d.platform;
        const category = platformVal === 10
          ? 'PS1'
          : platformVal === 11
          ? 'PS2'
          : d.category ?? (typeof platformVal === 'number' ? String(platformVal) : '');
        return {
          id: String(d.id ?? d._id),
          title: d.title ?? d.game_title ?? 'Untitled',
          description: d.description ?? '',
          category,
          imageUrl: d.imageUrl ?? d.boxartUrl,
          game_title: d.game_title,
          release_date: d.release_date,
          platform: d.platform,
          region_id: d.region_id,
          country_id: d.country_id,
          developers: d.developers,
        } as Game;
      });

      const itemsMap: Record<string, Game> = {};
      for (const it of items) itemsMap[it.id] = it;
      const seeded: PersistedState = {
        _id: DOC_ID,
        sourceItemIds: items.map((i) => i.id),
        targetItemIds: [],
        sourcePackages: [],
        targetPackages: [],
        quantities: {},
        prices: {},
        packageFreight: {},
        packageTax: {},
        packageCounter: 1,
        itemsMap,
        updatedAt: new Date().toISOString(),
      };
      return NextResponse.json(seeded, { status: 200 });
    }
    return NextResponse.json(doc, { status: 200 });
  } catch (err) {
    console.error('GET /api/state error', err);
    return NextResponse.json({ error: 'Failed to load state' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const payload = (await req.json()) as Partial<PersistedState> | null;
    if (!payload || typeof payload !== 'object') {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }

    const doc: Partial<PersistedState> = {
      sourceItemIds: Array.isArray(payload.sourceItemIds) ? payload.sourceItemIds.map(String) : [],
      targetItemIds: Array.isArray(payload.targetItemIds) ? payload.targetItemIds.map(String) : [],
      sourcePackages: Array.isArray(payload.sourcePackages)
        ? payload.sourcePackages.map((p) => ({
            id: String(p.id),
            name: String(p.name ?? ''),
            itemIds: Array.isArray(p.itemIds) ? p.itemIds.map(String) : [],
          }))
        : [],
      targetPackages: Array.isArray(payload.targetPackages)
        ? payload.targetPackages.map((p) => ({
            id: String(p.id),
            name: String(p.name ?? ''),
            itemIds: Array.isArray(p.itemIds) ? p.itemIds.map(String) : [],
          }))
        : [],
      quantities: payload.quantities && typeof payload.quantities === 'object' ? payload.quantities : {},
      prices: payload.prices && typeof payload.prices === 'object' ? payload.prices : {},
      packageFreight:
        payload.packageFreight && typeof payload.packageFreight === 'object'
          ? payload.packageFreight
          : {},
      packageTax:
        payload.packageTax && typeof payload.packageTax === 'object' ? payload.packageTax : {},
      packageCounter:
        typeof payload.packageCounter === 'number' ? payload.packageCounter : undefined,
      itemsMap:
        payload.itemsMap && typeof payload.itemsMap === 'object' ? (payload.itemsMap as Record<string, Game>) : undefined,
      updatedAt: new Date().toISOString(),
    };

    const db = await getDb();
    const col = db.collection<PersistedState>(COLLECTION);
    await col.updateOne(
      { _id: DOC_ID },
      { $set: { _id: DOC_ID, ...doc } },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('PUT /api/state error', err);
    return NextResponse.json({ error: 'Failed to save state' }, { status: 500 });
  }
}
