const $ = (selector) => document.querySelector(selector)
const pdfInput = $('#pdfInput')
const dropzone = $('#dropzone')
const fileList = $('#fileList')
const emptyFiles = $('#emptyFiles')
const fileCount = $('#fileCount')
const clearFiles = $('#clearFiles')
const convertButton = $('#convertButton')
const dpiInput = $('#dpiInput')
const qualityInput = $('#qualityInput')
const themeToggle = $('#themeToggle')
const themeIcon = $('#themeIcon')
const toast = $('#toast')
const toastMessage = $('#toastMessage')

let selectedFiles = []

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

const showToast = (message) => {
  toastMessage.textContent = message
  toast.classList.remove('hidden')
  clearTimeout(showToast.timer)
  showToast.timer = setTimeout(() => toast.classList.add('hidden'), 3200)
}

const renderFiles = () => {
  fileList.replaceChildren()

  if (!selectedFiles.length) {
    fileList.append(emptyFiles)
    emptyFiles.classList.remove('hidden')
  } else {
    selectedFiles.forEach((file, index) => {
      const row = document.createElement('div')
      row.className = 'file-row'

      const icon = document.createElement('div')
      icon.className = 'file-icon text-sm font-bold'
      icon.textContent = 'PDF'

      const details = document.createElement('div')
      details.className = 'min-w-0 flex-1'

      const name = document.createElement('div')
      name.className = 'file-name text-sm font-medium'
      name.textContent = file.name
      name.title = file.name

      const size = document.createElement('div')
      size.className = 'mt-0.5 text-xs text-base-content/50'
      size.textContent = formatBytes(file.size)
      details.append(name, size)

      const remove = document.createElement('button')
      remove.className = 'btn btn-ghost btn-sm btn-square text-base-content/45'
      remove.type = 'button'
      remove.setAttribute('aria-label', `Hapus ${file.name}`)
      remove.textContent = '×'
      remove.addEventListener('click', () => {
        selectedFiles.splice(index, 1)
        renderFiles()
      })

      row.append(icon, details, remove)
      fileList.append(row)
    })
  }

  fileCount.textContent = `${selectedFiles.length} file`
  clearFiles.disabled = selectedFiles.length === 0
  convertButton.disabled = selectedFiles.length === 0
}

const addFiles = (fileCollection) => {
  const files = Array.from(fileCollection)
  const pdfs = files.filter(file =>
    file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
  )

  if (pdfs.length !== files.length) showToast('Hanya file PDF yang dapat ditambahkan.')

  pdfs.forEach(file => {
    const duplicate = selectedFiles.some(item =>
      item.name === file.name && item.size === file.size && item.lastModified === file.lastModified
    )
    if (!duplicate) selectedFiles.push(file)
  })

  renderFiles()
}

pdfInput.addEventListener('change', event => {
  addFiles(event.target.files)
  pdfInput.value = ''
})

clearFiles.addEventListener('click', () => {
  selectedFiles = []
  renderFiles()
})

;['dragenter', 'dragover'].forEach(eventName => {
  dropzone.addEventListener(eventName, event => {
    event.preventDefault()
    dropzone.classList.add('is-dragging')
  })
})

;['dragleave', 'drop'].forEach(eventName => {
  dropzone.addEventListener(eventName, event => {
    event.preventDefault()
    dropzone.classList.remove('is-dragging')
  })
})

dropzone.addEventListener('drop', event => addFiles(event.dataTransfer.files))

dpiInput.addEventListener('input', () => {
  $('#dpiValue').textContent = `${dpiInput.value} DPI`
})

qualityInput.addEventListener('input', () => {
  $('#qualityValue').textContent = `${qualityInput.value}%`
})

const setTheme = theme => {
  document.documentElement.dataset.theme = theme
  localStorage.setItem('pdf-converter-theme', theme)

  themeIcon.innerHTML = theme === 'dark'
    ? '<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z"/>'
    : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>'
}

setTheme(localStorage.getItem('pdf-converter-theme') === 'dark' ? 'dark' : 'light')
themeToggle.addEventListener('click', () => {
  setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark')
})

const renderResults = results => {
  const container = $('#results')
  container.replaceChildren()

  if (!results.length) {
    container.className = 'rounded-xl border border-base-300 border-dashed px-4 py-8 text-center text-sm text-base-content/45'
    container.textContent = 'Belum ada hasil konversi.'
    $('#resultCount').textContent = '0 hasil'
    return
  }

  container.className = 'divide-y divide-base-300'
  results.forEach(result => {
    const row = document.createElement('div')
    row.className = 'result-row'
    const info = document.createElement('div')
    info.className = 'min-w-0'
    const name = document.createElement('div')
    name.className = 'file-name text-sm font-medium'
    name.textContent = result.name
    const size = document.createElement('div')
    size.className = 'mt-0.5 text-xs text-base-content/50'
    size.textContent = result.size ? formatBytes(result.size) : 'WebP'
    info.append(name, size)

    const link = document.createElement('a')
    link.className = 'btn btn-outline btn-primary btn-sm'
    link.href = result.url
    link.download = result.name
    link.textContent = 'Unduh'
    row.append(info, link)
    container.append(row)
  })

  $('#resultCount').textContent = `${results.length} hasil`
}

convertButton.addEventListener('click', () => {
  if (!selectedFiles.length) return

  window.dispatchEvent(new CustomEvent('pdf-convert', {
    detail: {
      files: [...selectedFiles],
      options: {
        dpi: Number(dpiInput.value),
        quality: Number(qualityInput.value),
        format: 'webp'
      }
    }
  }))

  showToast('Permintaan konversi dikirim ke bridge Python.')
})

window.addEventListener('pdf-conversion-start', () => {
  convertButton.disabled = true
  convertButton.textContent = 'Memproses...'
  $('#progressWrap').classList.remove('hidden')
  $('#progressBar').value = 0
})

window.addEventListener('pdf-conversion-progress', event => {
  const { current = 0, total = 0, label = 'Memproses...' } = event.detail || {}
  const percent = total ? Math.round(current / total * 100) : 0
  $('#progressLabel').textContent = label
  $('#progressBar').value = percent
  $('#progressValue').textContent = `${percent}%`
})

window.addEventListener('pdf-conversion-complete', event => {
  renderResults(event.detail?.results || [])
  $('#progressWrap').classList.add('hidden')
  convertButton.disabled = selectedFiles.length === 0
  convertButton.textContent = 'Mulai konversi'
  showToast('Konversi selesai.')
})

window.addEventListener('pdf-conversion-error', event => {
  $('#progressWrap').classList.add('hidden')
  convertButton.disabled = selectedFiles.length === 0
  convertButton.textContent = 'Mulai konversi'
  showToast(event.detail?.message || 'Terjadi kesalahan saat konversi.')
})

renderFiles()
renderResults([])
