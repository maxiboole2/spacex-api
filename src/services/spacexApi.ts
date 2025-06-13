// /home/lys/testLaravel/frontend/src/services/spacexApi.ts
import type { Lancement } from "../types/lancement";

const BASE_URL = "https://api.spacexdata.com/v5/launches";

export async function getProchainLancement(): Promise<Lancement> {
  try {
    const response = await fetch(`${BASE_URL}/next`);
    if (!response.ok) {
      throw new Error("Erreur lors du chargement du prochain lancement");
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur dans getProchainLancement:", error);
    throw error;
  }
}

export async function getLancements(
  filtre: "tous" | "succes" | "echec"
): Promise<Lancement[]> {
  try {
    const response = await fetch(`${BASE_URL}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: buildQuery(filtre),
        options: {
          sort: { date_utc: "desc" },
          limit: 10,
          populate: ["payloads", "launchpad"],
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors du chargement des lancements");
    }
    const data = await response.json();
    return data.docs;
  } catch (error) {
    console.error("Erreur dans getLancements:", error);
    throw error;
  }
}

function buildQuery(filtre: "tous" | "succes" | "echec") {
  if (filtre === "succes") {
    return { success: true };
  } else if (filtre === "echec") {
    return { success: false };
  } else {
    return {};
  }
}
