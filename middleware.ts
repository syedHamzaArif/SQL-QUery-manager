import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  let url = req.nextUrl.clone();
  if(url.pathname === '/') {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }
//   let cookie = req.cookies.get("khuta_auth");
//   if (cookie === undefined) {
//     if (url.pathname === "/home") return NextResponse.next();
//     if (url.pathname === "/") return NextResponse.next();
//     if (url.pathname === "/signup") return NextResponse.next();
//     if (url.pathname === "/terms-of-use") return NextResponse.next();
//     if (url.pathname === "/reset-password") return NextResponse.next();
//     if (url.pathname === "/privacy-policy") return NextResponse.next();
//     if (url.pathname === "/khuta-video.mp4") return NextResponse.next();
//     else if (url.pathname !== "/signin") {
//       url.pathname = "/signin";
//       return NextResponse.redirect(url);
//     } else return NextResponse.next();
//   } else {
//     if (
//       url.pathname === "/signin" ||
//       url.pathname === "/signup"
//       // || url.pathname === "/home" ||
//       // url.pathname === "/"
//     ) {
//       url.pathname = "/home"; // redirecting to home page...
//       return NextResponse.redirect(url);
//     } else {
//       return NextResponse.next();
//     }
//   }
};

export const config = {
  matcher: [
    "/((?!api|static|favicon.ico|_next|sideImage.png).*)", //Excludes middlware calls on APIs, icons, and static stuff
  ],
};
