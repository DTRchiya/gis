import { fetchProvince, PROVINCE_LIST } from './geojson';
import { useMapStore } from '@/store/useMapStore';

export async function preloadAllProvinces() {
  const store = useMapStore.getState();
  store.setIsPreloading(true);
  store.setLoadingProgress({ loaded: 0, total: PROVINCE_LIST.length, currentProvince: '' });

  let loaded = 0;

  // Load in batches of 3 to avoid overwhelming the browser
  const BATCH_SIZE = 3;
  for (let i = 0; i < PROVINCE_LIST.length; i += BATCH_SIZE) {
    const batch = PROVINCE_LIST.slice(i, i + BATCH_SIZE);

    await Promise.allSettled(
      batch.map(async (name) => {
        try {
          store.setLoadingProgress({
            loaded,
            total: PROVINCE_LIST.length,
            currentProvince: name,
          });
          const data = await fetchProvince(name);
          store.setProvinceCache(name, data);
        } catch (err) {
          console.warn(`Skipped province: ${name}`, err);
        } finally {
          loaded++;
          store.setLoadingProgress({
            loaded,
            total: PROVINCE_LIST.length,
            currentProvince: name,
          });
        }
      })
    );
  }

  store.setIsPreloading(false);
}
