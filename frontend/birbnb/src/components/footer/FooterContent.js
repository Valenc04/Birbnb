import FooterSection from "./FooterSection"

const FooterContent = () => (
    <section className="footer-content">
        <FooterSection
            title="Ayuda"
            links={[
                { text: "Centro de ayuda", href: "#" },
                { text: "Bir Cover", href: "#" },
                { text: "Lucha contra la discriminación", href: "#" },
                { text: "Ayuda en caso de discapacidad", href: "#" },
                { text: "Opciones de cancelación", href: "#" },
                { text: "Problemas en tu barrio", href: "#" },
            ]}
        />

        <FooterSection
            title="Cómo ser anfitrión"
            links={[
                { text: "Poné tu Birbnb", href: "#" },
                { text: "BirCover para anfitriones", href: "#" },
                { text: "Recursos para anfitriones", href: "#" },
                { text: "Foro de la comunidad", href: "#" },
                { text: "Sé un anfitrión responsable", href: "#" },
                { text: "Encontrá un coanfitrión", href: "#" },
            ]}
        />

        <FooterSection
            title="Birbnb"
            links={[
                { text: "Novedades de mayo 2025", href: "#" },
                { text: "Noticias", href: "#" },
                { text: "Funciones nuevas", href: "#" },
                { text: "Empleo", href: "#" },
                { text: "Inversionistas", href: "#" },
                { text: "Estadías en Birbnb.org", href: "#" },
            ]}
        />
    </section>
)


export default FooterContent