import { handleAuth, handleLogin, handleLogout } from "@auth0/nextjs-auth0";

export default handleAuth({
  async login(req, res) {
    await handleLogin(req, res, {
      returnTo: "/dashboard",
      authorizationParams: {
        screen_hint: (req.query["screen_hint"] as string) || "login",
        // scope: process.env.AUTH0_SCOPE,
      },
    });
  },
  async logout(req, res) {
    try {
      await handleLogout(req, res, {
        returnTo: 'http://localhost:3000/dashboard',
      });
    } catch (error: any) {
      console.log('err', error)
      res.status(error.status || 400).end(error.message);
    }
  },
});
