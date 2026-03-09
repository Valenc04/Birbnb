const FooterSection = ({ title, links }) => (
  <div>
    <h3>{title}</h3>
    <div className="content-links">
      {links.map((link, index) => (
        <a key={index} href={link.href}>
          {link.text}
        </a>
      ))}
    </div>
  </div>
);

export default FooterSection;