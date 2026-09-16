const state = { token: localStorage.getItem('vita_token'), user: JSON.parse(localStorage.getItem('vita_user') || 'null'), consultas: [] };
const $ = (selector) => document.querySelector(selector);

function message(target, text = '', error = true) { target.textContent = text; target.classList.toggle('error', error && Boolean(text)); }
function logout() { localStorage.removeItem('vita_token'); localStorage.removeItem('vita_user'); location.reload(); }
function showApp() {
  $('#login-screen').hidden = true; $('#app-screen').hidden = false;
  $('#user-email').textContent = state.user.email; $('#user-role').textContent = state.user.role;
  $('#avatar').textContent = state.user.email[0].toUpperCase();
  if (['ADMIN', 'MEDICO'].includes(state.user.role)) $('#open-modal').hidden = false;
  loadConsultas();
}
async function api(path, options = {}) {
  const response = await fetch(path, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${state.token}`, ...(options.headers || {}) } });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.mensagem || 'Não foi possível concluir a solicitação.');
  return payload;
}
async function loadConsultas() {
  const body = $('#consultas-list'); body.innerHTML = '<tr><td colspan="4" class="loading">Carregando agenda…</td></tr>';
  try { state.consultas = await api('/consultas'); renderConsultas(); }
  catch (err) { if (/Token/.test(err.message)) return logout(); body.innerHTML = `<tr><td colspan="4" class="loading">${err.message}</td></tr>`; }
}
function renderConsultas() {
  const term = $('#search').value.trim().toLocaleLowerCase('pt-BR');
  const data = state.consultas.filter(c => [c.paciente, c.medico, c.especialidade].some(v => v.toLocaleLowerCase('pt-BR').includes(term)));
  $('#total').textContent = state.consultas.length; $('#specialties').textContent = new Set(state.consultas.map(c => c.especialidade)).size;
  $('#consultas-list').innerHTML = data.map(c => `<tr><td><strong>${escapeHtml(c.paciente)}</strong></td><td>${escapeHtml(c.medico)}</td><td><span class="tag">${escapeHtml(c.especialidade)}</span></td><td>#${c.id}</td></tr>`).join('');
  $('#empty').hidden = data.length !== 0;
}
function escapeHtml(value) { const el = document.createElement('span'); el.textContent = value; return el.innerHTML; }

$('#login-form').addEventListener('submit', async (event) => {
  event.preventDefault(); const button = event.submitter; button.disabled = true; message($('#login-error'), '', false);
  try {
    const data = await fetch('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: $('#email').value, password: $('#password').value }) }).then(async r => { const p = await r.json(); if (!r.ok) throw new Error(p.mensagem || 'Não foi possível entrar.'); return p; });
    state.token = data.token; const part = JSON.parse(atob(data.token.split('.')[1])); state.user = { email: part.email, role: part.role }; localStorage.setItem('vita_token', state.token); localStorage.setItem('vita_user', JSON.stringify(state.user)); showApp();
  } catch (err) { message($('#login-error'), err.message); } finally { button.disabled = false; }
});
$('#logout').addEventListener('click', logout); $('#search').addEventListener('input', renderConsultas);
$('#open-modal').addEventListener('click', () => { $('#modal').classList.add('visible'); $('#modal').setAttribute('aria-hidden', 'false'); });
$('#close-modal').addEventListener('click', () => $('#modal').classList.remove('visible'));
$('#modal').addEventListener('click', e => { if (e.target === $('#modal')) $('#modal').classList.remove('visible'); });
$('#consulta-form').addEventListener('submit', async event => {
  event.preventDefault(); const form = event.currentTarget, button = event.submitter; button.disabled = true; message($('#consulta-error'), '', false);
  const values = Object.fromEntries(new FormData(form)); values.id = Math.max(0, ...state.consultas.map(c => Number(c.id))) + 1;
  try { await api('/consultas', { method: 'POST', body: JSON.stringify(values) }); form.reset(); $('#modal').classList.remove('visible'); await loadConsultas(); }
  catch (err) { message($('#consulta-error'), err.message); } finally { button.disabled = false; }
});
if (state.token && state.user) showApp();
