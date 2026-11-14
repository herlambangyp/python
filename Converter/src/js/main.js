import '../css/style.css'
import { initPython, mulaiConvert } from './interpreter.js'
import { render } from './render.js'

const $ = (selector) => document.querySelector(selector)
await Promise.all([
  render($('#deskripsi'), './component/section/deskripsi.html'),

  render($('#sectionInput'), './component/section/sectionInput.html'),

  render($('#sectionOutput'), './component/section/sectionOutput.html'),
  render($('#FAQ'), './component/FAQ.html'),
  render($('#header'), './component/header.html'),
  render($('#footer'), './component/footer.html')
])
await render('[selectFileUmum]', './component/general/optionFile.html', true)

const pdfInput = $('#pdfInput'),
  dropzone = $('#dropzone'),
  fileList = $('#fileList'),
  emptyFiles = $('#emptyFiles'),
  clearFiles = $('#clearFiles'),
  convertButton = $('#convertButton'),
  dpiInput = $('#dpiInput'),
  qualityInput = $('#qualityInput'),
  formatInput = $('#formatInput'),
  formatOutput = $('#formatOutput'),
  themeToggle = $('#themeToggle'),
  themeIcon = $('#themeIcon'),
  toast = $('#toast'),
  toastMessage = $('#toastMessage'),
  pythonStatus = $('#pythonStatus'),
  pythonStatusText = $('#pythonStatusText'),
  iconLoading = $('#iconLoading')


let pythonReady = false
let pyodide
let selectedFiles = []
const escapeHTML = text => String(text).replace(/[&<>"']/g, char => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;'
}[char]))

iconLoading.textContent = `✖`
pythonStatusText.textContent = `<b>ERROR: NodeJs Tewas Mengenaskan oleh CORS policy</b><br>Untuk mempreview web ini diperlukan development server yang sesuai. <b>Membuka file html langsung akan dicegat oleh keamanan browser CORS policy</b>. Akibatnya seluruh upaya fetch js akan "dibunuh secara brutal"`

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
},
  singkatNama = (name, maxLength = 14) => {
    const lastDot = name.lastIndexOf('.'),
      extension = lastDot !== -1 ? name.slice(lastDot) : '',
      baseName = lastDot !== -1 ? name.slice(0, lastDot) : name,
      pageMatch = baseName.match(/-HALAMAN_\d+$/i),
      pageLabel = pageMatch ? pageMatch[0] : '',
      fileName = pageMatch ? baseName.slice(0, -pageLabel.length) : baseName

    if (fileName.length <= maxLength) return name

    return `${fileName.slice(0, maxLength)}...${pageLabel}${extension}`
  }

const showToast = (message) => {
  toastMessage.textContent = message
  toast.classList.remove('hidden')
  clearTimeout(showToast.timer)
  showToast.timer = setTimeout(() => toast.classList.add('hidden'), 3200)
}

const renderFiles = () => {
  fileList.innerHTML = selectedFiles.length ? selectedFiles.map((file, index) => `
        <div class="file-row">
          <div class="file-icon text-sm font-bold bg-primary/10">
            PDF
          </div>

          <div class="min-w-0 flex-1">
            <div class="file-name text-sm font-medium" title="${file.name}">
              <span class="lg:hidden">${singkatNama(file.name)}</span>
              <span class="hidden md:inline">${file.name}</span>
            </div>

            <div class="mt-0.5 text-xs text-base-content/50">
              ${formatBytes(file.size)}
            </div>
          </div>

          <button
            class="btn btn-ghost btn-sm btn-square text-base-content/45"
            type="button"
            aria-label="Hapus ${file.name}"
            data-index="${index}"
          >
            ×
          </button>
        </div>
      `).join('')
    : emptyFiles.outerHTML

  clearFiles.disabled = selectedFiles.length === 0
  convertButton.disabled = selectedFiles.length === 0 || !pythonReady
  fileList.onclick = o => {
    const button = o.target.closest('[data-index]')

    if (!button) return

    selectedFiles.splice(Number(button.dataset.index), 1)
    renderFiles()
  }
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

pdfInput.onchange = o => {
  addFiles(o.target.files)
  pdfInput.value = ''
}

clearFiles.onclick = o => {
  selectedFiles = []
  renderFiles()
}

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

dpiInput.oninput = o => {
  $('#dpiValue').value = `${dpiInput.value}`
}
$('#dpiValue').oninput = o => {
  dpiInput.value = `${$('#dpiValue').value}`
  if ($('#dpiValue').value < 72 || $('#dpiValue').value > 300) showToast('DPI Tidak boleh kurang dari 72 atau lebih dari 300')
  console.log('DPI Input value = ', $('#dpiValue').value)
}

qualityInput.oninput = o => {
  $('#qualityValue').value = `${qualityInput.value}`
}
$('#qualityValue').oninput = o => {
  qualityInput.value = `${$('#qualityValue').value}`
}

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

  if (!results.length) {
    container.className = 'rounded-xl border border-base-300 border-dashed px-4 py-8 text-center text-sm text-base-content/45'
    container.innerHTML = 'Belum ada hasil konversi.'
    $('#resultCount').textContent = '0 File'
    return
  }

  container.className = 'space-y-3'

  const totalPages = results.reduce(
    (total, file) => total + file.pages.length,
    0
  )

  container.innerHTML = results.map(file => `
    <details class="collapse collapse-arrow bg-transparent border-0">

      <summary class="px-0 py-2 collapse-title font-semibold after:inset-s-0 after:inset-e-auto ps-5">
        <span class="lg:hidden">${escapeHTML(singkatNama(file.name))}</span>
        <span class="hidden md:inline">${file.name}</span>
      </summary>

      <div class="px-0 py-1 collapse-content text-sm z-1">

        ${file.pages.map(page => `
          <div class="result-row">

            <div class="min-w-0">
              <div class="file-name text-sm text-base-content/75">
                <span class="lg:hidden">${escapeHTML(singkatNama(page.name, 6))}</span>
                <span class="hidden lg:inline">${escapeHTML(page.name)}</span>
              </div>

              <div class="mt-0.5 text-xs text-base-content/50">
                ${formatBytes(page.size)}
              </div>
            </div>

            <a
              class="btn btn-outline btn-primary btn-sm"
              href="${page.url}"
              download="${escapeHTML(page.name)}"
            >
              Unduh
            </a>

          </div>
        `).join('')}

      </div>
    </details>
  `).join('')

  $('#resultCount').textContent = `${results.length} PDF • ${totalPages} Halaman`
}

convertButton.addEventListener('click', () => {
  if (!selectedFiles.length) return
  console.log('Output = ', formatOutput.value)
  window.dispatchEvent(new CustomEvent('pdf-convert', {
    detail: {
      files: [...selectedFiles],
      options: {
        dpi: Number(dpiInput.value),
        quality: Number(qualityInput.value),
        format: formatOutput.value
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

async function startPython() {
  let kamus = {
    'info': 'alert alert-info mb-3',
    'loading': 'alert alert-info mb-3',
    'error': 'alert alert-error mb-3',
    'success': 'alert alert-success mb-3',
    'warning': 'alert alert-warning mb-3',
    'neutral': 'alert alert-neutral mb-3',
  }
  pythonStatus.className = kamus[`info`]
  try {
    pyodide = await initPython(({ message, type }) => {
      pythonStatusText.textContent = message
      pythonStatus.className = kamus[type]
    })
    mulaiConvert(pyodide)

    iconLoading.innerHTML = `
      <div class="text-success-content w-fit h-fit">
        <svg class="w-6 rounded-[50%] stroke-3 stroke-success-content" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle class="checkmark__circle" cx="26" cy="26" r="23" fill="none" />
          <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
      </div>`
    pythonReady = true
    renderFiles()

  } catch (error) {
    pythonReady = false
    renderFiles()
  }
}

renderFiles()
renderResults([])
startPython()