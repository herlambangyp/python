import { render } from "./render"

export async function rakit() {

    // Komponen induk
    await Promise.all([
        render('#toastContainer', './component/toast.html'),
        render('#header', './component/header.html'),
        render('#formCard', './component/formCard.html'),
        render('#footer', './component/footer.html'),

    ])

    // Komponen Nested
    await render('#faq', './component/formCard/faq.html')
    await render('#pythonStatus', './component/formCard/pythonStatus.html')

}
