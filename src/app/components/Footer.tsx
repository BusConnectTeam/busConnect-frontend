import Link from 'next/link';
import { Bus, Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary p-2 rounded-lg">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">BusConnect</span>
            </div>
            <p className="text-sm text-neutral-400 mb-4">
              La plataforma líder en reservas de autocares en Catalunya. Conectamos viajeros con las mejores empresas de transporte.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Para viajeros */}
          <div>
            <h3 className="text-white font-semibold mb-4">Para viajeros</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/buscar" className="hover:text-primary transition-colors">
                  Buscar autocares
                </Link>
              </li>
              <li>
                <Link href="/empresas" className="hover:text-primary transition-colors">
                  Empresas verificadas
                </Link>
              </li>
              <li>
                <Link href="/como-funciona" className="hover:text-primary transition-colors">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link href="/mis-reservas" className="hover:text-primary transition-colors">
                  Mis reservas
                </Link>
              </li>
            </ul>
          </div>

          {/* Para empresas */}
          <div>
            <h3 className="text-white font-semibold mb-4">Para empresas</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/registro-empresa" className="hover:text-primary transition-colors">
                  Registrar mi empresa
                </Link>
              </li>
              <li>
                <Link href="/panel-empresa" className="hover:text-primary transition-colors">
                  Panel de control
                </Link>
              </li>
              <li>
                <Link href="/ventajas" className="hover:text-primary transition-colors">
                  Ventajas
                </Link>
              </li>
              <li>
                <Link href="/precios" className="hover:text-primary transition-colors">
                  Precios
                </Link>
              </li>
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h3 className="text-white font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ayuda" className="hover:text-primary transition-colors">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-primary transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@busconnect.cat" className="hover:text-primary transition-colors">
                  info@busconnect.cat
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+34900123456" className="hover:text-primary transition-colors">
                  900 123 456
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-400">
          <p>&copy; 2024 BusConnect. Todos los derechos reservados.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacidad" className="hover:text-primary transition-colors">
              Política de privacidad
            </Link>
            <Link href="/terminos" className="hover:text-primary transition-colors">
              Términos de uso
            </Link>
            <Link href="/cookies" className="hover:text-primary transition-colors">
              Política de cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}