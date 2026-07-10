import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase/client";

export interface Company {
  id: string;
  name: string;
  slug: string;
  custom_domain: string | null;
  logo_url: string | null;
  logo_height: number;
  primary_color: string | null;
  stripe_account_id: string | null;
}

interface TenantContextType {
  company: Company | null;
  isLoading: boolean;
  error: Error | null;
}

const TenantContext = createContext<TenantContextType>({
  company: null,
  isLoading: true,
  error: null,
});

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadTenant() {
      try {
        const hostname = window.location.hostname;
        
        // Local development fallback
        if (hostname === "localhost" || hostname === "127.0.0.1") {
          // For local testing, if user is logged in, use their company.
          // Otherwise, default to "openlead".
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
             const { data: profile } = await supabase
              .from('profiles')
              .select('company_id')
              .eq('id', session.user.id)
              .single();
              
             if (profile?.company_id) {
                const { data, error } = await supabase
                  .from("companies")
                  .select("*")
                  .eq("id", profile.company_id)
                  .single();
                  
                if (!error && data) {
                  setCompany(data);
                  applyBranding(data);
                  setIsLoading(false);
                  return;
                }
             }
          }

          const { data, error } = await supabase
            .from("companies")
            .select("*")
            .eq("slug", "openlead")
            .single();
            
          if (error) throw error;
          setCompany(data);
          applyBranding(data);
          setIsLoading(false);
          return;
        }

        // Production Routing Logic
        // 1. Check if it's a custom domain
        let { data, error } = await supabase
          .from("companies")
          .select("*")
          .eq("custom_domain", hostname)
          .maybeSingle();

        // 2. If not a custom domain, check if it's a subdomain (e.g., acme.openleadacademy.com)
        if (!data) {
          const mainDomain = "openleadacademy.com"; // Your base domain
          if (hostname.endsWith(mainDomain)) {
            const slug = hostname.replace(`.${mainDomain}`, "");
            if (slug !== "www" && slug !== mainDomain) {
              const { data: slugData, error: slugError } = await supabase
                .from("companies")
                .select("*")
                .eq("slug", slug)
                .maybeSingle();
                
              if (slugError) throw slugError;
              data = slugData;
            }
          }
        }

        // 3. Fallback to default company if no match is found
        if (!data) {
           const { data: defaultData, error: defaultError } = await supabase
            .from("companies")
            .select("*")
            .eq("slug", "openlead")
            .single();
            
          if (defaultError) throw defaultError;
          data = defaultData;
        }

        setCompany(data);
        applyBranding(data);
      } catch (err) {
        console.error("Failed to load tenant:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    }

    loadTenant();
  }, []);

  const hexToHsl = (hex: string) => {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const applyBranding = (company: Company) => {
    if (!company) return;
    
    // Apply primary color to CSS variables (Tailwind can use these)
    if (company.primary_color) {
      const hslValue = hexToHsl(company.primary_color);
      document.documentElement.style.setProperty('--primary', hslValue);
      // You can expand this to generate lighter/darker shades for a full theme
    }

    // Update document title
    document.title = company.name;
    
    // Update favicon if logo exists
    if (company.logo_url) {
      const favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (favicon) {
        favicon.href = company.logo_url;
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl font-bold mb-2">Platform Error</h1>
        <p className="text-muted-foreground">Unable to load the requested workspace.</p>
      </div>
    );
  }

  return (
    <TenantContext.Provider value={{ company, isLoading, error }}>
      {children}
    </TenantContext.Provider>
  );
}

export const useTenant = () => useContext(TenantContext);
