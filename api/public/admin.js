const GATE = document.getElementById('gate')
const PANEL = document.getElementById('panel')
const STATUS = document.getElementById('status')
const REPO = 'ValenzuelaxD/our-story'
let data = null

function setStatus(msg, cls) {
  STATUS.textContent = msg
  STATUS.className = 'status ' + (cls || '')
}

function unlock() {
  const token = document.getElementById('token').value.trim()
  if (!token) return
  sessionStorage.setItem('admin_token', token)
  GATE.hidden = true
  PANEL.hidden = false
  load()
}

function gateToken() {
  return sessionStorage.getItem('admin_token') || ''
}

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: 'Bearer ' + gateToken() }
}

async function load() {
  setStatus('Cargando contenido…')
  try {
    const res = await fetch('/api/contenido')
    const j = await res.json()
    if (j.ok && j.content) {
      data = j.content
    } else {
      data = null
    }
  } catch (e) {
    data = null
  }
  if (data) {
    fillIdentidad()
    document.getElementById('editor').value = JSON.stringify(data, null, 2)
    setStatus('Contenido cargado desde la base de datos.')
  } else {
    document.getElementById('editor').value = ''
    setStatus('No hay contenido guardado aún. Usa "Cargar plantilla del repo" para empezar.')
  }
}

function fillIdentidad() {
  const id = data.identidad || {}
  const set = (el, v) => { document.getElementById(el).value = v ?? '' }
  set('nombreEl', id.nombreEl); set('nombreElPublico', id.nombreElPublico)
  set('nombreElCompleto', id.nombreElCompleto); set('nombreElla', id.nombreElla)
  set('nombreEllaCompleto', id.nombreEllaCompleto); set('nombreEllaFuturo', id.nombreEllaFuturo)
  set('inicioNamoro', id.inicioNamoro); set('dataCasamento', id.dataCasamento)
  set('anioInicio', id.anioInicio); set('siteOrigin', id.siteOrigin)
}

function applyIdentidad() {
  if (!data) data = {}
  if (!data.identidad) data.identidad = {}
  const id = data.identidad
  const get = (el) => document.getElementById(el).value.trim()
  id.nombreEl = get('nombreEl'); id.nombreElPublico = get('nombreElPublico')
  id.nombreElCompleto = get('nombreElCompleto'); id.nombreElla = get('nombreElla')
  id.nombreEllaCompleto = get('nombreEllaCompleto'); id.nombreEllaFuturo = get('nombreEllaFuturo')
  id.inicioNamoro = get('inicioNamoro'); id.dataCasamento = get('dataCasamento')
  id.anioInicio = get('anioInicio'); id.siteOrigin = get('siteOrigin')
  document.getElementById('editor').value = JSON.stringify(data, null, 2)
}

async function loadRepo() {
  setStatus('Descargando plantilla del repo…')
  try {
    const res = await fetch('https://raw.githubusercontent.com/' + REPO + '/main/src/data/contenido.json')
    if (!res.ok) throw new Error('HTTP ' + res.status)
    data = await res.json()
    fillIdentidad()
    document.getElementById('editor').value = JSON.stringify(data, null, 2)
    setStatus('Plantilla cargada. Revisa y guarda.', 'ok')
  } catch (e) {
    setStatus('No se pudo descargar la plantilla: ' + e.message, 'err')
  }
}

async function save() {
  applyIdentidad()
  let parsed
  try {
    parsed = JSON.parse(document.getElementById('editor').value)
  } catch (e) {
    setStatus('JSON inválido: ' + e.message, 'err')
    return
  }
  if (!parsed.texto && !parsed.identidad) {
    setStatus('El JSON debe incluir al menos "texto" o "identidad".', 'err')
    return
  }
  const btn = document.getElementById('btnSave')
  btn.disabled = true
  setStatus('Guardando y disparando rebuild…')
  try {
    const res = await fetch('/api/contenido', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(parsed),
    })
    const j = await res.json()
    if (!res.ok) {
      setStatus('Error: ' + (j.error || ('HTTP ' + res.status)), 'err')
      return
    }
    setStatus('Guardado. El sitio se está reconstruyendo' +
      (j.rebuild_dispatched ? '…' : ' (el rebuild se hará en el próximo deploy).'), 'ok')
  } catch (e) {
    setStatus('Error de red: ' + e.message, 'err')
  } finally {
    btn.disabled = false
  }
}

document.getElementById('btnUnlock').addEventListener('click', unlock)
document.getElementById('btnSave').addEventListener('click', save)
document.getElementById('btnRepo').addEventListener('click', loadRepo)