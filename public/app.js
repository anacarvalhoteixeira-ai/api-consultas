const state = {
  token: localStorage.getItem("vsc_token"),
  user: JSON.parse(localStorage.getItem("vsc_user") || "null"),
  consultas: [],
};
const $ = (selector) => document.querySelector(selector);

function logout() {
  localStorage.removeItem("vsc_token");
  localStorage.removeItem("vsc_user");
  location.reload();
}
function escapeHtml(value = "") {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML;
}
function formatDate(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}
async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${state.token}`,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.mensagem || "Erro na requisição");
  return data;
}
function showLogin(form) {
  $("#login-form").hidden = form !== "login";
  $("#register-form").hidden = form !== "register";
}

function showApp() {
  $("#login-screen").hidden = true;
  $("#app-screen").hidden = false;
  $("#user-name").textContent = state.user.nome || state.user.email;
  $("#user-role").textContent = state.user.role;
  $("#paciente-field").hidden = state.user.role === "PACIENTE";
  $("#medico-field").hidden = state.user.role === "MEDICO";
  $("#form-help").textContent =
    state.user.role === "PACIENTE"
      ? "Informe o ID do médico."
      : state.user.role === "MEDICO"
        ? "Informe o ID do paciente."
        : "Informe os IDs do paciente e do médico.";
  loadConsultas();
}
async function loadConsultas() {
  try {
    state.consultas = await api("/consultas");
    renderConsultas();
  } catch (error) {
    $("#consultas-list").innerHTML =
      `<tr><td colspan="4">${escapeHtml(error.message)}</td></tr>`;
  }
}
function renderConsultas() {
  const term = $("#search").value.toLowerCase();
  const data = state.consultas.filter((c) =>
    [c.paciente?.nome, c.medico?.nome, c.especialidade].some((v) =>
      v?.toLowerCase().includes(term),
    ),
  );
  $("#consultas-list").innerHTML = data
    .map(
      (c) =>
        `<tr><td>${escapeHtml(c.paciente?.nome)}</td><td>${escapeHtml(c.medico?.nome)}</td><td>${escapeHtml(c.especialidade)}</td><td>${formatDate(c.dataConsulta)}</td></tr>`,
    )
    .join("");
  $("#empty").hidden = data.length !== 0;
}

$("#show-register").addEventListener("click", () => showLogin("register"));
$("#show-login").addEventListener("click", () => showLogin("login"));
$("#login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  $("#login-error").textContent = "";
  try {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: $("#email").value,
        password: $("#password").value,
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.mensagem);
    state.token = data.token;
    state.user = data.usuario;
    localStorage.setItem("vsc_token", state.token);
    localStorage.setItem("vsc_user", JSON.stringify(state.user));
    showApp();
  } catch (error) {
    $("#login-error").textContent = error.message || "Não foi possível entrar.";
  }
});
$("#register-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  $("#register-error").textContent = "";
  try {
    const response = await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: $("#register-name").value,
        email: $("#register-email").value,
        password: $("#register-password").value,
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.mensagem);
    $("#email").value = $("#register-email").value;
    $("#password").value = "";
    showLogin("login");
    $("#login-error").textContent = "Conta criada. Faça login para continuar.";
  } catch (error) {
    $("#register-error").textContent =
      error.message || "Não foi possível criar a conta.";
  }
});
$("#logout").addEventListener("click", logout);
$("#search").addEventListener("input", renderConsultas);
$("#open-modal").addEventListener("click", () =>
  $("#modal").classList.add("visible"),
);
$("#close-modal").addEventListener("click", () =>
  $("#modal").classList.remove("visible"),
);
$("#consulta-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  $("#consulta-error").textContent = "";
  const values = Object.fromEntries(new FormData(form));
  if (values.pacienteId) values.pacienteId = Number(values.pacienteId);
  else delete values.pacienteId;
  if (values.medicoId) values.medicoId = Number(values.medicoId);
  else delete values.medicoId;

  try {
    await api("/consultas", { method: "POST", body: JSON.stringify(values) });
    form.reset();
    $("#modal").classList.remove("visible");
    loadConsultas();
  } catch (error) {
    $("#consulta-error").textContent = error.message;
  }
});
if (state.token && state.user) showApp();
