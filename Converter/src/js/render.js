export async function render(element, path) {
  const response = await fetch(path)
  if (!response.ok) {
    throw new Error(`Gagal memuat komponen: ${path}`)
  }

  element.innerHTML = await response.text()
}
