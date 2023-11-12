import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
  handelScrollToContact?: () => void;
  handelScrollToFeatures?: () => void;
  handelScrollToPricing?: () => void;
};

const Footer = ({
  handelScrollToContact = () => {},
  handelScrollToFeatures = () => {},
  handelScrollToPricing = () => {},
}: Props) => {
  const router = useRouter();

  const handleRouteToHome = (anchor: string) => {
    router.push(`/?anchor=${anchor}`);
  };

  return (
    <footer className="footer p-10 bg-neutral text-neutral-content">
      <div>
        <span className="text-2xl font-bold">AI Query ❤️</span>
        <p>© {new Date().getFullYear()}</p>
      </div>
      <div>
        <span className="footer-title">Links</span>
        <a
          className="link link-hover"
          onClick={() =>
            router.pathname === ""
              ? handelScrollToFeatures()
              : handleRouteToHome("features")
          }
        >
          Features
        </a>
        <a
          className="link link-hover"
          onClick={() =>
            router.pathname === ""
              ? handelScrollToPricing()
              : handleRouteToHome("pricing")
          }
        >
          Pricing
        </a>
        <a
          className="link link-hover"
          onClick={() =>
            router.pathname === ""
              ? handelScrollToContact()
              : handleRouteToHome("contact")
          }
        >
          Contact
        </a>
      </div>
      <div>
        <span className="footer-title">Legal</span>
        <Link href={"/privacy-policy"}>
          <a className="link link-hover">Privacy Policy</a>
        </Link>
        <Link href={"/terms-of-use"}>
          <a className="link link-hover">Terms and Conditions</a>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
