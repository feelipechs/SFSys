import { MenuIcon, SearchIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { ModeToggle } from './ModeToggle';

const linkButtonStyle =
  'inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';

const Navbar = ({ navigationData }) => {
  return (
    <header className="bg-background border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 sm:px-6">
        <div className="text-muted-foreground flex flex-1 items-center gap-8 font-medium md:justify-center lg:gap-16">
          <Link to="/campanhas" className="hover:text-primary max-md:hidden">
            Campanhas
          </Link>
          <Link
            to="/doacoes-monetarias"
            className="hover:text-primary max-md:hidden"
          >
            Doações Monetárias
          </Link>
          <Link to="/" className="flex items-center">
            <img src="/images/logo.png" alt="Logo" className="h-16" />
          </Link>
          <Link to="/ajuda" className="hover:text-primary max-md:hidden">
            Ajuda
          </Link>
          <Link to="/contato" className="hover:text-primary max-md:hidden">
            Contato
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <ModeToggle />
          <Dialog>
            <DialogTrigger>Entrar</DialogTrigger>
            <span className="sr-only">Entrar</span>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Olá, como deseja entrar?</DialogTitle>
                <DialogDescription>
                  Você será encaminhado para a página de login.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-start">
                <Link to="/login" className={linkButtonStyle}>
                  Beneficiário
                </Link>
                <Link to="/login" className={linkButtonStyle}>
                  Doador
                </Link>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger className="md:hidden" asChild>
              <Button variant="outline" size="icon">
                <MenuIcon />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                {navigationData.map((item, index) => (
                  <DropdownMenuItem key={index}>
                    <Link to={item.href}>{item.title}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
