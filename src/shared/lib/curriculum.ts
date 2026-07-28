import type { ModuleDef, SupportTeam } from "@/features/learning/types";

export const SUPPORT: Record<string, SupportTeam> = {
  wms: {
    title: "WMS support",
    contacts: [
      { role: "Warehouse Ops Lead", name: "floor-ops@increff.demo", note: "Wrong PO / receipt issues" },
      { role: "WMS Support", name: "wms-help@increff.demo", note: "Screen errors" },
      { role: "Shift Supervisor", name: "Ops channel / radio", note: "Urgent dock decisions" },
    ],
  },
  oms: {
    title: "OMS support",
    contacts: [
      { role: "OMS Config Owner", name: "oms-config@increff.demo", note: "Location type / timezone" },
      { role: "Master Data", name: "masterdata@increff.demo", note: "Address corrections" },
      { role: "On-call L2", name: "l2-support@increff.demo", note: "System outages" },
    ],
  },
};

export const GLOSSARY: Record<string, string> = {
  "Gate Entry": "Acknowledgement of inward goods before GRN — invoice and logistics docs against PO/STN.",
  "Inward Box": "Box code linked to a Gate Entry; required before GRN can start.",
  GRN: "Goods Receipt Note — scan box/item, QC pass/fail, move to GRN bin.",
  QC: "Quality check at GRN — pass or fail with reason before bin scan.",
  Putaway: "Store GRNed inventory into locations so stock becomes LIVE for orders.",
  Bin: "Container holding items; used in GRN QC and putaway.",
  Location: "Storage slot / rack address in the warehouse.",
  "Piece Pick": "B2C picking of individual items against released picklists.",
  "Express Picking": "Priority wave; toggle ON to see express picklists, OFF for default.",
  SLA: "Required-by / dispatch deadline used to prioritize picking.",
  Manifest: "List of AWBs handed to a transporter for a client/channel.",
  Handover: "Confirming shipments are given to the logistics partner.",
  AWB: "Air Waybill / shipping label tracking number on the packet.",
  PO: "Purchase Order from buyer to supplier.",
  STO: "Stock Transfer Order between your locations.",
  ASN: "Advance Shipping Notice from supplier.",
  LR: "Lorry Receipt from the transporter.",
  BL: "Bill of Lading for sea/shipping.",
  "E-way bill": "Electronic way bill for goods movement (India).",
  "External PO No.": "PO number on the supplier/vendor paperwork.",
  "Internal PO No.": "PO id inside your system.",
  Client: "Brand / tenant you receive or fulfill for.",
  Supplier: "Vendor shipping goods in.",
  "Fulfillment Location": "Warehouse, store, or site in OMS.",
  "Location Type": "Warehouse, Store, USP, or WMS2.",
  Category: "PRIMARY or SECONDARY site role.",
  Channel: "Sales channel (e.g. Amazon, Flipkart).",
};

export const MODULES: ModuleDef[] = [
  {
    id: "wms",
    track: "WMS",
    number: 1,
    title: "Gate Entry",
    description: "Search entries → select a PO → create and submit a gate entry.",
    href: "/wms/gate-entry",
    duration: "15–20 min",
    skills: ["Search & filter gate entries", "Select the right PO", "Fill create form", "Submit the entry"],
  },
  {
    id: "wms-receive",
    track: "WMS",
    number: 2,
    title: "Receive Inward Boxes",
    description: "Print or scan box codes for a Gate Entry, then Confirm so GRN can start.",
    href: "/wms/receive-boxes",
    duration: "8–12 min",
    skills: [
      "Choose internal vs external codes",
      "Enter Gate Entry & box count",
      "Print / scan boxes",
      "Confirm all boxes received",
    ],
  },
  {
    id: "wms-grn",
    track: "WMS",
    number: 3,
    title: "GRN",
    description: "Scan inward box → barcode → Item ID → QC bin to complete goods receipt.",
    href: "/wms/grn",
    duration: "12–15 min",
    skills: ["Scan inward box & barcode", "Scan Item ID", "QC pass / fail", "Scan QC bin"],
  },
  {
    id: "wms-putaway",
    track: "WMS",
    number: 4,
    title: "Put Away",
    description: "Bin Putaway, Bin Transfer, or Item Putaway to make inventory LIVE.",
    href: "/wms/putaway",
    duration: "10–15 min",
    skills: [
      "Pick putaway method",
      "Bin Putaway to empty location",
      "Bin Transfer to static bin",
      "Item Putaway per piece",
    ],
  },
  {
    id: "wms-b2c-picking",
    track: "WMS",
    number: 5,
    title: "B2C Picking",
    description: "Monitor Piece Pick Pending, then Piece Pick Item (location → item).",
    href: "/wms/pick-pending",
    duration: "12–18 min",
    skills: [
      "Monitor zone / aisle pendency",
      "Assign by SLA & status",
      "Scan location & item",
      "Confirm pick / Not Found",
    ],
  },
  {
    id: "wms-b2c-packing",
    track: "WMS",
    number: 6,
    title: "B2C Packing",
    description: "Piece Packing → Manifest create/close → Piece Order Handover.",
    href: "/wms/packing",
    duration: "15–20 min",
    skills: [
      "Scan & complete packing",
      "Print invoice & scan AWB",
      "Create / close manifest",
      "Confirm handover",
    ],
  },
  {
    id: "oms",
    track: "OMS",
    number: 7,
    title: "Fulfillment Locations (full flow)",
    description: "Browse and filter locations, then add a new fulfillment location.",
    href: "/oms/fulfillment-locations",
    duration: "12–15 min",
    skills: [
      "Filter & find locations",
      "Read the directory",
      "Add a new location",
      "Fill required fields & submit",
    ],
  },
];

export function getModule(id: string): ModuleDef | undefined {
  return MODULES.find((m) => m.id === id);
}

export function getSupport(track: string): SupportTeam {
  return SUPPORT[track.toLowerCase()] || SUPPORT.wms;
}

export function getGlossaryEntries(keys?: string[]): [string, string][] {
  const entries = Object.entries(GLOSSARY);
  if (!keys || keys.length === 0) return entries;
  return entries.filter(([k]) => keys.includes(k));
}
