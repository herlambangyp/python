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
