import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

// Simple settings fetch without external dependencies
const getSettings = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://api.uzmart.org";
    const response = await fetch(`${baseUrl}/v1/rest/settings`);
    if (!response.ok) return {};
    
    const data = await response.json();
    if (!data?.data) return {};
    
    // Parse settings into a simple object
    const settings: Record<string, string> = {};
    data.data.forEach((setting: { key: string; value: string }) => {
      settings[setting.key] = setting.value;
    });
    
    return settings;
  } catch (e) {
    return {};
  }
};

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public files
  if (PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  // Check for token in cookies using Edge Function compatible method
  const token = request.cookies.get("token");
  
  if (!token && pathname.includes("/profile")) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl, 302);
  }

  // Get settings for UI type routing
  const settings = await getSettings();
  const uiType = ["2", "3"].find((type) => type === settings?.ui_type);

  if (!!uiType && (pathname === "/" || pathname === "/products")) {
    return NextResponse.rewrite(
      new URL(`${pathname === "/" ? `/home-${uiType}` : `${pathname}-${uiType}`}`, request.url)
    );
  }

  if (pathname.startsWith("/shops/") && !!uiType) {
    return NextResponse.rewrite(new URL(pathname.replace("shops", `shops-${uiType}`), request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
}; 