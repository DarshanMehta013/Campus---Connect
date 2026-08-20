/* ==========================================================================
   Campus Connect - Public Transparency Feed Engine (feed.js)
   ========================================================================== */

let activeFeedFilter = 'all';

function filterPublicFeed(dept) {
  activeFeedFilter = dept;
  document.querySelectorAll('.feed-filter-btn').forEach(btn => {
    btn.className = 'feed-filter-btn btn-animate px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 font-semibold btn-3d';
  });
  if (typeof event !== 'undefined' && event && event.target) {
    event.target.className = 'feed-filter-btn btn-animate px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold btn-3d';
  }
  renderPublicFeed(activeFeedFilter);
}

function renderPublicFeed(filter = 'all') {
  const grid = document.getElementById('publicFeedGrid');
  if (!grid) return;
  
  let list = (typeof appState !== 'undefined' && appState.complaints) ? appState.complaints : [];
  if (filter !== 'all') {
    list = list.filter(c => c.category === filter || c.dept === filter);
  }

  if (list.length === 0) {
    grid.innerHTML = '<div class="col-span-2 text-center py-10 text-slate-400 font-medium">No complaints found for this department filter.</div>';
    return;
  }

  grid.innerHTML = list.map((c, idx) => `
    <div class="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-sm space-y-4 hover:border-blue-500/40 transition-all card-3d feed-item-card group reveal-on-scroll delay-${Math.min((idx + 1) * 100, 400)}" data-tilt>
      <div class="flex justify-between items-start depth-layer-1">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 font-bold">${c.id}</span>
            <span class="text-xs px-2.5 py-0.5 rounded-full font-bold ${c.priority === 'High' ? 'bg-red-500/10 text-red-600 border border-red-500/20' : (c.priority === 'Medium' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 'bg-slate-500/10 text-slate-500')}">${c.priority} Priority</span>
          </div>
          <h4 class="font-display font-bold text-lg text-slate-900 dark:text-white pt-1 group-hover:text-blue-600 transition-colors">${c.title}</h4>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-bold ${c.status === 'Completed' || c.status === 'Perfectly Completed' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'}">${c.status}</span>
      </div>

      <p class="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-normal depth-layer-1">${c.description || c.desc || ''}</p>

      <div class="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 depth-layer-1">
        <div><i class="fa-solid fa-location-dot text-blue-600 mr-1.5"></i> ${c.location}</div>
        <div><i class="fa-solid fa-building text-violet-600 mr-1.5"></i> ${c.category || c.dept}</div>
      </div>

      ${c.image ? `
        <div class="pt-2 depth-layer-2">
          <div class="text-xs font-semibold text-slate-400 mb-1.5"><i class="fa-solid fa-camera mr-1"></i> Student Live Photo Evidence</div>
          <img src="${c.image}" onclick="openLightbox('${c.image}', '${c.title}')" class="h-28 w-full object-cover rounded-2xl border cursor-pointer hover:opacity-90 transition img-zoom" loading="lazy" decoding="async" alt="Complaint evidence">
        </div>
      ` : ''}

      ${c.proofImg ? `
        <div class="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between depth-layer-2">
          <div class="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <i class="fa-solid fa-circle-check text-emerald-500"></i> Certified Resolution Proof
          </div>
          <button onclick="openLightbox('${c.proofImg}', 'Technician Repair Proof: ${c.title}')" class="text-xs font-bold text-emerald-600 hover:underline">Inspect Photo</button>
        </div>
      ` : ''}
    </div>
  `).join('');

  if (typeof initScrollObserver === 'function') initScrollObserver();
  if (typeof init3DTiltCards === 'function') init3DTiltCards();
}

document.addEventListener('DOMContentLoaded', () => {
  renderPublicFeed();
});
