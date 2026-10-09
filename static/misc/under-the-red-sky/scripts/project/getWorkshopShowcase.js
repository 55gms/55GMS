const baseUrl = "https://workshop-showcase.dedragames.com";

let cachedWorkshopShowcase;
let pendingWorkshopShowcasePromise = null;

export default async function getWorkshopShowcase() {
    if (cachedWorkshopShowcase !== undefined) {
        return cachedWorkshopShowcase;
    }

    if (pendingWorkshopShowcasePromise) {
        return pendingWorkshopShowcasePromise;
    }

    pendingWorkshopShowcasePromise = (async () => {
        try {
            const nameRes = await fetch(`${baseUrl}/api/name`);
            const { name = "", hasFile = false } = await nameRes.json();

            if (!hasFile) {
                cachedWorkshopShowcase = { name: "", exists: false, content: null };
                return cachedWorkshopShowcase;
            }

            const fileRes = await fetch(`${baseUrl}/api/file`);
            const content = await fileRes.json();

            cachedWorkshopShowcase = { name, exists: true, content };
            return cachedWorkshopShowcase;
        } catch (e) {
            return { name: "", exists: false, content: null };
        }
    })();

    try {
        return await pendingWorkshopShowcasePromise;
    } finally {
        pendingWorkshopShowcasePromise = null;
    }
}
