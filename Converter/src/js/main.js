import { rakit } from "./perakit"
import { initTheme } from "./theme"
import { initPython } from "./interpreter"

// OnBoot function
await rakit()
initTheme()
let $ = (element) => document.querySelector(element),

  // Query selector
  toast = $('#toast'),
  toastMessage = $('#toastMessage'),
  pythonLoadingContainer = $('#pythonLoadingContainer'),
  pythonLoadingIcon = $('#pythonLoadingIcon'),
  pythonLoadingMsg = $('#pythonLoadingMsg'),

  // Variabel global
  pythonReady = false,
  pyodide,
  kamus = {
    'info': 'alert alert-info',
    'loading': 'alert alert-info',
    'error': 'alert alert-error',
    'success': 'alert alert-success',
    'warning': 'alert alert-warning',
    'neutral': 'alert alert-neutral',
  },

  // Variabel fungsi global
  showToast = (message, timer = 3200, tipe = 'info') => {
    // console.log('massage = ', message, ' | timer = ', timer, ' | tipe = ', kamus[tipe])
    toastMessage.classList.add(...kamus[tipe].split(' '))
    toastMessage.textContent = message
    toast.classList.remove('hidden')
    clearTimeout(showToast.timer)
    showToast.timer = setTimeout(() => toast.classList.add('hidden'), timer)
  }

async function startPython() {
  try {
    pyodide = await initPython(({ message, type }) => {
      pythonLoadingMsg.textContent = message
      pythonLoadingContainer.classList.add(...kamus[type].split(' '))
      pythonLoadingContainer.classList.remove('hidden')
    })

    pythonLoadingIcon.innerHTML = `
      <div class="text-succest w-fit h-fit">
        <svg class="w-6 rounded-[50%] stroke-3 stroke-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle class="checkmark__circle" cx="26" cy="26" r="23" fill="none" />
          <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
      </div>`
    pythonReady = true
    setTimeout(() => pythonLoadingContainer.classList.add('hidden'), 8000)
  } catch (error) {
    pythonReady = false
  }
}

// OnLoad function
startPython()