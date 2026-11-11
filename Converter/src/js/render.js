export async function render(element, path) {
  const response = await fetch(path)
  if (!response.ok) {
    throw new Error(`Gagal memuat komponen: ${path}`)
  }

  try{
  element.innerHTML = await response.text()
  }
  catch(e){
    console.log(`eror di element `, path, ' | Eror:\n', e)
  }
}
