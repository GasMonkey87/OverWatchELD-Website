const API_BASE = window.OVERWATCH_API_BASE || 'https://overwatcheld.up.railway.app';
const guildInput = document.getElementById('guildId');
const rows = document.getElementById('rows');
const totalCount = document.getElementById('totalCount');
const graphCount = document.getElementById('graphCount');
const certifiedCount = document.getElementById('certifiedCount');

const savedGuild = localStorage.getItem('ow_guild_id') || new URLSearchParams(location.search).get('guildId') || '';
guildInput.value = savedGuild;

function esc(value) {
  return String(value ?? '').replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
}

function fmtDate(value) {
  if (!value) return 'N/A';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

async function loadExports() {
  const guildId = guildInput.value.trim();
  if (guildId) localStorage.setItem('ow_guild_id', guildId);

  rows.innerHTML = '<tr><td colspan="6" class="muted">Loading…</td></tr>';
  totalCount.textContent = graphCount.textContent = certifiedCount.textContent = '…';

  try {
    const url = `${API_BASE}/api/logs/exports/recent${guildId ? `?guildId=${encodeURIComponent(guildId)}` : ''}`;
    const res = await fetch(url, { credentials: 'include' });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Request failed');

    const exports = Array.isArray(data.exports) ? data.exports : [];
    totalCount.textContent = exports.length;
    graphCount.textContent = exports.filter(x => x.hasGraph).length;
    certifiedCount.textContent = exports.filter(x => String(x.certified || '').toUpperCase() === 'YES').length;

    if (!exports.length) {
      rows.innerHTML = '<tr><td colspan="6" class="muted">No exports found for this guild yet.</td></tr>';
      return;
    }

    rows.innerHTML = exports.map(x => {
      const certified = String(x.certified || '').toUpperCase() === 'YES';
      return `<tr>
        <td>${esc(fmtDate(x.createdUtc))}</td>
        <td><strong>${esc(x.driverName || 'Unknown Driver')}</strong><br><span class="muted">${esc(x.discordUserId || 'No Discord ID')}</span></td>
        <td>${esc(x.dateRange || 'N/A')}</td>
        <td>${esc(x.truck || 'Unknown Truck')}<br><span class="muted">Unit ${esc(x.unitNumber || 'N/A')}</span></td>
        <td><span class="pill ${certified ? 'ok' : 'warn'}">${certified ? 'Certified' : 'Uncertified'}</span> ${x.hasGraph ? '<span class="pill ok">Graph</span>' : '<span class="pill warn">Text only</span>'}</td>
        <td>${esc(x.violations || 'None')}</td>
      </tr>`;
    }).join('');
  } catch (err) {
    rows.innerHTML = `<tr><td colspan="6" class="muted">Failed to load exports: ${esc(err.message)}</td></tr>`;
    totalCount.textContent = graphCount.textContent = certifiedCount.textContent = '—';
  }
}

document.getElementById('loadBtn').addEventListener('click', loadExports);
document.getElementById('clearBtn').addEventListener('click', () => {
  localStorage.removeItem('ow_guild_id');
  guildInput.value = '';
});

if (savedGuild) loadExports();
