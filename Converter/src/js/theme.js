export function initTheme() {
    let savedTheme = localStorage.getItem('tema'),
        themeName = localStorage.getItem('themeName')

    if (savedTheme && themeName) {
        document.documentElement.setAttribute('data-theme', savedTheme)
        document.querySelector('#selectTheme').value=themeName
    }
    document.querySelectorAll('[tema]').forEach(el => {
        el.onclick = o => {
            let tema = el.getAttribute('tema')
            if (document.documentElement.getAttribute('data-theme') === tema) return

            localStorage.setItem('tema', tema)
            localStorage.setItem('themeName', el.textContent)
            document.documentElement.setAttribute('data-theme', tema)
        }
    })
}