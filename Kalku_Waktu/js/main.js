let pyodide

async function initPython() {
    pyodide = await loadPyodide()

    const response = await fetch("./main.py")
    const kodePython = await response.text()

    await pyodide.runPythonAsync(kodePython)

    document.getElementById("btnHitung").disabled = false
    document.getElementById("btnHitung").textContent = "Hitung"

    document.getElementById("hasil").textContent = "Python siap digunakan"
}

async function hitung() {
    const operasi = document.getElementById("operasi").value
    const tipe = document.getElementById("tipe").value
    const jumlah = document.getElementById("jumlah").value

    if (jumlah === "" || !Number.isInteger(Number(jumlah)) || Number(jumlah) < 0) {
        document.getElementById("hasil").textContent = "Masukkan bilangan bulat non-negatif"
        return
    }

    // Kirim variabel JavaScript ke Python
    pyodide.globals.set("operasi", operasi)
    pyodide.globals.set("tipe", tipe)
    pyodide.globals.set("jumlah", Number(jumlah))

    // Jalankan fungsi Python
    const hasil = pyodide.runPython(`
        hitung_waktu(operasi, tipe, jumlah)
    `)

    // Tampilkan hasil ke HTML
    document.getElementById("hasil").textContent = hasil
}

// Hubungkan tombol dengan fungsi JavaScript
document.getElementById("btnHitung").addEventListener("click", hitung)

// Mulai inisialisasi Python
initPython()