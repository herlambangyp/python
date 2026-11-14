export async function render(element, path, loop = false) {
  const response = await fetch(path)
  if (!response.ok) {
    throw new Error(`Gagal memuat komponen: ${path}`)
  }

  try {
    let responText = await response.text()
    if (loop == true) {
      document.querySelectorAll(element).forEach(o => {
        o.innerHTML = responText
      })
      return
    }
    element.innerHTML = responText
  }
  catch (e) {
    console.log(`eror di element `, path, ' | Eror:\n', e)
  }
}

export async function renderLoop(el, path, dataLain='') {
  let responText
  try {
    responText = await fetch(path).text()
  } catch (e) {
    console.error(e)
  }
  document.querySelectorAll(el).forEach(o => {
    o.innerHTML = responText
  })
}
