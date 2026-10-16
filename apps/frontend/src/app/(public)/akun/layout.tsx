import "../about/about.css";
import "@/app/admin/cms.css";
import "@/components/writer/writer.css";
import { CmsProvider } from "@/lib/cms/store";

/**
 * Member area. Ruang Penulis reuses the admin form fields, so it loads the CMS styles and
 * (in staging) the same browser-local CMS store the admin edits.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <CmsProvider>{children}</CmsProvider>;
}
