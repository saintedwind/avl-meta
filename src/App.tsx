import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Download, Upload, Search, Database, Building2, Factory, Globe, ShieldCheck, Filter, CheckCircle2, AlertCircle } from "lucide-react";

/* =============================================================================
   Seed Data (Sample & Editable)
   NOTE: Replace/extend with real ingested data. The app can merge baked-in JSON
   from /public/data/* and imported JSON files at runtime.
============================================================================= */

const SEED_SOURCES = [
  { id: "asme", name: "ASME Certificate Holders", region: "Global", categories: ["Boilers","Pressure Vessels","Piping"], trustLevel: 0.98, lastUpdated: "2025-09-30" },
  { id: "nbbi", name: "National Board (NBBI) Directory", region: "Global", categories: ["Boilers","Pressure Vessels","Repairs"], trustLevel: 0.96, lastUpdated: "2025-08-20" },
  { id: "api", name: "API Composite List", region: "Global", categories: ["Oil & Gas","Valves","Pipes","Pumps"], trustLevel: 0.95, lastUpdated: "2025-10-01" },
  { id: "lr", name: "Lloyd's Register (LR) Approved", region: "Global/Europe", categories: ["Steel","Valves","Pressure Equipment","Marine"], trustLevel: 0.92, lastUpdated: "2025-09-01" },
  { id: "dnv", name: "DNV Approval Finder", region: "Global/Europe", categories: ["Marine","Offshore","Materials","Components"], trustLevel: 0.93, lastUpdated: "2025-07-12" },
  { id: "aramco", name: "Saudi Aramco Approved Manufacturers", region: "Middle East/Global", categories: ["Pipes","Valves","Coatings","Materials"], trustLevel: 0.91, lastUpdated: "2025-08-05" },
  { id: "adnoc", name: "ADNOC/ADCO AVL", region: "Middle East/Global", categories: ["Valves","Pipelines","Oilfield Equipment"], trustLevel: 0.88, lastUpdated: "2025-06-15" },
  { id: "eil", name: "Engineers India Ltd (EIL) AVL", region: "India/Global", categories: ["Boilers","Heat Exchangers","Pressure Vessels","Electrical","Instrumentation"], trustLevel: 0.9, lastUpdated: "2025-09-18" },
  { id: "selo", name: "China Special Equipment License (SELO)", region: "China", categories: ["Boilers","Pressure Vessels","Pressure Piping"], trustLevel: 0.94, lastUpdated: "2025-08-25" },
  { id: "ifi", name: "Inspection-for-Industry Aggregated List", region: "Global", categories: ["Rotating","Fixed","Electrical","Instrumentation"], trustLevel: 0.8, lastUpdated: "2025-09-10" },
];

const SEED_VENDORS = [
  {
    name: "Alfa Laval",
    country: "Sweden",
    industries: ["Power","Process","Marine"],
    categories: ["Heat Exchangers"],
    products: ["Plate Heat Exchangers","Shell-and-Tube Exchangers"],
    certifications: ["ASME"],
    avlMemberships: ["asme","lr","dnv","ifi"],
  },
  {
    name: "Doosan Enerbility",
    country: "Korea",
    industries: ["Power","Boiler","Turbine"],
    categories: ["Boilers","Turbines","Pressure Vessels"],
    products: ["Utility Boilers","Steam Turbines","HRSG"],
    certifications: ["ASME","NBBI"],
    avlMemberships: ["asme","nbbi","dnv","ifi"],
  },
  {
    name: "GE Vernova (Steam Power)",
    country: "USA",
    industries: ["Power"],
    categories: ["Turbines","Boilers"],
    products: ["Steam Turbines","Boiler Islands"],
    certifications: ["ASME","NBBI","API"],
    avlMemberships: ["asme","nbbi","api","dnv","ifi"],
  },
  {
    name: "BHEL (Bharat Heavy Electricals)",
    country: "India",
    industries: ["Power","Process"],
    categories: ["Boilers","Turbines","Heat Exchangers"],
    products: ["Utility Boilers","Steam Turbines","HX Bundles"],
    certifications: ["ASME","NBBI"],
    avlMemberships: ["asme","nbbi","eil","ifi"],
  },
  {
    name: "Zhejiang Boiler Co.",
    country: "China",
    industries: ["Boiler","Power"],
    categories: ["Boilers","Pressure Vessels"],
    products: ["Industrial Boilers","Pressure Vessels"],
    certifications: ["ASME","SELO"],
    avlMemberships: ["asme","selo","ifi"],
  },
  {
    name: "Metso Outotec (Metso)",
    country: "Finland",
    industries: ["Mining","Metals"],
    categories: ["Mining Equipment"],
    products: ["Crushers","Mills","Flotation"],
    certifications: ["API"],
    avlMemberships: ["api","dnv","ifi"],
  },
  {
    name: "Tenaris",
    country: "Luxembourg",
    industries: ["Oil & Gas","Power"],
    categories: ["Pipes","Tubes"],
    products: ["Seamless Pipes","OCTG"],
    certifications: ["API","ASME"],
    avlMemberships: ["api","asme","lr","ifi"],
  },
  {
    name: "Alstom (Steam Services)",
    country: "France",
    industries: ["Power"],
    categories: ["Turbines"],
    products: ["Steam Turbine Services"],
    certifications: ["ASME","NBBI"],
    avlMemberships: ["asme","nbbi","dnv","ifi"],
  },
  {
    name: "CIMC Enric",
    country: "China",
    industries: ["Process","Energy"],
    categories: ["Pressure Vessels","Cryogenics"],
    products: ["Storage Vessels","Tanks"],
    certifications: ["ASME","SELO","LR"],
    avlMemberships: ["asme","selo","lr","ifi"],
  },
  {
    name: "KSB",
    country: "Germany",
    industries: ["Power","Process","Mining"],
    categories: ["Pumps","Valves"],
    products: ["Centrifugal Pumps","Control Valves"],
    certifications: ["API","ASME"],
    avlMemberships: ["api","asme","dnv","ifi"],
  },
];

const INDUSTRIES = ["Boiler","Turbine","Mining","Pressure Vessels","Heat Exchangers","Power","Process","Oil & Gas","Marine"];
const CATEGORY_BY_INDUSTRY: Record<string, string[]> = {
  Boiler: ["Boilers","Burners","HRSG","Boiler Islands"],
  Turbine: ["Steam Turbines","Gas Turbines","Turbomachinery"],
  Mining: ["Crushers","Mills","Flotation","Conveyors","Screens"],
  "Pressure Vessels": ["Pressure Vessels","Columns","Reactors","Tanks"],
  "Heat Exchangers": ["Shell-and-Tube","Plate HX","Air-Cooled"],
  Power: ["Boilers","Turbines","Pipes","Valves","Pumps"],
  Process: ["Valves","Pumps","Instrumentation","Compressors"],
  "Oil & Gas": ["Pipes","Valves","Pumps","Separators"],
  Marine: ["Marine Equipment","Valves","Engines","HX"],
};

const CERT_BADGES = ["ASME","NBBI","API","LR","DNV","SELO"] as const;

/* =============================================================================
   Local Storage Helpers (Safe Snapshot)
============================================================================= */
const LS_KEY = "avl_meta_search_data_v1";
const MAX_PERSIST = 300;

type Source = typeof SEED_SOURCES[number];
type Vendor = typeof SEED_VENDORS[number];

type Store = {
  sources: Source[];
  vendors: Vendor[];
};

function loadStore(): Store {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { sources: SEED_SOURCES, vendors: SEED_VENDORS };
    const parsed = JSON.parse(raw);
    return {
      sources: Array.isArray(parsed.sources) ? parsed.sources : SEED_SOURCES,
      vendors: Array.isArray(parsed.vendors) ? parsed.vendors.slice(0, MAX_PERSIST) : SEED_VENDORS,
    };
  } catch {
    return { sources: SEED_SOURCES, vendors: SEED_VENDORS };
  }
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;
function saveStoreDebounced(store: Store) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      const snapshot: Store = {
        sources: store.sources,
        vendors: store.vendors.slice(0, MAX_PERSIST),
      };
      localStorage.setItem(LS_KEY, JSON.stringify(snapshot));
    } catch {
      try { localStorage.setItem(LS_KEY, JSON.stringify({ sources: store.sources, vendors: [] })); } catch {}
    }
  }, 200);
}

/* =============================================================================
   Merge / Dedupe Helpers
============================================================================= */
function mergeSources(a: Source[], b: Source[]) {
  const byId = new Map<string, Source>();
  for (const s of [...a, ...b]) byId.set(s.id, s);
  return Array.from(byId.values());
}

function dedupeByName(vendors: Vendor[]) {
  const by = new Map<string, Vendor>();
  for (const v of vendors) {
    const key = v.name.toLowerCase();
    if (!by.has(key)) {
      by.set(key, { ...v });
    } else {
      const ex = by.get(key)!;
      ex.avlMemberships = Array.from(new Set([...(ex.avlMemberships || []), ...(v.avlMemberships || [])])).sort();
      ex.certifications = Array.from(new Set([...(ex.certifications || []), ...(v.certifications || [])])).sort();
      if (v.country === "USA") ex.country = "USA";
      // keep first industries/categories/products
    }
  }
  return Array.from(by.values());
}

/* =============================================================================
   Scoring Engine (Deterministic)
   Score = membership*trust/recency + certs + industry/category match + region + product
============================================================================= */
function daysSince(dateStr: string) {
  const d = new Date(dateStr).getTime();
  const now = Date.now();
  return Math.max(1, Math.floor((now - d) / (1000 * 60 * 60 * 24)));
}

function scoreVendor(v: Vendor, opts: {
  sources: Source[];
  targetIndustry?: string;
  targetCategory?: string;
  productQuery?: string;
  preferredRegions: string[];
  minTrust: number;
}) {
  const { sources, targetIndustry, targetCategory, productQuery, preferredRegions, minTrust } = opts;

  // Membership score (weighted by trust & recency)
  let membershipScore = 0;
  v.avlMemberships.forEach((sid) => {
    const s = sources.find((x) => x.id === sid);
    if (!s) return;
    if (s.trustLevel < minTrust) return;
    const freshness = Math.max(0.5, 1.5 - Math.log10(daysSince(s.lastUpdated) + 1)); // decays slowly
    membershipScore += s.trustLevel * freshness;
  });

  // Certification score
  const certWeight = v.certifications.reduce((acc, c) => {
    const w = { ASME: 1.2, NBBI: 1.0, API: 1.0, LR: 0.9, DNV: 0.9, SELO: 1.1 }[c as keyof typeof CERT_BADGES] || 0.7;
    return acc + w;
  }, 0);

  // Category & industry match
  const industryMatch = targetIndustry ? (v.industries.some(i => i.toLowerCase().includes(targetIndustry.toLowerCase())) ? 1 : 0) : 0.5;
  const categoryMatch = targetCategory ? (v.categories.some(c => c.toLowerCase().includes(targetCategory.toLowerCase())) ? 1 : 0) : 0.5;

  // Region preference (based on source regions vendor belongs to)
  const vendorRegions = v.avlMemberships.map((sid) => sources.find(s => s.id === sid)?.region || "");
  const regionBonus = preferredRegions.length ? vendorRegions.some(r => preferredRegions.some(p => r.toLowerCase().includes(p.toLowerCase()))) ? 1 : 0 : 0.5;

  // Product keyword hint
  const productBonus = productQuery ? (v.products.concat(v.categories).some(p => p.toLowerCase().includes(productQuery.toLowerCase())) ? 0.6 : 0) : 0.2;

  // Final weighted score
  const score = (membershipScore * 0.5) + (certWeight * 0.2) + (industryMatch * 0.1) + (categoryMatch * 0.1) + (regionBonus * 0.07) + (productBonus * 0.03);
  return Number(score.toFixed(4));
}

/* =============================================================================
   Utility Components
============================================================================= */
function Pill({ children }: { children: React.ReactNode }) {
  return <span className="px-2 py-1 rounded-full text-xs bg-gray-100">{children}</span>;
}

function Section({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function Banner({ type = "ok", message }: { type?: "ok" | "warn"; message: string }) {
  return (
    <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${type === "ok" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
      {type === "ok" ? <CheckCircle2 className="w-4 h-4"/> : <AlertCircle className="w-4 h-4"/>}
      <span>{message}</span>
    </div>
  );
}

/* =============================================================================
   Main App
============================================================================= */
export default function App() {
  const [store, setStore] = useState<Store>(loadStore());
  const [industry, setIndustry] = useState<string>("Boiler");
  const [category, setCategory] = useState<string>("");
  const [product, setProduct] = useState<string>("");
  const [regions, setRegions] = useState<string[]>(["Global","USA","Europe","China"]);
  const [minTrust, setMinTrust] = useState<number>(0.8);
  const [companyQuery, setCompanyQuery] = useState<string>("");

  // Triggers for buttons (so clicking actually does something visible)
  const [searchTick, setSearchTick] = useState<number>(0);
  const [checkTick, setCheckTick] = useState<number>(0);
  const [flashMsg, setFlashMsg] = useState<string>("");

  const resultsRef = useRef<HTMLDivElement | null>(null);
  const companyRef = useRef<HTMLDivElement | null>(null);

  // Persist (safe snapshot)
  useEffect(() => {
    saveStoreDebounced(store);
  }, [store]);

  // Keep category in sync with industry
  useEffect(() => {
    const firstCat = CATEGORY_BY_INDUSTRY[industry]?.[0] || "";
    setCategory(firstCat);
  }, [industry]);

  // Load baked-in dataset once (public/data/avl_us_boilers.json)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/data/avl_us_boilers.json", { cache: "force-cache" });
        if (!res.ok) return;
        const data: Store = await res.json();
        if (cancelled) return;
        setStore(prev => ({
          sources: mergeSources(prev.sources, data.sources || []),
          vendors: dedupeByName([...(prev.vendors || []), ...((data.vendors as Vendor[]) || [])]),
        }));
      } catch (e) {
        console.warn("Failed to load embedded dataset", e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const ranked = useMemo(() => {
    void searchTick;
    const list = store.vendors.map((v) => ({
      v,
      score: scoreVendor(v, {
        sources: store.sources,
        targetIndustry: industry,
        targetCategory: category,
        productQuery: product,
        preferredRegions: regions,
        minTrust,
      }),
    }));
    return list.sort((a, b) => b.score - a.score);
  }, [store, industry, category, product, regions, minTrust, searchTick]);

  // Company lookup (after Check)
  const lookup = useMemo(() => {
    void checkTick;
    if (!companyQuery.trim()) return null;
    const v = store.vendors.find((x) => x.name.toLowerCase() === companyQuery.toLowerCase());
    if (!v) return { exists: false } as const;
    const memberships = v.avlMemberships.map((sid) => store.sources.find((s) => s.id === sid)).filter(Boolean) as Source[];
    return { exists: true, vendor: v, memberships } as const;
  }, [companyQuery, store, checkTick]);

  /* =========================
     Import / Export / Reset
  ========================== */
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(store, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "avl_data_export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!parsed.sources || !parsed.vendors) throw new Error("Invalid schema");
        // MERGE + DEDUPE instead of replacing
        const mergedSources = mergeSources(store.sources, parsed.sources);
        const mergedVendors = dedupeByName([...(store.vendors || []), ...(parsed.vendors || [])]);
        setStore({ sources: mergedSources, vendors: mergedVendors });
        setFlashMsg(`Dataset imported successfully. Vendors: +${(parsed.vendors || []).length}`);
        setTimeout(() => setFlashMsg(""), 2200);
      } catch (err) {
        alert("Invalid JSON file. Expected { sources: [], vendors: [] } schema.");
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    localStorage.removeItem(LS_KEY);
    setStore({ sources: SEED_SOURCES, vendors: SEED_VENDORS });
    setFlashMsg("Reset to seed dataset.");
    setTimeout(() => setFlashMsg(""), 1600);
  };

  const handleSearch = () => {
    setSearchTick((t) => t + 1);
    setFlashMsg("Search updated. Showing ranked vendors.");
    setTimeout(() => setFlashMsg(""), 1800);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCheck = () => {
    setCheckTick((t) => t + 1);
    setFlashMsg("Company check complete.");
    setTimeout(() => setFlashMsg(""), 1800);
    companyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };
  const onKeyDownCompany = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCheck();
  };

  /* =========================
     UI
  ========================== */
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <header className="flex items-start md:items-center justify-between gap-4 flex-col md:flex-row">
        <div>
          <h1 className="text-3xl font-bold">AVL Meta-Search Platform</h1>
          <p className="text-sm text-gray-600 mt-1">Search across multiple trusted AVLs to find vetted vendors for boilers, turbines, mining, pressure vessels, and heat exchangers.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleExport}><Download className="w-4 h-4 mr-2"/>Export</Button>
          <div className="relative">
            <input type="file" accept="application/json" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImport} />
            <Button variant="secondary"><Upload className="w-4 h-4 mr-2"/>Import</Button>
          </div>
          <Button variant="outline" onClick={handleReset} title="Clear saved snapshot & return to seed data">Reset</Button>
        </div>
      </header>

      {flashMsg && <Banner type="ok" message={flashMsg} />}

      <Tabs defaultValue="finder" className="w-full">
        <TabsList className="grid grid-cols-2 w-full md:w-auto">
          <TabsTrigger value="finder">Vendor Finder</TabsTrigger>
          <TabsTrigger value="checker">Company Checker</TabsTrigger>
        </TabsList>

        {/* Vendor Finder */}
        <TabsContent value="finder">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 space-y-6">
              <Section title="Search Criteria" icon={<Filter className="w-5 h-5"/>}>
                <div className="grid md:grid-cols-5 gap-4">
                  <div className="col-span-1">
                    <Label>Industry</Label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select industry"/></SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((i) => (
                          <SelectItem key={i} value={i}>{i}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <Label>Equipment / Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select category"/></SelectTrigger>
                      <SelectContent>
                        {(CATEGORY_BY_INDUSTRY[industry] || []).map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label>Product / Keyword (optional)</Label>
                    <Input className="mt-1" placeholder="e.g., Shell-and-Tube, Steam Turbine, OCTG" value={product} onChange={(e) => setProduct(e.target.value)} onKeyDown={onKeyDownSearch} />
                  </div>
                  <div className="col-span-1">
                    <Label>Min Source Trust</Label>
                    <div className="mt-2"><Slider value={[minTrust]} min={0.5} max={1.0} step={0.01} onValueChange={(v) => setMinTrust(v[0])} /></div>
                    <div className="text-xs text-gray-500 mt-1">{minTrust.toFixed(2)}</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="col-span-2 flex flex-wrap gap-2 items-center">
                    <Label className="mr-2">Preferred Regions:</Label>
                    {["Global","USA","Europe","China","Middle East","India"].map((r) => (
                      <Badge key={r} variant={regions.includes(r) ? "default" : "outline"} className="cursor-pointer" onClick={() => setRegions((prev) => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])}>{r}</Badge>
                    ))}
                  </div>
                  <div className="col-span-1 flex items-end justify-end">
                    <Button onClick={handleSearch}><Search className="w-4 h-4 mr-2"/>Search</Button>
                  </div>
                </div>
              </Section>

              <Section title="Results" icon={<Database className="w-5 h-5"/>}>
                <div ref={resultsRef} className="grid gap-4">
                  {ranked.map(({ v, score }) => (
                    <Card key={v.name} className="rounded-2xl">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold">{v.name}</h3>
                              <Pill>{v.country}</Pill>
                            </div>
                            <div className="text-sm text-gray-600 mt-1 flex flex-wrap gap-2">
                              {v.categories.map((c) => <Badge key={c} variant="secondary">{c}</Badge>)}
                            </div>
                            <div className="text-xs text-gray-500 mt-2">Products: {v.products.join(", ")}</div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Score</div>
                              <div className="text-2xl font-bold">{score.toFixed(2)}</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-sm text-gray-500">Certifications</div>
                              <div className="flex flex-wrap gap-2">
                                {v.certifications.map((c) => <Badge key={c} variant="outline"><ShieldCheck className="w-3 h-3 mr-1"/>{c}</Badge>)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="text-sm text-gray-500 mb-1">AVLs</div>
                          <div className="flex flex-wrap gap-2">
                            {v.avlMemberships.map((sid) => {
                              const s = store.sources.find((x) => x.id === sid);
                              if (!s) return null;
                              return (
                                <Badge key={sid} variant="outline" className="flex items-center gap-1">
                                  <Globe className="w-3 h-3"/>{s.name} <span className="text-[10px] text-gray-500">({s.trustLevel.toFixed(2)})</span>
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Section>

              <Section title="Data Sources" icon={<Building2 className="w-5 h-5"/>}>
                <div className="grid md:grid-cols-2 gap-3">
                  {store.sources.map((s) => (
                    <Card key={s.id} className="rounded-2xl">
                      <CardContent className="p-4 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{s.name}</h4>
                          <Pill>{s.region}</Pill>
                        </div>
                        <div className="text-xs text-gray-500">Categories: {s.categories.join(", ")}</div>
                        <div className="text-xs text-gray-500">Trust: {s.trustLevel.toFixed(2)} · Updated: {s.lastUpdated}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Checker */}
        <TabsContent value="checker">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 space-y-6">
              <Section title="Find Company in AVLs" icon={<Search className="w-5 h-5"/>}>
                <div className="grid md:grid-cols-3 gap-4 items-end">
                  <div className="md:col-span-2">
                    <Label>Company name</Label>
                    <Input className="mt-1" placeholder="Exact company name (e.g., Doosan Enerbility)" value={companyQuery} onChange={(e) => setCompanyQuery(e.target.value)} onKeyDown={onKeyDownCompany} />
                  </div>
                  <div className="md:col-span-1 flex justify-end">
                    <Button onClick={handleCheck}><Search className="w-4 h-4 mr-2"/>Check</Button>
                  </div>
                </div>
                <div ref={companyRef} />
                {lookup && (
                  <div className="mt-4">
                    {!lookup.exists ? (
                      <div className="text-red-600 text-sm">Company not found in current dataset. Try importing more AVL data.</div>
                    ) : (
                      <Card className="rounded-2xl">
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{lookup.vendor.name}</h3>
                            <Pill>{lookup.vendor.country}</Pill>
                          </div>
                          <div className="text-sm text-gray-600 flex flex-wrap gap-2">{lookup.vendor.categories.map((c) => <Badge key={c} variant="secondary">{c}</Badge>)}</div>
                          <div className="text-xs text-gray-500">Certifications: {lookup.vendor.certifications.join(", ")}</div>
                          <div className="text-sm text-gray-700">Approved in:</div>
                          <div className="flex flex-wrap gap-2">
                            {lookup.memberships.map((s) => (
                              <Badge key={s.id} variant="outline"><Factory className="w-3 h-3 mr-1"/>{s.name}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </Section>

              <Section title="Manage Data" icon={<Database className="w-5 h-5"/>}>
                <p className="text-sm text-gray-600">
                  Use <strong>Export</strong> to download your current dataset. Use <strong>Import</strong> to load JSON in the schema: {"{ "}
                  sources: Source[], vendors: Vendor[] {" }"}. You can merge real AVLs from scrapers or manual curation.
                </p>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <footer className="text-xs text-gray-500 pt-4">
        <div>Scoring = 50% AVL-weighted membership · 20% certifications · 10% industry match · 10% category match · 7% region · 3% product keyword. Adjustable in code.</div>
      </footer>
    </div>
  );
}
