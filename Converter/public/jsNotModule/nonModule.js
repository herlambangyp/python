// Node Error
const $ = (selector) => document.querySelector(selector),
    pythonStatusText = $('#pythonStatusText'),
    iconLoading = $('#iconLoading')

iconLoading.textContent = `✖`
pythonStatusText.innerHTML = `<b>ERROR: NodeJs Tewas Mengenaskan oleh CORS policy</b><br>Untuk mempreview web ini diperlukan development server yang sesuai. <b>Membuka file html langsung akan dicegat oleh keamanan browser CORS policy</b>. Akibatnya seluruh upaya fetch js akan "dibunuh secara brutal"
<br><br><a href="https://github.com/herlambangyp/python/tree/main/Converter">Klik Disini</a> untuk detail cara mempreview web ini secara lokal
`
