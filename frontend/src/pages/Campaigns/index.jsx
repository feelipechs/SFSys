import { AppSidebar } from '@/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from 'lucide-react';

import Pagination from '@/components/Pagination';
import CampaignsList from '@/components/Campaign/CampaignsList';

const CampaignsPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Início</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Campanhas</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"> */}
        <div className="mb-10">
          <div className="">
            <CampaignsList />
          </div>
          <Pagination />
        </div>
        <footer className="text-muted-foreground flex items-center justify-between gap-3 px-4 py-3 max-sm:flex-col sm:gap-6 sm:px-6 md:max-lg:flex-col">
          <p className="text-center text-sm text-balance">
            {`©${new Date().getFullYear()}`}{' '}
            <a href="#" className="text-primary">
              SFSys
            </a>
            , Feito para ajudar quem mais precisa
          </p>
          <div className="flex items-center gap-5">
            <a href="#">
              <FacebookIcon className="size-4" />
            </a>
            <a href="#">
              <InstagramIcon className="size-4" />
            </a>
            <a href="#">
              <LinkedinIcon className="size-4" />
            </a>
            <a href="#">
              <TwitterIcon className="size-4" />
            </a>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default CampaignsPage;
