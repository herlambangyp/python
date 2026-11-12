import { render } from "./render"
const $ = (element) => document.querySelector(element)
await Promise.all([
  render('#toastContainer', './component/toast.html'),
  render('#header', './component/header.html'),

  render('#mainCard', './component/mainCard.html'),
  render('#faq', './component/mainCard/faq.html'),
])

const  toast = $('#toast'),
  toastMessage = $('#toastMessage')

const showToast = (message) => {
  toastMessage.textContent = message
  toast.classList.remove('hidden')
  clearTimeout(showToast.timer)
  showToast.timer = setTimeout(() => toast.classList.add('hidden'), 3200)
}
showToast('Ujicoba Toast')