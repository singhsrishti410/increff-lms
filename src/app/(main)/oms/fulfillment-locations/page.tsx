"use client";

import { useTrainingContext } from "@/providers/training-provider";
import { AppHeader } from "@/shared/components/app-header";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { OmsTour } from "@/features/oms/fulfillment-locations/tour-config";

export default function OmsFulfillmentLocationsPage() {
  const { startTraining } = useTrainingContext();

  return (
    <>
      <AppHeader title="INCREFF OMS" showTraining onStartTraining={() => startTraining(OmsTour)} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Fulfillment Locations" }]} />
      <div className="product-page-body p-5">
        <OmsFulfillmentLocationsContent />
      </div>
    </>
  );
}

function OmsFulfillmentLocationsContent() {
  // Filtering state
  const handleRefresh = () => {
    const el = document.getElementById("oms-results-count");
    if (el) el.textContent = "Showing 12 results";
  };

  return (
    <div className="max-w-6xl">
      {/* Filter Panel */}
      <div className="bg-slate-100 border border-slate-200 rounded p-4 pb-3 mb-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="text-[12px] font-semibold text-slate-700">Location Type</label>
            <select
              id="oms-location-type"
              className="h-8 px-2.5 border border-slate-300 rounded bg-white text-[13px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="">All Types</option>
              <option value="WAREHOUSE">WAREHOUSE</option>
              <option value="STORE">STORE</option>
              <option value="USP">USP</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="text-[12px] font-semibold text-slate-700">Category</label>
            <select
              id="oms-category"
              className="h-8 px-2.5 border border-slate-300 rounded bg-white text-[13px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="">All Categories</option>
              <option value="PRIMARY">PRIMARY</option>
              <option value="SECONDARY">SECONDARY</option>
            </select>
          </div>
          <div className="flex gap-2 items-end pb-0">
            <button
              id="oms-btn-refresh"
              onClick={handleRefresh}
              className="h-8 px-4 rounded bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Results toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span id="oms-results-count" className="text-[13px] text-slate-400">
            Showing 2 results
          </span>
          <input
            id="oms-find-results"
            type="text"
            placeholder="Find in results..."
            className="h-8 px-2.5 border border-slate-300 rounded text-[13px] min-w-[180px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <button
          id="oms-btn-add"
          className="h-8 px-4 rounded bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700"
        >
          + Add New Location
        </button>
      </div>

      {/* Table */}
      <div id="oms-results-table" className="bg-white border border-slate-200 rounded overflow-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {["Location ID", "Type", "Category", "Name", "Contact Details", "Address", "Timezone"].map((h) => (
                <th key={h} className="bg-slate-100 text-left px-3 py-2.5 font-semibold border-b border-slate-300 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-3 py-3 border-b border-slate-100 font-semibold">LOC-1001</td>
              <td className="px-3 py-3 border-b border-slate-100"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[11px] font-semibold">WAREHOUSE</span></td>
              <td className="px-3 py-3 border-b border-slate-100"><span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[11px] font-semibold">PRIMARY</span></td>
              <td className="px-3 py-3 border-b border-slate-100 font-medium">kisah</td>
              <td className="px-3 py-3 border-b border-slate-100">
                <div className="text-[12px] leading-relaxed">
                  <div>Rajesh Kumar</div>
                  <div className="text-blue-600">rajesh@kisah.in</div>
                  <div>+91-9876543210</div>
                </div>
              </td>
              <td className="px-3 py-3 border-b border-slate-100 text-[12px] leading-relaxed max-w-[280px]">
                Plot 42, Sector 12, Whitefield, Bengaluru, Karnataka 560066, India
              </td>
              <td className="px-3 py-3 border-b border-slate-100">IST</td>
            </tr>
            <tr>
              <td className="px-3 py-3 border-b border-slate-100 font-semibold">LOC-2002</td>
              <td className="px-3 py-3 border-b border-slate-100"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[11px] font-semibold">STORE</span></td>
              <td className="px-3 py-3 border-b border-slate-100">—</td>
              <td className="px-3 py-3 border-b border-slate-100 font-medium">confluxe-store</td>
              <td className="px-3 py-3 border-b border-slate-100">
                <div className="text-[12px] leading-relaxed">
                  <div>Priya Sharma</div>
                  <div className="text-blue-600">priya@confluxe.in</div>
                  <div>+91-9988776655</div>
                </div>
              </td>
              <td className="px-3 py-3 border-b border-slate-100 text-[12px] leading-relaxed max-w-[280px]">
                Shop 5, MG Road, Indiranagar, Bengaluru, Karnataka 560038, India
              </td>
              <td className="px-3 py-3 border-b border-slate-100">IST</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add Location Modal */}
      <div
        id="modal-add-location"
        className="modal-overlay"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.classList.remove("open");
        }}
      >
        <div className="bg-white rounded w-full max-w-[920px] shadow-xl relative">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
            <h3 className="text-base font-semibold">Add New Fulfillment Location</h3>
            <button
              type="button"
              onClick={() => document.getElementById("modal-add-location")?.classList.remove("open")}
              className="bg-none border-none text-[22px] text-slate-400 cursor-pointer p-0.5 hover:text-slate-700"
            >
              &times;
            </button>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-5 max-[800px]:grid-cols-1">
              {/* Left column */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-slate-700">Name *</label>
                  <input id="oms-location-name" type="text" className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-slate-700">Type *</label>
                  <div className="flex flex-wrap gap-4 items-center">
                    {["Warehouse", "Store", "USP", "WMS2"].map((t) => (
                      <label key={t} className="flex items-center gap-1.5 text-[13px] cursor-pointer">
                        <input type="radio" name="oms-loc-type" value={t} className="accent-blue-600" />
                        {t}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-slate-700">Contact Name *</label>
                  <input id="oms-contact-name" type="text" className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-slate-700">Email</label>
                  <input id="oms-contact-email" type="email" className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-slate-700">Phone</label>
                  <input id="oms-contact-number" type="tel" className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500" />
                </div>
              </div>
              {/* Right column */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-slate-700">Address *</label>
                  <input id="oms-address1" type="text" className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-slate-700">City *</label>
                  <input id="oms-city" type="text" className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-slate-700">Pincode *</label>
                  <input id="oms-pincode" type="text" className="h-8 px-2.5 border border-slate-300 rounded text-[13px] outline-none focus:border-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[13px] font-medium text-slate-700">Country *</label>
                    <select id="oms-country" className="h-8 px-2.5 border border-slate-300 rounded bg-white text-[13px] outline-none focus:border-blue-500">
                      <option value="">Select</option>
                      <option value="IN">India</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[13px] font-medium text-slate-700">State *</label>
                    <select id="oms-state" className="h-8 px-2.5 border border-slate-300 rounded bg-white text-[13px] outline-none focus:border-blue-500">
                      <option value="">Select</option>
                      <option value="KA">Karnataka</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-slate-700">Timezone *</label>
                  <select id="oms-location-tz" className="h-8 px-2.5 border border-slate-300 rounded bg-white text-[13px] outline-none focus:border-blue-500">
                    <option value="">Select</option>
                    <option value="IST">IST (UTC+5:30)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2.5 px-5 py-3.5 border-t border-slate-200">
            <button
              onClick={() => document.getElementById("modal-add-location")?.classList.remove("open")}
              className="h-8 px-4 rounded border border-slate-200 bg-transparent text-slate-400 text-[13px] font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                document.getElementById("modal-add-location")?.classList.remove("open");
                const toast = document.getElementById("demo-toast");
                if (toast) {
                  toast.textContent = "Successful";
                  toast.classList.remove("hidden");
                  toast.classList.add("block");
                  setTimeout(() => { toast.classList.remove("block"); toast.classList.add("hidden"); }, 2500);
                }
              }}
              className="h-8 px-4 rounded bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
